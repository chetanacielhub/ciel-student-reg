import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Eye, Layers, Presentation, Target, Tv, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About CIEL | Vision & Institutional Mission",
  description:
    "Centre for Innovation & Entrepreneurship Learning (CIEL) is an institutional innovation ecosystem under Chetana Institute fostering student founders, business upscaling, and venture guidance.",
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
          Centre for Innovation &amp; Entrepreneurship Learning (CIEL) is an institutional incubator at Chetana Institute dedicated to nurturing student innovators, early-stage ideas, and registered ventures through experiential learning, dedicated facilities, and active mentor networks.
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

      {/* Core Facilities & Offerings */}
      <div style={{ marginBottom: 64 }}>
        <div className="section-heading" style={{ marginBottom: 36 }}>
          <h2>Core Facilities &amp; Support</h2>
          <p>Practical resources and direct guidance provided to every innovator at CIEL.</p>
        </div>

        <div className="ecosystem-pillars-card" style={{ maxWidth: 960, margin: "0 auto" }}>
          <div className="pillar-item">
            <div className="pillar-icon">
              <Presentation size={20} />
            </div>
            <div>
              <h3 className="pillar-title">Business Upscaling &amp; Ideation Seminars</h3>
              <p className="pillar-desc">
                Constant seminars and masterclasses focused on starting an idea from scratch, business validation, and practical scaling.
              </p>
            </div>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon">
              <Layers size={20} />
            </div>
            <div>
              <h3 className="pillar-title">Tech Lab</h3>
              <p className="pillar-desc">
                Dedicated technology workspace and development computing infrastructure for building and testing digital solutions.
              </p>
            </div>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon">
              <Tv size={20} />
            </div>
            <div>
              <h3 className="pillar-title">Conference Room with Projector</h3>
              <p className="pillar-desc">
                Equipped conference room featuring high-definition projection for interactive idea discussions and team pitch sessions.
              </p>
            </div>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon">
              <Users size={20} />
            </div>
            <div>
              <h3 className="pillar-title">Wide Mentor Support &amp; Network</h3>
              <p className="pillar-desc">
                Direct 1-on-1 access to seasoned industry leaders, faculty advisors, and experienced entrepreneurs for founder guidance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action banner */}
      <div className="status-card" style={{ maxWidth: "100%", textAlign: "center" }}>
        <h2>Ready to Build Your Venture at CIEL?</h2>
        <p style={{ maxWidth: 600, margin: "12px auto 28px" }}>
          Join nearly 200 student council members and registered startups collaborating with our industry partners.
        </p>
        <div className="inline-actions" style={{ justifyContent: "center" }}>
          <Link className="button button-primary button-large" href="/register">
            Apply to CIEL
          </Link>
          <Link className="button button-secondary button-large" href="/governance">
            Governance Structure
          </Link>
        </div>
      </div>
    </div>
  );
}
