import type { Metadata } from "next";
import { CheckCircle2, FileText, Microscope, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Research & IPR Cell",
  description: "Intellectual property management, patent facilitation, technology transfer, and research labs at CIEL.",
};

export default function ResearchIPRPage() {
  return (
    <section className="shell page-section">
      <div className="section-heading" style={{ textAlign: "left", maxWidth: "800px", margin: "0 0 60px" }}>
        <span className="eyebrow">
          <Microscope size={14} className="text-gold" />
          Patents & Tech Transfer
        </span>
        <h1>Research & Intellectual Property Rights (IPR)</h1>
        <p style={{ fontSize: "18px" }}>
          Protecting academic innovation, assisting student and faculty researchers with patent filing, copyright registration, commercial licensing, and technology transfer.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: "60px" }}>
        <div className="luxury-card">
          <div className="card-icon-wrap">
            <FileText size={26} />
          </div>
          <h2>Patent Facilitation & Search</h2>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: 20 }}>
            Prior art searches, patent drafting assistance, filing fee subsidies, and attorney consultation for institutional projects.
          </p>
          <ul className="card-list">
            <li><CheckCircle2 size={16} /> Prior Art Patentability Search</li>
            <li><CheckCircle2 size={16} /> Provisional & Complete Specification Drafting</li>
            <li><CheckCircle2 size={16} /> Legal Attorney & IP Advisory Panel</li>
          </ul>
        </div>

        <div className="luxury-card">
          <div className="card-icon-wrap">
            <ShieldCheck size={26} />
          </div>
          <h2>Technology Transfer & Commercialization</h2>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: 20 }}>
            Licensing institutional inventions and lab patents to corporate partners and spin-off startups.
          </p>
          <ul className="card-list">
            <li><CheckCircle2 size={16} /> Technology Licensing Agreements</li>
            <li><CheckCircle2 size={16} /> Faculty Spin-off Venture Guidelines</li>
            <li><CheckCircle2 size={16} /> Industry R&D Collaboration MoUs</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
