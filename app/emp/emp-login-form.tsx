"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldAlert, CheckCircle2, UserCheck } from "lucide-react";
import { EmpThemeToggle } from "./emp-theme-toggle";
import { Logo } from "@/components/ui/logo";

export default function EmpLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        setError(data.error || "Authentication failed. Please check credentials.");
        setLoading(false);
        return;
      }

      // Success -> Redirect to target portal route
      router.push(data.redirectUrl || "/emp/dashboard");
      router.refresh();
    } catch (err: any) {
      setError("Network error or server unreachable.");
      setLoading(false);
    }
  };

  return (
    <div className="emp-auth-wrap">
      <div className="emp-auth-card">
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
          <EmpThemeToggle />
        </div>

        <div className="emp-auth-header">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <Logo href="/emp" size="medium" />
          </div>
          <h1 className="emp-auth-title">Employee Management Portal</h1>
          <p className="emp-auth-sub">
            Sign in to access your employee dashboard, mark attendance, and manage daily updates.
          </p>
        </div>

        {error && (
          <div className="emp-alert emp-alert-error">
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="emp-form-group">
            <label className="emp-label" htmlFor="emp-email">
              Employee Email / Username
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="emp-email"
                type="text"
                className="emp-input"
                placeholder="e.g. employee1@ciel.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="emp-form-group">
            <label className="emp-label" htmlFor="emp-password">
              Password
            </label>
            <input
              id="emp-password"
              type="password"
              className="emp-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="emp-btn emp-btn-primary"
            style={{ marginTop: "12px" }}
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In to Portal"}
          </button>
        </form>

        {/* Demo Authorized Accounts Reference */}
        <div className="emp-credentials-box">
          <div className="emp-credentials-title">Authorized Accounts Reference:</div>
          <div className="emp-credentials-list">
            <div className="emp-cred-item">
              <div><strong className="emp-cred-role">Employee 1:</strong> employee1@ciel.edu.in</div>
              <div style={{ opacity: 0.8 }}>Pass: Emp1@Ciel2026</div>
            </div>
            <div className="emp-cred-item">
              <div><strong className="emp-cred-role">Employee 2:</strong> employee2@ciel.edu.in</div>
              <div style={{ opacity: 0.8 }}>Pass: Emp2@Ciel2026</div>
            </div>
            <div className="emp-cred-item">
              <div><strong className="emp-cred-role">Employee 3:</strong> employee3@ciel.edu.in</div>
              <div style={{ opacity: 0.8 }}>Pass: Emp3@Ciel2026</div>
            </div>
            <div className="emp-cred-item">
              <div><strong className="emp-cred-role">Emp Admin:</strong> empadmin@ciel.edu.in</div>
              <div style={{ opacity: 0.8 }}>Pass: EmpAdmin@Ciel2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
