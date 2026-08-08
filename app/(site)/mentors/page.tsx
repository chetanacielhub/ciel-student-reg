import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, UserCheck } from "lucide-react";
import { getMentors } from "@/lib/dynamic-store";
import { LinkedInIcon } from "@/components/ui/linkedin-icon";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mentors & Advisory Network | CIEL",
  description:
    "Connect with industry experts, venture capitalists, patent attorneys, and senior faculty mentoring CIEL startups.",
};

export default async function MentorsPage() {
  const mentors = await getMentors();

  return (
    <div className="shell page-section">
      <div className="section-heading">
        <span className="eyebrow">
          <UserCheck size={14} className="text-gold" />
          Expert Guidance
        </span>
        <h1 style={{ marginTop: 16 }}>Mentorship &amp; Advisory Directory</h1>
        <p>
          Our network of domain advisors, serial entrepreneurs, venture capital partners, and patent attorneys provide 1-on-1 strategic guidance to CIEL incubated ventures.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: 64 }}>
        {mentors.map((m) => {
          const content = (
            <article className="luxury-card" key={m.id} style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    {m.avatar && (m.avatar.startsWith("/") || m.avatar.startsWith("http")) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.avatar}
                        alt={m.name}
                        style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", border: "1.5px solid var(--ciel-gold-border)", flexShrink: 0 }}
                      />
                    ) : (
                      <div className="member-avatar" style={{ margin: 0, width: 60, height: 60, fontSize: 20 }}>
                        {m.avatar || m.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                    )}
                    <div>
                      <h3 style={{ fontSize: 20, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                        {m.name}
                      </h3>
                      <div style={{ fontSize: 13.5, color: "var(--ciel-gold-bright)", fontWeight: 600, marginTop: 2 }}>
                        {m.designation}
                      </div>
                      <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{m.organization}</span>
                    </div>
                  </div>
                  {m.linkedinUrl && (
                    <span
                      style={{
                        background: "rgba(96, 165, 250, 0.12)",
                        color: "#60A5FA",
                        border: "1px solid rgba(96, 165, 250, 0.3)",
                        borderRadius: "50%",
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                      title="View LinkedIn Profile"
                    >
                      <LinkedInIcon size={18} />
                    </span>
                  )}
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
              </div>

              {m.linkedinUrl && (
                <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                  <span style={{ fontSize: 13, color: "#60A5FA", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    <LinkedInIcon size={15} /> Connect on LinkedIn &rarr;
                  </span>
                </div>
              )}
            </article>
          );

          return m.linkedinUrl ? (
            <a
              href={m.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              key={m.id}
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              {content}
            </a>
          ) : (
            content
          );
        })}
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

