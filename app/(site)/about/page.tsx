import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, Compass, Eye, Flag, Layers, ShieldCheck, Target, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About CIEL | Vision & Institutional Mission",
  description:
    "Centre for Innovation & Entrepreneurship Learning (CIEL) is an institutional innovation ecosystem under Chetana Institute fostering student founders, research, and venture acceleration.",
};

export default function AboutPage() {
  return (
    <div className="shell page-section">
      <div className="section-heading">
        <span className="eyebrow">
          <Compass size={14} className="text-gold" />
          Institutional Overview
        </span>
        <h1 style={{ marginTop: 16 }}>About CIEL</h1>
        <p>
          Centre for Innovation &amp; Entrepreneurship Learning (CIEL) is a premier institutional incubator dedicated to nurturing student innovators, researchers, and early-stage entrepreneurs into high-impact ventures.
        </p>
      </div>

      {/* Vision & Mission Grid */}
      <div className="grid-2" style={{ marginBottom: 64 }}>
        <article className="luxury-card">
          <div className="card-icon-wrap">
            <Eye size={28} />
          </div>
          <h3>Our Vision</h3>
          <p>
            To emerge as a world-class institutional innovation hub that transforms academic research and creative ideas into globally competitive, scalable, and socially responsible technological enterprises.
          </p>
          <ul className="card-list">
            <li><ShieldCheck size={16} /> Foster institutional culture of innovation and research excellence.</li>
            <li><ShieldCheck size={16} /> Empower youth and women entrepreneurs across diverse sectors.</li>
            <li><ShieldCheck size={16} /> Bridge the gap between academia, industry, and venture capital.</li>
          </ul>
        </article>

        <article className="luxury-card">
          <div className="card-icon-wrap">
            <Target size={28} />
          </div>
          <h3>Our Mission</h3>
          <p>
            To provide end-to-end incubation support including seed funding, prototyping labs, patent filing assistance, legal incorporation, and industry mentorship for campus &amp; regional innovators.
          </p>
          <ul className="card-list">
            <li><Flag size={16} /> Incubate 100+ high-potential startups by 2028.</li>
            <li><Flag size={16} /> Facilitate 50+ patent filings &amp; technology transfers.</li>
            <li><Flag size={16} /> Create robust Industry MoUs and angel investment syndicates.</li>
          </ul>
        </article>
      </div>

      {/* Core Operational Pillars */}
      <div style={{ marginBottom: 64 }}>
        <div className="section-heading" style={{ marginBottom: 40 }}>
          <h2>Core Institutional Pillars</h2>
          <p>Structured support systems designed to accelerate innovation at every stage.</p>
        </div>

        <div className="grid-3">
          <div className="role-feature">
            <div className="role-feature-icon">
              <Layers size={24} />
            </div>
            <h3>Makerspace &amp; Prototyping</h3>
            <p>State-of-the-art 3D printing, IoT testing workbench, mechanical fabrication, and high-performance computing labs.</p>
          </div>

          <div className="role-feature">
            <div className="role-feature-icon">
              <Award size={24} />
            </div>
            <h3>IPR &amp; Patent Cell</h3>
            <p>Dedicated legal counsel for prior art search, patent drafting, copyright registration, and commercial licensing.</p>
          </div>

          <div className="role-feature">
            <div className="role-feature-icon">
              <Zap size={24} />
            </div>
            <h3>Seed Grant &amp; VC Network</h3>
            <p>Direct seed funding up to ₹5 Lakhs per venture, with Demo Day presentations before leading angel syndicates.</p>
          </div>
        </div>
      </div>

      {/* Call to action banner */}
      <div className="status-card" style={{ maxWidth: "100%", textAlign: "center" }}>
        <h2>Ready to Launch Your Innovation at CIEL?</h2>
        <p style={{ maxWidth: 600, margin: "12px auto 28px" }}>
          Submit your venture application today and gain access to prototyping facilities, mentorship, and grant support.
        </p>
        <div className="inline-actions" style={{ justifyContent: "center" }}>
          <Link className="button button-primary button-large" href="/register">
            Apply for Incubation
            <ArrowRight size={18} />
          </Link>
          <Link className="button button-secondary button-large" href="/governance">
            Governance &amp; Committee Structure
          </Link>
        </div>
      </div>
    </div>
  );
}
