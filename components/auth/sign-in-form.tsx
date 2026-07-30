"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
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
          : "The email or password is incorrect.",
      );
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  return (
    <form className="form-stack" onSubmit={handleSubmit} noValidate>
      {formError ? (
        <div className="alert alert-error" role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          <span>{formError}</span>
        </div>
      ) : null}

      <div className="field">
        <label className="field-label" htmlFor="email">
          Gmail address
        </label>
        <div className="input-wrap">
          <Mail className="input-icon" size={18} aria-hidden="true" />
          <input
            className="input input-with-icon"
            id="email"
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
            aria-invalid={Boolean(errors.email)}
          />
        </div>
        {errors.email ? (
          <p className="field-error">
            <AlertCircle size={14} aria-hidden="true" />
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="password">
          Password
        </label>
        <div className="input-wrap">
          <LockKeyhole className="input-icon" size={18} aria-hidden="true" />
          <input
            className="input input-with-icon input-with-action"
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrors((current) => ({ ...current, password: undefined }));
              setFormError("");
            }}
            aria-invalid={Boolean(errors.password)}
          />
          <button
            className="input-action"
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password ? (
          <p className="field-error">
            <AlertCircle size={14} aria-hidden="true" />
            {errors.password}
          </p>
        ) : null}
      </div>

      <button className="button button-primary button-wide" type="submit" disabled={submitting}>
        {submitting ? (
          <>
            <LoaderCircle className="spinner" size={18} aria-hidden="true" />
            Signing in…
          </>
        ) : (
          "Sign in and continue"
        )}
      </button>

      <div className="form-divider">New to this event?</div>
      <Link className="button button-secondary button-wide" href="/auth/sign-up">
        Create your registration account
      </Link>
    </form>
  );
}
