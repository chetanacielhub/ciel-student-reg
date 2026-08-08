import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function requireUser(nextPath = "/dashboard") {
  const supabase = await createClient();

  // 1. Try Supabase auth first
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (user && !error) {
      return { supabase, user };
    }
  } catch {
    // Fall through to cookie check
  }

  // 2. Check fallback session cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("ciel_user_session");

  if (sessionCookie?.value) {
    try {
      const parsed = JSON.parse(sessionCookie.value);
      if (parsed?.email) {
        const user = {
          id: parsed.id || `usr-${Date.now()}`,
          email: parsed.email,
          user_metadata: {
            full_name: parsed.fullName || "Innovator",
          },
        } as any;

        return { supabase, user };
      }
    } catch {
      // Invalid cookie — fall through to redirect
    }
  }

  redirect(`/auth/sign-in?next=${encodeURIComponent(nextPath)}`);
}

export async function requireAdmin() {
  const { supabase, user } = await requireUser("/admin");
  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    redirect("/dashboard?error=admin_required");
  }

  return { supabase, user };
}
