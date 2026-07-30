import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthSide } from "@/components/auth/auth-side";
import { SignInForm } from "@/components/auth/sign-in-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign in",
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
    <div className="auth-page">
      <AuthSide mode="sign-in" />
      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          <h2>Sign in</h2>
          <p>Continue your registration or open your shared team profile.</p>
          <SignInForm nextPath={nextPath} />
        </div>
      </section>
    </div>
  );
}
