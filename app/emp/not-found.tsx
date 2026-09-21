import Link from "next/link";
import { ArrowLeft, ShieldAlert, LayoutDashboard, LogIn, Home } from "lucide-react";

export default function EmpNotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
        background: "var(--emp-bg, #070d1a)",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          background: "var(--emp-surface, #0f1829)",
          border: "1px solid var(--emp-border, rgba(255, 255, 255, 0.08))",
          borderRadius: 20,
          padding: "48px 36px",
          textAlign: "center",
          boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.6)",
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 16,
            background: "rgba(245, 158, 11, 0.12)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f59e0b",
            marginBottom: 20,
          }}
        >
          <ShieldAlert size={28} />
        </div>

        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "#f59e0b",
            marginBottom: 8,
          }}
        >
          Employee Portal · 404
        </div>

        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "var(--emp-text, #f1f5f9)",
            margin: "0 0 12px 0",
            lineHeight: 1.25,
          }}
        >
          Portal Resource Not Found
        </h1>

        <p
          style={{
            fontSize: 14,
            color: "var(--emp-text-muted, #8899b4)",
            lineHeight: 1.6,
            margin: "0 0 32px 0",
          }}
        >
          The workforce module, task record, or attendance screen you attempted to reach does not exist or requires higher authorization.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Link
            href="/emp/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 20px",
              borderRadius: 10,
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "#000",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
              transition: "transform 0.2s ease",
            }}
          >
            <LayoutDashboard size={17} /> Go to Staff Dashboard
          </Link>

          <Link
            href="/emp/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 20px",
              borderRadius: 10,
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid var(--emp-border, rgba(255, 255, 255, 0.1))",
              color: "var(--emp-text, #f1f5f9)",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            <LogIn size={17} /> Employee Sign In
          </Link>

          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "10px 16px",
              color: "var(--emp-text-faint, #64748b)",
              fontSize: 13,
              textDecoration: "none",
              marginTop: 4,
            }}
          >
            <Home size={15} /> Return to Main CIEL Site
          </Link>
        </div>
      </div>
    </div>
  );
}
