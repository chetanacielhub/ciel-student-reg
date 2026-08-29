import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, Rocket, Users2, Zap } from "lucide-react";
import { ACCELERATOR_STARTUPS } from "@/lib/ciel-data";

export const metadata: Metadata = {
  title: "Accelerator Vertical | CIEL",
  description: "Scale-up programs, business diagnostics, market access, and accelerated startup ventures at CIEL Accelerator.",
};

export default function AcceleratorPage() {
  return (
    <section className="shell page-section">
      <div className="section-heading" style={{ margin: "0 auto 36px" }}>
        <div className="section-heading-row">
          <span className="eyebrow">
            <Rocket size={14} className="text-gold" />
            Scale-Up &amp; Growth
          </span>
          <h1>CIEL Startup Accelerator</h1>
        </div>
        <p style={{ fontSize: "18px" }}>
          Designed for growth-stage ventures scaling revenue and operations. We accelerate market positioning, business upscaling, enterprise pilots, and strategic industry partnerships.
        </p>
      </div>

      {/* Featured Accelerator Cohort Startups */}
      <div style={{ marginBottom: "60px" }}>
        <div className="section-heading" style={{ marginBottom: "28px", textAlign: "left" }}>
          <h2>Accelerated Ventures Cohort</h2>
          <p>Active startups scaling through the CIEL Accelerator program.</p>
        </div>

        <div className="grid-3" style={{ gap: "20px" }}>
          {ACCELERATOR_STARTUPS.map((st) => (
            <article className="luxury-card" key={st.id} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span className="badge badge-brand">{st.sector}</span>
                  <span className="badge badge-neutral" style={{ textTransform: "capitalize" }}>Stage: {st.stage}</span>
                </div>
                <h3 style={{ fontSize: 20, margin: "4px 0 8px" }}>{st.name}</h3>
                <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>
                  {st.description}
                </p>
              </div>

              <div style={{ paddingTop: 12, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--ciel-gold-bright)", fontWeight: 600 }}>{st.fundingRaised}</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>CIEL Cohort</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Core Diagnostics and Growth Pillars */}
      <div className="grid-2" style={{ marginBottom: "60px" }}>
        <div className="luxury-card">
          <div className="card-icon-wrap">
            <BarChart3 size={26} />
          </div>
          <h2>Business Diagnostics &amp; Metrics</h2>
          <p style={{ fontSize: "15px", lineHeight: "1.7", marginBottom: 20 }}>
            In-depth analysis of unit economics, customer acquisition cost (CAC), customer lifetime value (LTV), market sizing, and operational scaling.
          </p>
          <ul className="card-list">
            <li><CheckCircle2 size={16} /> Unit Economic Modeling</li>
            <li><CheckCircle2 size={16} /> Funnel &amp; Conversion Optimization</li>
            <li><CheckCircle2 size={16} /> Business Model Scalability Audits</li>
          </ul>
        </div>

        <div className="luxury-card">
          <div className="card-icon-wrap">
            <Users2 size={26} />
          </div>
          <h2>Enterprise Connect &amp; Industry Network</h2>
          <p style={{ fontSize: "15px", lineHeight: "1.7", marginBottom: 20 }}>
            Direct access to industry partners, corporate pilot opportunities, and dedicated 1-on-1 sessions with seasoned mentors and entrepreneurs.
          </p>
          <ul className="card-list">
            <li><CheckCircle2 size={16} /> B2B Corporate Pilot Alignment</li>
            <li><CheckCircle2 size={16} /> 1-on-1 Mentor Office Hours</li>
            <li><CheckCircle2 size={16} /> Pitch Deck &amp; Growth Refinement</li>
          </ul>
        </div>
      </div>

      {/* Call to action */}
      <div className="luxury-card" style={{ padding: "40px", textAlign: "center" }}>
        <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>Scale Your Venture with CIEL</h2>
        <p style={{ fontSize: "15px", color: "var(--text-secondary)", maxWidth: "560px", margin: "0 auto 28px" }}>
          Connect with our accelerator team for growth diagnostics, industry connects, and mentor sessions.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <Link className="button button-primary button-large" href="/register">
            Apply for Acceleration
            <ArrowRight size={18} />
          </Link>
          <Link className="button button-secondary button-large" href="/contact">
            Contact Accelerator Team
          </Link>
        </div>
      </div>
    </section>
  );
}
