import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/types/database";

type AdminSupabaseClient = SupabaseClient<Database, "public", "public", Database["public"]>;

export async function writeAdminAuditLog({
  supabase,
  actorId,
  action,
  entityType,
  entityId,
  metadata = {},
}: {
  supabase: AdminSupabaseClient;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Json;
}) {
  const { error } = await supabase.from("admin_audit_logs").insert({
    actor_id: actorId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata,
  });

  if (error) {
    console.warn("Unable to write admin audit log", error.message);
  }
}
