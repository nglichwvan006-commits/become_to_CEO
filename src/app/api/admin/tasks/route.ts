import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { DEMO_ADMIN_TASKS, getAdminMetrics } from "@/constants/admin-demo";
import { writeAdminAuditLog } from "@/lib/admin/audit";
import { requireAdminAccess } from "@/lib/auth/admin";
import {
  buildDemoTaskFromDraft,
  buildTaskInsert,
  buildTaskUpdate,
  slugify,
  toManagedTask,
  type AdminTaskRow,
} from "@/lib/admin/task-mappers";
import type { ManagedTask, TaskDraft, TaskStatus } from "@/types/admin";
import type { Database, Json } from "@/types/database";

function isTaskDraft(value: unknown): value is TaskDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<TaskDraft>;

  return (
    typeof draft.title === "string" &&
    typeof draft.category === "string" &&
    ["easy", "medium", "hard"].includes(String(draft.difficulty)) &&
    ["low", "medium", "high", "critical"].includes(String(draft.priority)) &&
    typeof draft.expReward === "number" &&
    typeof draft.deadlineHours === "number" &&
    ["published", "draft", "archived"].includes(String(draft.status))
  );
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return value === "published" || value === "draft" || value === "archived";
}

function mergeAdminMeta(starterCode: Json, status: TaskStatus): Json {
  if (typeof starterCode === "object" && starterCode !== null && !Array.isArray(starterCode)) {
    return {
      ...starterCode,
      adminMeta: {
        status,
      },
    };
  }

  return {
    adminMeta: {
      status,
    },
  };
}

async function getSupabaseTasks(supabase: SupabaseClient<Database, "public", "public", Database["public"]>) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*,career_levels(id,slug)")
    .order("order_index", { ascending: true })
    .returns<AdminTaskRow[]>();

  if (error) throw new Error(error.message);

  return (data ?? []).map(toManagedTask);
}

export async function GET() {
  const access = await requireAdminAccess();

  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  if (access.mode === "demo") {
    return NextResponse.json({
      source: "demo",
      tasks: DEMO_ADMIN_TASKS,
      metrics: getAdminMetrics(DEMO_ADMIN_TASKS),
    });
  }

  try {
    const tasks = await getSupabaseTasks(access.supabase);

    return NextResponse.json({
      source: "supabase",
      tasks,
      metrics: getAdminMetrics(tasks),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load admin tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const access = await requireAdminAccess();

  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const body = (await request.json()) as { draft?: unknown; duplicateTaskId?: unknown };

  if (access.mode === "demo") {
    if (typeof body.duplicateTaskId === "string") {
      const source = DEMO_ADMIN_TASKS.find((task) => task.id === body.duplicateTaskId);
      if (!source) return NextResponse.json({ error: "Task not found" }, { status: 404 });

      const task: ManagedTask = {
        ...source,
        id: `task-copy-${Date.now()}`,
        title: `${source.title} Copy`,
        slug: `${source.slug}-copy-${DEMO_ADMIN_TASKS.length + 1}`,
        status: "draft",
        submissions: 0,
        acceptanceRate: 0,
        updatedAt: "2026-05-15",
      };

      return NextResponse.json({ source: "demo", task });
    }

    if (!isTaskDraft(body.draft)) {
      return NextResponse.json({ error: "Invalid task draft" }, { status: 400 });
    }

    return NextResponse.json({
      source: "demo",
      task: buildDemoTaskFromDraft(body.draft, DEMO_ADMIN_TASKS.length),
    });
  }

  try {
    if (typeof body.duplicateTaskId === "string") {
      const { data: sourceRaw, error: sourceError } = await access.supabase
        .from("tasks")
        .select("*,career_levels(id,slug)")
        .eq("id", body.duplicateTaskId)
        .single();
      const source = sourceRaw as AdminTaskRow | null;

      if (sourceError || !source) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }

      const insertPayload = {
        career_level_id: source.career_level_id,
        title: `${source.title} Copy`,
        slug: `${source.slug}-copy-${Date.now()}`,
        type: source.type,
        difficulty: source.difficulty,
        category: source.category,
        statement: source.statement,
        input_format: source.input_format,
        output_format: source.output_format,
        constraints: source.constraints,
        sample_input: source.sample_input,
        sample_output: source.sample_output,
        hidden_tests: source.hidden_tests,
        starter_code: mergeAdminMeta(source.starter_code, "draft"),
        exp_reward: source.exp_reward,
        salary_reward: source.salary_reward,
        reputation_reward: source.reputation_reward,
        deadline_hours: source.deadline_hours,
        priority: source.priority,
        penalty_performance: source.penalty_performance,
        penalty_reputation: source.penalty_reputation,
        order_index: source.order_index + 1,
      };

      const { data: insertedRaw, error } = await access.supabase
        .from("tasks")
        .insert(insertPayload)
        .select("*,career_levels(id,slug)")
        .single();
      const data = insertedRaw as AdminTaskRow | null;

      if (error || !data) throw new Error(error?.message ?? "Unable to duplicate task");

      const task = toManagedTask(data);
      await writeAdminAuditLog({
        supabase: access.supabase,
        actorId: access.userId,
        action: "task.duplicate",
        entityType: "task",
        entityId: task.id,
        metadata: { sourceTaskId: source.id, slug: task.slug },
      });

      return NextResponse.json({ source: "supabase", task });
    }

    if (!isTaskDraft(body.draft)) {
      return NextResponse.json({ error: "Invalid task draft" }, { status: 400 });
    }

    const { data: careerLevel, error: careerError } = await access.supabase
      .from("career_levels")
      .select("id,slug")
      .eq("slug", "intern")
      .single();

    if (careerError || !careerLevel) {
      throw new Error(careerError?.message ?? "Intern career level is missing");
    }

    const { count } = await access.supabase
      .from("tasks")
      .select("id", { count: "exact", head: true });

    const { data: insertedRaw, error } = await access.supabase
      .from("tasks")
      .insert(buildTaskInsert(body.draft, careerLevel.id, count ?? 0))
      .select("*,career_levels(id,slug)")
      .single();
    const data = insertedRaw as AdminTaskRow | null;

    if (error || !data) throw new Error(error?.message ?? "Unable to create task");

    const task = toManagedTask(data);
    await writeAdminAuditLog({
      supabase: access.supabase,
      actorId: access.userId,
      action: "task.create",
      entityType: "task",
      entityId: task.id,
      metadata: { slug: task.slug, status: task.status },
    });

    return NextResponse.json({ source: "supabase", task });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save task" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const access = await requireAdminAccess();

  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const body = (await request.json()) as {
    id?: unknown;
    draft?: unknown;
    status?: unknown;
  };

  if (typeof body.id !== "string") {
    return NextResponse.json({ error: "Task id is required" }, { status: 400 });
  }

  if (access.mode === "demo") {
    const source = DEMO_ADMIN_TASKS.find((task) => task.id === body.id);
    if (!source) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    const task =
      isTaskDraft(body.draft)
        ? {
            ...source,
            title: body.draft.title.trim(),
            category: body.draft.category.trim() || "General",
            difficulty: body.draft.difficulty,
            priority: body.draft.priority,
            expReward: body.draft.expReward,
            deadlineHours: body.draft.deadlineHours,
            status: body.draft.status,
            updatedAt: "2026-05-15",
          }
        : isTaskStatus(body.status)
          ? { ...source, status: body.status, updatedAt: "2026-05-15" }
          : source;

    return NextResponse.json({ source: "demo", task });
  }

  try {
    const { data: existingRaw, error: existingError } = await access.supabase
      .from("tasks")
      .select("*,career_levels(id,slug)")
      .eq("id", body.id)
      .single();
    const existing = existingRaw as AdminTaskRow | null;

    if (existingError || !existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const status = isTaskDraft(body.draft)
      ? body.draft.status
      : isTaskStatus(body.status)
        ? body.status
        : toManagedTask(existing).status;

    const updatePayload = {
      ...(isTaskDraft(body.draft) ? buildTaskUpdate(body.draft) : {}),
      slug: isTaskDraft(body.draft) ? slugify(body.draft.title) || existing.slug : existing.slug,
      starter_code: mergeAdminMeta(existing.starter_code, status),
    };

    const { data: updatedRaw, error } = await access.supabase
      .from("tasks")
      .update(updatePayload)
      .eq("id", body.id)
      .select("*,career_levels(id,slug)")
      .single();
    const data = updatedRaw as AdminTaskRow | null;

    if (error || !data) throw new Error(error?.message ?? "Unable to update task");

    const task = toManagedTask(data);
    await writeAdminAuditLog({
      supabase: access.supabase,
      actorId: access.userId,
      action: "task.update",
      entityType: "task",
      entityId: task.id,
      metadata: { slug: task.slug, status: task.status },
    });

    return NextResponse.json({ source: "supabase", task });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update task" },
      { status: 500 }
    );
  }
}
