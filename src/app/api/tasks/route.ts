import { NextResponse } from "next/server";
import { MOCK_TASKS } from "@/constants/mock-tasks";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";
import type { Difficulty, TaskType } from "@/types/game";

type TaskListRow = Pick<
  Tables<"tasks">,
  | "id"
  | "title"
  | "slug"
  | "type"
  | "difficulty"
  | "category"
  | "exp_reward"
  | "deadline_hours"
  | "priority"
> & {
  career_levels: { slug: string } | null;
};

function toTaskListItem(task: TaskListRow) {
  return {
    id: task.id,
    title: task.title,
    slug: task.slug,
    type: task.type,
    difficulty: task.difficulty,
    category: task.category,
    careerLevel: task.career_levels?.slug ?? "intern",
    expReward: task.exp_reward,
    deadlineHours: task.deadline_hours,
    priority: task.priority,
  };
}

function isDifficulty(value: string | null): value is Difficulty {
  return value === "easy" || value === "medium" || value === "hard";
}

function isTaskType(value: string | null): value is TaskType {
  return (
    value === "coding" ||
    value === "bug_fix" ||
    value === "refactor" ||
    value === "code_review" ||
    value === "system_design" ||
    value === "database" ||
    value === "deployment" ||
    value === "debug"
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const difficulty = searchParams.get("difficulty");
  const type = searchParams.get("type");
  const careerLevel = searchParams.get("careerLevel");

  const supabase = await createServerSupabaseClient();

  if (supabase) {
    let query = supabase
      .from("tasks")
      .select(
        "id,title,slug,type,difficulty,category,exp_reward,deadline_hours,priority,career_levels(slug)"
      )
      .order("order_index", { ascending: true });

    if (isDifficulty(difficulty)) query = query.eq("difficulty", difficulty);
    if (isTaskType(type)) query = query.eq("type", type);
    if (careerLevel) query = query.eq("career_levels.slug", careerLevel);

    const { data, error } = await query.returns<TaskListRow[]>();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      source: "supabase",
      tasks: (data ?? []).map(toTaskListItem),
    });
  }

  let tasks = MOCK_TASKS;

  if (isDifficulty(difficulty)) {
    tasks = tasks.filter((t) => t.difficulty === difficulty);
  }
  if (isTaskType(type)) {
    tasks = tasks.filter((t) => t.type === type);
  }
  if (careerLevel) {
    tasks = tasks.filter((t) => t.careerLevel === careerLevel);
  }

  const simplified = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    slug: t.slug,
    type: t.type,
    difficulty: t.difficulty,
    category: t.category,
    careerLevel: t.careerLevel,
    expReward: t.expReward,
    deadlineHours: t.deadlineHours,
    priority: t.priority,
  }));

  return NextResponse.json({ source: "mock", tasks: simplified });
}
