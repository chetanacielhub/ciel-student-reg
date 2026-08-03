"use client";

import { useState } from "react";
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

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("co_founder");

  const [projects, setProjects] = useState([
    {
      id: "p-1",
      name: registration.teams?.name || "CIEL Venture Project",
      problem: registration.teams?.problem_statement || "AI-driven telemetry for sustainable impact.",
      stage: "prototype",
      progress: 45,
      pitchDeck: "v1.2_PitchDeck.pdf",
    },
  ]);

  const [newProject, setNewProject] = useState({ name: "", problem: "", stage: "idea" });

  const team = registration.teams;

  function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!newProject.name.trim()) return;
    setProjects((prev) => [
      ...prev,
      {
        id: `p-${Date.now()}`,
        name: newProject.name.trim(),
        problem: newProject.problem.trim() || "Prototyping phase project.",
        stage: newProject.stage,
        progress: 15,
        pitchDeck: "Draft_Pitch.pdf",
      },
    ]);
    setNewProject({ name: "", problem: "", stage: "idea" });
    setShowNewProjectModal(false);
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
            <FolderGit2 size={16} /> My Projects <span className="adm-nav-badge">{projects.length}</span>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <span className="badge badge-brand">Incubated Venture</span>
                <h2 style={{ fontSize: 26, margin: "8px 0 4px", color: "var(--text-white)" }}>{team?.name}</h2>
                <span style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>Stage: Prototype / Validation</span>
              </div>
              <Rocket size={32} style={{ color: "var(--ciel-gold)" }} />
            </div>

            <div className="problem-box" style={{ marginBottom: 24 }}>
              <span>Problem Statement &amp; Executive Summary</span>
              <p>{team?.problem_statement}</p>
            </div>

            <div className="grid-3">
              <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 8, border: "1px solid var(--line)" }}>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)", display: "block" }}>GRANT SUPPORT</span>
                <strong style={{ fontSize: 16, color: "var(--ciel-gold-bright)" }}>Up to ₹5 Lakhs</strong>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 8, border: "1px solid var(--line)" }}>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)", display: "block" }}>IP STATUS</span>
                <strong style={{ fontSize: 16, color: "var(--text-white)" }}>Provisional Patent Pending</strong>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 8, border: "1px solid var(--line)" }}>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)", display: "block" }}>TEAM ROSTER</span>
                <strong style={{ fontSize: 16, color: "var(--text-white)" }}>{members.length} Members</strong>
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
                <h2 style={{ fontSize: 22, margin: 0 }}>Venture Projects</h2>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Track stages from Idea to Scale</span>
              </div>
              <button className="button button-primary button-small" onClick={() => setShowNewProjectModal(true)}>
                <FolderPlus size={15} /> Create Project
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {projects.map((p) => (
                <div key={p.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--ciel-gold-border)", borderRadius: 12, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <h3 style={{ fontSize: 18, color: "var(--text-white)", margin: 0 }}>{p.name}</h3>
                    <span className="badge badge-brand" style={{ textTransform: "capitalize" }}>{p.stage}</span>
                  </div>
                  <p style={{ fontSize: 13.5, color: "var(--text-secondary)", marginBottom: 16 }}>{p.problem}</p>

                  {/* Stage Stepper */}
                  <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                    {STAGES.map((st) => (
                      <div
                        key={st.key}
                        style={{
                          flex: 1,
                          height: 6,
                          borderRadius: 3,
                          background: st.key === p.stage ? "var(--ciel-gold-bright)" : "rgba(255,255,255,0.1)",
                        }}
                        title={st.label}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Deck: {p.pitchDeck}</span>
                </div>
              ))}
            </div>

            {/* Create Project Modal */}
            {showNewProjectModal && (
              <div className="modal-backdrop" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                <form onSubmit={handleCreateProject} className="luxury-card" style={{ maxWidth: 480, width: "100%", padding: 32 }}>
                  <h3 style={{ fontSize: 20, marginBottom: 16 }}>Create Venture Project</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                    <input
                      type="text"
                      className="input"
                      placeholder="Project Name"
                      value={newProject.name}
                      onChange={(e) => setNewProject((v) => ({ ...v, name: e.target.value }))}
                      required
                    />
                    <textarea
                      className="input"
                      placeholder="Problem Statement / Solution Description"
                      rows={3}
                      value={newProject.problem}
                      onChange={(e) => setNewProject((v) => ({ ...v, problem: e.target.value }))}
                    />
                    <select
                      className="select"
                      value={newProject.stage}
                      onChange={(e) => setNewProject((v) => ({ ...v, stage: e.target.value }))}
                    >
                      {STAGES.map((s) => (
                        <option key={s.key} value={s.key}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                    <button type="button" className="button button-ghost" onClick={() => setShowNewProjectModal(false)}>Cancel</button>
                    <button type="submit" className="button button-primary">Save Project</button>
                  </div>
                </form>
              </div>
            )}
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
