import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, Compass, Eye, Layers, Target, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About CIEL | Vision & Institutional Mission",
  description:
    "Centre for Innovation & Entrepreneurship Learning (CIEL) is an institutional innovation ecosystem under Chetana Institute fostering student founders, research, and venture acceleration.",
};

export default function AboutPage() {
  return (
    <div className="shell page-section">
      <div className="section-heading">
        <div className="section-heading-row">
          <span className="eyebrow">
            <Compass size={14} className="text-gold" />
            Institutional Overview
          </span>
          <h1>About CIEL</h1>
        </div>
        <p>
          Centre for Innovation &amp; Entrepreneurship Learning (CIEL) is a premier institutional incubator dedicated to nurturing student innovators, researchers, and early-stage entrepreneurs into high-impact ventures.
        </p>
      </div>

      {/* Vision & Mission Grid */}
      <div className="grid-2" style={{ gap: 36, marginBottom: 72 }}>
        <article className="luxury-card">
          <div className="card-icon-wrap">
            <Eye size={28} />
          </div>
          <h3>Our Vision</h3>
          <p>
            To be a premier hub for nurturing an innovative mindset and entrepreneurial talents to produce significant, long-term solutions to global challenges.
          </p>
        </article>

        <article className="luxury-card">
          <div className="card-icon-wrap">
            <Target size={28} />
          </div>
          <h3>Our Mission</h3>
          <p>
            Cultivating an ecosystem that allows individuals to translate ideas into significant initiatives through experiential learning, interdisciplinary collaboration, and strategic partnerships to generate long-term economic and social growth.
          </p>
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
          <Link className="button button-secondary button-large" href="/governance">
            Governance &amp; Committee Structure
          </Link>
        </div>
      </div>
    </div>
  );
}
