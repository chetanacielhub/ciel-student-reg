import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "User Sign In | CIEL Portal",
  description: "Sign in to your CIEL innovator portal, venture dashboard, and team management.",
};

export default function LoginPage() {
  return (
    <div className="compact-auth-page">
      <div className="compact-auth-card">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, margin: "0 0 6px", color: "var(--text-white)", fontFamily: "var(--font-serif-family)" }}>
            Sign In to User Portal
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--text-secondary)", margin: 0 }}>
            Access your startup dashboard, project milestones, and mentorship sessions.
          </p>
        </div>

        <form action="/auth/sign-in" method="POST" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="field">
            <label className="field-label" htmlFor="portal-email">
              Email Address
            </label>
            <div className="input-wrap">
              <Mail className="input-icon" size={17} aria-hidden="true" />
              <input
                className="input input-with-icon"
                id="portal-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder=""
                required
              />
            </div>
          </div>

          <div className="field">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label className="field-label" htmlFor="portal-password" style={{ marginBottom: 0 }}>
                Password
              </label>
              <Link href="/forgot-password" style={{ fontSize: 12.5, color: "var(--ciel-gold-bright)" }}>
                Forgot Password?
              </Link>
            </div>
            <div className="input-wrap">
              <LockKeyhole className="input-icon" size={17} aria-hidden="true" />
              <input
                className="input input-with-icon"
                id="portal-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder=""
                required
              />
            </div>
          </div>

          <button className="button button-primary button-wide" type="submit" style={{ marginTop: 8 }}>
            Sign In to Dashboard
            <ArrowRight size={17} />
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--line)", textAlign: "center", fontSize: 13, color: "var(--text-secondary)" }}>
          Don&apos;t have an account yet?{" "}
          <Link href="/auth/sign-up" style={{ color: "var(--ciel-gold-bright)", fontWeight: 600 }}>
            Create Innovator Account
          </Link>
        </div>
      </div>
    </div>
  );
}
