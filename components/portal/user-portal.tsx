"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  FolderGit2,
  FolderPlus,
  Globe,
  HelpCircle,
  KeyRound,
  LayoutDashboard,
  Lightbulb,
  LockKeyhole,
  LogOut,
  Mail,
  Plus,
  Rocket,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCheck,
  UserPlus,
  UserRound,
  UsersRound,
  Zap,
} from "lucide-react";
import type { CIEL_DOWNLOADS } from "@/lib/ciel-data";

type PortalProps = {
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
};

type PortalTab =
  | "profile"
  | "startup"
  | "team"
  | "projects"
  | "documents"
  | "applications"
  | "mentorship"
  | "events"
  | "notifications"
  | "downloads"
  | "certificates"
  | "settings";

const STAGES = [
  { key: "idea", label: "Idea", color: "#94A3B8" },
  { key: "prototype", label: "Prototype", color: "#60A5FA" },
  { key: "validation", label: "Validation", color: "#F59E0B" },
  { key: "incubation", label: "Incubation", color: "#D4AF37" },
  { key: "funding", label: "Funding", color: "#10B981" },
  { key: "market", label: "Market", color: "#8B5CF6" },
  { key: "scale", label: "Scale", color: "#EC4899" },
];

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

export function UserPortal({ profile, registration, members, downloads }: PortalProps) {
  const [activeTab, setActiveTab] = useState<PortalTab>("profile");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [inviteEmail, setInviteEmail] = useState("");
  const team = registration.teams;

  // Live Venture Project State
  const [project, setProject] = useState({
    id: "proj-1",
    name: team?.name || "EcoGrid Telemetry Hub",
    problemStatement: team?.problem_statement || "IoT-enabled smart grid telemetry for micro-solar installations.",
    stage: "prototype" as "idea" | "prototype" | "validation" | "incubation" | "funding" | "market" | "scale",
    progress: 55,
    pitchDeck: "/uploads/EcoGrid_PitchDeck_v2.pdf",
    grantStatus: "approved" as "under_review" | "approved" | "grant_awarded" | "needs_revision",
    reviewerNotes: "Prototype validation approved by CIEL Board. Pre-seed grant of ₹3.5 Lakhs allocated.",
    journeyMilestones: [
      {
        id: "jm-1",
        stage: "idea",
        title: "Ideation & Problem Validation",
        description: "Validated sensor requirements across 12 micro-solar installations.",
        date: "2026-01-10",
        status: "completed",
      },
      {
        id: "jm-2",
        stage: "prototype",
        title: "ESP32 PCB Hardware Assembly",
        description: "Completed working hardware telemetry prototype in CIEL Makerspace lab.",
        date: "2026-02-01",
        status: "completed",
      },
      {
        id: "jm-3",
        stage: "validation",
        title: "Field Pilot & IoT Dashboard Test",
        description: "Deploying 5 test nodes for 30-day live telemetry stream.",
        date: "2026-03-01",
        status: "in_progress",
      },
    ],
  });

  const [milestoneForm, setMilestoneForm] = useState({
    title: "",
    stage: "prototype" as any,
    description: "",
    date: new Date().toISOString().split("T")[0],
    status: "completed" as any,
  });

  const [editForm, setEditForm] = useState({
    name: project.name,
    problemStatement: project.problemStatement,
    stage: project.stage,
    progress: project.progress,
    pitchDeck: project.pitchDeck,
  });

  // Sync initial state from API
  useEffect(() => {
    fetch("/api/portal/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.project) {
          const p = data.project;
          setProject((prev) => ({
            ...prev,
            ...p,
            journeyMilestones: p.journeyMilestones || prev.journeyMilestones,
          }));
          setEditForm({
            name: p.name || "",
            problemStatement: p.problemStatement || "",
            stage: p.stage || "idea",
            progress: p.progress ?? 20,
            pitchDeck: p.pitchDeck || "",
          });
        }
      })
      .catch(() => {});
  }, []);

  async function handleUpdateProject(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/portal/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: project.id,
          ...editForm,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.project) {
          setProject((prev) => ({ ...prev, ...json.project }));
        }
        setShowEditProjectModal(false);
      } else {
        alert("Failed to update project.");
      }
    } catch {
      alert("Error updating project.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddMilestone(e: React.FormEvent) {
    e.preventDefault();
    if (!milestoneForm.title.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/portal/journey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          ...milestoneForm,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.milestone) {
          setProject((prev) => ({
            ...prev,
            journeyMilestones: [json.milestone, ...(prev.journeyMilestones || [])],
          }));
        }
        setMilestoneForm({
          title: "",
          stage: project.stage,
          description: "",
          date: new Date().toISOString().split("T")[0],
          status: "completed",
        });
        setShowMilestoneModal(false);
      } else {
        alert("Failed to add milestone.");
      }
    } catch {
      alert("Error adding milestone.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUploadPitchDeck(file: File) {
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.ok) {
        const json = await res.json();
        setEditForm((prev) => ({ ...prev, pitchDeck: json.url }));
      } else {
        alert("Failed to upload pitch deck.");
      }
    } catch {
      alert("Error uploading pitch deck file.");
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "80vh", gap: 24, marginTop: 12 }}>
      {/* 1. NOTION / LINEAR STYLE SLEEK SIDEBAR */}
      <aside
        style={{
          width: 260,
          flexShrink: 0,
          background: "rgba(15, 17, 24, 0.9)",
          border: "1px solid var(--ciel-gold-border)",
          borderRadius: "var(--radius-md)",
          padding: "20px 14px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "0 10px 18px", borderBottom: "1px solid var(--line)", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                color: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 16,
              }}
            >
              {getInitials(profile?.full_name)}
            </div>
            <div style={{ overflow: "hidden" }}>
              <strong style={{ display: "block", fontSize: 14, color: "var(--text-white)", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                {profile?.full_name || "Innovator Account"}
              </strong>
              <span style={{ fontSize: 11.5, color: "var(--ciel-gold-bright)" }}>
                {registration.role.replace("_", " ").toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <button className={`adm-nav-item ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
            <UserRound size={16} /> Profile
          </button>
          <button className={`adm-nav-item ${activeTab === "startup" ? "active" : ""}`} onClick={() => setActiveTab("startup")}>
            <Rocket size={16} /> My Startup
          </button>
          <button className={`adm-nav-item ${activeTab === "team" ? "active" : ""}`} onClick={() => setActiveTab("team")}>
            <UsersRound size={16} /> My Team <span className="adm-nav-badge">{members.length}</span>
          </button>
          <button className={`adm-nav-item ${activeTab === "projects" ? "active" : ""}`} onClick={() => setActiveTab("projects")}>
            <FolderGit2 size={16} /> My Projects <span className="adm-nav-badge">1</span>
          </button>
          <button className={`adm-nav-item ${activeTab === "documents" ? "active" : ""}`} onClick={() => setActiveTab("documents")}>
            <FileText size={16} /> Documents
          </button>
          <button className={`adm-nav-item ${activeTab === "applications" ? "active" : ""}`} onClick={() => setActiveTab("applications")}>
            <ShieldCheck size={16} /> Applications
          </button>
          <button className={`adm-nav-item ${activeTab === "mentorship" ? "active" : ""}`} onClick={() => setActiveTab("mentorship")}>
            <UserCheck size={16} /> Mentorship
          </button>
          <button className={`adm-nav-item ${activeTab === "events" ? "active" : ""}`} onClick={() => setActiveTab("events")}>
            <Zap size={16} /> Events
          </button>
          <button className={`adm-nav-item ${activeTab === "notifications" ? "active" : ""}`} onClick={() => setActiveTab("notifications")}>
            <Bell size={16} /> Notifications <span className="adm-nav-badge">2</span>
          </button>
          <button className={`adm-nav-item ${activeTab === "downloads" ? "active" : ""}`} onClick={() => setActiveTab("downloads")}>
            <Download size={16} /> Downloads
          </button>
          <button className={`adm-nav-item ${activeTab === "certificates" ? "active" : ""}`} onClick={() => setActiveTab("certificates")}>
            <Award size={16} /> Certificates
          </button>
          <button className={`adm-nav-item ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>
            <Settings size={16} /> Settings
          </button>
        </nav>

        <form action="/auth/sign-out" method="post" style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
          <button type="submit" className="adm-logout-btn">
            <LogOut size={15} /> Sign Out
          </button>
        </form>
      </aside>

      {/* 2. MAIN CONTENT VIEWPORT */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {/* TAB 1: PROFILE */}
        {activeTab === "profile" && (
          <div className="luxury-card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, color: "var(--text-white)", marginBottom: 16 }}>Innovator Profile</h2>
            <div className="detail-list">
              <div className="detail-row">
                <span>Full Name</span>
                <strong>{profile?.full_name || "—"}</strong>
              </div>
              <div className="detail-row">
                <span>Verified Email</span>
                <strong>{profile?.email || "—"}</strong>
              </div>
              <div className="detail-row">
                <span>Phone Contact</span>
                <strong>{profile?.phone || "Not provided"}</strong>
              </div>
              <div className="detail-row">
                <span>Campus / Institution</span>
                <strong>{registration.institutions?.name || "CIEL Campus"}</strong>
              </div>
              <div className="detail-row">
                <span>Roll / Student ID</span>
                <strong>{registration.roll_number}</strong>
              </div>
              <div className="detail-row">
                <span>Portal Role</span>
                <strong style={{ color: "var(--ciel-gold-bright)" }}>{registration.role.replace("_", " ").toUpperCase()}</strong>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY STARTUP */}
        {activeTab === "startup" && (
          <div className="luxury-card" style={{ padding: 32 }}>
            {/* Admin Grant & Review Banner */}
            {project.grantStatus && (
              <div
                style={{
                  background: project.grantStatus === "approved" || project.grantStatus === "grant_awarded" ? "rgba(16, 185, 129, 0.12)" : "rgba(212, 175, 55, 0.12)",
                  border: `1px solid ${project.grantStatus === "approved" || project.grantStatus === "grant_awarded" ? "#10B981" : "var(--ciel-gold)"}`,
                  borderRadius: "var(--radius-sm)",
                  padding: 16,
                  marginBottom: 24,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <ShieldCheck size={18} color={project.grantStatus === "approved" || project.grantStatus === "grant_awarded" ? "#10B981" : "#D4AF37"} />
                  <strong style={{ color: "var(--text-white)", fontSize: 15, textTransform: "capitalize" }}>
                    Incubation Approval Status: {project.grantStatus.replace("_", " ").toUpperCase()}
                  </strong>
                </div>
                {project.reviewerNotes && (
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, paddingLeft: 28 }}>
                    <strong>Admin Feedback:</strong> {project.reviewerNotes}
                  </p>
                )}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <span className="badge badge-brand" style={{ textTransform: "uppercase" }}>Stage: {project.stage}</span>
                <h2 style={{ fontSize: 26, margin: "8px 0 4px", color: "var(--text-white)" }}>{project.name}</h2>
                <span style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>Team Roster: {members.length} Members</span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="button button-secondary button-small" onClick={() => setShowEditProjectModal(true)}>
                  <Settings size={15} /> Edit Venture
                </button>
                <button className="button button-primary button-small" onClick={() => setShowMilestoneModal(true)}>
                  <Plus size={15} /> Log Milestone
                </button>
              </div>
            </div>

            <div className="problem-box" style={{ marginBottom: 24 }}>
              <span>Problem Statement &amp; Executive Summary</span>
              <p>{project.problemStatement}</p>
            </div>

            {/* Stage Stepper */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ciel-gold-bright)" }}>INNOVATION JOURNEY PROGRESS ({project.progress}%)</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Current Stage: <strong style={{ color: "var(--text-white)", textTransform: "capitalize" }}>{project.stage}</strong></span>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {STAGES.map((st) => {
                  const isActive = st.key === project.stage;
                  return (
                    <div
                      key={st.key}
                      style={{
                        flex: 1,
                        padding: "10px 4px",
                        textAlign: "center",
                        borderRadius: 6,
                        background: isActive ? "linear-gradient(135deg, rgba(212,175,55,0.3), rgba(184,134,11,0.2))" : "rgba(255,255,255,0.03)",
                        border: isActive ? "1px solid var(--ciel-gold)" : "1px solid var(--line)",
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 700, color: isActive ? "var(--ciel-gold-bright)" : "var(--text-muted)", textTransform: "uppercase" }}>{st.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid-3" style={{ marginBottom: 28 }}>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 8, border: "1px solid var(--line)" }}>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)", display: "block" }}>GRANT SUPPORT</span>
                <strong style={{ fontSize: 16, color: "var(--ciel-gold-bright)" }}>Up to ₹5 Lakhs</strong>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 8, border: "1px solid var(--line)" }}>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)", display: "block" }}>PITCH DECK</span>
                <strong style={{ fontSize: 14, color: "#60A5FA", display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                  <FileText size={14} /> {project.pitchDeck ? "Uploaded" : "Pending Upload"}
                </strong>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 8, border: "1px solid var(--line)" }}>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)", display: "block" }}>JOURNEY LOGS</span>
                <strong style={{ fontSize: 16, color: "var(--text-white)" }}>{project.journeyMilestones.length} Milestones</strong>
              </div>
            </div>

            {/* Journey Milestone Timeline */}
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 18, color: "var(--text-white)", margin: 0 }}>Innovation Journey Timeline</h3>
                <button className="button button-ghost button-small" onClick={() => setShowMilestoneModal(true)}>
                  <Plus size={14} /> Add Milestone
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {project.journeyMilestones.map((m) => (
                  <div key={m.id} style={{ display: "flex", gap: 16, background: "rgba(255,255,255,0.02)", padding: 16, borderRadius: 8, border: "1px solid var(--line)" }}>
                    <div style={{ flexShrink: 0 }}>
                      <span className="badge badge-brand" style={{ textTransform: "uppercase", fontSize: 10 }}>{m.stage}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: "var(--text-white)", display: "block", fontSize: 15 }}>{m.title}</strong>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0" }}>{m.description}</p>
                      <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Logged on {m.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MY TEAM */}
        {activeTab === "team" && (
          <div className="luxury-card" style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 22, margin: 0 }}>Team Roster</h2>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Team Code / Name: <strong>{team?.name}</strong></span>
              </div>
              <button className="button button-primary button-small" onClick={() => setShowInviteModal(true)}>
                <UserPlus size={15} /> Invite Member
              </button>
            </div>

            <div className="member-list">
              {members.map((m) => (
                <div className="member-item" key={m.id}>
                  <div className="member-avatar">{getInitials(m.profiles?.full_name)}</div>
                  <div style={{ flex: 1 }}>
                    <strong>{m.profiles?.full_name || "Team Member"}</strong>
                    <span>{m.role.replace("_", " ")} · Roll {m.roll_number}</span>
                  </div>
                  <span className="badge badge-neutral">{m.role}</span>
                </div>
              ))}
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
              <div className="modal-backdrop" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                <div className="luxury-card" style={{ maxWidth: 440, width: "100%", padding: 32 }}>
                  <h3 style={{ fontSize: 20, marginBottom: 12 }}>Invite Team Member</h3>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>
                    Enter email address to send an official team invitation link.
                  </p>
                  <input
                    type="email"
                    className="input"
                    placeholder="member@institution.edu"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    style={{ marginBottom: 16 }}
                  />
                  <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                    <button className="button button-ghost" onClick={() => setShowInviteModal(false)}>Cancel</button>
                    <button
                      className="button button-primary"
                      onClick={() => {
                        alert(`Invitation sent to ${inviteEmail}`);
                        setShowInviteModal(false);
                      }}
                    >
                      Send Invite
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MY PROJECTS */}
        {activeTab === "projects" && (
          <div className="luxury-card" style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 22, margin: 0 }}>Venture Projects &amp; Innovation Stage</h2>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Track journey from Idea to Scale</span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="button button-secondary button-small" onClick={() => setShowEditProjectModal(true)}>
                  <Settings size={15} /> Update Project
                </button>
                <button className="button button-primary button-small" onClick={() => setShowMilestoneModal(true)}>
                  <Plus size={15} /> Add Milestone
                </button>
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--ciel-gold-border)", borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 20, color: "var(--text-white)", margin: 0 }}>{project.name}</h3>
                  <p style={{ fontSize: 13.5, color: "var(--text-secondary)", marginTop: 4 }}>{project.problemStatement}</p>
                </div>
                <span className="badge badge-brand" style={{ textTransform: "uppercase" }}>{project.stage}</span>
              </div>

              {/* Stage Stepper */}
              <div style={{ display: "flex", gap: 6, margin: "16px 0" }}>
                {STAGES.map((st) => (
                  <div
                    key={st.key}
                    style={{
                      flex: 1,
                      height: 8,
                      borderRadius: 4,
                      background: st.key === project.stage ? "var(--ciel-gold-bright)" : "rgba(255,255,255,0.1)",
                    }}
                    title={st.label}
                  />
                ))}
              </div>

              {project.pitchDeck && (
                <div style={{ marginTop: 14 }}>
                  <a href={project.pitchDeck} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#60A5FA", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <FileText size={15} /> View Uploaded Pitch Deck PDF &rarr;
                  </a>
                </div>
              )}
            </div>

            {/* Milestones timeline */}
            <h3 style={{ fontSize: 18, color: "var(--text-white)", marginBottom: 14 }}>Journey Timeline Logs</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {project.journeyMilestones.map((m) => (
                <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", padding: 14, borderRadius: 8, border: "1px solid var(--line)" }}>
                  <div>
                    <strong style={{ color: "var(--text-white)", display: "block" }}>{m.title}</strong>
                    <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{m.description}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className="badge badge-neutral" style={{ fontSize: 10, textTransform: "uppercase", display: "block", marginBottom: 4 }}>{m.stage}</span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{m.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL 1: EDIT PROJECT */}
        {showEditProjectModal && (
          <div className="modal-backdrop" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <form onSubmit={handleUpdateProject} className="luxury-card" style={{ maxWidth: 500, width: "100%", padding: 32 }}>
              <h3 style={{ fontSize: 20, marginBottom: 16 }}>Update Venture Project</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                <div>
                  <label className="field-label">Venture / Project Name *</label>
                  <input
                    type="text"
                    className="input"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="field-label">Problem Statement / Solution *</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={editForm.problemStatement}
                    onChange={(e) => setEditForm({ ...editForm, problemStatement: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="field-label">Current Innovation Stage</label>
                  <select
                    className="select"
                    value={editForm.stage}
                    onChange={(e) => setEditForm({ ...editForm, stage: e.target.value as any })}
                  >
                    {STAGES.map((s) => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="field-label">Progress Percentage ({editForm.progress}%)</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={editForm.progress}
                    onChange={(e) => setEditForm({ ...editForm, progress: parseInt(e.target.value) })}
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label className="field-label">Upload Pitch Deck File / PDF</label>
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx"
                    className="input"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUploadPitchDeck(f);
                    }}
                  />
                  {editForm.pitchDeck && (
                    <span style={{ fontSize: 12, color: "#34D399", display: "block", marginTop: 4 }}>
                      ✓ Pitch Deck attached: {editForm.pitchDeck}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button type="button" className="button button-ghost" onClick={() => setShowEditProjectModal(false)}>Cancel</button>
                <button type="submit" className="button button-primary" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Venture Updates"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL 2: ADD JOURNEY MILESTONE */}
        {showMilestoneModal && (
          <div className="modal-backdrop" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <form onSubmit={handleAddMilestone} className="luxury-card" style={{ maxWidth: 480, width: "100%", padding: 32 }}>
              <h3 style={{ fontSize: 20, marginBottom: 16 }}>Log Innovation Journey Milestone</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                <div>
                  <label className="field-label">Milestone Title *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Completed ESP32 Telemetry Board Assembly"
                    value={milestoneForm.title}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="field-label">Innovation Stage</label>
                  <select
                    className="select"
                    value={milestoneForm.stage}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, stage: e.target.value as any })}
                  >
                    {STAGES.map((s) => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="field-label">Description / Achievements</label>
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="Brief description of work done, testing results, or patent filed..."
                    value={milestoneForm.description}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="field-label">Milestone Date</label>
                  <input
                    type="date"
                    className="input"
                    value={milestoneForm.date}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, date: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button type="button" className="button button-ghost" onClick={() => setShowMilestoneModal(false)}>Cancel</button>
                <button type="submit" className="button button-primary" disabled={submitting}>
                  {submitting ? "Logging..." : "Log Milestone"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="luxury-card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, color: "var(--text-white)", marginBottom: 16 }}>Project Documents</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: 14, background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid var(--line)" }}>
                <div>
                  <strong style={{ color: "var(--text-white)", display: "block" }}>Pitch Deck (v1.2)</strong>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>PDF · 4.2 MB · Uploaded Jan 2026</span>
                </div>
                <button className="button button-secondary button-small"><Download size={14} /> Download</button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: APPLICATIONS */}
        {activeTab === "applications" && (
          <div className="luxury-card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, color: "var(--text-white)", marginBottom: 16 }}>Incubation Applications</h2>
            <div className="alert alert-info">
              <ShieldCheck size={18} />
              <span>Application Status: Under Review by CIEL Investment Board. Next milestone review in 14 days.</span>
            </div>
          </div>
        )}

        {/* TAB 7: MENTORSHIP */}
        {activeTab === "mentorship" && (
          <div className="luxury-card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, color: "var(--text-white)", marginBottom: 16 }}>Mentorship Sessions</h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 }}>Book 1-on-1 office hours with assigned domain experts.</p>
            <button className="button button-primary"><UserCheck size={16} /> Schedule Mentor Session</button>
          </div>
        )}

        {/* TAB 8: EVENTS */}
        {activeTab === "events" && (
          <div className="luxury-card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, color: "var(--text-white)", marginBottom: 16 }}>Registered Events</h2>
            <div style={{ padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid var(--line)" }}>
              <strong style={{ color: "var(--text-white)", display: "block" }}>CIEL Annual Innovation Hackathon 2026</strong>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>March 15-16, 2026 · CIEL Prototyping Labs</span>
            </div>
          </div>
        )}

        {/* TAB 9: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="luxury-card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, color: "var(--text-white)", marginBottom: 16 }}>System Notifications</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="alert alert-info"><Bell size={16} /> <span>Your team registration was verified by campus administration.</span></div>
              <div className="alert alert-success"><CheckCircle2 size={16} /> <span>Pitch deck v1.2 uploaded successfully.</span></div>
            </div>
          </div>
        )}

        {/* TAB 10: DOWNLOADS */}
        {activeTab === "downloads" && (
          <div className="luxury-card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, color: "var(--text-white)", marginBottom: 16 }}>Official Downloads</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {downloads.map((doc) => (
                <div key={doc.id} style={{ display: "flex", justifyContent: "space-between", padding: 14, background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid var(--line)" }}>
                  <div>
                    <strong style={{ color: "var(--text-white)", display: "block" }}>{doc.title}</strong>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{doc.format} · {doc.fileSize}</span>
                  </div>
                  <a className="button button-secondary button-small" href="/downloads"><Download size={14} /> Download</a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 11: CERTIFICATES */}
        {activeTab === "certificates" && (
          <div className="luxury-card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, color: "var(--text-white)", marginBottom: 16 }}>Verified Certificates</h2>
            <div className="alert alert-info"><Award size={18} /> <span>Certificates are issued automatically upon workshop or cohort completion.</span></div>
          </div>
        )}

        {/* TAB 12: SETTINGS */}
        {activeTab === "settings" && (
          <div className="luxury-card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, color: "var(--text-white)", marginBottom: 16 }}>Account Settings</h2>
            <form onSubmit={(e) => { e.preventDefault(); alert("Settings saved!"); }} style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 440 }}>
              <div>
                <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Contact Phone</label>
                <input type="text" className="input" defaultValue={profile?.phone || ""} />
              </div>
              <button type="submit" className="button button-primary" style={{ width: "fit-content" }}>Save Preferences</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
