import { NextResponse } from "next/server";
import {
  executeCode,
  compareOutputs,
  normalizeOutput,
  getSupportedLanguages,
} from "@/lib/piston";

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW_MS);
  rateLimitMap.set(ip, recent);
  return recent.length < RATE_LIMIT;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Thử lại sau 1 phút." },
        { status: 429 }
      );
    }

    rateLimitMap.get(ip)!.push(Date.now());

    const body = await request.json();
    const { code, language, stdin, expectedOutput } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    if (!language || !getSupportedLanguages().includes(language)) {
      return NextResponse.json(
        {
          error: `Unsupported language. Supported: ${getSupportedLanguages().join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (code.length > 50_000) {
      return NextResponse.json(
        { error: "Code too long (max 50KB)" },
        { status: 400 }
      );
    }

    const result = await executeCode(language, code, stdin || "");

    const output = result.run?.output || "";
    const stderr = result.run?.stderr || "";
    const compileError = result.compile?.stderr || "";
    const exitCode = result.run?.code ?? 0;

    let status: string = "success";
    if (compileError) {
      status = "compilation_error";
    } else if (exitCode !== 0 || stderr) {
      status = "runtime_error";
    } else if (expectedOutput !== undefined) {
      status = compareOutputs(output, expectedOutput)
        ? "accepted"
        : "wrong_answer";
    }

    return NextResponse.json({
      status,
      output: normalizeOutput(output),
      stderr: stderr || compileError || null,
      exitCode,
      language: result.language,
      version: result.version,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown execution error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
