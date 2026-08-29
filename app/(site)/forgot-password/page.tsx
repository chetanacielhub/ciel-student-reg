"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function ForgotPasswordPage() {
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

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Password reset instructions have been sent to your email.");
          }}
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
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
                required
              />
            </div>
          </div>

          <button className="button button-primary button-wide" type="submit" style={{ marginTop: 8 }}>
            <Send size={16} /> Send Reset Link
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--line)", textAlign: "center" }}>
          <Link className="button button-ghost button-small" href="/login">
            <ArrowLeft size={15} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
