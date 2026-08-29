"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  ShieldAlert,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { EmpThemeToggle } from "./emp-theme-toggle";
import { Logo } from "@/components/ui/logo";

export default function EmpLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/emp/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Authentication failed. Please check your credentials.");
        setLoading(false);
        return;
      }
      router.push(data.redirectUrl || "/emp/dashboard");
      router.refresh();
    } catch {
      setError("Network error or server unreachable.");
      setLoading(false);
    }
  };

  return (
    <div className="emp-login-page">
      {/* Ambient background glow */}
      <div className="emp-login-blob emp-login-blob-1" />
      <div className="emp-login-blob emp-login-blob-2" />
      <div className="emp-login-blob emp-login-blob-3" />

      {/* Top right theme toggle */}
      <div style={{ position: "fixed", top: "20px", right: "24px", zIndex: 100 }}>
        <EmpThemeToggle />
      </div>

      {/* Centered Clean Login Card */}
      <div className="emp-login-card-centered">
        {/* Brand Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "24px",
            gap: "10px",
          }}
        >
          <Logo href="/emp" size="small" />
          <span
            className="emp-topbar-badge"
            style={{ fontSize: "11px", padding: "3px 12px", letterSpacing: "0.8px" }}
          >
            Employee Portal
          </span>
        </div>

        <div style={{ textAlign: "center", marginBottom: "26px" }}>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "var(--emp-text)",
              margin: "0 0 6px",
              letterSpacing: "-0.4px",
            }}
          >
            Sign In
          </h1>
          <p style={{ fontSize: "13.5px", color: "var(--emp-text-muted)", margin: 0 }}>
            Enter your official CIEL credentials to access your dashboard
          </p>
        </div>

        {error && (
          <div className="emp-login-error" style={{ marginBottom: "20px" }}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="emp-login-form">
          <div className="emp-login-field">
            <label htmlFor="emp-email" className="emp-login-label">
              <Mail size={14} /> Email Address
            </label>
            <input
              id="emp-email"
              type="text"
              className="emp-login-input"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="emp-login-field">
            <label htmlFor="emp-password" className="emp-login-label">
              <Lock size={14} /> Password
            </label>
            <div className="emp-login-password-wrap">
              <input
                id="emp-password"
                type={showPassword ? "text" : "password"}
                className="emp-login-input emp-login-input-pass"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="emp-login-eye"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="emp-login-submit" disabled={loading} style={{ marginTop: "6px" }}>
            {loading ? (
              <>
                <Loader2 size={18} className="emp-login-spinner" />
                Authenticating…
              </>
            ) : (
              <>
                Access Portal
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: "24px",
            paddingTop: "16px",
            borderTop: "1px solid var(--emp-border)",
            textAlign: "center",
            fontSize: "12px",
            color: "var(--emp-text-faint)",
          }}
        >
          Authorized CIEL workforce portal • Internal use only
        </div>
      </div>
    </div>
  );
}
