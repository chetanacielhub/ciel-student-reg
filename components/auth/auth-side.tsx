import { CheckCircle2, Lightbulb, LockKeyhole, Rocket, UsersRound } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export function AuthSide({ mode }: { mode: "sign-up" | "sign-in" }) {
  const signingUp = mode === "sign-up";

  return (
    <aside className="auth-side">
      <div className="auth-copy">
        <div style={{ marginBottom: "36px" }}>
          <Logo />
        </div>
        <span className="eyebrow" style={{ marginBottom: "20px" }}>
          {signingUp ? "Incubation Portal" : "Participant Portal"}
        </span>
        <h1>
          {signingUp
            ? "Begin Your Innovation Journey."
            : "Welcome Back to CIEL."}
        </h1>
        <p>
          {signingUp
            ? "Create a verified account to submit your incubation application, form a team, and access the CIEL innovation ecosystem."
            : "Sign in to view your application status, team profile, project dashboard, and mentorship resources."}
        </p>

        <div className="auth-features">
          <div className="auth-feature">
            <div className="auth-feature-icon">
              <LockKeyhole size={19} aria-hidden="true" />
            </div>
            <div>
              <strong>Secure Authentication</strong>
              <span>Email verified access with protected database sessions and row-level security.</span>
            </div>
          </div>

          <div className="auth-feature">
            <div className="auth-feature-icon">
              <UsersRound size={19} aria-hidden="true" />
            </div>
            <div>
              <strong>Team Collaboration</strong>
              <span>Leaders create the team name; members join instantly using the same name.</span>
            </div>
          </div>

          <div className="auth-feature">
            <div className="auth-feature-icon">
              <Rocket size={19} aria-hidden="true" />
            </div>
            <div>
              <strong>Innovation Access</strong>
              <span>Unlock seed grants, makerspace labs, mentorship, and investor connects.</span>
            </div>
          </div>
        </div>
      </div>

      <span className="auth-side-footer">
        CIEL — Centre for Innovation & Entrepreneurship Learning
      </span>
    </aside>
  );
}
