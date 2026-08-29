import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, GraduationCap, Sparkles } from "lucide-react";
import { getStudentCouncilLeads } from "@/lib/dynamic-store";
import { LinkedInIcon } from "@/components/ui/linkedin-icon";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Student Innovation Council | CIEL",
  description:
    "Student Innovation Council leads campus hackathons, prototyping workshops, and student-driven entrepreneurship at CIEL.",
};

export default async function StudentCouncilPage() {
  const councilLeads = await getStudentCouncilLeads();

  return (
    <div className="shell page-section">
      <div className="section-heading">
        <div className="section-heading-row">
          <span className="eyebrow">
            <GraduationCap size={14} className="text-gold" />
            Youth &amp; Student Leadership
          </span>
          <h1>Student Innovation Council</h1>
        </div>
        <p>
          The Student Innovation Council (SIC) is an active community of nearly 200 members under CIEL driving grassroots innovation, organizing constant business upscaling seminars, coordinating the Tech Lab, and facilitating projector-equipped idea pitch sessions.
        </p>
      </div>

      {/* Leadership Grid */}
      <div className="section-heading" style={{ marginBottom: 36, textAlign: "left" }}>
        <h2>Council Leadership</h2>
        <p>Elected student office bearers representing nearly 200 active student innovators across engineering, technology, and management.</p>
      </div>

      <div className="grid-3" style={{ marginBottom: 64 }}>
        {councilLeads.map((lead) => {
          const cardContent = (
            <article className="member-card" key={lead.id || lead.name} style={{ position: "relative" }}>
              {lead.avatar && (lead.avatar.startsWith("/") || lead.avatar.startsWith("http")) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={lead.avatar}
                  alt={lead.name}
                  style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", margin: "0 auto 16px", border: "1.5px solid var(--ciel-gold-border)", display: "block" }}
                />
              ) : (
                <div className="member-avatar">
                  {lead.avatar || lead.name.split(" ").map((n) => n[0]).join("")}
                </div>
              )}
              <h3 className="member-name" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {lead.name}
                {lead.linkedinUrl && <LinkedInIcon size={15} color="#60A5FA" />}
              </h3>
              <div className="member-role">{lead.role}</div>
              <div className="member-dept">
                {lead.branch} · {lead.year}
              </div>
              {lead.linkedinUrl && (
                <div style={{ marginTop: 12, fontSize: 12, color: "#60A5FA", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                  Connect on LinkedIn &rarr;
                </div>
              )}
            </article>
          );

          return lead.linkedinUrl ? (
            <a
              href={lead.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              key={lead.id || lead.name}
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              {cardContent}
            </a>
          ) : (
            cardContent
          );
        })}
      </div>

      {/* Council Initiatives */}
      <div className="grid-2" style={{ marginBottom: 64 }}>
        <div className="luxury-card">
          <div className="card-icon-wrap">
            <Sparkles size={26} />
          </div>
          <h3>Business Upscaling &amp; Ideation Seminars</h3>
          <p>
            The Council organizes regular seminars on taking ideas from scratch, founder bootcamps, and business scaling masterclasses for students across all departments.
          </p>
        </div>

        <div className="luxury-card">
          <div className="card-icon-wrap">
            <Award size={26} />
          </div>
          <h3>Tech Lab &amp; Conference Pitch Sessions</h3>
          <p>
            Student leads facilitate tech lab workspace access and organize conference room pitch sessions with projectors for idea reviews and mentor discussions.
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

