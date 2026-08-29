import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Lightbulb, Presentation, Tv, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Incubation Vertical",
  description: "Supporting student ventures from starting an idea from scratch to business upscaling, tech lab access, and mentor guidance at CIEL.",
};

export default function IncubationPage() {
  return (
    <section className="shell page-section">
      <div className="section-heading" style={{ margin: "0 auto 36px" }}>
        <div className="section-heading-row">
          <span className="eyebrow">
            <Lightbulb size={14} className="text-gold" />
            Idea to Venture
          </span>
          <h1>CIEL Incubation Cell</h1>
        </div>
        <p style={{ fontSize: "18px" }}>
          The Incubation Cell provides student founders, innovators, and registered ventures with business upscaling seminars, tech lab infrastructure, projector-equipped conference rooms for idea discussions, and comprehensive mentor support.
        </p>
      </div>

      <div className="verticals-grid" style={{ marginBottom: "60px" }}>
        <div className="luxury-card">
          <div className="card-icon-wrap">
            <Presentation size={26} />
          </div>
          <h3>Business Upscaling Seminars</h3>
          <p>Constant seminars and interactive workshops focused on taking an idea from scratch to a viable venture model.</p>
          <ul className="card-list">
            <li><CheckCircle2 size={16} /> Idea-to-MVP Masterclasses</li>
            <li><CheckCircle2 size={16} /> Business Model &amp; Scaling Sessions</li>
            <li><CheckCircle2 size={16} /> Market Validation Guidance</li>
          </ul>
        </div>

        <div className="luxury-card">
          <div className="card-icon-wrap">
            <Tv size={26} />
          </div>
          <h3>Tech Lab &amp; Conference Room</h3>
          <p>Dedicated technology workspace and projector-equipped conference room for interactive team discussions and idea pitching.</p>
          <ul className="card-list">
            <li><CheckCircle2 size={16} /> Dedicated Tech Lab Workstations</li>
            <li><CheckCircle2 size={16} /> Conference Room with Projector</li>
            <li><CheckCircle2 size={16} /> Team Brainstorming &amp; Pitch Room</li>
          </ul>
        </div>

        <div className="luxury-card">
          <div className="card-icon-wrap">
            <Users size={26} />
          </div>
          <h3>Wide Mentor Support &amp; Network</h3>
          <p>Direct access to seasoned industry leaders, faculty advisors, and experienced startup mentors across diverse domains.</p>
          <ul className="card-list">
            <li><CheckCircle2 size={16} /> 1-on-1 Mentor Office Hours</li>
            <li><CheckCircle2 size={16} /> Industry Partner Connects</li>
            <li><CheckCircle2 size={16} /> Strategic Venture Feedback</li>
          </ul>
        </div>
      </div>

      <div className="luxury-card" style={{ padding: "40px", textAlign: "center" }}>
        <h2 style={{ fontSize: "30px", marginBottom: "16px" }}>Ready to Incubate Your Idea?</h2>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 32px" }}>
          Submit your idea or venture proposal to access our facilities, seminars, and mentor network.
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
