"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Mail, Send, LoaderCircle, AlertCircle } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { createClient } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/site-url";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${getSiteUrl()}/auth/confirm`,
      });

      if (resetError) {
        // Don't reveal whether the email exists — show generic success
        // (Supabase may still return "Email not found" but we mask it for security)
      }

      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="shell page-section" style={{ minHeight: "75vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="luxury-card" style={{ maxWidth: 440, width: "100%", padding: "40px 36px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-block", marginBottom: 16 }}>
            <Logo />
          </div>
          <h1 style={{ fontSize: 24, margin: "12px 0 6px", color: "var(--text-white)" }}>
            Reset Your Password
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--text-secondary)", margin: 0 }}>
            Enter your registered email address to receive a secure recovery link.
          </p>
        </div>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <CheckCircle size={48} style={{ color: "var(--ciel-gold-bright)" }} />
            </div>
            <h2 style={{ fontSize: 18, margin: "0 0 10px", color: "var(--text-white)" }}>Check Your Email</h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              If an account exists for <strong style={{ color: "var(--text-white)" }}>{email}</strong>, you will receive a password reset link shortly.
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 12 }}>
              Check your spam folder if you don&apos;t see it within a few minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {error ? (
              <div className="alert alert-error" role="alert" style={{ padding: "8px 12px", fontSize: 13 }}>
                <AlertCircle size={16} aria-hidden="true" />
                <span>{error}</span>
              </div>
            ) : null}

            <div className="field">
              <label className="field-label" htmlFor="reset-email">
                Registered Email Address
              </label>
              <div className="input-wrap">
                <Mail className="input-icon" size={17} aria-hidden="true" />
                <input
                  className="input input-with-icon"
                  id="reset-email"
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  required
                />
              </div>
            </div>

            <button
              className="button button-primary button-wide"
              type="submit"
              disabled={submitting}
              style={{ marginTop: 8 }}
            >
              {submitting ? (
                <>
                  <LoaderCircle className="spinner" size={16} aria-hidden="true" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} /> Send Reset Link
                </>
              )}
            </button>
          </form>
        )}

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--line)", textAlign: "center" }}>
          <Link className="button button-ghost button-small" href="/auth/sign-in">
            <ArrowLeft size={15} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
