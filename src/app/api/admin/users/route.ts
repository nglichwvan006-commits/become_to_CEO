import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { DEMO_ADMIN_TASKS, DEMO_ADMIN_USERS, getAdminMetrics } from "@/constants/admin-demo";
import { writeAdminAuditLog } from "@/lib/admin/audit";
import { requireAdminAccess } from "@/lib/auth/admin";
import { toManagedUser, type AdminProfileRow } from "@/lib/admin/user-mappers";
import type { ManagedUser, UserStatus } from "@/types/admin";
import type { Database } from "@/types/database";

function isUserRole(value: unknown): value is "user" | "admin" {
  return value === "user" || value === "admin";
}

function isUserStatus(value: unknown): value is UserStatus {
  return value === "active" || value === "at_risk" || value === "locked";
}

function statusToCareerPatch(status: UserStatus) {
  if (status === "locked") {
    return { demotion_risk: 95, performance_score: 25 };
  }

  if (status === "at_risk") {
    return { demotion_risk: 75, performance_score: 45 };
  }

  return { demotion_risk: 10, performance_score: 80 };
}

async function getSupabaseUsers(supabase: SupabaseClient<Database, "public", "public", Database["public"]>) {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id,username,avatar_url,role,created_at,updated_at,user_careers(tasks_completed,performance_score,demotion_risk,reputation,salary,updated_at,career_levels(name))"
    )
    .order("created_at", { ascending: false })
    .returns<AdminProfileRow[]>();

  if (error) throw new Error(error.message);

  return (data ?? []).map(toManagedUser);
}

export async function GET() {
  const access = await requireAdminAccess();

  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  if (access.mode === "demo") {
    return NextResponse.json({
      source: "demo",
      users: DEMO_ADMIN_USERS,
      metrics: getAdminMetrics(DEMO_ADMIN_TASKS, DEMO_ADMIN_USERS),
    });
  }

  try {
    const users = await getSupabaseUsers(access.supabase);

    return NextResponse.json({
      source: "supabase",
      users,
      metrics: getAdminMetrics(DEMO_ADMIN_TASKS, users),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load admin users" },
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
    role?: unknown;
    status?: unknown;
  };

  if (typeof body.id !== "string") {
    return NextResponse.json({ error: "User id is required" }, { status: 400 });
  }

  if (!isUserRole(body.role) && !isUserStatus(body.status)) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  if (access.mode === "demo") {
    const source = DEMO_ADMIN_USERS.find((user) => user.id === body.id);
    if (!source) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const nextStatus = isUserStatus(body.status) ? body.status : source.status;
    const user: ManagedUser = {
      ...source,
      role: isUserRole(body.role) ? body.role : source.role,
      status: nextStatus,
      ...(nextStatus === "locked"
        ? { demotionRisk: 95, performanceScore: 25 }
        : nextStatus === "at_risk"
          ? { demotionRisk: 75, performanceScore: 45 }
          : { demotionRisk: 10, performanceScore: Math.max(source.performanceScore, 80) }),
    };

    return NextResponse.json({ source: "demo", user });
  }

  try {
    if (isUserRole(body.role)) {
      const { error } = await access.supabase
        .from("profiles")
        .update({ role: body.role })
        .eq("id", body.id);

      if (error) throw new Error(error.message);
    }

    if (isUserStatus(body.status)) {
      const { error } = await access.supabase
        .from("user_careers")
        .update(statusToCareerPatch(body.status))
        .eq("profile_id", body.id);

      if (error) throw new Error(error.message);
    }

    const { data: profileRaw, error } = await access.supabase
      .from("profiles")
      .select(
        "id,username,avatar_url,role,created_at,updated_at,user_careers(tasks_completed,performance_score,demotion_risk,reputation,salary,updated_at,career_levels(name))"
      )
      .eq("id", body.id)
      .single();
    const data = profileRaw as AdminProfileRow | null;

    if (error || !data) throw new Error(error?.message ?? "Unable to reload user");

    const user = toManagedUser(data);
    await writeAdminAuditLog({
      supabase: access.supabase,
      actorId: access.userId,
      action: "user.update",
      entityType: "profile",
      entityId: user.id,
      metadata: {
        role: isUserRole(body.role) ? body.role : undefined,
        status: isUserStatus(body.status) ? body.status : undefined,
      },
    });

    return NextResponse.json({ source: "supabase", user });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update user" },
      { status: 500 }
    );
  }
}
