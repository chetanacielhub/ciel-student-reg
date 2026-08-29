import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { Logo } from "@/components/ui/logo";
import { LockKeyhole, ShieldCheck, AlertCircle } from "lucide-react";
import { AdminThemeToggle } from "./admin-theme-toggle";

export const metadata: Metadata = {
  title: "Admin Login | CIEL",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const alreadyIn = await isAdminAuthenticated();
  if (alreadyIn) redirect("/admin/dashboard");

  const hasError = params.error === "invalid";

  return (
    <div className="admin-login-page">
      {/* Pinned Top-Right Theme Toggle */}
      <div style={{ position: "fixed", top: "20px", right: "24px", zIndex: 100000 }}>
        <AdminThemeToggle />
      </div>

      <div className="admin-login-card">
        {/* Centered Logo */}
        <div style={{ marginBottom: "22px", display: "flex", justifyContent: "center" }}>
          <Logo size="small" />
        </div>

        {/* Icon Badge */}
        <div className="admin-login-icon">
          <ShieldCheck size={28} />
        </div>

        {/* Clean, Modern Heading */}
        <h1 className="admin-login-title">Admin Portal</h1>
        <p className="admin-login-sub">
          Enter your administrator credentials to access the CIEL control panel.
        </p>

        {/* Error alert */}
        {hasError && (
          <div className="alert alert-error" style={{ marginBottom: "24px" }}>
            <AlertCircle size={17} />
            <span>Invalid username or password. Please try again.</span>
          </div>
        )}

        {/* Login Form */}
        <form action="/admin/login" method="POST" className="admin-login-form">
          <div className="field">
            <label className="field-label" htmlFor="admin-username">
              Username
            </label>
            <div className="input-wrap">
              <ShieldCheck className="input-icon" size={18} aria-hidden="true" />
              <input
                className="input input-with-icon"
                id="admin-username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder=""
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="admin-password">
              Password
            </label>
            <div className="input-wrap">
              <LockKeyhole className="input-icon" size={18} aria-hidden="true" />
              <input
                className="input input-with-icon"
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder=""
                required
              />
            </div>
          </div>

          <button
            className="button button-primary button-wide"
            type="submit"
            style={{ marginTop: "10px" }}
          >
            <LockKeyhole size={16} />
            Sign in to Admin Panel
          </button>
        </form>

        <p className="admin-login-footer">
          This portal is restricted to authorized CIEL administrators only.
          Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
