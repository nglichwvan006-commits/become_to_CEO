export function isSupabaseConfigured() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return Boolean(
    supabaseUrl &&
      supabaseKey &&
      supabaseUrl !== "your_supabase_url_here" &&
      supabaseKey !== "your_supabase_anon_key_here"
  );
}
