import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { getLanguageConfig } from "@/lib/code-languages";

interface ProcessResult {
  stdout: string;
  stderr: string;
  code: number | null;
  signal: string | null;
  timedOut: boolean;
}

interface CommandSpec {
  command: string;
  args: string[];
}

interface LocalLanguageRuntime {
  fileName: string;
  run: (workDir: string) => CommandSpec[];
  compile?: (workDir: string) => CommandSpec[];
}

export interface LocalExecuteResponse {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    code: number | null;
    signal: string | null;
    output: string;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number | null;
    signal: string | null;
    output: string;
  };
}

const EXECUTION_TIMEOUT_MS = 10_000;
const OUTPUT_LIMIT = 100_000;

const isWindows = process.platform === "win32";

const RUNTIMES: Record<string, LocalLanguageRuntime> = {
  python: {
    fileName: "main.py",
    run: (workDir) =>
      isWindows
        ? [
            { command: "py", args: ["-3", path.join(workDir, "main.py")] },
            { command: "python", args: [path.join(workDir, "main.py")] },
          ]
        : [
            { command: "python3", args: [path.join(workDir, "main.py")] },
            { command: "python", args: [path.join(workDir, "main.py")] },
          ],
  },
  javascript: {
    fileName: "main.js",
    run: (workDir) => [
      { command: process.execPath, args: [path.join(workDir, "main.js")] },
    ],
  },
  cpp: {
    fileName: "main.cpp",
    compile: (workDir) => [
      {
        command: "g++",
        args: [
          path.join(workDir, "main.cpp"),
          "-O2",
          "-std=c++17",
          "-o",
          path.join(workDir, isWindows ? "main.exe" : "main"),
        ],
      },
    ],
    run: (workDir) => [
      { command: path.join(workDir, isWindows ? "main.exe" : "main"), args: [] },
    ],
  },
  c: {
    fileName: "main.c",
    compile: (workDir) => [
      {
        command: "gcc",
        args: [
          path.join(workDir, "main.c"),
          "-O2",
          "-std=c11",
          "-o",
          path.join(workDir, isWindows ? "main.exe" : "main"),
        ],
      },
    ],
    run: (workDir) => [
      { command: path.join(workDir, isWindows ? "main.exe" : "main"), args: [] },
    ],
  },
  java: {
    fileName: "Main.java",
    compile: (workDir) => [
      { command: "javac", args: [path.join(workDir, "Main.java")] },
    ],
    run: (workDir) => [
      { command: "java", args: ["-cp", workDir, "Main"] },
    ],
  },
};

function createOutput(stdout: string, stderr: string) {
  return `${stdout}${stderr}`;
}

function toExecutionBlock(result: ProcessResult) {
  return {
    stdout: result.stdout,
    stderr: result.stderr,
    code: result.code,
    signal: result.timedOut ? "TIMEOUT" : result.signal,
    output: createOutput(result.stdout, result.stderr),
  };
}

function missingRuntimeResult(specs: CommandSpec[]): ProcessResult {
  const commands = specs.map((spec) => spec.command).join(", ");
  return {
    stdout: "",
    stderr: `Local runtime not found. Install one of: ${commands}.`,
    code: 127,
    signal: null,
    timedOut: false,
  };
}

async function runProcess(
  spec: CommandSpec,
  cwd: string,
  stdin: string,
  timeoutMs: number
): Promise<ProcessResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(spec.command, spec.args, {
      cwd,
      shell: false,
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";
    let settled = false;
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    const finish = (result: ProcessResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(result);
    };

    const appendOutput = (
      current: string,
      chunk: Buffer,
      killForLimit: () => void
    ) => {
      const next = current + chunk.toString("utf8");
      if (next.length > OUTPUT_LIMIT) {
        killForLimit();
        return next.slice(0, OUTPUT_LIMIT);
      }
      return next;
    };

    child.stdout.on("data", (chunk: Buffer) => {
      stdout = appendOutput(stdout, chunk, () => child.kill("SIGKILL"));
    });

    child.stderr.on("data", (chunk: Buffer) => {
      stderr = appendOutput(stderr, chunk, () => child.kill("SIGKILL"));
    });

    child.on("error", (error: NodeJS.ErrnoException) => {
      clearTimeout(timer);
      reject(error);
    });

    child.on("close", (code, signal) => {
      finish({ stdout, stderr, code, signal, timedOut });
    });

    child.stdin.end(stdin);
  });
}

async function runFirstAvailable(
  specs: CommandSpec[],
  cwd: string,
  stdin: string,
  timeoutMs: number
) {
  for (const spec of specs) {
    try {
      return await runProcess(spec, cwd, stdin, timeoutMs);
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        continue;
      }
      throw error;
    }
  }

  return missingRuntimeResult(specs);
}

export async function executeCode(
  language: string,
  code: string,
  stdin: string = ""
): Promise<LocalExecuteResponse> {
  const config = getLanguageConfig(language);
  const runtime = RUNTIMES[config.language];

  if (!runtime) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const workDir = await mkdtemp(path.join(tmpdir(), "career-quest-code-"));

  try {
    await writeFile(path.join(workDir, runtime.fileName), code, "utf8");

    let compileBlock: LocalExecuteResponse["compile"];
    if (runtime.compile) {
      const compileResult = await runFirstAvailable(
        runtime.compile(workDir),
        workDir,
        "",
        EXECUTION_TIMEOUT_MS
      );
      compileBlock = toExecutionBlock(compileResult);

      if (compileResult.code !== 0 || compileResult.timedOut) {
        return {
          language: config.language,
          version: config.version,
          compile: compileBlock,
          run: {
            stdout: "",
            stderr: "",
            code: null,
            signal: null,
            output: "",
          },
        };
      }
    }

    const runResult = await runFirstAvailable(
      runtime.run(workDir),
      workDir,
      stdin,
      EXECUTION_TIMEOUT_MS
    );

    return {
      language: config.language,
      version: config.version,
      compile: compileBlock,
      run: toExecutionBlock(runResult),
    };
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}

export function normalizeOutput(output: string): string {
  return output.replace(/\r\n/g, "\n").trimEnd();
}

export function compareOutputs(actual: string, expected: string): boolean {
  return normalizeOutput(actual) === normalizeOutput(expected);
}
