import { MOCK_TASKS } from "@/constants/mock-tasks";
import type {
  AdminAuditLog,
  AdminMetrics,
  ManagedTask,
  ManagedUser,
  TaskDraft,
} from "@/types/admin";

export const EMPTY_TASK_DRAFT: TaskDraft = {
  id: null,
  title: "",
  category: "Co ban",
  difficulty: "easy",
  priority: "low",
  expReward: 10,
  deadlineHours: 24,
  status: "draft",
};

export const DEMO_ADMIN_TASKS: ManagedTask[] = MOCK_TASKS.map((task, index) => ({
  id: task.id,
  title: task.title,
  slug: task.slug,
  type: task.type,
  difficulty: task.difficulty,
  category: task.category,
  careerLevel: task.careerLevel,
  expReward: task.expReward,
  salaryReward: task.salaryReward,
  reputationReward: task.reputationReward,
  deadlineHours: task.deadlineHours,
  priority: task.priority,
  status: index % 5 === 4 ? "draft" : "published",
  submissions: 42 + index * 17,
  acceptanceRate: Math.max(28, 88 - index * 5),
  updatedAt: `2026-05-${String(10 + index).padStart(2, "0")}`,
}));

export const DEMO_ADMIN_USERS: ManagedUser[] = [
  {
    id: "u-001",
    name: "Nguyen Minh Anh",
    email: "minhanh@careerquest.dev",
    role: "admin",
    status: "active",
    careerLevel: "Senior Developer",
    tasksCompleted: 68,
    performanceScore: 94,
    demotionRisk: 6,
    reputation: 1820,
    salary: 42000000,
    lastActive: "2026-05-15",
  },
  {
    id: "u-002",
    name: "Tran Gia Bao",
    email: "giabao@careerquest.dev",
    role: "user",
    status: "active",
    careerLevel: "Middle Developer",
    tasksCompleted: 43,
    performanceScore: 82,
    demotionRisk: 18,
    reputation: 920,
    salary: 26000000,
    lastActive: "2026-05-14",
  },
  {
    id: "u-003",
    name: "Le Hoang Nam",
    email: "hoangnam@careerquest.dev",
    role: "user",
    status: "at_risk",
    careerLevel: "Junior Developer",
    tasksCompleted: 16,
    performanceScore: 47,
    demotionRisk: 73,
    reputation: 260,
    salary: 12000000,
    lastActive: "2026-05-09",
  },
  {
    id: "u-004",
    name: "Pham Thao Vy",
    email: "thaovy@careerquest.dev",
    role: "user",
    status: "active",
    careerLevel: "Intern",
    tasksCompleted: 8,
    performanceScore: 76,
    demotionRisk: 22,
    reputation: 140,
    salary: 6000000,
    lastActive: "2026-05-15",
  },
  {
    id: "u-005",
    name: "Do Quang Huy",
    email: "quanghuy@careerquest.dev",
    role: "user",
    status: "locked",
    careerLevel: "Intern",
    tasksCompleted: 3,
    performanceScore: 31,
    demotionRisk: 88,
    reputation: 20,
    salary: 4500000,
    lastActive: "2026-05-01",
  },
];

export const DEMO_ADMIN_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: "audit-001",
    actorId: "u-001",
    actorName: "Nguyen Minh Anh",
    action: "task.create",
    entityType: "task",
    entityId: "task-demo-001",
    metadata: { slug: "kiem-thu-api-admin", status: "draft" },
    createdAt: "2026-05-15T01:48:00.000Z",
  },
  {
    id: "audit-002",
    actorId: "u-001",
    actorName: "Nguyen Minh Anh",
    action: "task.update",
    entityType: "task",
    entityId: "6",
    metadata: { slug: "fix-infinite-loop", status: "published" },
    createdAt: "2026-05-15T01:38:00.000Z",
  },
  {
    id: "audit-003",
    actorId: "u-001",
    actorName: "Nguyen Minh Anh",
    action: "user.update",
    entityType: "profile",
    entityId: "u-003",
    metadata: { status: "at_risk" },
    createdAt: "2026-05-15T01:24:00.000Z",
  },
  {
    id: "audit-004",
    actorId: "u-001",
    actorName: "Nguyen Minh Anh",
    action: "task.duplicate",
    entityType: "task",
    entityId: "task-copy-001",
    metadata: { sourceTaskId: "4", slug: "fizzbuzz-copy" },
    createdAt: "2026-05-15T01:05:00.000Z",
  },
];

export function getAdminMetrics(
  tasks: ManagedTask[] = DEMO_ADMIN_TASKS,
  users: ManagedUser[] = DEMO_ADMIN_USERS
): AdminMetrics {
  const published = tasks.filter((task) => task.status === "published").length;
  const drafts = tasks.filter((task) => task.status === "draft").length;
  const totalSubmissions = tasks.reduce((sum, task) => sum + task.submissions, 0);
  const averageAcceptanceRate =
    tasks.reduce((sum, task) => sum + task.acceptanceRate, 0) / Math.max(tasks.length, 1);

  const active = users.filter((user) => user.status === "active").length;
  const atRisk = users.filter((user) => user.status === "at_risk").length;
  const averagePerformance =
    users.reduce((sum, user) => sum + user.performanceScore, 0) / Math.max(users.length, 1);

  return {
    taskStats: {
      published,
      drafts,
      totalSubmissions,
      averageAcceptanceRate,
    },
    userStats: {
      active,
      atRisk,
      total: users.length,
      averagePerformance,
    },
  };
}
