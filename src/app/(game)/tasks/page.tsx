"use client";

import { useState } from "react";
import { FadeIn } from "@/components/animations/fade-in";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GAME_CONFIG } from "@/constants/game-config";
import { MOCK_TASKS } from "@/constants/mock-tasks";
import {
  Search, Clock, AlertCircle,
  ChevronRight, Code, Bug, RefreshCw, Eye,
  Server, Database, Rocket, Target,
} from "lucide-react";
import Link from "next/link";

const TASK_ICONS: Record<string, React.ReactNode> = {
  coding: <Code className="h-4 w-4" />,
  bug_fix: <Bug className="h-4 w-4" />,
  refactor: <RefreshCw className="h-4 w-4" />,
  code_review: <Eye className="h-4 w-4" />,
  system_design: <Server className="h-4 w-4" />,
  database: <Database className="h-4 w-4" />,
  deployment: <Rocket className="h-4 w-4" />,
  debug: <Target className="h-4 w-4" />,
};

const DEMO_TASKS = MOCK_TASKS.map((t) => ({
  ...t,
  completed: false,
}));

const PRIORITY_COLORS = {
  low: "text-emerald-500",
  medium: "text-amber-500",
  high: "text-orange-500",
  critical: "text-red-500",
};

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const filtered = DEMO_TASKS.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedType && t.type !== selectedType) return false;
    if (selectedDifficulty && t.difficulty !== selectedDifficulty) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Nhiệm Vụ</h1>
            <p className="text-sm text-muted-foreground">
              Hoàn thành nhiệm vụ để nhận EXP, lương và thăng cấp
            </p>
          </div>
          <Badge variant="career">{DEMO_TASKS.filter((t) => !t.completed).length} chưa hoàn thành</Badge>
        </div>
      </FadeIn>

      {/* Filters */}
      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm nhiệm vụ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["coding", "bug_fix", "refactor", "database"].map((type) => {
              const config = GAME_CONFIG.taskTypes.find((t) => t.type === type);
              return (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                >
                  {config?.icon} {config?.label}
                </Button>
              );
            })}
            {(["easy", "medium", "hard"] as const).map((d) => (
              <Button
                key={d}
                variant={selectedDifficulty === d ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
              >
                <Badge variant={d} className="mr-1">{d === "easy" ? "Dễ" : d === "medium" ? "Trung bình" : "Khó"}</Badge>
              </Button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Task list */}
      <div className="space-y-3">
        {filtered.map((task, i) => (
          <FadeIn key={task.id} delay={0.15 + i * 0.05}>
            <Link href={`/tasks/${task.slug}`}>
              <Card className={`group cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/30 ${task.completed ? "opacity-60" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Type icon */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0"
                      style={{ color: GAME_CONFIG.taskTypes.find((t) => t.type === task.type)?.color }}
                    >
                      {TASK_ICONS[task.type]}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-sm font-semibold truncate ${task.completed ? "line-through" : ""}`}>
                          {task.title}
                        </h3>
                        <Badge variant={task.difficulty}>{task.difficulty === "easy" ? "Dễ" : task.difficulty === "medium" ? "TB" : "Khó"}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {GAME_CONFIG.taskTypes.find((t) => t.type === task.type)?.icon}{" "}
                          {GAME_CONFIG.taskTypes.find((t) => t.type === task.type)?.label}
                        </span>
                        <span>•</span>
                        <span>{task.category}</span>
                        <span>•</span>
                        <span className={PRIORITY_COLORS[task.priority]}>
                          {task.priority === "low" ? "Thấp" : task.priority === "medium" ? "TB" : task.priority === "high" ? "Cao" : "Khẩn cấp"}
                        </span>
                      </div>
                    </div>

                    {/* Rewards + deadline */}
                    <div className="hidden sm:flex items-center gap-4 shrink-0">
                      <div className="text-center">
                        <p className="text-sm font-bold text-gradient-green">+{task.expReward}</p>
                        <p className="text-[10px] text-muted-foreground">EXP</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{task.deadlineHours}h</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </FadeIn>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p>Không tìm thấy nhiệm vụ phù hợp</p>
          </div>
        )}
      </div>
    </div>
  );
}
