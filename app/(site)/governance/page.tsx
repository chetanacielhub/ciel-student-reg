import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building, FileCheck2, Shield, Users } from "lucide-react";
import { GOVERNANCE_COMMITTEES } from "@/lib/ciel-data";

export const metadata: Metadata = {
  title: "Governance & Committees | CIEL",
  description:
    "Steering committee, incubation board, and advisory governance structure for CIEL Innovation Hub.",
};

export default function GovernancePage() {
  return (
    <div className="shell page-section">
      <div className="section-heading">
        <span className="eyebrow">
          <Shield size={14} className="text-gold" />
          Institutional Leadership
        </span>
        <h1 style={{ marginTop: 16 }}>Governance Structure</h1>
        <p>
          CIEL operates under strict academic and administrative governance to ensure compliance, transparency, equity allocation integrity, and ethical research.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 36, marginBottom: 64 }}>
        {GOVERNANCE_COMMITTEES.map((comm) => (
          <article className="event-card" key={comm.name}>
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
              {comm.members.map((m) => (
                <div
                  key={m.name}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid var(--ciel-gold-border)",
                    borderRadius: "var(--radius-sm)",
                    padding: 18,
                  }}
                >
                  <strong style={{ display: "block", color: "var(--text-white)", fontSize: 15, marginBottom: 4 }}>
                    {m.name}
                  </strong>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{m.role}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
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
