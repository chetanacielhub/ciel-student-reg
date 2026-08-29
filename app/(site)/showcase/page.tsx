import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Rocket, TrendingUp, Zap } from "lucide-react";
import { FEATURED_STARTUPS, ACCELERATOR_STARTUPS } from "@/lib/ciel-data";

export const metadata: Metadata = {
  title: "Startup Showcase | CIEL Incubated & Accelerated Ventures",
  description:
    "Explore high-impact ventures incubated and accelerated at Centre for Innovation & Entrepreneurship Learning.",
};

export default function StartupShowcasePage() {
  return (
    <div className="shell page-section">
      <div className="section-heading">
        <div className="section-heading-row">
          <span className="eyebrow">
            <Rocket size={14} className="text-gold" />
            Venture Portfolio
          </span>
          <h1>Startup Showcase</h1>
        </div>
        <p>
          Discover cutting-edge student and alumni ventures across assistive technology, smart IoT, AI systems, digital solutions, and sustainable consumer brands supported by CIEL.
        </p>
      </div>

      {/* 1. INCUBATED VENTURES */}
      <div style={{ marginBottom: 60 }}>
        <div className="section-heading" style={{ marginBottom: 28, textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Zap size={22} className="text-gold" />
            <h2 style={{ margin: 0 }}>Incubated Ventures</h2>
          </div>
          <p>Early-stage student innovations scaling from concept to validated product.</p>
        </div>

        <div className="grid-2" style={{ gap: 24 }}>
          {FEATURED_STARTUPS.map((st) => (
            <article className="luxury-card" key={st.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <span className="badge badge-brand" style={{ marginBottom: 8 }}>{st.sector}</span>
                  <h3 style={{ fontSize: 22, margin: "4px 0" }}>{st.name}</h3>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{st.founder}</span>
                </div>
                <span className="badge badge-neutral" style={{ textTransform: "capitalize" }}>Stage: {st.stage}</span>
              </div>

              <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
                {st.description}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                <div>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block" }}>PROGRAM</span>
                  <strong style={{ fontSize: 14, color: "var(--ciel-gold-bright)" }}>{st.fundingRaised}</strong>
                </div>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>CIEL Incubation Cell</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* 2. ACCELERATED VENTURES */}
      <div style={{ marginBottom: 64 }}>
        <div className="section-heading" style={{ marginBottom: 28, textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <TrendingUp size={22} className="text-gold" />
            <h2 style={{ margin: 0 }}>Accelerated Ventures</h2>
          </div>
          <p>Growth-stage enterprises scaling market presence, business operations, and enterprise reach.</p>
        </div>

        <div className="grid-2" style={{ gap: 24 }}>
          {ACCELERATOR_STARTUPS.map((st) => (
            <article className="luxury-card" key={st.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <span className="badge badge-brand" style={{ marginBottom: 8 }}>{st.sector}</span>
                  <h3 style={{ fontSize: 22, margin: "4px 0" }}>{st.name}</h3>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{st.founder}</span>
                </div>
                <span className="badge badge-neutral" style={{ textTransform: "capitalize" }}>Stage: {st.stage}</span>
              </div>

              <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
                {st.description}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                <div>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block" }}>PROGRAM</span>
                  <strong style={{ fontSize: 14, color: "var(--ciel-gold-bright)" }}>{st.fundingRaised}</strong>
                </div>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>CIEL Accelerator</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="status-card" style={{ maxWidth: "100%", textAlign: "center" }}>
        <h2>Scale Your Venture with CIEL</h2>
        <p style={{ maxWidth: 540, margin: "12px auto 24px" }}>
          Gain access to business upscaling seminars, tech lab facilities, projector pitch rooms, and our active mentor network.
        </p>
        <Link className="button button-primary" href="/register">
          Submit Venture Application
          <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}
