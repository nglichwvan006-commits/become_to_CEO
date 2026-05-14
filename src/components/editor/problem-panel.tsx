"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { GAME_CONFIG } from "@/constants/game-config";
import type { MockTask } from "@/constants/mock-tasks";
import {
  Clock,
  Zap,
  DollarSign,
  Star,
  FileText,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

interface ProblemPanelProps {
  task: MockTask;
}

const DIFFICULTY_LABELS = {
  easy: "Dễ",
  medium: "Trung bình",
  hard: "Khó",
};

export function ProblemPanel({ task }: ProblemPanelProps) {
  const taskConfig = GAME_CONFIG.taskTypes.find((t) => t.type === task.type);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border/50 p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-lg font-bold leading-tight">{task.title}</h1>
          <Badge variant={task.difficulty}>{DIFFICULTY_LABELS[task.difficulty]}</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="secondary" className="gap-1">
            {taskConfig?.icon} {taskConfig?.label}
          </Badge>
          <Badge variant="secondary">{task.category}</Badge>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{task.deadlineHours}h</span>
          </div>
        </div>
        {/* Rewards */}
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1 text-emerald-500 font-medium">
            <Zap className="h-3 w-3" /> +{task.expReward} EXP
          </span>
          <span className="flex items-center gap-1 text-amber-500 font-medium">
            <DollarSign className="h-3 w-3" /> +{task.salaryReward.toLocaleString()}₫
          </span>
          <span className="flex items-center gap-1 text-violet-500 font-medium">
            <Star className="h-3 w-3" /> +{task.reputationReward} Rep
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Statement */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Đề bài</h2>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed">
            {task.statement.split("\n").map((line, i) => {
              if (line.startsWith("## ")) {
                return (
                  <h3 key={i} className="text-base font-bold mt-3 mb-1">
                    {line.replace("## ", "")}
                  </h3>
                );
              }
              if (line.startsWith("### ")) {
                return (
                  <h4 key={i} className="text-sm font-semibold mt-2 mb-1">
                    {line.replace("### ", "")}
                  </h4>
                );
              }
              if (line.startsWith("```")) return null;
              if (line.trim() === "") return <br key={i} />;
              return <p key={i} className="mb-1" dangerouslySetInnerHTML={{
                __html: line
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 rounded bg-muted text-xs font-mono">$1</code>')
              }} />;
            })}
          </div>
        </section>

        {/* Input Format */}
        {task.inputFormat && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <ArrowRight className="h-4 w-4 text-cyan-500" />
              <h2 className="text-sm font-semibold">Input</h2>
            </div>
            <p className="text-sm text-muted-foreground">{task.inputFormat}</p>
          </section>
        )}

        {/* Output Format */}
        {task.outputFormat && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <ArrowLeft className="h-4 w-4 text-emerald-500" />
              <h2 className="text-sm font-semibold">Output</h2>
            </div>
            <p className="text-sm text-muted-foreground">{task.outputFormat}</p>
          </section>
        )}

        {/* Constraints */}
        {task.constraints && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-semibold">Ràng buộc</h2>
            </div>
            <p className="text-sm text-muted-foreground font-mono">{task.constraints}</p>
          </section>
        )}

        {/* Sample Test */}
        {(task.sampleInput || task.sampleOutput) && (
          <section>
            <h2 className="text-sm font-semibold mb-2">Ví dụ</h2>
            <Card className="overflow-hidden">
              {task.sampleInput && (
                <div className="border-b border-border/50 p-3">
                  <span className="text-xs font-medium text-muted-foreground mb-1 block">Input</span>
                  <pre className="text-xs font-mono bg-muted/50 rounded p-2 whitespace-pre-wrap">
                    {task.sampleInput}
                  </pre>
                </div>
              )}
              <div className="p-3">
                <span className="text-xs font-medium text-muted-foreground mb-1 block">Output</span>
                <pre className="text-xs font-mono bg-muted/50 rounded p-2 whitespace-pre-wrap">
                  {task.sampleOutput}
                </pre>
              </div>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}
