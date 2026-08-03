import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, Globe, Rocket, ShieldCheck } from "lucide-react";
import { FEATURED_STARTUPS } from "@/lib/ciel-data";

export const metadata: Metadata = {
  title: "Startup Showcase | CIEL Incubated Ventures",
  description:
    "Explore high-impact ventures incubated and accelerated at Centre for Innovation & Entrepreneurship Learning.",
};

export default function StartupShowcasePage() {
  return (
    <div className="shell page-section">
      <div className="section-heading">
        <span className="eyebrow">
          <Rocket size={14} className="text-gold" />
          Incubated Portfolio
        </span>
        <h1 style={{ marginTop: 16 }}>Startup Showcase</h1>
        <p>
          Discover cutting-edge technological enterprises, healthtech innovations, clean-tech solutions, and SaaS platforms built by CIEL student founders and alumni.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: 64 }}>
        {FEATURED_STARTUPS.map((st) => (
          <article className="luxury-card" key={st.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <span className="badge badge-brand" style={{ marginBottom: 8 }}>{st.sector}</span>
                <h3 style={{ fontSize: 24, margin: "4px 0" }}>{st.name}</h3>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Founder: {st.founder}</span>
              </div>
              <span className="badge badge-neutral" style={{ textTransform: "capitalize" }}>Stage: {st.stage}</span>
            </div>

            <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
              {st.description}
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid var(--line)" }}>
              <div>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)", display: "block" }}>GRANT &amp; FUNDING</span>
                <strong style={{ fontSize: 15, color: "var(--ciel-gold-bright)" }}>{st.fundingRaised ?? "Seed Incubated"}</strong>
              </div>

              {st.website && (
                <a
                  className="button button-secondary button-small"
                  href={st.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website <ExternalLink size={14} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="status-card" style={{ maxWidth: "100%", textAlign: "center" }}>
        <h2>Incubate Your Venture at CIEL</h2>
        <p style={{ maxWidth: 540, margin: "12px auto 24px" }}>
          Gain access to seed funding, prototype labs, legal incorporation, and investor demo days.
        </p>
        <Link className="button button-primary" href="/register">
          Submit Incubation Application
          <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}
