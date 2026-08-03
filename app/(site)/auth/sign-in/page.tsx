import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/auth/sign-in-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "User Sign In | CIEL Portal",
  description: "Sign in to your CIEL innovator portal, venture dashboard, and team management.",
};

function safeNextPath(value?: string) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims?.sub) redirect(nextPath);

  return (
    <div className="compact-auth-page">
      <div className="compact-auth-card">
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <h1 style={{ fontSize: 24, margin: "0 0 6px", color: "var(--text-white)", fontFamily: "var(--font-serif-family)" }}>
            Sign In to User Portal
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--text-secondary)", margin: 0 }}>
            Access your startup dashboard, project milestones, and mentorship sessions.
          </p>
        </div>

        <SignInForm nextPath={nextPath} />
      </div>
    </div>
  );
}
