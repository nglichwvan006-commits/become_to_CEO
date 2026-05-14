"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, AlertTriangle, Terminal, ListChecks, History } from "lucide-react";
import { cn } from "@/lib/utils";

interface OutputPanelProps {
  activeTab: "output" | "tests" | "history";
  onTabChange: (tab: "output" | "tests" | "history") => void;
  isRunning: boolean;
  executionResult: {
    status: string;
    output: string;
    stderr: string | null;
    exitCode: number;
  } | null;
  testResults: {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
  }[];
  submissions: {
    id: string;
    language: string;
    status: string;
    timestamp: number;
  }[];
}

const tabs = [
  { key: "output" as const, label: "Output", icon: Terminal },
  { key: "tests" as const, label: "Test Cases", icon: ListChecks },
  { key: "history" as const, label: "Lịch sử", icon: History },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  accepted: { label: "Accepted", color: "text-emerald-500", icon: CheckCircle },
  wrong_answer: { label: "Wrong Answer", color: "text-red-500", icon: XCircle },
  runtime_error: { label: "Runtime Error", color: "text-orange-500", icon: AlertTriangle },
  compilation_error: { label: "Compile Error", color: "text-red-500", icon: AlertTriangle },
  time_limit: { label: "Time Limit", color: "text-amber-500", icon: Clock },
  success: { label: "Success", color: "text-emerald-500", icon: CheckCircle },
  error: { label: "Error", color: "text-red-500", icon: XCircle },
};

export function OutputPanel({
  activeTab,
  onTabChange,
  isRunning,
  executionResult,
  testResults,
  submissions,
}: OutputPanelProps) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-border/50 bg-card">
      {/* Tab bar */}
      <div className="flex items-center border-b border-border/50 px-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px",
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
            {tab.key === "tests" && testResults.length > 0 && (
              <Badge
                variant={testResults.every((r) => r.passed) ? "easy" : "hard"}
                className="ml-1 text-[10px] px-1.5 py-0"
              >
                {testResults.filter((r) => r.passed).length}/{testResults.length}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3">
        <AnimatePresence mode="wait">
          {isRunning && (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full items-center justify-center"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-sm text-muted-foreground">Đang chạy code...</span>
              </div>
            </motion.div>
          )}

          {!isRunning && activeTab === "output" && (
            <motion.div
              key="output"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              {executionResult ? (
                <>
                  {(() => {
                    const cfg = STATUS_CONFIG[executionResult.status] || STATUS_CONFIG.error;
                    const Icon = cfg.icon;
                    return (
                      <div className={cn("flex items-center gap-2 text-sm font-medium", cfg.color)}>
                        <Icon className="h-4 w-4" />
                        {cfg.label}
                      </div>
                    );
                  })()}
                  {executionResult.output && (
                    <pre className="rounded-md bg-muted/50 p-3 text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                      {executionResult.output}
                    </pre>
                  )}
                  {executionResult.stderr && (
                    <pre className="rounded-md bg-red-500/10 border border-red-500/20 p-3 text-xs font-mono text-red-400 whitespace-pre-wrap">
                      {executionResult.stderr}
                    </pre>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nhấn <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">Run</kbd> hoặc{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">Submit</kbd> để xem kết quả
                </p>
              )}
            </motion.div>
          )}

          {!isRunning && activeTab === "tests" && (
            <motion.div
              key="tests"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              {testResults.length > 0 ? (
                testResults.map((test, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-lg border p-3 text-xs",
                      test.passed
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-red-500/30 bg-red-500/5"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Test #{i + 1}</span>
                      {test.passed ? (
                        <Badge variant="easy">Passed</Badge>
                      ) : (
                        <Badge variant="hard">Failed</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {test.input && (
                        <div>
                          <span className="text-muted-foreground">Input:</span>
                          <pre className="mt-1 rounded bg-muted/50 p-2 font-mono">{test.input}</pre>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Expected:</span>
                        <pre className="mt-1 rounded bg-muted/50 p-2 font-mono">{test.expectedOutput}</pre>
                      </div>
                      {!test.passed && (
                        <div>
                          <span className="text-red-400">Actual:</span>
                          <pre className="mt-1 rounded bg-red-500/10 p-2 font-mono text-red-400">
                            {test.actualOutput || "(empty)"}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nhấn <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">Submit</kbd> để chạy test cases
                </p>
              )}
            </motion.div>
          )}

          {!isRunning && activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              {submissions.length > 0 ? (
                submissions.map((sub) => {
                  const cfg = STATUS_CONFIG[sub.status] || STATUS_CONFIG.error;
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={cn("h-4 w-4", cfg.color)} />
                        <span className={cn("text-sm font-medium", cfg.color)}>{cfg.label}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary">{sub.language}</Badge>
                        <span>{new Date(sub.timestamp).toLocaleTimeString("vi-VN")}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Chưa có lần submit nào
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
