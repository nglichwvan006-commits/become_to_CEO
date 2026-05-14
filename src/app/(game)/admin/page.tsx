"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Archive,
  BarChart3,
  CheckCircle2,
  Copy,
  Edit3,
  FilePlus2,
  Filter,
  Gauge,
  History,
  Lock,
  MoreHorizontal,
  Save,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Unlock,
  Users,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  DEMO_ADMIN_AUDIT_LOGS,
  DEMO_ADMIN_TASKS,
  DEMO_ADMIN_USERS,
  EMPTY_TASK_DRAFT,
} from "@/constants/admin-demo";
import { GAME_CONFIG } from "@/constants/game-config";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import type {
  AdminAuditLog,
  AdminView,
  ManagedTask,
  ManagedUser,
  TaskDraft,
  TaskStatus,
  UserStatus,
} from "@/types/admin";
import type { Difficulty, Priority } from "@/types/game";

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "De",
  medium: "Trung binh",
  hard: "Kho",
};

const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Thap",
  medium: "Trung binh",
  high: "Cao",
  critical: "Khan cap",
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  published: "Dang mo",
  draft: "Ban nhap",
  archived: "Luu tru",
};

const USER_STATUS_LABELS: Record<UserStatus, string> = {
  active: "Dang hoc",
  at_risk: "Can theo doi",
  locked: "Da khoa",
};

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  tone: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const className =
    status === "published"
      ? "bg-emerald-500/15 text-emerald-500"
      : status === "draft"
        ? "bg-amber-500/15 text-amber-500"
        : "bg-muted text-muted-foreground";

  return (
    <Badge variant="secondary" className={className}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}

function UserStatusBadge({ status }: { status: UserStatus }) {
  const className =
    status === "active"
      ? "bg-emerald-500/15 text-emerald-500"
      : status === "at_risk"
        ? "bg-orange-500/15 text-orange-500"
        : "bg-red-500/15 text-red-500";

  return (
    <Badge variant="secondary" className={className}>
      {USER_STATUS_LABELS[status]}
    </Badge>
  );
}

type AdminTasksResponse = {
  source: "demo" | "supabase";
  tasks: ManagedTask[];
};

type AdminTaskResponse = {
  source: "demo" | "supabase";
  task: ManagedTask;
};

type AdminUsersResponse = {
  source: "demo" | "supabase";
  users: ManagedUser[];
};

type AdminUserResponse = {
  source: "demo" | "supabase";
  user: ManagedUser;
};

type AdminAuditResponse = {
  source: "demo" | "supabase";
  logs: AdminAuditLog[];
};

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Admin request failed");
  }

  return data as T;
}

export default function AdminPage() {
  const [activeView, setActiveView] = useState<AdminView>("tasks");
  const [tasks, setTasks] = useState<ManagedTask[]>(DEMO_ADMIN_TASKS);
  const [users, setUsers] = useState<ManagedUser[]>(DEMO_ADMIN_USERS);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(DEMO_ADMIN_AUDIT_LOGS);
  const [search, setSearch] = useState("");
  const [taskFilter, setTaskFilter] = useState<TaskStatus | "all">("all");
  const [draft, setDraft] = useState<TaskDraft>(EMPTY_TASK_DRAFT);
  const [dataSource, setDataSource] = useState<"demo" | "supabase">("demo");
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;

    async function loadAdminData() {
      try {
        const [tasksResponse, usersResponse, auditResponse] = await Promise.all([
          requestJson<AdminTasksResponse>("/api/admin/tasks"),
          requestJson<AdminUsersResponse>("/api/admin/users"),
          requestJson<AdminAuditResponse>("/api/admin/audit"),
        ]);

        if (!alive) return;
        setTasks(tasksResponse.tasks);
        setUsers(usersResponse.users);
        setAuditLogs(auditResponse.logs);
        setDataSource(tasksResponse.source);
      } catch (error) {
        toast.error("Khong tai duoc admin data", {
          description: error instanceof Error ? error.message : "Dung demo data tam thoi.",
        });
      } finally {
        if (alive) setLoadingData(false);
      }
    }

    loadAdminData();

    return () => {
      alive = false;
    };
  }, []);

  const taskStats = useMemo(() => {
    const published = tasks.filter((task) => task.status === "published").length;
    const draftCount = tasks.filter((task) => task.status === "draft").length;
    const avgAcceptance =
      tasks.reduce((sum, task) => sum + task.acceptanceRate, 0) / Math.max(tasks.length, 1);
    const totalSubmissions = tasks.reduce((sum, task) => sum + task.submissions, 0);

    return { published, draftCount, avgAcceptance, totalSubmissions };
  }, [tasks]);

  const userStats = useMemo(() => {
    const active = users.filter((user) => user.status === "active").length;
    const atRisk = users.filter((user) => user.status === "at_risk").length;
    const avgPerformance =
      users.reduce((sum, user) => sum + user.performanceScore, 0) / Math.max(users.length, 1);

    return { active, atRisk, avgPerformance };
  }, [users]);

  const filteredTasks = tasks.filter((task) => {
    const query = search.toLowerCase();
    const matchesSearch =
      task.title.toLowerCase().includes(query) ||
      task.category.toLowerCase().includes(query) ||
      task.slug.toLowerCase().includes(query);
    const matchesStatus = taskFilter === "all" || task.status === taskFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.careerLevel.toLowerCase().includes(query)
    );
  });

  const filteredAuditLogs = auditLogs.filter((log) => {
    const query = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(query) ||
      log.entityType.toLowerCase().includes(query) ||
      log.entityId.toLowerCase().includes(query) ||
      log.actorName.toLowerCase().includes(query)
    );
  });

  function editTask(task: ManagedTask) {
    setDraft({
      id: task.id,
      title: task.title,
      category: task.category,
      difficulty: task.difficulty,
      priority: task.priority,
      expReward: task.expReward,
      deadlineHours: task.deadlineHours,
      status: task.status,
    });
  }

  async function saveTask() {
    if (!draft.title.trim()) return;
    setSaving(true);

    try {
      if (draft.id) {
        const response = await requestJson<AdminTaskResponse>("/api/admin/tasks", {
          method: "PATCH",
          body: JSON.stringify({ id: draft.id, draft }),
        });

        setTasks((current) =>
          current.map((task) => (task.id === response.task.id ? response.task : task))
        );
        toast.success("Da cap nhat task");
      } else {
        const response = await requestJson<AdminTaskResponse>("/api/admin/tasks", {
          method: "POST",
          body: JSON.stringify({ draft }),
        });

        setTasks((current) => [response.task, ...current]);
        toast.success("Da tao task moi");
      }

      setDraft(EMPTY_TASK_DRAFT);
    } catch (error) {
      toast.error("Khong luu duoc task", {
        description: error instanceof Error ? error.message : "Hay thu lai.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function duplicateTask(task: ManagedTask) {
    try {
      const response = await requestJson<AdminTaskResponse>("/api/admin/tasks", {
        method: "POST",
        body: JSON.stringify({ duplicateTaskId: task.id }),
      });

      setTasks((current) => [response.task, ...current]);
      toast.success("Da nhan ban task");
    } catch (error) {
      toast.error("Khong nhan ban duoc task", {
        description: error instanceof Error ? error.message : "Hay thu lai.",
      });
    }
  }

  async function updateTaskStatus(task: ManagedTask, status: TaskStatus) {
    const previousTasks = tasks;
    setTasks((current) =>
      current.map((item) =>
        item.id === task.id ? { ...item, status, updatedAt: "2026-05-15" } : item
      )
    );

    try {
      const response = await requestJson<AdminTaskResponse>("/api/admin/tasks", {
        method: "PATCH",
        body: JSON.stringify({ id: task.id, status }),
      });

      setTasks((current) =>
        current.map((item) => (item.id === response.task.id ? response.task : item))
      );
    } catch (error) {
      setTasks(previousTasks);
      toast.error("Khong doi duoc trang thai task", {
        description: error instanceof Error ? error.message : "Hay thu lai.",
      });
    }
  }

  function toggleTaskStatus(task: ManagedTask) {
    const nextStatus: TaskStatus = task.status === "published" ? "draft" : "published";
    updateTaskStatus(task, nextStatus);
  }

  function archiveTask(taskId: string) {
    const task = tasks.find((item) => item.id === taskId);
    if (task) updateTaskStatus(task, "archived");
  }

  async function updateUser(user: ManagedUser, patch: { role?: "user" | "admin"; status?: UserStatus }) {
    const previousUsers = users;
    setUsers((current) =>
      current.map((item) =>
        item.id === user.id
          ? {
              ...item,
              role: patch.role ?? item.role,
              status: patch.status ?? item.status,
            }
          : item
      )
    );

    try {
      const response = await requestJson<AdminUserResponse>("/api/admin/users", {
        method: "PATCH",
        body: JSON.stringify({ id: user.id, ...patch }),
      });

      setUsers((current) =>
        current.map((item) => (item.id === response.user.id ? response.user : item))
      );
    } catch (error) {
      setUsers(previousUsers);
      toast.error("Khong cap nhat duoc user", {
        description: error instanceof Error ? error.message : "Hay thu lai.",
      });
    }
  }

  function toggleUserLock(user: ManagedUser) {
    updateUser(user, { status: user.status === "locked" ? "active" : "locked" });
  }

  function toggleUserRole(user: ManagedUser) {
    updateUser(user, { role: user.role === "admin" ? "user" : "admin" });
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <Badge variant="career">Admin Console</Badge>
              <Badge variant="secondary">
                {loadingData ? "Syncing" : dataSource === "supabase" ? "Supabase live" : "Demo mode"}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold">Quan ly he thong</h1>
            <p className="text-sm text-muted-foreground">
              Dieu phoi nhiem vu, theo doi nguoi dung va chuan bi du lieu cho Supabase.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeView === "tasks" ? "career" : "outline"}
              onClick={() => setActiveView("tasks")}
            >
              <FilePlus2 className="h-4 w-4" />
              Nhiem vu
            </Button>
            <Button
              variant={activeView === "users" ? "career" : "outline"}
              onClick={() => setActiveView("users")}
            >
              <Users className="h-4 w-4" />
              Nguoi dung
            </Button>
            <Button
              variant={activeView === "audit" ? "career" : "outline"}
              onClick={() => setActiveView("audit")}
            >
              <History className="h-4 w-4" />
              Audit
            </Button>
          </div>
        </div>
      </FadeIn>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FadeIn delay={0.05}>
          <StatCard
            icon={FilePlus2}
            label="Task dang mo"
            value={String(taskStats.published)}
            hint={`${taskStats.draftCount} ban nhap can duyet`}
            tone="bg-violet-500/15 text-violet-500"
          />
        </FadeIn>
        <FadeIn delay={0.1}>
          <StatCard
            icon={BarChart3}
            label="Luot nop bai"
            value={String(taskStats.totalSubmissions)}
            hint={`${Math.round(taskStats.avgAcceptance)}% ty le dung TB`}
            tone="bg-cyan-500/15 text-cyan-500"
          />
        </FadeIn>
        <FadeIn delay={0.15}>
          <StatCard
            icon={ShieldCheck}
            label="Nguoi dung active"
            value={String(userStats.active)}
            hint={`${users.length} tai khoan dang quan ly`}
            tone="bg-emerald-500/15 text-emerald-500"
          />
        </FadeIn>
        <FadeIn delay={0.2}>
          <StatCard
            icon={Gauge}
            label="Can canh bao"
            value={String(userStats.atRisk)}
            hint={`${Math.round(userStats.avgPerformance)}% hieu suat TB`}
            tone="bg-orange-500/15 text-orange-500"
          />
        </FadeIn>
      </div>

      <FadeIn delay={0.25}>
        <Card>
          <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={
                  activeView === "tasks"
                    ? "Tim theo ten, slug hoac danh muc..."
                    : activeView === "users"
                      ? "Tim theo ten, email hoac cap bac..."
                      : "Tim theo action, entity hoac actor..."
                }
                className="pl-10"
              />
            </div>
            {activeView === "tasks" && (
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {(["all", "published", "draft", "archived"] as const).map((status) => (
                  <Button
                    key={status}
                    variant={taskFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTaskFilter(status)}
                  >
                    {status === "all" ? "Tat ca" : STATUS_LABELS[status]}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {activeView === "tasks" ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <FadeIn delay={0.3}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Task pipeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[860px] text-sm">
                    <thead className="border-y bg-muted/50 text-xs text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Task</th>
                        <th className="px-4 py-3 text-left font-medium">Loai</th>
                        <th className="px-4 py-3 text-left font-medium">Do kho</th>
                        <th className="px-4 py-3 text-left font-medium">Trang thai</th>
                        <th className="px-4 py-3 text-left font-medium">Hieu qua</th>
                        <th className="px-4 py-3 text-right font-medium">Thao tac</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.map((task) => (
                        <motion.tr
                          key={task.id}
                          layout
                          className="border-b transition-colors hover:bg-muted/40"
                        >
                          <td className="px-4 py-3">
                            <div className="max-w-[320px]">
                              <p className="truncate font-medium">{task.title}</p>
                              <p className="truncate text-xs text-muted-foreground">
                                {task.slug} - {task.category} - cap {task.careerLevel}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5 text-xs">
                              {GAME_CONFIG.taskTypes.find((type) => type.type === task.type)?.icon}
                              {GAME_CONFIG.taskTypes.find((type) => type.type === task.type)?.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Badge variant={task.difficulty}>
                                {DIFFICULTY_LABELS[task.difficulty]}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {PRIORITY_LABELS[task.priority]}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <TaskStatusBadge status={task.status} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="w-40 space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>{task.submissions} nop bai</span>
                                <span>{task.acceptanceRate}%</span>
                              </div>
                              <Progress
                                value={task.acceptanceRate}
                                className="h-1.5"
                                indicatorClassName="bg-gradient-to-r from-cyan-500 to-emerald-500"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Chinh sua"
                                aria-label="Chinh sua task"
                                onClick={() => editTask(task)}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Nhan ban"
                                aria-label="Nhan ban task"
                                onClick={() => duplicateTask(task)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title={task.status === "published" ? "Chuyen ve ban nhap" : "Xuat ban"}
                                aria-label={
                                  task.status === "published" ? "Chuyen task ve ban nhap" : "Xuat ban task"
                                }
                                onClick={() => toggleTaskStatus(task)}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Luu tru"
                                aria-label="Luu tru task"
                                onClick={() => archiveTask(task.id)}
                              >
                                <Archive className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredTasks.length === 0 && (
                  <div className="py-12 text-center text-sm text-muted-foreground">
                    Khong co task phu hop voi bo loc hien tai.
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.35}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FilePlus2 className="h-4 w-4 text-primary" />
                  {draft.id ? "Chinh sua task" : "Tao task nhanh"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Ten task</Label>
                  <Input
                    id="task-title"
                    value={draft.title}
                    onChange={(event) => setDraft((item) => ({ ...item, title: event.target.value }))}
                    placeholder="Vi du: Kiem tra palindrome"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-category">Danh muc</Label>
                  <Input
                    id="task-category"
                    value={draft.category}
                    onChange={(event) => setDraft((item) => ({ ...item, category: event.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="task-difficulty">Do kho</Label>
                    <select
                      id="task-difficulty"
                      value={draft.difficulty}
                      onChange={(event) =>
                        setDraft((item) => ({ ...item, difficulty: event.target.value as Difficulty }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    >
                      {(["easy", "medium", "hard"] as const).map((difficulty) => (
                        <option key={difficulty} value={difficulty}>
                          {DIFFICULTY_LABELS[difficulty]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-priority">Uu tien</Label>
                    <select
                      id="task-priority"
                      value={draft.priority}
                      onChange={(event) =>
                        setDraft((item) => ({ ...item, priority: event.target.value as Priority }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    >
                      {(["low", "medium", "high", "critical"] as const).map((priority) => (
                        <option key={priority} value={priority}>
                          {PRIORITY_LABELS[priority]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="task-exp">EXP</Label>
                    <Input
                      id="task-exp"
                      type="number"
                      value={draft.expReward}
                      onChange={(event) =>
                        setDraft((item) => ({ ...item, expReward: Number(event.target.value) }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-deadline">Deadline h</Label>
                    <Input
                      id="task-deadline"
                      type="number"
                      value={draft.deadlineHours}
                      onChange={(event) =>
                        setDraft((item) => ({ ...item, deadlineHours: Number(event.target.value) }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-status">Trang thai</Label>
                  <select
                    id="task-status"
                    value={draft.status}
                    onChange={(event) =>
                      setDraft((item) => ({ ...item, status: event.target.value as TaskStatus }))
                    }
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  >
                    {(["draft", "published", "archived"] as const).map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" variant="career" onClick={saveTask} disabled={saving}>
                    <Save className="h-4 w-4" />
                    {saving ? "Dang luu" : "Luu"}
                  </Button>
                  <Button variant="outline" onClick={() => setDraft(EMPTY_TASK_DRAFT)}>
                    Huy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      ) : activeView === "users" ? (
        <FadeIn delay={0.3}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4 text-primary" />
                User operations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead className="border-y bg-muted/50 text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Nguoi dung</th>
                      <th className="px-4 py-3 text-left font-medium">Vai tro</th>
                      <th className="px-4 py-3 text-left font-medium">Trang thai</th>
                      <th className="px-4 py-3 text-left font-medium">Tien do</th>
                      <th className="px-4 py-3 text-left font-medium">Tai chinh</th>
                      <th className="px-4 py-3 text-right font-medium">Thao tac</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <motion.tr
                        key={user.id}
                        layout
                        className="border-b transition-colors hover:bg-muted/40"
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Active: {user.lastActive}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={user.role === "admin" ? "career" : "secondary"}>
                            {user.role === "admin" ? "Admin" : "Learner"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <UserStatusBadge status={user.status} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="w-52 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span>{user.careerLevel}</span>
                              <span>{user.performanceScore}%</span>
                            </div>
                            <Progress
                              value={user.performanceScore}
                              className="h-1.5"
                              indicatorClassName="bg-gradient-to-r from-violet-500 to-cyan-500"
                            />
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{user.tasksCompleted} tasks</span>
                              <span>Risk {user.demotionRisk}%</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{formatCurrency(user.salary)}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.reputation} reputation
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              title={user.role === "admin" ? "Ha quyen" : "Cap quyen admin"}
                              aria-label={user.role === "admin" ? "Ha quyen" : "Cap quyen admin"}
                              onClick={() => toggleUserRole(user)}
                            >
                              <ShieldCheck className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title={user.status === "locked" ? "Mo khoa" : "Khoa tai khoan"}
                              aria-label={user.status === "locked" ? "Mo khoa" : "Khoa tai khoan"}
                              onClick={() => toggleUserLock(user)}
                            >
                              {user.status === "locked" ? (
                                <Unlock className="h-4 w-4" />
                              ) : (
                                <Lock className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Them tuy chon"
                              aria-label="Them tuy chon"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredUsers.length === 0 && (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Khong co nguoi dung phu hop voi tu khoa hien tai.
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      ) : (
        <FadeIn delay={0.3}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="h-4 w-4 text-primary" />
                Audit timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-sm">
                  <thead className="border-y bg-muted/50 text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Thoi diem</th>
                      <th className="px-4 py-3 text-left font-medium">Actor</th>
                      <th className="px-4 py-3 text-left font-medium">Action</th>
                      <th className="px-4 py-3 text-left font-medium">Entity</th>
                      <th className="px-4 py-3 text-left font-medium">Metadata</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAuditLogs.map((log) => (
                      <motion.tr
                        key={log.id}
                        layout
                        className="border-b transition-colors hover:bg-muted/40"
                      >
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{log.actorName}</p>
                            <p className="text-xs text-muted-foreground">{log.actorId ?? "system"}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary">{log.action}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{log.entityType}</p>
                            <p className="text-xs text-muted-foreground">{log.entityId}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <code className="block max-w-md truncate rounded-md bg-muted px-2 py-1 text-xs">
                            {JSON.stringify(log.metadata)}
                          </code>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredAuditLogs.length === 0 && (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Chua co audit log phu hop voi tu khoa hien tai.
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </div>
  );
}
