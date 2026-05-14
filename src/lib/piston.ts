const PISTON_API_URL =
  process.env.NEXT_PUBLIC_PISTON_API_URL || "https://emkc.org/api/v2/piston";

export interface PistonRuntime {
  language: string;
  version: string;
  aliases: string[];
}

export interface PistonExecuteRequest {
  language: string;
  version: string;
  files: { name?: string; content: string }[];
  stdin?: string;
  args?: string[];
  run_timeout?: number;
  compile_timeout?: number;
}

export interface PistonExecuteResponse {
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

const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
  python: { language: "python", version: "3.10.0" },
  javascript: { language: "javascript", version: "18.15.0" },
  cpp: { language: "c++", version: "10.2.0" },
  java: { language: "java", version: "15.0.2" },
  c: { language: "c", version: "10.2.0" },
  typescript: { language: "typescript", version: "5.0.3" },
};

export function getSupportedLanguages() {
  return Object.keys(LANGUAGE_MAP);
}

export function getLanguageConfig(lang: string) {
  return LANGUAGE_MAP[lang] || LANGUAGE_MAP.python;
}

export async function executeCode(
  language: string,
  code: string,
  stdin: string = ""
): Promise<PistonExecuteResponse> {
  const config = getLanguageConfig(language);

  const body: PistonExecuteRequest = {
    language: config.language,
    version: config.version,
    files: [{ content: code }],
    stdin,
    run_timeout: 10000,
    compile_timeout: 10000,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${PISTON_API_URL}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Piston API error (${res.status}): ${text}`);
    }

    return await res.json();
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Code execution timed out (15s)");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export function normalizeOutput(output: string): string {
  return output.replace(/\r\n/g, "\n").trimEnd();
}

export function compareOutputs(actual: string, expected: string): boolean {
  return normalizeOutput(actual) === normalizeOutput(expected);
}
