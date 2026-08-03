import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, GraduationCap, Sparkles, Users } from "lucide-react";
import { STUDENT_COUNCIL_LEADS } from "@/lib/ciel-data";

export const metadata: Metadata = {
  title: "Student Innovation Council | CIEL",
  description:
    "Student Innovation Council leads campus hackathons, prototyping workshops, and student-driven entrepreneurship at CIEL.",
};

export default function StudentCouncilPage() {
  return (
    <div className="shell page-section">
      <div className="section-heading">
        <span className="eyebrow">
          <GraduationCap size={14} className="text-gold" />
          Youth &amp; Student Leadership
        </span>
        <h1 style={{ marginTop: 16 }}>Student Innovation Council</h1>
        <p>
          The Student Innovation Council (SIC) is a student-led body under CIEL driving grassroots innovation, organizing campus hackathons, managing prototyping labs, and mentoring junior student founders.
        </p>
      </div>

      {/* Leadership Grid */}
      <div className="section-heading" style={{ marginBottom: 36, textAlign: "left" }}>
        <h2>Council Leadership (2025–26)</h2>
        <p>Elected student office bearers across engineering, technology, and management programs.</p>
      </div>

      <div className="grid-3" style={{ marginBottom: 64 }}>
        {STUDENT_COUNCIL_LEADS.map((lead) => (
          <article className="member-card" key={lead.name}>
            <div className="member-avatar">{lead.name.split(" ").map((n) => n[0]).join("")}</div>
            <h3 className="member-name">{lead.name}</h3>
            <div className="member-role">{lead.role}</div>
            <div className="member-dept">
              {lead.branch} · {lead.year}
            </div>
          </article>
        ))}
      </div>

      {/* Council Initiatives */}
      <div className="grid-2" style={{ marginBottom: 64 }}>
        <div className="luxury-card">
          <div className="card-icon-wrap">
            <Sparkles size={26} />
          </div>
          <h3>Hackathons &amp; Ideathons</h3>
          <p>
            The Council organizes quarterly institution-wide 36-hour hackathons, bringing together 500+ student coders, designers, and domain thinkers to solve real-world industry problems.
          </p>
        </div>

        <div className="luxury-card">
          <div className="card-icon-wrap">
            <Award size={26} />
          </div>
          <h3>Makerspace Lab Managers</h3>
          <p>
            Trained student leads operate 3D printers, laser cutters, and IoT development kits, offering peer-to-peer technical guidance for hardware prototyping.
          </p>
        </div>
      </div>

      <div className="status-card" style={{ maxWidth: "100%", textAlign: "center" }}>
        <h2>Join the Student Innovation Movement</h2>
        <p style={{ maxWidth: 540, margin: "12px auto 24px" }}>
          Are you a student passionate about building startups or leading tech events? Join the Student Innovation Council today.
        </p>
        <Link className="button button-primary" href="/register">
          Apply as Student Innovator
          <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}
