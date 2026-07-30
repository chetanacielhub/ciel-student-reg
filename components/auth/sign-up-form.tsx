"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/site-url";
import { signUpSchema } from "@/lib/validation";

type FieldErrors = Partial<
  Record<"fullName" | "email" | "phone" | "password" | "confirmPassword", string>
>;

export function SignUpForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    phone: "+91",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordRules = [
    { label: "8+ characters", valid: values.password.length >= 8 },
    { label: "Uppercase letter", valid: /[A-Z]/.test(values.password) },
    { label: "Lowercase letter", valid: /[a-z]/.test(values.password) },
    { label: "One number", valid: /[0-9]/.test(values.password) },
  ];

  function updateValue(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const parsed = signUpSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FieldErrors | undefined;
        if (field && !nextErrors[field]) nextErrors[field] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          full_name: parsed.data.fullName,
          phone: parsed.data.phone,
        },
        emailRedirectTo: `${getSiteUrl()}/auth/confirm`,
      },
    });

    if (error) {
      setSubmitting(false);
      setFormError(error.message);
      return;
    }

    if (data.session) {
      router.replace("/register");
      router.refresh();
      return;
    }

    router.replace(`/auth/check-email?email=${encodeURIComponent(parsed.data.email)}`);
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
        <label className="field-label" htmlFor="fullName">
          Full name
        </label>
        <div className="input-wrap">
          <UserRound className="input-icon" size={18} aria-hidden="true" />
          <input
            className="input input-with-icon"
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            value={values.fullName}
            onChange={(event) => updateValue("fullName", event.target.value)}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
          />
        </div>
        {errors.fullName ? (
          <p className="field-error" id="fullName-error">
            <AlertCircle size={14} aria-hidden="true" />
            {errors.fullName}
          </p>
        ) : null}
      </div>

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
            inputMode="email"
            autoComplete="email"
            placeholder="you@gmail.com"
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </div>
        {errors.email ? (
          <p className="field-error" id="email-error">
            <AlertCircle size={14} aria-hidden="true" />
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="phone">
          Phone number
        </label>
        <div className="input-wrap">
          <Phone className="input-icon" size={18} aria-hidden="true" />
          <input
            className="input input-with-icon"
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+919876543210"
            value={values.phone}
            onChange={(event) => updateValue("phone", event.target.value.replace(/\s/g, ""))}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : "phone-help"}
          />
        </div>
        {errors.phone ? (
          <p className="field-error" id="phone-error">
            <AlertCircle size={14} aria-hidden="true" />
            {errors.phone}
          </p>
        ) : (
          <p className="field-help" id="phone-help">
            Include the country code, for example +91.
          </p>
        )}
      </div>

      <div className="form-row">
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
              autoComplete="new-password"
              placeholder="Create password"
              value={values.password}
              onChange={(event) => updateValue("password", event.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : "password-rules"}
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
            <p className="field-error" id="password-error">
              <AlertCircle size={14} aria-hidden="true" />
              {errors.password}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="confirmPassword">
            Confirm password
          </label>
          <div className="input-wrap">
            <LockKeyhole className="input-icon" size={18} aria-hidden="true" />
            <input
              className="input input-with-icon"
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repeat password"
              value={values.confirmPassword}
              onChange={(event) => updateValue("confirmPassword", event.target.value)}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
            />
          </div>
          {errors.confirmPassword ? (
            <p className="field-error" id="confirmPassword-error">
              <AlertCircle size={14} aria-hidden="true" />
              {errors.confirmPassword}
            </p>
          ) : null}
        </div>
      </div>

      <div className="password-rules" id="password-rules">
        {passwordRules.map((rule) => (
          <span
            className={`password-rule${rule.valid ? " password-rule-valid" : ""}`}
            key={rule.label}
          >
            <Check size={13} aria-hidden="true" />
            {rule.label}
          </span>
        ))}
      </div>

      <button className="button button-primary button-wide" type="submit" disabled={submitting}>
        {submitting ? (
          <>
            <LoaderCircle className="spinner" size={18} aria-hidden="true" />
            Creating account…
          </>
        ) : (
          "Create account and continue"
        )}
      </button>

      <p className="form-note">
        By creating an account, you agree that the event administrators may use
        your registration details to coordinate this event.
      </p>

      <div className="form-divider">Already registered?</div>
      <Link className="button button-secondary button-wide" href="/auth/sign-in">
        Sign in to your account
      </Link>
    </form>
  );
}
