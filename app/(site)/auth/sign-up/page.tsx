import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Create Account | CIEL",
};

export default async function SignUpPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims?.sub) redirect("/apply");

  return (
    <div className="compact-auth-page">
      <div className="compact-auth-card">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <h1 style={{ fontSize: 24, margin: "0 0 6px", fontFamily: "var(--font-serif-family)", color: "var(--text-white)" }}>
            Create Your Account
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--text-secondary)", margin: 0 }}>
            Enter your details below to begin your CIEL venture application.
          </p>
        </div>

        {/* Compact Form */}
        <SignUpForm />
      </div>
    </div>
  );
}
