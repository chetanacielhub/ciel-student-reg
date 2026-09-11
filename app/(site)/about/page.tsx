import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Eye, Layers, Presentation, Shield, Target, Tv, Users, Award, GraduationCap } from "lucide-react";
import { getGovernanceCommittees, getStudentCouncilLeads } from "@/lib/dynamic-store";
import { LinkedInIcon } from "@/components/ui/linkedin-icon";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About CIEL | Vision, Governance & Institutional Mission",
  description:
    "Centre for Innovation & Entrepreneurship Learning (CIEL) is an institutional innovation ecosystem under Chetana Institute fostering student founders, business upscaling, and venture guidance.",
};

export default async function AboutPage() {
  const committees = await getGovernanceCommittees();
  const allCouncilLeads = await getStudentCouncilLeads();
  const councilLeads = allCouncilLeads.filter((l) => l.category !== "functional");
  const studentFunctionalLeads = allCouncilLeads.filter((l) => l.category === "functional");

  const governingComm = committees.find((c) => c.name.toLowerCase().includes("governing"));
  const steeringComm = committees.find((c) => c.name.toLowerCase().includes("steering"));
  const functionalComm = committees.find((c) => c.name.toLowerCase().includes("functional"));
  const otherComms = committees.filter((c) => c !== governingComm && c !== steeringComm && c !== functionalComm);

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
      <div id="vision-mission" className="grid-2" style={{ gap: 36, marginBottom: 72 }}>
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
      <div style={{ marginBottom: 72 }}>
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

      {/* ─── LEADERSHIP & COMMITTEES (120px Circular Portrait Photos) ─── */}
      <div style={{ marginBottom: 72 }}>
        <div className="section-heading" style={{ marginBottom: 44 }}>
          <div className="section-heading-row" style={{ justifyContent: "center" }}>
            <span className="eyebrow">
              <Shield size={14} className="text-gold" />
              Leadership &amp; Committees
            </span>
          </div>
          <h2>Our Leadership &amp; Governance</h2>
          <p style={{ maxWidth: 700, margin: "0 auto" }}>
            Institutional steering board, incubation evaluation panel, functional track leads, and student innovation council office bearers.
          </p>
        </div>

        {/* 1. Governing Committee */}
        {governingComm && (
          <div id="governing-committee" style={{ marginBottom: 60 }}>
            <div style={{ marginBottom: 24, textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--ciel-gold-bright)", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                <Shield size={16} /> Governance Board
              </div>
              <h3 style={{ fontSize: 24, color: "var(--text-white)", margin: "0 0 8px" }}>{governingComm.name}</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 660, margin: "0 auto" }}>{governingComm.description}</p>
            </div>

            <div className="team-portrait-grid">
              {governingComm.members.map((m, idx) => (
                <div key={m.name + idx} className="portrait-member-card">
                  {m.avatar && (m.avatar.startsWith("/") || m.avatar.startsWith("http")) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.avatar} alt={m.name} className="portrait-photo" />
                  ) : (
                    <div className="portrait-avatar-placeholder">
                      {m.avatar || m.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                  )}
                  <h4 className="portrait-name">
                    <span>{m.name}</span>
                    {m.linkedinUrl && (
                      <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex" }}>
                        <LinkedInIcon size={14} color="#60A5FA" />
                      </a>
                    )}
                  </h4>
                  <p className="portrait-role">{m.role}</p>
                  {m.linkedinUrl && (
                    <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" className="portrait-linkedin-btn">
                      LinkedIn Profile &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Joint-Steering Committee */}
        {steeringComm && (
          <div id="joint-steering-committee" style={{ marginBottom: 60 }}>
            <div style={{ marginBottom: 24, textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--ciel-gold-bright)", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                <Layers size={16} /> Strategic Alignment
              </div>
              <h3 style={{ fontSize: 24, color: "var(--text-white)", margin: "0 0 8px" }}>{steeringComm.name}</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 660, margin: "0 auto" }}>{steeringComm.description}</p>
            </div>

            <div className="team-portrait-grid">
              {steeringComm.members.map((m, idx) => (
                <div key={m.name + idx} className="portrait-member-card">
                  {m.avatar && (m.avatar.startsWith("/") || m.avatar.startsWith("http")) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.avatar} alt={m.name} className="portrait-photo" />
                  ) : (
                    <div className="portrait-avatar-placeholder">
                      {m.avatar || m.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                  )}
                  <h4 className="portrait-name">
                    <span>{m.name}</span>
                    {m.linkedinUrl && (
                      <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex" }}>
                        <LinkedInIcon size={14} color="#60A5FA" />
                      </a>
                    )}
                  </h4>
                  <p className="portrait-role">{m.role}</p>
                  {m.linkedinUrl && (
                    <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" className="portrait-linkedin-btn">
                      LinkedIn Profile &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Functional Committee */}
        {functionalComm && (
          <div id="functional-committee" style={{ marginBottom: 60 }}>
            <div style={{ marginBottom: 24, textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--ciel-gold-bright)", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                <Award size={16} /> Operational Tracks
              </div>
              <h3 style={{ fontSize: 24, color: "var(--text-white)", margin: "0 0 8px" }}>{functionalComm.name}</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 660, margin: "0 auto" }}>{functionalComm.description}</p>
            </div>

            <div className="team-portrait-grid">
              {functionalComm.members.map((m, idx) => {
                const sectionTitle = m.role.includes("—") ? m.role.split("—")[1].trim() : null;
                return (
                  <div key={m.name + idx} className="portrait-member-card">
                    {sectionTitle && (
                      <span className="badge badge-brand" style={{ fontSize: 11, marginBottom: 12 }}>
                        Section {sectionTitle.match(/^(\d+)[:.]/)?.[1] || idx + 1}: {sectionTitle.replace(/^\d+[:.]\s*/, "")}
                      </span>
                    )}

                    {m.avatar && (m.avatar.startsWith("/") || m.avatar.startsWith("http")) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.avatar} alt={m.name} className="portrait-photo" />
                    ) : (
                      <div className="portrait-avatar-placeholder">
                        {m.avatar || m.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                    )}
                    <h4 className="portrait-name">
                      <span>{m.name}</span>
                      {m.linkedinUrl && (
                        <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex" }}>
                          <LinkedInIcon size={14} color="#60A5FA" />
                        </a>
                      )}
                    </h4>
                    <p className="portrait-role">{sectionTitle ? "Committee Lead" : m.role}</p>
                    {m.linkedinUrl && (
                      <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" className="portrait-linkedin-btn">
                        LinkedIn Profile &rarr;
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Student Innovation Council */}
        <div id="student-innovation-council" style={{ marginBottom: 60 }}>
          {/* Dedicated 4-Institute Portal Link Banner */}
          <div
            style={{
              padding: "16px 20px",
              borderRadius: 14,
              border: "1px solid rgba(212, 175, 55, 0.4)",
              background: "linear-gradient(135deg, rgba(212, 175, 55, 0.12), rgba(212, 175, 55, 0.03))",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: "var(--ciel-gold-bright)", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
                Dedicated Multi-Institute Governance Page
              </div>
              <div style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
                View dedicated sections for all 4 institutes: <strong>CIMR</strong>, <strong>CRKIMR</strong>, <strong>Chetana&apos;s SFC</strong>, and <strong>H.S. Commerce &amp; Arts</strong>.
              </div>
            </div>
            <Link className="button button-primary button-small" href="/student-council">
              Open 4-Institutes Council Page &rarr;
            </Link>
          </div>
        </div>

        {/* Any other committees */}
        {otherComms.map((comm) => (
          <div key={comm.id || comm.name} style={{ marginBottom: 60 }}>
            <div style={{ marginBottom: 24, textAlign: "center" }}>
              <h3 style={{ fontSize: 24, color: "var(--text-white)", margin: "0 0 8px" }}>{comm.name}</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 660, margin: "0 auto" }}>{comm.description}</p>
            </div>
            <div className="team-portrait-grid">
              {comm.members.map((m, idx) => (
                <div key={m.name + idx} className="portrait-member-card">
                  {m.avatar && (m.avatar.startsWith("/") || m.avatar.startsWith("http")) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.avatar} alt={m.name} className="portrait-photo" />
                  ) : (
                    <div className="portrait-avatar-placeholder">
                      {m.avatar || m.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                  )}
                  <h4 className="portrait-name">
                    <span>{m.name}</span>
                    {m.linkedinUrl && (
                      <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex" }}>
                        <LinkedInIcon size={14} color="#60A5FA" />
                      </a>
                    )}
                  </h4>
                  <p className="portrait-role">{m.role}</p>
                  {m.linkedinUrl && (
                    <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" className="portrait-linkedin-btn">
                      LinkedIn Profile &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
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

