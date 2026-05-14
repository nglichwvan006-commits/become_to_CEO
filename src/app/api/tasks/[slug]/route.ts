import { NextResponse } from "next/server";
import { getTaskBySlug, type MockTask } from "@/constants/mock-tasks";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Json, Tables } from "@/types/database";

type TaskDetailRow = Tables<"tasks"> & {
  career_levels: { slug: string } | null;
};

function isHiddenTests(value: Json): value is { input: string; output: string }[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "input" in item &&
        "output" in item
    )
  );
}

function isStarterCode(value: Json): value is Record<string, string> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((item) => typeof item === "string")
  );
}

function toMockTask(row: TaskDetailRow): MockTask {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    type: row.type,
    difficulty: row.difficulty,
    category: row.category,
    careerLevel: row.career_levels?.slug ?? "intern",
    statement: row.statement,
    inputFormat: row.input_format,
    outputFormat: row.output_format,
    constraints: row.constraints,
    sampleInput: row.sample_input,
    sampleOutput: row.sample_output,
    hiddenTests: isHiddenTests(row.hidden_tests) ? row.hidden_tests : [],
    starterCode: isStarterCode(row.starter_code) ? row.starter_code : {},
    expReward: row.exp_reward,
    salaryReward: row.salary_reward,
    reputationReward: row.reputation_reward,
    deadlineHours: row.deadline_hours,
    priority: row.priority,
    orderIndex: row.order_index,
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("tasks")
      .select("*,career_levels(slug)")
      .eq("slug", slug)
      .single()
      .returns<TaskDetailRow>();

    if (!error && data) {
      return NextResponse.json({ source: "supabase", task: toMockTask(data) });
    }
  }

  const task = getTaskBySlug(slug);

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ source: "mock", task });
}
