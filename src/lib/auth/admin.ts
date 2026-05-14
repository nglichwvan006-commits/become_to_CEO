import type { SupabaseClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type AdminAccess =
  | {
      ok: true;
      mode: "demo";
      supabase: null;
      userId: null;
    }
  | {
      ok: true;
      mode: "supabase";
      supabase: SupabaseClient<Database, "public", "public", Database["public"]>;
      userId: string;
    }
  | {
      ok: false;
      status: 401 | 403 | 500;
      error: string;
    };

export async function requireAdminAccess(): Promise<AdminAccess> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return {
      ok: true,
      mode: "demo",
      supabase: null,
      userId: null,
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      status: 401,
      error: "Authentication required",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    return {
      ok: false,
      status: 500,
      error: profileError.message,
    };
  }

  if (profile?.role !== "admin") {
    return {
      ok: false,
      status: 403,
      error: "Admin role required",
    };
  }

  return {
    ok: true,
    mode: "supabase",
    supabase,
    userId: user.id,
  };
}
