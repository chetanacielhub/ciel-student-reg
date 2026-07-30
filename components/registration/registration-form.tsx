"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Info,
  Lightbulb,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  UserRound,
  UsersRound,
  Zap,
} from "lucide-react";
import { registerForEvent } from "@/app/register/actions";
import type {
  ClassOption,
  Institution,
  RegistrationInput,
  RegistrationRole,
} from "@/lib/types";

type FieldName =
  | "institutionId"
  | "classId"
  | "rollNumber"
  | "role"
  | "teamName"
  | "problemStatement"
  | "form";

type Errors = Partial<Record<FieldName, string>>;

const roleOptions: Array<{
  value: RegistrationRole;
  title: string;
  description: string;
  icon: typeof UsersRound;
}> = [
  {
    value: "team_leader",
    title: "Team leader",
    description:
      "Create the official team and problem statement. Your members join after you submit.",
    icon: UsersRound,
  },
  {
    value: "team_member",
    title: "Team member",
    description:
      "Join an existing team using exactly the same name entered by your leader.",
    icon: UserRound,
  },
  {
    value: "solo",
    title: "Solo participant",
    description:
      "Register your own project and continue as a one-person team for this event.",
    icon: Zap,
  },
];

const roleLabels: Record<RegistrationRole, string> = {
  team_leader: "Team leader",
  team_member: "Team member",
  solo: "Solo participant",
};

export function RegistrationForm({
  eventSlug,
  eventTitle,
  institutions,
  classes,
}: {
  eventSlug: string;
  eventTitle: string;
  institutions: Institution[];
  classes: ClassOption[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [values, setValues] = useState({
    institutionId: "",
    classId: "",
    rollNumber: "",
    role: "" as RegistrationRole | "",
    teamName: "",
    problemStatement: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const availableClasses = useMemo(
    () => classes.filter((item) => item.institution_id === values.institutionId),
    [classes, values.institutionId],
  );

  const selectedInstitution = institutions.find(
    (item) => item.id === values.institutionId,
  );
  const selectedClass = classes.find((item) => item.id === values.classId);
  const isMember = values.role === "team_member";
  const needsProblem =
    values.role === "team_leader" || values.role === "solo";

  function updateValue<K extends keyof typeof values>(
    field: K,
    value: (typeof values)[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  }

  function validateAcademicStep() {
    const nextErrors: Errors = {};
    if (!values.institutionId) nextErrors.institutionId = "Select your institution.";
    if (!values.classId) nextErrors.classId = "Select your class.";
    if (!values.rollNumber.trim()) nextErrors.rollNumber = "Enter your roll number.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateRoleStep() {
    if (!values.role) {
      setErrors({ role: "Select how you are registering." });
      return false;
    }
    setErrors({});
    return true;
  }

  function goNext() {
    if (step === 1 && validateAcademicStep()) setStep(2);
    if (step === 2 && validateRoleStep()) setStep(3);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step < 3) {
      goNext();
      return;
    }

    const nextErrors: Errors = {};
    if (!values.teamName.trim()) {
      nextErrors.teamName = isMember
        ? "Enter your team name exactly as your leader registered it."
        : "Enter your team or project name.";
    }
    if (needsProblem && values.problemStatement.trim().length < 10) {
      nextErrors.problemStatement =
        "Describe the problem in at least 10 characters.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (!values.role) return;

    const input: RegistrationInput = {
      eventSlug,
      institutionId: values.institutionId,
      classId: values.classId,
      rollNumber: values.rollNumber,
      role: values.role,
      teamName: values.teamName,
      problemStatement: needsProblem ? values.problemStatement : undefined,
    };

    setSubmitting(true);
    setErrors({});
    const result = await registerForEvent(input);

    if (!result.ok) {
      setSubmitting(false);
      setErrors({ [result.field ?? "form"]: result.message });

      if (
        result.field === "institutionId" ||
        result.field === "classId" ||
        result.field === "rollNumber"
      ) {
        setStep(1);
      } else if (result.field === "role") {
        setStep(2);
      }
      return;
    }

    router.replace("/dashboard?registered=1");
    router.refresh();
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <header className="form-header">
        <div className="form-header-row">
          <div>
            <span className="live-pill">
              <span className="live-dot" />
              Secure registration
            </span>
            <h1>{eventTitle}</h1>
            <p>
              Complete the form once. Your participation type determines the
              fields you see and the team profile created after submission.
            </p>
          </div>
          <ShieldCheck size={34} aria-hidden="true" />
        </div>
      </header>

      <div className="stepper" aria-label="Registration progress">
        {["Student details", "Participation", "Team or project"].map(
          (label, index) => {
            const number = index + 1;
            const complete = step > number;
            const active = step === number;
            return (
              <div
                className={`step-item${active ? " step-item-active" : ""}${
                  complete ? " step-item-complete" : ""
                }`}
                key={label}
                aria-current={active ? "step" : undefined}
              >
                <span className="step-number">
                  {complete ? <Check size={15} aria-hidden="true" /> : number}
                </span>
                <span>{label}</span>
              </div>
            );
          },
        )}
      </div>

      <div className="form-body">
        {errors.form ? (
          <div className="alert alert-error" role="alert" style={{ marginBottom: 22 }}>
            <AlertCircle size={18} aria-hidden="true" />
            <span>{errors.form}</span>
          </div>
        ) : null}

        {step === 1 ? (
          <section>
            <div className="form-section-heading">
              <h2>Your academic details</h2>
              <p>
                Class options change automatically after you select an institution.
              </p>
            </div>

            <div className="form-stack" style={{ marginTop: 0 }}>
              <div className="field">
                <label className="field-label" htmlFor="institution">
                  Institution
                </label>
                <select
                  className="select"
                  id="institution"
                  value={values.institutionId}
                  onChange={(event) => {
                    setValues((current) => ({
                      ...current,
                      institutionId: event.target.value,
                      classId: "",
                    }));
                    setErrors((current) => ({
                      ...current,
                      institutionId: undefined,
                      classId: undefined,
                    }));
                  }}
                  aria-invalid={Boolean(errors.institutionId)}
                >
                  <option value="">Select your institution</option>
                  {institutions.map((institution) => (
                    <option key={institution.id} value={institution.id}>
                      {institution.name}
                    </option>
                  ))}
                </select>
                {errors.institutionId ? (
                  <p className="field-error">
                    <AlertCircle size={14} aria-hidden="true" />
                    {errors.institutionId}
                  </p>
                ) : null}
              </div>

              <div className="form-row">
                <div className="field">
                  <label className="field-label" htmlFor="class">
                    Class
                  </label>
                  <select
                    className="select"
                    id="class"
                    value={values.classId}
                    onChange={(event) => updateValue("classId", event.target.value)}
                    disabled={!values.institutionId}
                    aria-invalid={Boolean(errors.classId)}
                  >
                    <option value="">
                      {values.institutionId
                        ? "Select your class"
                        : "Select institution first"}
                    </option>
                    {availableClasses.map((classOption) => (
                      <option key={classOption.id} value={classOption.id}>
                        {classOption.name}
                      </option>
                    ))}
                  </select>
                  {errors.classId ? (
                    <p className="field-error">
                      <AlertCircle size={14} aria-hidden="true" />
                      {errors.classId}
                    </p>
                  ) : null}
                </div>

                <div className="field">
                  <label className="field-label" htmlFor="rollNumber">
                    Roll number
                  </label>
                  <input
                    className="input"
                    id="rollNumber"
                    type="text"
                    inputMode="text"
                    placeholder="Enter your roll number"
                    value={values.rollNumber}
                    onChange={(event) => updateValue("rollNumber", event.target.value)}
                    aria-invalid={Boolean(errors.rollNumber)}
                  />
                  {errors.rollNumber ? (
                    <p className="field-error">
                      <AlertCircle size={14} aria-hidden="true" />
                      {errors.rollNumber}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <section>
            <div className="form-section-heading">
              <h2>How are you registering?</h2>
              <p>
                Choose one option. The final step changes based on your selection.
              </p>
            </div>

            <div className="role-grid">
              {roleOptions.map((option) => {
                const Icon = option.icon;
                const selected = values.role === option.value;
                return (
                  <label
                    className={`role-option${selected ? " role-option-selected" : ""}`}
                    key={option.value}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={selected}
                      onChange={() => updateValue("role", option.value)}
                    />
                    <span className="role-radio" />
                    <span className="role-option-icon">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <h3>{option.title}</h3>
                    <p>{option.description}</p>
                  </label>
                );
              })}
            </div>

            {errors.role ? (
              <p className="field-error" style={{ marginTop: 14 }}>
                <AlertCircle size={14} aria-hidden="true" />
                {errors.role}
              </p>
            ) : null}
          </section>
        ) : null}

        {step === 3 ? (
          <section>
            <div className="form-section-heading">
              <h2>{isMember ? "Join your registered team" : "Your team or project"}</h2>
              <p>
                {isMember
                  ? "Your form ends after the exact team name. We will connect you to the leader’s team."
                  : "Name your team or project and describe the problem you plan to solve."}
              </p>
            </div>

            {isMember ? (
              <div className="alert alert-warning" style={{ marginBottom: 22 }}>
                <Info size={18} aria-hidden="true" />
                <span>
                  Enter the team name <strong>exactly</strong>, including capital
                  letters and spaces. If it is not found, ask your team leader to
                  register first.
                </span>
              </div>
            ) : null}

            <div className="form-stack" style={{ marginTop: 0 }}>
              <div className="field">
                <label className="field-label" htmlFor="teamName">
                  {isMember ? "Exact team name" : "Team / project name"}
                </label>
                <input
                  className="input"
                  id="teamName"
                  type="text"
                  autoComplete="off"
                  placeholder={
                    isMember
                      ? "Type the name exactly as your leader entered it"
                      : "Example: AquaSense"
                  }
                  value={values.teamName}
                  onChange={(event) => updateValue("teamName", event.target.value)}
                  aria-invalid={Boolean(errors.teamName)}
                />
                {errors.teamName ? (
                  <p className="field-error">
                    <AlertCircle size={14} aria-hidden="true" />
                    {errors.teamName}
                  </p>
                ) : isMember ? (
                  <p className="field-help">This lookup is case-sensitive.</p>
                ) : null}
              </div>

              {needsProblem ? (
                <div className="field">
                  <label className="field-label" htmlFor="problemStatement">
                    Add your problem
                    <span className="field-label-optional">10–3,000 characters</span>
                  </label>
                  <textarea
                    className="textarea"
                    id="problemStatement"
                    placeholder="What real problem are you solving, who experiences it, and why does it matter?"
                    value={values.problemStatement}
                    onChange={(event) =>
                      updateValue("problemStatement", event.target.value.slice(0, 3000))
                    }
                    aria-invalid={Boolean(errors.problemStatement)}
                  />
                  <div className="char-count">
                    {values.problemStatement.length.toLocaleString("en-IN")} / 3,000
                  </div>
                  {errors.problemStatement ? (
                    <p className="field-error">
                      <AlertCircle size={14} aria-hidden="true" />
                      {errors.problemStatement}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {!isMember ? (
                <div>
                  <div className="form-section-heading" style={{ marginBottom: 16 }}>
                    <h2 style={{ fontSize: "1.15rem" }}>Review before submitting</h2>
                  </div>
                  <div className="review-grid">
                    <div className="review-item">
                      <span>Institution</span>
                      <strong>{selectedInstitution?.name ?? "Not selected"}</strong>
                    </div>
                    <div className="review-item">
                      <span>Class & roll number</span>
                      <strong>
                        {selectedClass?.name ?? "Not selected"} · {values.rollNumber}
                      </strong>
                    </div>
                    <div className="review-item">
                      <span>Registration type</span>
                      <strong>{values.role ? roleLabels[values.role] : "Not selected"}</strong>
                    </div>
                    <div className="review-item">
                      <span>Team / project</span>
                      <strong>{values.teamName || "Not entered"}</strong>
                    </div>
                    <div className="review-item review-item-wide">
                      <span>Problem statement</span>
                      <p>{values.problemStatement || "Not entered"}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        <div className="form-footer-actions">
          {step > 1 ? (
            <button
              className="button button-secondary"
              type="button"
              onClick={() => {
                setErrors({});
                setStep((current) => Math.max(1, current - 1));
              }}
              disabled={submitting}
            >
              <ArrowLeft size={17} aria-hidden="true" />
              Previous
            </button>
          ) : (
            <span />
          )}

          {step < 3 ? (
            <button className="button button-primary" type="submit">
              Continue
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          ) : (
            <button className="button button-primary" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <LoaderCircle className="spinner" size={18} aria-hidden="true" />
                  Submitting…
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  {isMember
                    ? "Join team and submit"
                    : values.role === "solo"
                      ? "Register solo project"
                      : "Create team and submit"}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export function RegistrationHelp() {
  return (
    <aside className="side-stack">
      <section className="side-card">
        <h3>
          <Lightbulb size={18} aria-hidden="true" />
          Correct order
        </h3>
        <ul className="side-list">
          <li>
            <CheckCircle2 size={16} aria-hidden="true" />
            Team leader creates the team first.
          </li>
          <li>
            <CheckCircle2 size={16} aria-hidden="true" />
            Members use the exact registered name.
          </li>
          <li>
            <CheckCircle2 size={16} aria-hidden="true" />
            Everyone appears in one shared profile.
          </li>
        </ul>
      </section>

      <section className="side-card">
        <h3>
          <LockKeyhole size={18} aria-hidden="true" />
          Data protection
        </h3>
        <p>
          Students can only see their own profile and people assigned to the same
          team. Event admins can review all registrations through the protected
          admin dashboard.
        </p>
      </section>
    </aside>
  );
}
