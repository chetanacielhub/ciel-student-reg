import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MailCheck, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Check Your Email | CIEL",
};

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="shell center-page">
      <section className="status-card" style={{ maxWidth: 540 }}>
        <div className="status-icon">
          <MailCheck size={30} aria-hidden="true" />
        </div>
        <h1>Account Created Successfully</h1>
        <p style={{ marginBottom: 16 }}>
          We sent a verification link{email ? ` to ${email}` : " to your email inbox"}.
        </p>

        <div
          style={{
            background: "rgba(212, 175, 55, 0.1)",
            border: "1px solid var(--ciel-gold-border)",
            borderRadius: 8,
            padding: 16,
            textAlign: "left",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--ciel-gold-bright)", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
            <ShieldAlert size={16} /> Not receiving the email?
          </div>
          <p style={{ fontSize: 12.5, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
            Supabase built-in SMTP has rate limits. If email confirmation is enabled in your Supabase project, go to <strong>Supabase Dashboard &rarr; Authentication &rarr; Providers &rarr; Email</strong> and disable <strong>&quot;Confirm email&quot;</strong>. This allows users to sign in instantly without waiting for an email.
          </p>
        </div>

        <div className="inline-actions" style={{ justifyContent: "center" }}>
          <Link className="button button-primary" href="/auth/sign-in">
            Proceed to Sign In Now
            <ArrowRight size={16} />
          </Link>
          <Link className="button button-secondary" href="/apply">
            Go to Application
          </Link>
        </div>
      </section>
    </div>
  );
}
