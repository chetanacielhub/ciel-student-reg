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
  const allLeads = await getStudentCouncilLeads();
  const councilLeads = allLeads.filter((l) => l.category !== "functional");
  const functionalLeads = allLeads.filter((l) => l.category === "functional");

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

      <div className="team-portrait-grid" style={{ marginBottom: 64 }}>
        {councilLeads.map((lead) => {
          const cardContent = (
            <article className="portrait-member-card" key={lead.id || lead.name}>
              {lead.avatar && (lead.avatar.startsWith("/") || lead.avatar.startsWith("http")) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={lead.avatar}
                  alt={lead.name}
                  className="portrait-photo"
                />
              ) : (
                <div className="portrait-avatar-placeholder">
                  {lead.avatar || lead.name.split(" ").map((n) => n[0]).join("")}
                </div>
              )}
              <h3 className="portrait-name">
                <span>{lead.name}</span>
                {lead.linkedinUrl && <LinkedInIcon size={14} color="#60A5FA" />}
              </h3>
              <p className="portrait-role" style={{ color: "var(--ciel-gold-bright)", fontWeight: 600 }}>{lead.role}</p>
              <div className="portrait-meta" style={{ color: "var(--text-secondary)", fontWeight: 400 }}>
                {lead.branch} · {lead.year}
              </div>
              {lead.linkedinUrl && (
                <span className="portrait-linkedin-btn">
                  Connect on LinkedIn &rarr;
                </span>
              )}
            </article>
          );

          return lead.linkedinUrl ? (
            <a
              href={lead.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              key={lead.id || lead.name}
              style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
            >
              {cardContent}
            </a>
          ) : (
            cardContent
          );
        })}
      </div>

      {/* Student Functional Committee Section */}
      {functionalLeads.length > 0 && (
        <div style={{ marginBottom: 64 }}>
          <div className="section-heading" style={{ marginBottom: 36, textAlign: "left" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--ciel-gold-bright)", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              <Award size={16} /> Operational Verticals
            </div>
            <h2>Student Functional Committee</h2>
            <p>Dedicated student track coordinators executing CIEL&apos;s 6 core innovation verticals alongside institutional leads.</p>
          </div>

          <div className="team-portrait-grid">
            {functionalLeads.map((lead) => {
              const cardContent = (
                <article className="portrait-member-card" key={lead.id || lead.name}>
                  {lead.avatar && (lead.avatar.startsWith("/") || lead.avatar.startsWith("http")) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={lead.avatar}
                      alt={lead.name}
                      className="portrait-photo"
                    />
                  ) : (
                    <div className="portrait-avatar-placeholder">
                      {lead.avatar || lead.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                  )}
                  <h3 className="portrait-name">
                    <span>{lead.name}</span>
                    {lead.linkedinUrl && <LinkedInIcon size={14} color="#60A5FA" />}
                  </h3>
                  <p className="portrait-role" style={{ color: "var(--ciel-gold-bright)", fontWeight: 600 }}>{lead.role}</p>
                  <div className="portrait-meta" style={{ color: "var(--text-secondary)", fontWeight: 400 }}>
                    {lead.branch} · {lead.year}
                  </div>
                  {lead.linkedinUrl && (
                    <span className="portrait-linkedin-btn">
                      Connect on LinkedIn &rarr;
                    </span>
                  )}
                </article>
              );

              return lead.linkedinUrl ? (
                <a
                  href={lead.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={lead.id || lead.name}
                  style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
                >
                  {cardContent}
                </a>
              ) : (
                cardContent
              );
            })}
          </div>
        </div>
      )}

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

