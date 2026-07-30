import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireUser(nextPath = "/dashboard") {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  if (!claimsData?.claims?.sub) {
    redirect(`/auth/sign-in?next=${encodeURIComponent(nextPath)}`);
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect(`/auth/sign-in?next=${encodeURIComponent(nextPath)}`);
  }

  return { supabase, user };
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
