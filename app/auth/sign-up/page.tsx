import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthSide } from "@/components/auth/auth-side";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Create account",
};

export default async function SignUpPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims?.sub) redirect("/register");

  return (
    <div className="auth-page">
      <AuthSide mode="sign-up" />
      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          <h2>Create your account</h2>
          <p>Use your Gmail, phone number, and a strong password.</p>
          <SignUpForm />
        </div>
      </section>
    </div>
  );
}
