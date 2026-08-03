import { createClient as createServerClient } from "@supabase/supabase-js";

/**
 * Supabase admin client.
 * Uses SUPABASE_SERVICE_ROLE_KEY if available to bypass RLS policies.
 * Falls back to NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY if service key is not set.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in environment.");
  }

  return createServerClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
