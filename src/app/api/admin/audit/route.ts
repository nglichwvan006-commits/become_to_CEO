import { NextResponse } from "next/server";
import { DEMO_ADMIN_AUDIT_LOGS } from "@/constants/admin-demo";
import { requireAdminAccess } from "@/lib/auth/admin";
import type { AdminAuditLog } from "@/types/admin";
import type { Tables } from "@/types/database";

type AuditLogRow = Tables<"admin_audit_logs"> & {
  profiles: Pick<Tables<"profiles">, "username"> | null;
};

function toAdminAuditLog(row: AuditLogRow): AdminAuditLog {
  return {
    id: row.id,
    actorId: row.actor_id,
    actorName: row.profiles?.username ?? "Admin",
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    metadata: row.metadata,
    createdAt: row.created_at,
  };
}

export async function GET() {
  const access = await requireAdminAccess();

  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  if (access.mode === "demo") {
    return NextResponse.json({
      source: "demo",
      logs: DEMO_ADMIN_AUDIT_LOGS,
    });
  }

  const { data, error } = await access.supabase
    .from("admin_audit_logs")
    .select("*,profiles(username)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    logs: ((data ?? []) as AuditLogRow[]).map(toAdminAuditLog),
  });
}
