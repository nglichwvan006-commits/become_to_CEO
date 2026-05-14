import type { Difficulty, Priority, TaskType } from "./game";

import type { Json } from "./database";

export type AdminView = "tasks" | "users" | "audit";
export type TaskStatus = "published" | "draft" | "archived";
export type UserStatus = "active" | "at_risk" | "locked";

export interface ManagedTask {
  id: string;
  title: string;
  slug: string;
  type: TaskType;
  difficulty: Difficulty;
  category: string;
  careerLevel: string;
  expReward: number;
  salaryReward: number;
  reputationReward: number;
  deadlineHours: number;
  priority: Priority;
  status: TaskStatus;
  submissions: number;
  acceptanceRate: number;
  updatedAt: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: UserStatus;
  careerLevel: string;
  tasksCompleted: number;
  performanceScore: number;
  demotionRisk: number;
  reputation: number;
  salary: number;
  lastActive: string;
}

export interface TaskDraft {
  id: string | null;
  title: string;
  category: string;
  difficulty: Difficulty;
  priority: Priority;
  expReward: number;
  deadlineHours: number;
  status: TaskStatus;
}

export interface AdminMetrics {
  taskStats: {
    published: number;
    drafts: number;
    totalSubmissions: number;
    averageAcceptanceRate: number;
  };
  userStats: {
    active: number;
    atRisk: number;
    total: number;
    averagePerformance: number;
  };
}

export interface AdminAuditLog {
  id: string;
  actorId: string | null;
  actorName: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Json;
  createdAt: string;
}
