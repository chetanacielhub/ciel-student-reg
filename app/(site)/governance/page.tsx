import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield, Users } from "lucide-react";
import { getGovernanceCommittees } from "@/lib/dynamic-store";
import { LinkedInIcon } from "@/components/ui/linkedin-icon";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Governance & Committees | CIEL",
  description:
    "Steering committee, incubation board, and advisory governance structure for CIEL Innovation Hub.",
};

export default async function GovernancePage() {
  const rawCommittees = await getGovernanceCommittees();
  const getPriority = (name: string) => {
    const n = (name || "").toLowerCase().trim();
    if (n.includes("governing")) return 1;
    if (n.includes("joint") || n.includes("steering")) return 2;
    if (n.includes("functional")) return 3;
    return 99;
  };
  const committees = [...rawCommittees].sort((a, b) => getPriority(a.name) - getPriority(b.name));

  return (
    <div className="shell page-section">
      <div className="section-heading">
        <div className="section-heading-row">
          <span className="eyebrow">
            <Shield size={14} className="text-gold" />
            Institutional Leadership
          </span>
          <h1>Governance Structure</h1>
        </div>
        <p>
          CIEL operates under strict academic and administrative governance to ensure compliance, transparency, equity allocation integrity, and ethical research.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 36, marginBottom: 64 }}>
        {committees.map((comm) => {
          const sectionId = comm.id?.replace(/^gov-/, "") || comm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return (
            <article className="event-card" key={comm.id || comm.name} id={sectionId}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div className="card-icon-wrap" style={{ width: 44, height: 44, marginBottom: 0 }}>
                <Users size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: 22, margin: 0 }}>{comm.name}</h2>
                <span style={{ fontSize: 13, color: "var(--ciel-gold-bright)" }}>CIEL Standing Committee</span>
              </div>
            </div>

            <p className="event-card-description">{comm.description}</p>

            <div className="team-portrait-grid" style={{ marginTop: 28 }}>
              {comm.members.map((m, idx) => {
                const isFunctional = comm.id === "functional-committee" || comm.name.toLowerCase().includes("functional");
                const sectionTitle = isFunctional && m.role.includes("—") 
                  ? m.role.split("—")[1].trim()
                  : null;

                const memberCard = (
                  <div key={m.name + idx} className="portrait-member-card">
                    {sectionTitle && (
                      <span className="badge badge-brand" style={{ fontSize: 11, marginBottom: 12 }}>
                        Section {sectionTitle.match(/^(\d+)[:.]/)?.[1] || idx + 1}: {sectionTitle.replace(/^\d+[:.]\s*/, "")}
                      </span>
                    )}

                    {m.avatar && (m.avatar.startsWith("/") || m.avatar.startsWith("http")) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="portrait-photo"
                      />
                    ) : (
                      <div className="portrait-avatar-placeholder">
                        {m.avatar || m.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                    )}

                    <h3 className="portrait-name">
                      <span>{m.name}</span>
                      {m.linkedinUrl && <LinkedInIcon size={14} color="#60A5FA" />}
                    </h3>

                    <p className="portrait-role">
                      {sectionTitle ? "Committee Lead" : m.role}
                    </p>

                    {m.linkedinUrl && (
                      <span className="portrait-linkedin-btn">
                        LinkedIn Profile &rarr;
                      </span>
                    )}
                  </div>
                );

                return m.linkedinUrl ? (
                  <a
                    href={m.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={m.name + idx}
                    style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
                  >
                    {memberCard}
                  </a>
                ) : (
                  memberCard
                );
              })}
            </div>
          </article>
        );
      })}
      </div>

      <div className="status-card" style={{ maxWidth: "100%", textAlign: "center" }}>
        <h2>Review Official Governance &amp; IP Policies</h2>
        <p style={{ maxWidth: 560, margin: "12px auto 24px" }}>
          Download official documents regarding equity allocation, seed grant disbursement terms, and patent ownership guidelines.
        </p>
        <Link className="button button-primary" href="/resources">
          View Policy &amp; Resource Documents
          <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}

