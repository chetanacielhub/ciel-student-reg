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
  const committees = await getGovernanceCommittees();

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

            <div className="grid-3" style={{ marginTop: 24 }}>
              {comm.members.map((m, idx) => {
                const isFunctional = comm.id === "functional-committee" || comm.name.toLowerCase().includes("functional");
                // Extract section name if role starts with "Lead — "
                const sectionTitle = isFunctional && m.role.includes("—") 
                  ? m.role.split("—")[1].trim()
                  : null;

                const memberCard = (
                  <div
                    key={m.name + idx}
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid var(--ciel-gold-border)",
                      borderRadius: "var(--radius-sm)",
                      padding: 18,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      {sectionTitle && (
                        <div style={{ marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid rgba(212, 160, 23, 0.15)" }}>
                          <span className="badge badge-brand" style={{ fontSize: 11, marginBottom: 4, display: "inline-block" }}>
                            Section {sectionTitle.match(/^(\d+)[:.]/)?.[1] || idx + 1}
                          </span>
                          <h3 style={{ fontSize: 16, margin: "4px 0 0", color: "var(--ciel-gold-bright)", fontWeight: 700 }}>
                            {sectionTitle.replace(/^\d+[:.]\s*/, "")}
                          </h3>
                        </div>
                      )}

                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        {m.avatar && (m.avatar.startsWith("/") || m.avatar.startsWith("http")) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={m.avatar}
                            alt={m.name}
                            style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--ciel-gold-border)", flexShrink: 0 }}
                          />
                        ) : (
                          <div className="member-avatar" style={{ margin: 0, width: 36, height: 36, fontSize: 13, flexShrink: 0 }}>
                            {m.avatar || m.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                        )}
                        <div style={{ flex: 1 }}>
                          <strong style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--text-white)", fontSize: 15 }}>
                            <span>{m.name}</span>
                            {m.linkedinUrl && <LinkedInIcon size={15} color="#60A5FA" />}
                          </strong>
                          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                            {sectionTitle ? "Committee Lead" : m.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {m.linkedinUrl && (
                      <div style={{ marginTop: 12, fontSize: 11.5, color: "#60A5FA", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                        LinkedIn Profile &rarr;
                      </div>
                    )}
                  </div>
                );

                return m.linkedinUrl ? (
                  <a
                    href={m.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={m.name + idx}
                    style={{ textDecoration: "none", color: "inherit", display: "block" }}
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

