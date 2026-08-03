"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signInSchema } from "@/lib/validation";

export function SignInForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setFormError("");

    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      const nextErrors: { email?: string; password?: string } = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field === "email" || field === "password") {
          nextErrors[field] ??= issue.message;
        }
      });
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);

    if (error) {
      setSubmitting(false);
      setFormError(
        error.message.toLowerCase().includes("email not confirmed")
          ? "Confirm your email address before signing in."
          : "The email address or password is incorrect.",
      );
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {formError ? (
        <div className="alert alert-error" role="alert" style={{ padding: "8px 12px", fontSize: 13 }}>
          <AlertCircle size={16} aria-hidden="true" />
          <span>{formError}</span>
        </div>
      ) : null}

      <div>
        <label style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: 6 }}>
          Email Address
        </label>
        <div className="input-wrap">
          <Mail className="input-icon" size={17} aria-hidden="true" />
          <input
            className="input input-with-icon"
            style={{ padding: "11px 14px 11px 40px", fontSize: 14 }}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@gmail.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors((current) => ({ ...current, email: undefined }));
              setFormError("");
            }}
          />
        </div>
        {errors.email ? <p className="field-error" style={{ fontSize: 11.5, marginTop: 4 }}>{errors.email}</p> : null}
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <label style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>
            Password
          </label>
          <Link href="/forgot-password" style={{ fontSize: 12, color: "var(--ciel-gold-bright)", textDecoration: "none" }}>
            Forgot Password?
          </Link>
        </div>
        <div className="input-wrap">
          <LockKeyhole className="input-icon" size={17} aria-hidden="true" />
          <input
            className="input input-with-icon input-with-action"
            style={{ padding: "11px 14px 11px 40px", fontSize: 14 }}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrors((current) => ({ ...current, password: undefined }));
              setFormError("");
            }}
          />
          <button
            className="input-action"
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            style={{ right: 10 }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password ? <p className="field-error" style={{ fontSize: 11.5, marginTop: 4 }}>{errors.password}</p> : null}
      </div>

      <button className="button button-primary button-wide" type="submit" disabled={submitting} style={{ marginTop: 6, padding: 12, fontSize: 14 }}>
        {submitting ? (
          <>
            <LoaderCircle className="spinner" size={17} aria-hidden="true" />
            Signing In...
          </>
        ) : (
          <>
            Sign In to Dashboard
            <ArrowRight size={17} />
          </>
        )}
      </button>

      <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--line)", textAlign: "center", fontSize: 13, color: "var(--text-secondary)" }}>
        Don&apos;t have an account yet?{" "}
        <Link href="/auth/sign-up" style={{ color: "var(--ciel-gold-bright)", fontWeight: 600, textDecoration: "underline" }}>
          Create Innovator Account
        </Link>
      </div>
    </form>
  );
}
