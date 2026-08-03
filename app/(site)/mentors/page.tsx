import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, Briefcase, GraduationCap, UserCheck } from "lucide-react";
import { CIEL_MENTORS } from "@/lib/ciel-data";

export const metadata: Metadata = {
  title: "Mentors & Advisory Network | CIEL",
  description:
    "Connect with industry experts, venture capitalists, patent attorneys, and senior faculty mentoring CIEL startups.",
};

export default function MentorsPage() {
  return (
    <div className="shell page-section">
      <div className="section-heading">
        <span className="eyebrow">
          <UserCheck size={14} className="text-gold" />
          Expert Guidance
        </span>
        <h1 style={{ marginTop: 16 }}>Mentorship &amp; Advisory Directory</h1>
        <p>
          Our network of 40+ domain advisors, serial entrepreneurs, venture capital partners, and patent attorneys provide 1-on-1 strategic guidance to CIEL incubated ventures.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: 64 }}>
        {CIEL_MENTORS.map((m) => (
          <article className="luxury-card" key={m.id}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
              <div className="member-avatar" style={{ margin: 0, width: 60, height: 60, fontSize: 20 }}>
                {m.avatar}
              </div>
              <div>
                <h3 style={{ fontSize: 20, margin: 0 }}>{m.name}</h3>
                <div style={{ fontSize: 13.5, color: "var(--ciel-gold-bright)", fontWeight: 600, marginTop: 2 }}>
                  {m.designation}
                </div>
                <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{m.organization}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: 11.5, color: "var(--text-muted)", display: "block", marginBottom: 8, fontWeight: 700 }}>
                CORE EXPERTISE
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {m.expertise.map((exp) => (
                  <span className="badge badge-neutral" key={exp}>
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="status-card" style={{ maxWidth: "100%", textAlign: "center" }}>
        <h2>Interested in Joining CIEL as a Mentor?</h2>
        <p style={{ maxWidth: 540, margin: "12px auto 24px" }}>
          Share your industry experience and guide the next generation of technological entrepreneurs.
        </p>
        <Link className="button button-primary" href="/register">
          Apply as Mentor / Advisor
          <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}
