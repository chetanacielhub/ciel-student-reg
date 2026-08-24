import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, FileText, Globe, Handshake } from "lucide-react";

export const metadata: Metadata = {
  title: "Industry Partners & MoUs | CIEL",
  description:
    "Corporate alliances, research MoUs, and industry partners supporting CIEL incubation ventures.",
};

const PARTNERS = [
  { name: "National Research Development Corp (NRDC)", type: "Government MoU", focus: "Technology Transfer & Patent Licensing" },
  { name: "Vanguard Seed Capital", type: "Venture Partner", focus: "Early Stage Angel Syndicates & Demo Days" },
  { name: "Apex Industrial Automation", type: "Corporate MoU", focus: "IoT Makerspace Hardware Support" },
  { name: "MSME Development Institute", type: "Government Cell", focus: "Rural Enterprise Modernization Grants" },
];

export default function PartnersPage() {
  return (
    <div className="shell page-section">
      <div className="section-heading">
        <div className="section-heading-row">
          <span className="eyebrow">
            <Handshake size={14} className="text-gold" />
            Strategic Network
          </span>
          <h1>Industry Partners &amp; MoUs</h1>
        </div>
        <p>
          CIEL collaborates with government research agencies, venture capital syndicates, and industry leaders to provide corporate pilot access and market validation.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: 64 }}>
        {PARTNERS.map((p) => (
          <article className="luxury-card" key={p.name}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span className="badge badge-brand">{p.type}</span>
              <Building2 size={22} style={{ color: "var(--ciel-gold)" }} />
            </div>
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>{p.name}</h3>
            <p style={{ fontSize: 13.5, color: "var(--text-secondary)", margin: 0 }}>
              Focus Area: {p.focus}
            </p>
          </article>
        ))}
      </div>

      <div className="status-card" style={{ maxWidth: "100%", textAlign: "center" }}>
        <h2>Partner with CIEL Innovation Hub</h2>
        <p style={{ maxWidth: 560, margin: "12px auto 24px" }}>
          Explore corporate sponsorship, joint R&amp;D MoUs, or student hackathon bounties.
        </p>
        <Link className="button button-primary" href="/contact">
          Inquire About Corporate MoU
        </Link>
      </div>
    </div>
  );
}
