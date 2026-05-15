"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CodeEditor } from "@/components/editor/code-editor";
import { OutputPanel } from "@/components/editor/output-panel";
import { ProblemPanel } from "@/components/editor/problem-panel";
import { useGameStore } from "@/stores/game-store";
import { getTaskBySlug } from "@/constants/mock-tasks";
import { getSupportedLanguages } from "@/lib/code-languages";
import {
  Play,
  Send,
  ArrowLeft,
  ChevronDown,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LANGUAGE_LABELS: Record<string, string> = {
  python: "Python",
  javascript: "JavaScript",
  cpp: "C++",
  java: "Java",
  c: "C",
  typescript: "TypeScript",
};

export default function TaskDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const task = useMemo(() => getTaskBySlug(slug), [slug]);
  const [showProblem, setShowProblem] = useState(true);
  const [langOpen, setLangOpen] = useState(false);

  const {
    code,
    language,
    isRunning,
    executionResult,
    testResults,
    submissions,
    activeOutputTab,
    setCode,
    setLanguage,
    setActiveOutputTab,
    runCode,
    submitCode,
    resetExecution,
  } = useGameStore();

  useEffect(() => {
    if (!task || code) return;

    const starterCode = task.starterCode[language] || task.starterCode.python || "";
    setCode(starterCode);
  }, [task, code, language, setCode]);

  const handleLanguageChange = useCallback(
    (lang: string) => {
      setLanguage(lang);
      setLangOpen(false);
      if (task?.starterCode[lang]) {
        setCode(task.starterCode[lang]);
      }
      resetExecution();
    },
    [task, setLanguage, setCode, resetExecution]
  );

  const handleRun = useCallback(() => {
    if (!task) return;
    runCode(task.sampleInput);
  }, [task, runCode]);

  const handleSubmit = useCallback(() => {
    if (!task) return;
    submitCode(task.slug, task.hiddenTests, {
      expReward: task.expReward,
      salaryReward: task.salaryReward,
      reputationReward: task.reputationReward,
    });
  }, [task, submitCode]);

  if (!task) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium">Không tìm thấy nhiệm vụ</p>
        <Link href="/tasks">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col -m-6">
      {/* Top toolbar */}
      <div className="flex items-center justify-between border-b border-border/50 bg-card/80 backdrop-blur px-4 py-2 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/tasks">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Quay lại</span>
            </Button>
          </Link>
          <div className="h-4 w-px bg-border" />
          <h2 className="text-sm font-semibold truncate max-w-[200px] sm:max-w-none">
            {task.title}
          </h2>
          <Badge variant={task.difficulty} className="hidden sm:flex">
            {task.difficulty === "easy" ? "Dễ" : task.difficulty === "medium" ? "TB" : "Khó"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLangOpen(!langOpen)}
              className="gap-1.5 text-xs min-w-[100px] justify-between"
            >
              {LANGUAGE_LABELS[language] || language}
              <ChevronDown className="h-3 w-3" />
            </Button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 rounded-lg border border-border bg-card shadow-lg py-1 min-w-[140px]">
                  {getSupportedLanguages().map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={cn(
                        "w-full px-3 py-1.5 text-left text-xs hover:bg-muted transition-colors",
                        language === lang && "bg-muted font-medium text-primary"
                      )}
                    >
                      {LANGUAGE_LABELS[lang] || lang}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Toggle problem panel */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowProblem(!showProblem)}
            className="hidden lg:flex"
          >
            {showProblem ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>

          {/* Run button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRun}
            disabled={isRunning}
            className="gap-1.5"
          >
            {isRunning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            Run
          </Button>

          {/* Submit button */}
          <Button
            variant="career"
            size="sm"
            onClick={handleSubmit}
            disabled={isRunning}
            className="gap-1.5"
          >
            {isRunning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Submit
          </Button>
        </div>
      </div>

      {/* Main content — Split panels */}
      <div className="flex flex-1 overflow-hidden">
        {/* Problem panel (left) */}
        {showProblem && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "40%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="hidden lg:flex border-r border-border/50 bg-card/50 min-w-[300px] max-w-[50%]"
          >
            <ProblemPanel task={task} />
          </motion.div>
        )}

        {/* Right side: Editor + Output */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Mobile: Problem panel (stacked) */}
          <div className="lg:hidden border-b border-border/50 max-h-[40vh] overflow-y-auto">
            <ProblemPanel task={task} />
          </div>

          {/* Code editor */}
          <div className="flex-1 min-h-[200px]">
            <CodeEditor
              value={code}
              language={language}
              onChange={setCode}
            />
          </div>

          {/* Output panel */}
          <div className="h-[35%] min-h-[150px] border-t border-border/50">
            <OutputPanel
              activeTab={activeOutputTab}
              onTabChange={setActiveOutputTab}
              isRunning={isRunning}
              executionResult={executionResult}
              testResults={testResults}
              submissions={submissions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
