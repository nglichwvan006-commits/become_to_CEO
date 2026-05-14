import { MOCK_TASKS } from "@/constants/mock-tasks";
import type { ManagedTask, TaskDraft, TaskStatus } from "@/types/admin";
import type { InsertTables, Tables, UpdateTables } from "@/types/database";
import type { Priority, TaskType } from "@/types/game";

type TaskStatusMeta = {
  status?: TaskStatus | null;
  submissions?: number | null;
  acceptanceRate?: number | null;
};

export type AdminTaskRow = Tables<"tasks"> & {
  career_levels: { id: string; slug: string } | null;
};

export type CareerLevelOption = Pick<Tables<"career_levels">, "id" | "slug">;

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getTaskMeta(taskId: string, index = 0): TaskStatusMeta {
  return {
    status: index % 5 === 4 ? "draft" : "published",
    submissions: 42 + index * 17,
    acceptanceRate: Math.max(28, 88 - index * 5),
  };
}

export function toManagedTask(row: AdminTaskRow, index = 0): ManagedTask {
  const meta =
    typeof row.starter_code === "object" &&
    row.starter_code !== null &&
    !Array.isArray(row.starter_code) &&
    "adminMeta" in row.starter_code
      ? (row.starter_code.adminMeta as TaskStatusMeta)
      : getTaskMeta(row.id, index);

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    type: row.type,
    difficulty: row.difficulty,
    category: row.category,
    careerLevel: row.career_levels?.slug ?? "intern",
    expReward: row.exp_reward,
    salaryReward: row.salary_reward,
    reputationReward: row.reputation_reward,
    deadlineHours: row.deadline_hours,
    priority: row.priority,
    status: meta.status ?? "published",
    submissions: meta.submissions ?? 0,
    acceptanceRate: meta.acceptanceRate ?? 0,
    updatedAt: row.updated_at.slice(0, 10),
  };
}

export function buildTaskInsert(
  draft: TaskDraft,
  careerLevelId: string,
  orderIndex: number
): InsertTables<"tasks"> {
  const fallback = MOCK_TASKS[0];
  const title = draft.title.trim();

  return {
    career_level_id: careerLevelId,
    title,
    slug: slugify(title) || `new-task-${orderIndex + 1}`,
    type: "coding",
    difficulty: draft.difficulty,
    category: draft.category.trim() || "General",
    statement: fallback.statement,
    input_format: fallback.inputFormat,
    output_format: fallback.outputFormat,
    constraints: fallback.constraints,
    sample_input: fallback.sampleInput,
    sample_output: fallback.sampleOutput,
    hidden_tests: fallback.hiddenTests,
    starter_code: {
      ...fallback.starterCode,
      adminMeta: {
        status: draft.status,
        submissions: 0,
        acceptanceRate: 0,
      },
    },
    exp_reward: Number(draft.expReward) || 10,
    salary_reward: 50000,
    reputation_reward: 2,
    deadline_hours: Number(draft.deadlineHours) || 24,
    priority: draft.priority,
    penalty_performance: 5,
    penalty_reputation: 3,
    order_index: orderIndex,
  };
}

export function buildTaskUpdate(draft: Partial<TaskDraft>): UpdateTables<"tasks"> {
  const update: UpdateTables<"tasks"> = {};

  if (draft.title !== undefined) update.title = draft.title.trim();
  if (draft.category !== undefined) update.category = draft.category.trim() || "General";
  if (draft.difficulty !== undefined) update.difficulty = draft.difficulty;
  if (draft.priority !== undefined) update.priority = draft.priority;
  if (draft.expReward !== undefined) update.exp_reward = Number(draft.expReward) || 10;
  if (draft.deadlineHours !== undefined) update.deadline_hours = Number(draft.deadlineHours) || 24;

  return update;
}

export function buildDemoTaskFromDraft(draft: TaskDraft, orderIndex: number): ManagedTask {
  const source = MOCK_TASKS[0];
  const title = draft.title.trim();

  return {
    id: draft.id ?? `task-${Date.now()}`,
    title,
    slug: slugify(title) || `new-task-${orderIndex + 1}`,
    type: "coding" satisfies TaskType,
    difficulty: draft.difficulty,
    category: draft.category.trim() || "General",
    careerLevel: "intern",
    expReward: Number(draft.expReward) || 10,
    salaryReward: source.salaryReward,
    reputationReward: source.reputationReward,
    deadlineHours: Number(draft.deadlineHours) || 24,
    priority: draft.priority satisfies Priority,
    status: draft.status,
    submissions: 0,
    acceptanceRate: 0,
    updatedAt: "2026-05-15",
  };
}
