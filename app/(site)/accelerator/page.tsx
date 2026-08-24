import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, LineChart, Rocket, Users2, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Accelerator Vertical",
  description: "Scale-up programs, business diagnostics, market access, and investor connections at CIEL Accelerator.",
};

export default function AcceleratorPage() {
  return (
    <section className="shell page-section">
      <div className="section-heading" style={{ margin: "0 0 36px" }}>
        <div className="section-heading-row" style={{ justifyContent: "flex-start" }}>
          <span className="eyebrow">
            <Rocket size={14} className="text-gold" />
            Scale-Up &amp; Growth
          </span>
          <h1>CIEL Startup Accelerator</h1>
        </div>
        <p style={{ fontSize: "18px" }}>
          Designed for high-growth startups with an MVP or early revenue. We accelerate product-market fit, sales channels, industry partnerships, and investor funding rounds.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: "60px" }}>
        <div className="luxury-card">
          <div className="card-icon-wrap">
            <BarChart3 size={26} />
          </div>
          <h2>Business Diagnostics & Metrics</h2>
          <p style={{ fontSize: "15px", lineHeight: "1.7", marginBottom: 20 }}>
            In-depth analysis of unit economics, customer acquisition cost (CAC), customer lifetime value (LTV), market sizing, and operational bottlenecks.
          </p>
          <ul className="card-list">
            <li><CheckCircle2 size={16} /> Unit Economic Modeling</li>
            <li><CheckCircle2 size={16} /> Funnel & Conversion Optimization</li>
            <li><CheckCircle2 size={16} /> Financial Auditing & Runway Planning</li>
          </ul>
        </div>

        <div className="luxury-card">
          <div className="card-icon-wrap">
            <Users2 size={26} />
          </div>
          <h2>Investor Connect & Demo Day</h2>
          <p style={{ fontSize: "15px", lineHeight: "1.7", marginBottom: 20 }}>
            Curated access to angel networks, micro-VCs, corporate venture arms, and institutional Demo Days.
          </p>
          <ul className="card-list">
            <li><CheckCircle2 size={16} /> Pitch Deck Refinement</li>
            <li><CheckCircle2 size={16} /> 1-on-1 Investor Speed Dating</li>
            <li><CheckCircle2 size={16} /> Annual Institutional Demo Day</li>
          </ul>
        </div>
      </div>

      <div className="luxury-card" style={{ padding: "40px" }}>
        <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>Accelerator Support Services</h2>
        <div className="grid-3" style={{ gap: "24px" }}>
          <div>
            <h3 style={{ fontSize: "18px", color: "var(--ciel-gold)", marginBottom: "8px" }}>Market Research & Insights</h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Comprehensive market intelligence and competitor analysis to guide strategic positioning.</p>
          </div>
          <div>
            <h3 style={{ fontSize: "18px", color: "var(--ciel-gold)", marginBottom: "8px" }}>Sales & Lead Generation</h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Direct B2B introduction to enterprise clients, pilot opportunities, and procurement contracts.</p>
          </div>
          <div>
            <h3 style={{ fontSize: "18px", color: "var(--ciel-gold)", marginBottom: "8px" }}>Industry Mentorship</h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Dedicated one-on-one sessions with CXOs, industry leaders, and domain experts.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
