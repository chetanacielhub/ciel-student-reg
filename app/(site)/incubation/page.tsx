import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Lightbulb, Microscope, ShieldCheck, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Incubation Vertical",
  description: "Supporting student ventures from ideation to prototype, seed funding, and business incubation at CIEL.",
};

export default function IncubationPage() {
  return (
    <section className="shell page-section">
      <div className="section-heading" style={{ margin: "0 0 36px" }}>
        <div className="section-heading-row" style={{ justifyContent: "flex-start" }}>
          <span className="eyebrow">
            <Lightbulb size={14} className="text-gold" />
            Idea to Startup
          </span>
          <h1>CIEL Incubation Cell</h1>
        </div>
        <p style={{ fontSize: "18px" }}>
          The Incubation Cell provides early-stage student founders, researchers, and innovators with structured incubation programs, prototype lab access, seed grants, legal support, and dedicated office workspace.
        </p>
      </div>

      <div className="verticals-grid" style={{ marginBottom: "60px" }}>
        <div className="luxury-card">
          <div className="card-icon-wrap">
            <Zap size={26} />
          </div>
          <h3>Ideation & Business Hackathons</h3>
          <p>Regular hackathons and design-thinking bootcamps to refine problem statements and validate initial concepts.</p>
          <ul className="card-list">
            <li><CheckCircle2 size={16} /> 36-Hour Hackathons</li>
            <li><CheckCircle2 size={16} /> Design Thinking Workshops</li>
            <li><CheckCircle2 size={16} /> Team Matching Sessions</li>
          </ul>
        </div>

        <div className="luxury-card">
          <div className="card-icon-wrap">
            <Microscope size={26} />
          </div>
          <h3>Makerspace & Prototyping Labs</h3>
          <p>State-of-the-art hardware and software lab infrastructure to convert blueprints into functional MVPs.</p>
          <ul className="card-list">
            <li><CheckCircle2 size={16} /> Rapid 3D Printing & Electronics</li>
            <li><CheckCircle2 size={16} /> AI/ML Cloud Compute Grants</li>
            <li><CheckCircle2 size={16} /> Testing & Validation Benches</li>
          </ul>
        </div>

        <div className="luxury-card">
          <div className="card-icon-wrap">
            <ShieldCheck size={26} />
          </div>
          <h3>Seed Funding & Legal Setup</h3>
          <p>Direct institutional seed grants up to ₹5 Lakhs per venture, company incorporation, and IP patent protection.</p>
          <ul className="card-list">
            <li><CheckCircle2 size={16} /> Institutional Grant Funding</li>
            <li><CheckCircle2 size={16} /> Private Limited Incorporation</li>
            <li><CheckCircle2 size={16} /> Patent & Copyright Filing</li>
          </ul>
        </div>
      </div>

      <div className="luxury-card" style={{ padding: "40px", textAlign: "center" }}>
        <h2 style={{ fontSize: "30px", marginBottom: "16px" }}>Ready to Incubate Your Idea?</h2>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 32px" }}>
          Submit your proposal or join an upcoming hackathon through our registration portal.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <Link className="button button-primary button-large" href="/register">
            Apply for Incubation / Register
            <ArrowRight size={18} />
          </Link>
          <Link className="button button-secondary button-large" href="/contact">
            Contact Incubation Manager
          </Link>
        </div>
      </div>
    </section>
  );
}
