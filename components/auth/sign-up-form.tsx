"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
  ArrowRight,
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

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const json = await res.json();

      if (!res.ok) {
        setSubmitting(false);
        setFormError(json.error || "Registration failed. Please try again.");
        return;
      }

      if (json.redirect) {
        router.replace(json.redirect);
        router.refresh();
        return;
      }
    } catch {
      // Client-side fallback if API fetch fails
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
        router.replace("/apply");
        router.refresh();
        return;
      }

      const { data: signInData } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (signInData?.session) {
        router.replace("/apply");
        router.refresh();
        return;
      }

      router.replace(`/auth/check-email?email=${encodeURIComponent(parsed.data.email)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {formError ? (
        <div className="alert alert-error" role="alert" style={{ padding: "8px 12px", fontSize: 13 }}>
          <AlertCircle size={16} aria-hidden="true" />
          <span>{formError}</span>
        </div>
      ) : null}

      {/* Row 1: Full Name & Phone */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: 4 }}>
            Full Name
          </label>
          <div className="input-wrap">
            <UserRound className="input-icon" size={16} aria-hidden="true" />
            <input
              className="input input-with-icon"
              style={{ padding: "10px 12px 10px 38px", fontSize: 13.5 }}
              name="fullName"
              type="text"
              placeholder=""
              value={values.fullName}
              onChange={(e) => updateValue("fullName", e.target.value)}
            />
          </div>
          {errors.fullName ? <p className="field-error" style={{ fontSize: 11, marginTop: 3 }}>{errors.fullName}</p> : null}
        </div>

        <div>
          <label style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: 4 }}>
            Phone (+91)
          </label>
          <div className="input-wrap">
            <Phone className="input-icon" size={16} aria-hidden="true" />
            <input
              className="input input-with-icon"
              style={{ padding: "10px 12px 10px 38px", fontSize: 13.5 }}
              name="phone"
              type="tel"
              placeholder=""
              value={values.phone}
              onChange={(e) => updateValue("phone", e.target.value.replace(/\s/g, ""))}
            />
          </div>
          {errors.phone ? <p className="field-error" style={{ fontSize: 11, marginTop: 3 }}>{errors.phone}</p> : null}
        </div>
      </div>

      {/* Row 2: Email */}
      <div>
        <label style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: 4 }}>
          Email Address
        </label>
        <div className="input-wrap">
          <Mail className="input-icon" size={16} aria-hidden="true" />
          <input
            className="input input-with-icon"
            style={{ padding: "10px 12px 10px 38px", fontSize: 13.5 }}
            name="email"
            type="email"
            placeholder=""
            value={values.email}
            onChange={(e) => updateValue("email", e.target.value)}
          />
        </div>
        {errors.email ? <p className="field-error" style={{ fontSize: 11, marginTop: 3 }}>{errors.email}</p> : null}
      </div>

      {/* Row 3: Password & Confirm */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: 4 }}>
            Password
          </label>
          <div className="input-wrap">
            <LockKeyhole className="input-icon" size={16} aria-hidden="true" />
            <input
              className="input input-with-icon input-with-action"
              style={{ padding: "10px 12px 10px 38px", fontSize: 13.5 }}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder=""
              value={values.password}
              onChange={(e) => updateValue("password", e.target.value)}
            />
            <button
              className="input-action"
              type="button"
              onClick={() => setShowPassword((c) => !c)}
              style={{ right: 8 }}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password ? <p className="field-error" style={{ fontSize: 11, marginTop: 3 }}>{errors.password}</p> : null}
        </div>

        <div>
          <label style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: 4 }}>
            Confirm Password
          </label>
          <div className="input-wrap">
            <LockKeyhole className="input-icon" size={16} aria-hidden="true" />
            <input
              className="input input-with-icon"
              style={{ padding: "10px 12px 10px 38px", fontSize: 13.5 }}
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder=""
              value={values.confirmPassword}
              onChange={(e) => updateValue("confirmPassword", e.target.value)}
            />
          </div>
          {errors.confirmPassword ? <p className="field-error" style={{ fontSize: 11, marginTop: 3 }}>{errors.confirmPassword}</p> : null}
        </div>
      </div>

      <button
        className="button button-primary button-wide"
        type="submit"
        disabled={submitting}
        style={{ marginTop: 8, padding: 12, fontSize: 14 }}
      >
        {submitting ? (
          <>
            <LoaderCircle className="spinner" size={16} />
            Creating Account...
          </>
        ) : (
          <>
            Create Account &amp; Proceed
            <ArrowRight size={16} />
          </>
        )}
      </button>

      <div style={{ textAlign: "center", marginTop: 8, fontSize: 13, color: "var(--text-muted)" }}>
        Already have an account?{" "}
        <Link href="/auth/sign-in" style={{ color: "var(--ciel-gold-bright)", fontWeight: 600, textDecoration: "underline" }}>
          Sign In
        </Link>
      </div>
    </form>
  );
}
