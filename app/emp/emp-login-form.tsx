"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  ShieldAlert,
  Eye,
  EyeOff,
  MapPin,
  ListChecks,
  BarChart3,
  ArrowRight,
  Loader2,
  UserCheck,
} from "lucide-react";
import { EmpThemeToggle } from "./emp-theme-toggle";
import { Logo } from "@/components/ui/logo";

const QUICK_ACCOUNTS = [
  {
    label: "Employee 1",
    name: "Aarav Mehta",
    email: "employee1@ciel.edu.in",
    password: "Emp1@Ciel2026",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.12)",
    border: "rgba(99,102,241,0.3)",
    initials: "AM",
  },
  {
    label: "Employee 2",
    name: "Neha Sharma",
    email: "employee2@ciel.edu.in",
    password: "Emp2@Ciel2026",
    color: "#ec4899",
    bg: "rgba(236,72,153,0.12)",
    border: "rgba(236,72,153,0.3)",
    initials: "NS",
  },
  {
    label: "Employee 3",
    name: "Rishi Patel",
    email: "employee3@ciel.edu.in",
    password: "Emp3@Ciel2026",
    color: "#14b8a6",
    bg: "rgba(20,184,166,0.12)",
    border: "rgba(20,184,166,0.3)",
    initials: "RP",
  },
  {
    label: "Admin",
    name: "Executive Office",
    email: "empadmin@ciel.edu.in",
    password: "EmpAdmin@Ciel2026",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.3)",
    initials: "EO",
  },
];

const FEATURES = [
  {
    icon: <MapPin size={18} />,
    title: "Smart Geo-Attendance",
    desc: "GPS-verified check-in within Chetana Campus zone",
    color: "#6366f1",
  },
  {
    icon: <ListChecks size={18} />,
    title: "Daily Task Tracker",
    desc: "Assign, prioritize, and track completion in real-time",
    color: "#14b8a6",
  },
  {
    icon: <BarChart3 size={18} />,
    title: "Performance Reports",
    desc: "Consolidated work summaries visible to management",
    color: "#f59e0b",
  },
];

export default function EmpLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);

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
      router.push(data.redirectUrl || "/emp/dashboard");
      router.refresh();
    } catch {
      setError("Network error or server unreachable.");
      setLoading(false);
    }
  };

  const selectAccount = (idx: number) => {
    const acc = QUICK_ACCOUNTS[idx];
    setEmail(acc.email);
    setPassword(acc.password);
    setSelectedAccount(idx);
    setError(null);
  };

  return (
    <div className="emp-login-page">
      {/* Ambient backgrounds */}
      <div className="emp-login-blob emp-login-blob-1" />
      <div className="emp-login-blob emp-login-blob-2" />
      <div className="emp-login-blob emp-login-blob-3" />

      <div className="emp-login-shell">
        {/* LEFT: Brand panel */}
        <div className="emp-login-left">
          <div className="emp-login-left-inner">
            <div className="emp-login-brand">
              <Logo href="/emp" size="medium" />
              <div className="emp-login-brand-tag">Employee Portal</div>
            </div>

            <div className="emp-login-hero">
              <h1 className="emp-login-hero-title">
                Workforce Intelligence <span>at Your Fingertips</span>
              </h1>
              <p className="emp-login-hero-sub">
                Attendance management, task tracking, and daily reporting — unified in one powerful portal for the CIEL team.
              </p>
            </div>

            <div className="emp-login-features">
              {FEATURES.map((f, i) => (
                <div key={i} className="emp-login-feature-card">
                  <div className="emp-login-feature-icon" style={{ color: f.color, background: `${f.color}1a` }}>
                    {f.icon}
                  </div>
                  <div>
                    <div className="emp-login-feature-title">{f.title}</div>
                    <div className="emp-login-feature-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="emp-login-footer-note">
              © 2026 CIEL — Chetana Institute of Management &amp; Research
            </div>
          </div>
        </div>

        {/* RIGHT: Login card */}
        <div className="emp-login-right">
          <div className="emp-login-card">
            <div className="emp-login-card-topbar">
              <div className="emp-login-card-logo-area">
                <div className="emp-login-lock-icon">
                  <UserCheck size={22} />
                </div>
                <div>
                  <div className="emp-login-card-title">Sign In</div>
                  <div className="emp-login-card-sub">Secure employee access</div>
                </div>
              </div>
              <EmpThemeToggle />
            </div>

            {/* Quick account selector */}
            <div className="emp-login-accounts">
              <div className="emp-login-accounts-label">Quick Access</div>
              <div className="emp-login-accounts-grid">
                {QUICK_ACCOUNTS.map((acc, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`emp-login-account-pill ${selectedAccount === i ? "emp-login-account-pill-active" : ""}`}
                    style={
                      selectedAccount === i
                        ? { borderColor: acc.border, background: acc.bg, color: acc.color }
                        : {}
                    }
                    onClick={() => selectAccount(i)}
                  >
                    <span
                      className="emp-login-account-avatar"
                      style={
                        selectedAccount === i
                          ? { background: acc.color, color: "#fff" }
                          : {}
                      }
                    >
                      {acc.initials}
                    </span>
                    <span className="emp-login-account-name">{acc.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="emp-login-divider"><span>or enter manually</span></div>

            {error && (
              <div className="emp-login-error">
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
                  placeholder="employee@ciel.edu.in"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setSelectedAccount(null); }}
                  required
                  disabled={loading}
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
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="emp-login-eye"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="emp-login-submit"
                disabled={loading}
              >
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
          </div>
        </div>
      </div>
    </div>
  );
}
