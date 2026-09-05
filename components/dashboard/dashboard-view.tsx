"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Download,
  FileText,
  FolderGit2,
  LayoutDashboard,
  Lightbulb,
  LockKeyhole,
  Rocket,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserRound,
  UsersRound,
  Zap,
} from "lucide-react";
import type { CIEL_DOWNLOADS } from "@/lib/ciel-data";

type DashboardProps = {
  profile: {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  registration: {
    id: string;
    role: "team_leader" | "team_member" | "solo";
    roll_number: string;
    created_at: string;
    institutions: { name?: string } | null;
    classes: { name?: string } | null;
    teams: {
      id: string;
      name: string;
      kind: "team" | "solo";
      problem_statement: string;
      created_at: string;
    } | null;
  };
  members: Array<{
    id: string;
    role: "team_leader" | "team_member" | "solo";
    roll_number: string;
    profiles: {
      full_name: string | null;
      email: string | null;
      phone: string | null;
    } | null;
    classes: { name?: string } | null;
  }>;
  downloads: typeof CIEL_DOWNLOADS;
  registeredSuccess?: boolean;
};

const ROLE_LABELS = {
  team_leader: "Team Leader",
  team_member: "Team Member",
  solo: "Solo Founder",
};

function getInitials(name?: string | null) {
  return (
    name
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("") || "U"
  );
}

export function DashboardView({
  profile,
  registration,
  members,
  downloads,
  registeredSuccess,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "team" | "project" | "downloads" | "mentorship"
  >("overview");

  const team = registration.teams;

  return (
    <div className="dashboard-wrapper">
      {/* Success Notification */}
      {registeredSuccess && (
        <div className="alert alert-success" style={{ marginBottom: 24 }}>
          <CheckCircle2 size={18} />
          <span>Your incubation registration was submitted successfully. Your team profile is live!</span>
        </div>
      )}

      {/* Top Profile Summary Bar */}
      <div
        className="luxury-card"
        style={{
          padding: "24px 32px",
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            className="avatar"
            style={{
              width: 56,
              height: 56,
              fontSize: 22,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #222636, #0E1017)",
              border: "2px solid var(--ciel-gold)",
              color: "var(--ciel-gold-bright)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
            }}
          >
            {getInitials(profile?.full_name)}
          </div>
          <div>
            <h2 style={{ fontSize: 22, margin: 0, color: "var(--text-white)" }}>
              {profile?.full_name || "Innovator Account"}
            </h2>
            <span style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
              {profile?.email || "Email verified"} · {registration.institutions?.name || "CIEL Campus"}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="badge badge-brand" style={{ fontSize: 13, padding: "6px 14px" }}>
            <Sparkles size={13} style={{ marginRight: 4 }} />
            {ROLE_LABELS[registration.role]}
          </span>
          <span className="badge badge-neutral" style={{ fontSize: 13, padding: "6px 14px" }}>
            Roll: {registration.roll_number}
          </span>
        </div>
      </div>

      {/* Interactive Tabs Navigation */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 28,
          borderBottom: "1px solid var(--line)",
          paddingBottom: 12,
          overflowX: "auto",
        }}
      >
        <button
          className={`button ${activeTab === "overview" ? "button-primary" : "button-ghost"}`}
          onClick={() => setActiveTab("overview")}
          style={{ fontSize: 13.5 }}
        >
          <LayoutDashboard size={16} /> Overview
        </button>
        <button
          className={`button ${activeTab === "team" ? "button-primary" : "button-ghost"}`}
          onClick={() => setActiveTab("team")}
          style={{ fontSize: 13.5 }}
        >
          <UsersRound size={16} /> My Team ({members.length})
        </button>
        <button
          className={`button ${activeTab === "project" ? "button-primary" : "button-ghost"}`}
          onClick={() => setActiveTab("project")}
          style={{ fontSize: 13.5 }}
        >
          <FolderGit2 size={16} /> Project &amp; Milestones
        </button>
        <button
          className={`button ${activeTab === "downloads" ? "button-primary" : "button-ghost"}`}
          onClick={() => setActiveTab("downloads")}
          style={{ fontSize: 13.5 }}
        >
          <Download size={16} /> Guidelines &amp; Policies
        </button>
        <button
          className={`button ${activeTab === "mentorship" ? "button-primary" : "button-ghost"}`}
          onClick={() => setActiveTab("mentorship")}
          style={{ fontSize: 13.5 }}
        >
          <UserCheck size={16} /> Mentorship
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="dashboard-grid">
          <article className="dashboard-card profile-card">
            <h2>Registration Summary</h2>
            <div className="detail-list">
              <div className="detail-row">
                <span>Phone Contact</span>
                <strong>{profile?.phone || "Not provided"}</strong>
              </div>
              <div className="detail-row">
                <span>Registration Date</span>
                <strong>
                  {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
                    new Date(registration.created_at)
                  )}
                </strong>
              </div>
              <div className="detail-row">
                <span>Incubation Stage</span>
                <strong style={{ color: "var(--ciel-gold-bright)" }}>Idea / Prototype Validation</strong>
              </div>
            </div>
          </article>

          <article className="dashboard-card team-card">
            <h2>{team?.kind === "solo" ? "Solo Venture Profile" : "Incubated Venture Profile"}</h2>
            <div className="team-title-row">
              <div>
                <h3>{team?.name ?? "Venture Team"}</h3>
                <span className="badge badge-brand" style={{ marginTop: 10 }}>
                  {members.length} Active {members.length === 1 ? "Member" : "Members"}
                </span>
              </div>
              <Rocket size={32} style={{ color: "var(--ciel-gold)", opacity: 0.8 }} />
            </div>
            <div className="problem-box">
              <span>Problem Statement</span>
              <p>{team?.problem_statement ?? "No problem statement submitted yet."}</p>
            </div>
          </article>
        </div>
      )}

      {/* TAB 2: MY TEAM */}
      {activeTab === "team" && (
        <article className="dashboard-card members-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h2 style={{ marginBottom: 4 }}>Connected Team Roster</h2>
              <p style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
                Team members connect automatically by entering the exact team name: <strong>{team?.name}</strong>
              </p>
            </div>
            <span className="badge badge-brand">{members.length} Members</span>
          </div>

          <div className="member-list">
            {members.map((m) => (
              <div className="member-item" key={m.id}>
                <div className="member-avatar">{getInitials(m.profiles?.full_name)}</div>
                <div style={{ flex: 1 }}>
                  <strong>{m.profiles?.full_name || "Team Member"}</strong>
                  <span>
                    {ROLE_LABELS[m.role]} · {m.classes?.name ?? "Department"} · Roll {m.roll_number}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {m.profiles?.email || m.profiles?.phone || "Verified Campus Identity"}
                  </span>
                </div>
                <span className="badge badge-neutral">{ROLE_LABELS[m.role]}</span>
              </div>
            ))}
          </div>
        </article>
      )}

      {/* TAB 3: PROJECT & MILESTONES */}
      {activeTab === "project" && (
        <article className="dashboard-card">
          <h2>Venture Progression Roadmap</h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
            Track your milestone reviews from initial submission to seed grant disbarment and lab prototyping.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                background: "rgba(212, 175, 55, 0.08)",
                border: "1px solid var(--ciel-gold-border)",
                borderRadius: "var(--radius-sm)",
                padding: 18,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <CheckCircle2 size={24} style={{ color: "var(--ciel-gold-bright)", flexShrink: 0 }} />
              <div>
                <strong style={{ display: "block", color: "var(--text-white)" }}>Stage 1: Application Submission</strong>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Registration completed and assigned to CIEL evaluation cell.</span>
              </div>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius-sm)",
                padding: 18,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Lightbulb size={24} style={{ color: "var(--ciel-gold)", flexShrink: 0 }} />
              <div>
                <strong style={{ display: "block", color: "var(--text-white)" }}>Stage 2: Pitch Deck &amp; Idea Screening</strong>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Present before the CIEL Incubation &amp; Mentorship Panel.</span>
              </div>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius-sm)",
                padding: 18,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Zap size={24} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <div>
                <strong style={{ display: "block", color: "var(--text-white)" }}>Stage 3: Tech Lab &amp; Ideation Pitch Evaluation</strong>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Access the Tech Lab, conference pitch room, and business scaling seminars.</span>
              </div>
            </div>
          </div>
        </article>
      )}

      {/* TAB 4: DOWNLOADS & GUIDELINES */}
      {activeTab === "downloads" && (
        <article className="dashboard-card">
          <h2>CIEL Policies &amp; Resource Documents</h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
            Official handbooks, patent policies, and pitch deck templates available for download.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {downloads.map((doc) => (
              <div
                key={doc.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 16,
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--ciel-gold-border)",
                  borderRadius: "var(--radius-sm)",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <FileText size={22} style={{ color: "var(--ciel-gold)", flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", fontSize: 15, color: "var(--text-white)" }}>{doc.title}</strong>
                    <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>
                      {doc.format} · {doc.fileSize} · Updated {doc.updatedAt}
                    </span>
                  </div>
                </div>
                <a
                  className="button button-secondary button-small"
                  href="/downloads"
                >
                  <Download size={14} /> Download
                </a>
              </div>
            ))}
          </div>
        </article>
      )}

      {/* TAB 5: MENTORSHIP */}
      {activeTab === "mentorship" && (
        <article className="dashboard-card">
          <h2>Assigned Mentors &amp; Advisory Sessions</h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
            Book 1-on-1 office hours with industry experts, IP attorneys, and venture capitalists.
          </p>

          <div className="alert alert-info">
            <UserCheck size={18} />
            <span>
              Your team will be assigned a primary domain mentor following Stage 2 pitch evaluation.
            </span>
          </div>
        </article>
      )}
    </div>
  );
}
