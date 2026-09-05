import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { SiteHeaderClient } from "@/components/site-header-client";

export async function SiteHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  // Also check custom session cookie (set by /api/auth/login and /api/auth/register)
  const cookieStore = await cookies();
  const localSession = cookieStore.get("ciel_user_session")?.value;
  let hasLocalSession = false;
  if (localSession) {
    try {
      // Decode URL-encoded value before parsing (Next.js stores cookies URL-encoded)
      const decoded = decodeURIComponent(localSession);
      const parsed = JSON.parse(decoded);
      hasLocalSession = Boolean(parsed?.email);
    } catch {
      // Invalid cookie — ignore
    }
  }

  const signedIn = Boolean(data?.claims?.sub) || hasLocalSession;

  return <SiteHeaderClient signedIn={signedIn} />;
}
