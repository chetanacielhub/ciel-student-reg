import { CheckCircle2, LockKeyhole, UsersRound } from "lucide-react";

export function AuthSide({ mode }: { mode: "sign-up" | "sign-in" }) {
  const signingUp = mode === "sign-up";

  return (
    <aside className="auth-side">
      <div className="auth-copy">
        <span className="eyebrow">Event registration portal</span>
        <h1>
          {signingUp
            ? "Your event registration starts here."
            : "Welcome back to your team."}
        </h1>
        <p>
          {signingUp
            ? "Create one verified account, complete the smart registration form, and see your teammates together in one secure profile."
            : "Sign in to finish your registration, view your project, and see every member connected to your team."}
        </p>

        <div className="auth-features">
          <div className="auth-feature">
            <div className="auth-feature-icon">
              <LockKeyhole size={18} aria-hidden="true" />
            </div>
            <div>
              <strong>Secure Supabase Auth</strong>
              <span>Email confirmation, protected sessions, and database RLS.</span>
            </div>
          </div>

          <div className="auth-feature">
            <div className="auth-feature-icon">
              <UsersRound size={18} aria-hidden="true" />
            </div>
            <div>
              <strong>Automatic team connection</strong>
              <span>Members join the team their leader has already registered.</span>
            </div>
          </div>

          <div className="auth-feature">
            <div className="auth-feature-icon">
              <CheckCircle2 size={18} aria-hidden="true" />
            </div>
            <div>
              <strong>No duplicate registration</strong>
              <span>One account and roll number per event, enforced in PostgreSQL.</span>
            </div>
          </div>
        </div>
      </div>

      <span className="auth-side-footer">
        Designed for institution-wide innovation events.
      </span>
    </aside>
  );
}
