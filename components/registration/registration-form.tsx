"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  Compass,
  FileCheck2,
  GraduationCap,
  HelpCircle,
  Info,
  Layers,
  Lightbulb,
  LoaderCircle,
  LockKeyhole,
  Rocket,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserRound,
  UsersRound,
  Zap,
} from "lucide-react";
import { registerForEvent } from "@/app/(site)/register/actions";
import { FadeIn, ScaleIn } from "@/components/ui/motion";
import type {
  ClassOption,
  Institution,
  RegistrationRole,
  UserCategory,
} from "@/lib/types";

type FieldName =
  | "institutionId"
  | "classId"
  | "rollNumber"
  | "role"
  | "teamName"
  | "problemStatement"
  | "userCategory"
  | "form";

type Errors = Partial<Record<FieldName, string>>;

const DEFAULT_INSTITUTIONS: Institution[] = [
  { id: "inst-1", code: "CIT", name: "Chetana Institute of Technology" },
  { id: "inst-2", code: "CSM", name: "Chetana School of Management" },
  { id: "inst-3", code: "EXT", name: "External / Partner Institution" },
];

const DEFAULT_CLASSES: ClassOption[] = [
  { id: "class-1", institution_id: "inst-1", name: "Computer Science & Engineering", sort_order: 1 },
  { id: "class-2", institution_id: "inst-1", name: "Electronics & IoT Engineering", sort_order: 2 },
  { id: "class-3", institution_id: "inst-2", name: "MBA Technology Management", sort_order: 1 },
  { id: "class-4", institution_id: "inst-3", name: "General / Independent Founder", sort_order: 1 },
];

const CATEGORY_OPTIONS: Array<{
  value: UserCategory;
  label: string;
  desc: string;
  icon: typeof GraduationCap;
}> = [
  { value: "student", label: "Student Innovator", desc: "Undergraduate / Postgraduate student founder", icon: GraduationCap },
  { value: "entrepreneur", label: "Early-Stage Founder", desc: "Individual founder with startup idea", icon: Lightbulb },
  { value: "startup", label: "Registered Startup", desc: "Incorporated startup seeking acceleration", icon: Rocket },
  { value: "msme", label: "MSME Enterprise", desc: "Small / medium business seeking innovation partner", icon: Building2 },
  { value: "industry_partner", label: "Industry Executive", desc: "Corporate / industry partner representative", icon: Briefcase },
  { value: "investor", label: "Angel / VC Investor", desc: "Investor seeking deal flow & syndicate access", icon: Zap },
  { value: "mentor", label: "Subject Advisor / Mentor", desc: "Domain expert guiding incubated ventures", icon: UserCheck },
  { value: "social_innovator", label: "Social Innovator / NGO", desc: "Rural impact & non-profit innovator", icon: Sparkles },
];

const ROLE_OPTIONS: Array<{
  value: RegistrationRole;
  title: string;
  description: string;
  icon: typeof UsersRound;
}> = [
  {
    value: "team_leader",
    title: "Team leader",
    description: "Create the official team and problem statement. Your members join after you submit.",
    icon: UsersRound,
  },
  {
    value: "team_member",
    title: "Team member",
    description: "Join an existing team using exactly the same name entered by your leader.",
    icon: UserRound,
  },
  {
    value: "solo",
    title: "Solo participant",
    description: "Register your own project and continue as a one-person team for this event.",
    icon: Zap,
  },
];

export function RegistrationHelp() {
  return (
    <aside className="luxury-card" style={{ padding: 32, position: "sticky", top: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <ShieldCheck size={22} className="text-gold" />
        <h3 style={{ fontSize: 18, color: "var(--text-white)", margin: 0, fontFamily: "var(--font-serif-family)" }}>
          Incubation Support
        </h3>
      </div>

      <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
        Submitting your venture application grants your project immediate access to CIEL institutional review.
      </p>

      <ul style={{ display: "flex", flexDirection: "column", gap: 14, padding: 0, margin: 0, listStyle: "none", fontSize: 13.5, color: "var(--text-secondary)" }}>
        <li style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <CheckCircle2 size={17} style={{ color: "var(--ciel-gold)", flexShrink: 0, marginTop: 2 }} />
          <span><strong>Constant Seminars:</strong> Upscaling business &amp; starting ideas from scratch.</span>
        </li>
        <li style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <CheckCircle2 size={17} style={{ color: "var(--ciel-gold)", flexShrink: 0, marginTop: 2 }} />
          <span><strong>Tech Lab &amp; Conference Room:</strong> Dedicated computing workspace &amp; projector pitch room.</span>
        </li>
        <li style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <CheckCircle2 size={17} style={{ color: "var(--ciel-gold)", flexShrink: 0, marginTop: 2 }} />
          <span><strong>Wide Mentor Network:</strong> 1-on-1 industry guidance &amp; founder advisory.</span>
        </li>
      </ul>

      <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--line)", fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 8 }}>
        <LockKeyhole size={14} className="text-gold" />
        <span>SSL Encrypted &amp; Institutional Governance Protected</span>
      </div>
    </aside>
  );
}

export function RegistrationForm({
  eventSlug,
  eventTitle,
  institutions: propInstitutions,
  classes: propClasses,
}: {
  eventSlug: string;
  eventTitle: string;
  institutions: Institution[];
  classes: ClassOption[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const institutionsList = propInstitutions.length > 0 ? propInstitutions : DEFAULT_INSTITUTIONS;
  const classesList = propClasses.length > 0 ? propClasses : DEFAULT_CLASSES;

  const [values, setValues] = useState({
    userCategory: "student" as UserCategory,
    institutionId: institutionsList[0]?.id || "",
    classId: "",
    rollNumber: "",
    role: "team_leader" as RegistrationRole,
    teamName: "",
    problemStatement: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const availableClasses = useMemo(
    () => classesList.filter((item) => item.institution_id === values.institutionId),
    [classesList, values.institutionId]
  );

  function validateStep(targetStep: number): boolean {
    const nextErrors: Errors = {};

    if (targetStep >= 1) {
      if (!values.userCategory) nextErrors.userCategory = "Select a participant category.";
      if (!values.role) nextErrors.role = "Select your participation role.";
    }

    if (targetStep >= 2) {
      if (!values.institutionId) nextErrors.institutionId = "Select your institution / campus.";
      if (!values.classId) nextErrors.classId = "Select your department or class.";
      if (!values.rollNumber.trim()) {
        nextErrors.rollNumber = "Enter your roll number or official ID.";
      }
    }

    if (targetStep >= 3) {
      if (!values.teamName.trim()) {
        nextErrors.teamName =
          values.role === "team_member"
            ? "Enter the exact team name registered by your leader."
            : "Enter your team or project name.";
      }

      if (
        (values.role === "team_leader" || values.role === "solo") &&
        !values.problemStatement.trim()
      ) {
        nextErrors.problemStatement =
          "Describe your problem statement or venture idea (minimum 15 characters).";
      } else if (
        (values.role === "team_leader" || values.role === "solo") &&
        values.problemStatement.trim().length < 15
      ) {
        nextErrors.problemStatement =
          "Problem statement is too short. Provide a clear description (at least 15 characters).";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleNext() {
    if (validateStep(step)) {
      setStep((current) => Math.min(current + 1, 3));
    }
  }

  function handleBack() {
    setErrors({});
    setStep((current) => Math.max(current - 1, 1));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateStep(3)) return;
    if (!values.role) return;

    setSubmitting(true);
    setErrors({});

    const result = await registerForEvent({
      eventSlug,
      institutionId: values.institutionId,
      classId: values.classId,
      rollNumber: values.rollNumber.trim(),
      role: values.role,
      teamName: values.teamName.trim(),
      problemStatement:
        values.role === "team_member"
          ? undefined
          : values.problemStatement.trim(),
    });

    setSubmitting(false);

    if (!result.ok) {
      setErrors({
        [result.field ?? "form"]: result.message,
      });

      if (result.field === "role" || result.field === "userCategory") setStep(1);
      else if (
        result.field === "institutionId" ||
        result.field === "classId" ||
        result.field === "rollNumber"
      ) {
        setStep(2);
      } else {
        setStep(3);
      }
      return;
    }

    router.push("/dashboard?registered=1");
    router.refresh();
  }

  const progressPercent = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <article className="luxury-card" style={{ padding: 40, border: "1px solid var(--ciel-gold-border)" }}>
      {/* Header Banner */}
      <div style={{ marginBottom: 28, borderBottom: "1px solid var(--line)", paddingBottom: 24 }}>
        <span className="eyebrow" style={{ marginBottom: 6 }}>
          <Sparkles size={14} className="text-gold" />
          Institutional Application Portal
        </span>
        <h1 style={{ fontSize: 32, margin: "6px 0 8px", fontFamily: "var(--font-serif-family)", color: "var(--text-white)" }}>
          CIEL Incubation &amp; Venture Application
        </h1>
        <p style={{ fontSize: 14.5, color: "var(--text-secondary)", margin: 0 }}>
          {eventTitle} · Stage-gated evaluation for seed funding, prototyping labs &amp; patent support.
        </p>
      </div>

      {/* Progress Bar & Steps */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13, color: "var(--text-secondary)" }}>
          <span>Stage {step} of 3</span>
          <span style={{ color: "var(--ciel-gold-bright)", fontWeight: 700 }}>{progressPercent}% Completed</span>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progressPercent}%`, background: "linear-gradient(90deg, #D4AF37 0%, #F5D77F 100%)", transition: "width 0.4s ease" }} />
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {errors.form ? (
          <div className="alert alert-error" style={{ marginBottom: 24 }}>
            <AlertCircle size={18} aria-hidden="true" />
            <span>{errors.form}</span>
          </div>
        ) : null}

        {/* STEP 1: CATEGORY & ROLE */}
        {step === 1 && (
          <ScaleIn key="step-1">
            <div>
              <h2 style={{ fontSize: 22, color: "var(--text-white)", marginBottom: 4, fontFamily: "var(--font-serif-family)" }}>
                Step 1: Institutional Profile &amp; Role
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
                Select your participant category and specify your venture role.
              </p>

              {/* Category Grid */}
              <div className="form-group" style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 13, color: "var(--ciel-gold-bright)", fontWeight: 600, display: "block", marginBottom: 12 }}>
                  1. Participant Category
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                  {CATEGORY_OPTIONS.map((cat) => {
                    const IconComp = cat.icon;
                    const isSelected = values.userCategory === cat.value;
                    return (
                      <div
                        key={cat.value}
                        onClick={() => setValues((v) => ({ ...v, userCategory: cat.value }))}
                        style={{
                          padding: 16,
                          cursor: "pointer",
                          background: isSelected ? "rgba(212, 175, 55, 0.16)" : "rgba(255,255,255,0.03)",
                          border: isSelected ? "1.5px solid var(--ciel-gold)" : "1px solid var(--line)",
                          borderRadius: 10,
                          display: "flex",
                          gap: 12,
                          alignItems: "center",
                          transition: "all 0.2s ease",
                          boxShadow: isSelected ? "0 4px 20px rgba(212, 175, 55, 0.15)" : "none",
                        }}
                      >
                        <div style={{ color: isSelected ? "var(--ciel-gold-bright)" : "var(--text-muted)", flexShrink: 0 }}>
                          <IconComp size={22} />
                        </div>
                        <div>
                          <strong style={{ fontSize: 14, color: "var(--text-white)", display: "block" }}>{cat.label}</strong>
                          <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{cat.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Role Grid */}
              <div className="form-group" style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 13, color: "var(--ciel-gold-bright)", fontWeight: 600, display: "block", marginBottom: 12 }}>
                  2. Participation Role
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                  {ROLE_OPTIONS.map((opt) => {
                    const IconComp = opt.icon;
                    const isSelected = values.role === opt.value;
                    return (
                      <div
                        key={opt.value}
                        onClick={() => {
                          setValues((v) => ({ ...v, role: opt.value }));
                          setErrors((e) => ({ ...e, role: undefined }));
                        }}
                        style={{
                          padding: 16,
                          cursor: "pointer",
                          background: isSelected ? "rgba(212, 175, 55, 0.16)" : "rgba(255,255,255,0.03)",
                          border: isSelected ? "1.5px solid var(--ciel-gold)" : "1px solid var(--line)",
                          borderRadius: 10,
                          display: "flex",
                          gap: 12,
                          alignItems: "flex-start",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div style={{ color: isSelected ? "var(--ciel-gold-bright)" : "var(--text-muted)", marginTop: 2, flexShrink: 0 }}>
                          <IconComp size={22} />
                        </div>
                        <div>
                          <strong style={{ fontSize: 14, color: "var(--text-white)", display: "block" }}>{opt.title}</strong>
                          <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4, display: "block" }}>{opt.description}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.role ? <p className="field-error" style={{ marginTop: 8 }}>{errors.role}</p> : null}
              </div>

              <div style={{ marginTop: 36, display: "flex", justifyContent: "flex-end" }}>
                <button className="ref-btn-primary" type="button" onClick={handleNext}>
                  Continue to Academic Profile
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </ScaleIn>
        )}

        {/* STEP 2: ACADEMIC PROFILE */}
        {step === 2 && (
          <ScaleIn key="step-2">
            <div>
              <h2 style={{ fontSize: 22, color: "var(--text-white)", marginBottom: 4, fontFamily: "var(--font-serif-family)" }}>
                Step 2: Academic &amp; Institutional Profile
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
                Provide your verified campus or corporate affiliation.
              </p>

              <div className="form-group" style={{ marginBottom: 20 }}>
                <label htmlFor="institutionId" style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>Institution / Campus</label>
                <select
                  id="institutionId"
                  className="select"
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 8 }}
                  value={values.institutionId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setValues((v) => ({ ...v, institutionId: val, classId: "" }));
                    setErrors((err) => ({ ...err, institutionId: undefined }));
                  }}
                >
                  {institutionsList.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} ({inst.code})
                    </option>
                  ))}
                </select>
                {errors.institutionId ? <p className="field-error" style={{ marginTop: 6 }}>{errors.institutionId}</p> : null}
              </div>

              <div className="form-group" style={{ marginBottom: 20 }}>
                <label htmlFor="classId" style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>Department / Program</label>
                <select
                  id="classId"
                  className="select"
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 8 }}
                  value={values.classId}
                  onChange={(e) => {
                    setValues((v) => ({ ...v, classId: e.target.value }));
                    setErrors((err) => ({ ...err, classId: undefined }));
                  }}
                >
                  <option value="">-- Select Department / Program --</option>
                  {(availableClasses.length > 0 ? availableClasses : classesList).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.classId ? <p className="field-error" style={{ marginTop: 6 }}>{errors.classId}</p> : null}
              </div>

              <div className="form-group" style={{ marginBottom: 20 }}>
                <label htmlFor="rollNumber" style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>Roll Number / Official Campus ID</label>
                <input
                  id="rollNumber"
                  type="text"
                  className="input"
                  placeholder=""
                  style={{ padding: "12px 16px", borderRadius: 8 }}
                  value={values.rollNumber}
                  onChange={(e) => {
                    setValues((v) => ({ ...v, rollNumber: e.target.value }));
                    setErrors((err) => ({ ...err, rollNumber: undefined }));
                  }}
                />
                {errors.rollNumber ? <p className="field-error" style={{ marginTop: 6 }}>{errors.rollNumber}</p> : null}
              </div>

              <div style={{ marginTop: 36, display: "flex", justifyContent: "space-between" }}>
                <button className="ref-btn-secondary" type="button" onClick={handleBack}>
                  <ArrowLeft size={17} /> Back
                </button>
                <button className="ref-btn-primary" type="button" onClick={handleNext}>
                  Continue to Venture Details
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </ScaleIn>
        )}

        {/* STEP 3: VENTURE & SUBMISSION */}
        {step === 3 && (
          <ScaleIn key="step-3">
            <div>
              <h2 style={{ fontSize: 22, color: "var(--text-white)", marginBottom: 4, fontFamily: "var(--font-serif-family)" }}>
                Step 3: Venture &amp; Submission
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
                Specify your team name and problem statement for incubation evaluation.
              </p>

              <div className="form-group" style={{ marginBottom: 20 }}>
                <label htmlFor="teamName" style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>
                  {values.role === "team_member" ? "Leader's Registered Team Name" : "Venture / Team Name"}
                </label>
                <input
                  id="teamName"
                  type="text"
                  className="input"
                  placeholder=""
                  style={{ padding: "12px 16px", borderRadius: 8 }}
                  value={values.teamName}
                  onChange={(e) => {
                    setValues((v) => ({ ...v, teamName: e.target.value }));
                    setErrors((err) => ({ ...err, teamName: undefined }));
                  }}
                />
                {errors.teamName ? <p className="field-error" style={{ marginTop: 6 }}>{errors.teamName}</p> : null}
              </div>

              {(values.role === "team_leader" || values.role === "solo") && (
                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label htmlFor="problemStatement" style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>
                    Problem Statement &amp; Venture Summary
                  </label>
                  <textarea
                    id="problemStatement"
                    rows={4}
                    className="input"
                    placeholder=""
                    style={{ resize: "vertical", padding: "12px 16px", borderRadius: 8 }}
                    value={values.problemStatement}
                    onChange={(e) => {
                      setValues((v) => ({ ...v, problemStatement: e.target.value }));
                      setErrors((err) => ({ ...err, problemStatement: undefined }));
                    }}
                  />
                  {errors.problemStatement ? (
                    <p className="field-error" style={{ marginTop: 6 }}>{errors.problemStatement}</p>
                  ) : null}
                </div>
              )}

              <div style={{ marginTop: 36, display: "flex", justifyContent: "space-between" }}>
                <button className="ref-btn-secondary" type="button" onClick={handleBack}>
                  <ArrowLeft size={17} /> Back
                </button>
                <button className="ref-btn-primary" type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <LoaderCircle className="spinner" size={18} />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      Submit Incubation Application
                      <CheckCircle2 size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </ScaleIn>
        )}
      </form>
    </article>
  );
}
