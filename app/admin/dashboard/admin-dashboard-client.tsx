"use client";

import { useState, useRef, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  FolderGit2,
  Globe,
  GraduationCap,
  Handshake,
  Image as ImageIcon,
  Layers,
  Lock,
  LogOut,
  Mail,
  MoreHorizontal,
  Play,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sliders,
  Trash2,
  TrendingUp,
  Upload,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  UserStar,
  UserX,
  Video,
  X,
  Zap,
  Eye,
  Edit,
  Copy,
  ExternalLink,
  Sun,
  Moon,
} from "lucide-react";
import { CIEL_DOWNLOADS } from "@/lib/ciel-data";
import type { GovernanceCommitteeItem, MentorItem, StudentCouncilLeadItem, VentureProjectItem, CielEventItem, DownloadItem, GoogleFormItem, ElevatorPitchItem } from "@/lib/types";
import { LinkedInIcon } from "@/components/ui/linkedin-icon";
import { Logo } from "@/components/ui/logo";

// ─── Types ─────────────────────────────────────────────────────────────────

type RegistrationRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  className: string;
  rollNumber: string;
  role: "team_leader" | "team_member" | "solo";
  teamName: string;
  problemStatement: string;
  createdAt: string;
};

type ProfileRow = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
};

type GalleryImage = {
  filename: string;
  url: string;
};

type AdminStats = {
  totalRegistrations: number;
  teamCount: number;
  leaderCount: number;
  memberCount: number;
  soloCount: number;
  totalUsers: number;
  totalImages: number;
  mentorCount?: number;
  councilCount?: number;
  governanceCount?: number;
  formsCount?: number;
  pitchesCount?: number;
};

type Props = {
  registrations: RegistrationRow[];
  profiles: ProfileRow[];
  images: GalleryImage[];
  initialMentors?: MentorItem[];
  initialCouncil?: StudentCouncilLeadItem[];
  initialGovernance?: GovernanceCommitteeItem[];
  initialEvents?: CielEventItem[];
  initialDownloads?: DownloadItem[];
  initialGoogleForms?: GoogleFormItem[];
  initialProjects?: VentureProjectItem[];
  initialPitches?: ElevatorPitchItem[];
  stats: AdminStats;
  eventTitle: string;
};

type AdminTab =
  | "dashboard"
  | "users"
  | "registrations"
  | "projects"
  | "gallery"
  | "mentors"
  | "student-council"
  | "governance"
  | "events"
  | "downloads"
  | "google-forms"
  | "pitches"
  | "partners"
  | "analytics"
  | "settings";

const ROLE_LABELS = {
  team_leader: "Team Leader",
  team_member: "Team Member",
  solo: "Solo",
};

async function uploadPhotoFile(file: File): Promise<string | null> {
  const fd = new FormData();
  fd.append("image", file);
  try {
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const json = await res.json();
      return json.url;
    } else {
      const err = await res.json();
      alert(err.error || "Failed to upload photo.");
      return null;
    }
  } catch {
    alert("Error uploading photo file.");
    return null;
  }
}

function AvatarDisplay({ avatar, name, size = 32 }: { avatar?: string; name: string; size?: number }) {
  const isImage = avatar && (avatar.startsWith("/") || avatar.startsWith("http"));
  if (isImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatar}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "1px solid var(--ciel-gold-border)",
          flexShrink: 0,
        }}
      />
    );
  }

  const initials = avatar || name.split(" ").map((n) => n[0]).join("");
  return (
    <div className="member-avatar" style={{ width: size, height: size, fontSize: size * 0.4, margin: 0, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

// ─── ERP SUB-VIEWS ─────────────────────────────────────────────────────────

/** 1. DASHBOARD ERP OVERVIEW */
function ERPDashboardTab({ stats }: { stats: AdminStats }) {
  return (
    <div className="adm-tab-content">
      <div className="adm-section-head">
        <div>
          <h2>Executive ERP Dashboard</h2>
          <p>Real-time institutional metrics &amp; venture incubation pipelines</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="stats-grid" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-icon"><Users size={20} /></div>
          <div>
            <span>Total Registered Users</span>
            <strong>{stats.totalUsers}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><Rocket size={20} /></div>
          <div>
            <span>Active Incubated Teams</span>
            <strong>{stats.teamCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><UserStar size={20} /></div>
          <div>
            <span>Team Leaders</span>
            <strong>{stats.leaderCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><Zap size={20} /></div>
          <div>
            <span>Solo Founders</span>
            <strong>{stats.soloCount}</strong>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid-2" style={{ gap: 24, marginBottom: 32 }}>
        <div className="adm-table-wrap" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, color: "var(--text-white)", marginBottom: 16 }}>Incubation Pipeline Stages</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: "var(--text-secondary)" }}>Idea Screening &amp; Team Formation</span>
                <strong style={{ color: "var(--ciel-gold-bright)" }}>55%</strong>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div style={{ width: "55%", height: "100%", background: "var(--ciel-gold)" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: "var(--text-secondary)" }}>Makerspace Prototyping &amp; Fab</span>
                <strong style={{ color: "#60A5FA" }}>30%</strong>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div style={{ width: "30%", height: "100%", background: "#60A5FA" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: "var(--text-secondary)" }}>Approved Seed Grant &amp; Legal Incorporation</span>
                <strong style={{ color: "#34D399" }}>15%</strong>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div style={{ width: "15%", height: "100%", background: "#34D399" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log Quick Preview */}
        <div className="adm-table-wrap" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, color: "var(--text-white)", marginBottom: 16 }}>Recent System Audit Logs</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 12.5 }}>
            <div style={{ padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 6, border: "1px solid var(--line)" }}>
              <span style={{ color: "var(--ciel-gold-bright)", fontWeight: 600 }}>USER_REGISTERED</span> · Participant account verified
              <div style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 2 }}>System · Just now</div>
            </div>
            <div style={{ padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 6, border: "1px solid var(--line)" }}>
              <span style={{ color: "#60A5FA", fontWeight: 600 }}>SUBMISSION_RECEIVED</span> · New venture problem statement
              <div style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 2 }}>System · 15 mins ago</div>
            </div>
            <div style={{ padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 6, border: "1px solid var(--line)" }}>
              <span style={{ color: "#34D399", fontWeight: 600 }}>SESSION_AUTHENTICATED</span> · Admin master login
              <div style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 2 }}>Admin · 1 hr ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 2. USER MANAGEMENT ERP TAB */
function ERPUsersTab({
  profiles,
  registrations = [],
  projects = [],
}: {
  profiles: ProfileRow[];
  registrations?: RegistrationRow[];
  projects?: VentureProjectItem[];
}) {
  const [query, setQuery] = useState("");
  const [selectedUserForJourney, setSelectedUserForJourney] = useState<ProfileRow | null>(null);
  const [userList, setUserList] = useState(
    profiles.map((p) => ({ ...p, status: "active" as "active" | "suspended" | "pending" }))
  );
  const [grantSaving, setGrantSaving] = useState(false);
  const [grantMsg, setGrantMsg] = useState<string | null>(null);

  const filtered = userList.filter((p) => {
    const q = query.trim().toLowerCase();
    return !q || [p.full_name, p.email ?? "", p.phone ?? ""].some((v) => v.toLowerCase().includes(q));
  });

  async function toggleStatus(id: string, nextStatus: "active" | "suspended") {
    const target = userList.find((u) => u.id === id);
    setUserList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u))
    );

    try {
      await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus, email: target?.email }),
      });
    } catch {
      // Ignore network hiccup
    }
  }

  async function deleteUser(id: string) {
    const target = userList.find((u) => u.id === id);
    const displayName = target?.full_name || target?.email || "this user";

    if (
      !confirm(
        `Are you sure you want to permanently delete user "${displayName}" from CIEL ERP?\n\nThis will permanently remove their account credentials, registrations, and project records.`
      )
    ) {
      return;
    }

    // Optimistically update list
    const previousList = userList;
    setUserList((prev) => prev.filter((u) => u.id !== id));
    if (selectedUserForJourney?.id === id) {
      setSelectedUserForJourney(null);
    }

    try {
      const res = await fetch(
        `/api/admin/users?id=${encodeURIComponent(id)}&email=${encodeURIComponent(target?.email || "")}`,
        { method: "DELETE" }
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        setUserList(previousList);
        alert(json.error || "Failed to delete user from server.");
      }
    } catch {
      setUserList(previousList);
      alert("Network error while attempting to delete user.");
    }
  }

  return (
    <div className="adm-tab-content">
      <div className="adm-section-head">
        <div>
          <h2>User Accounts Management</h2>
          <p>Approve, suspend, or view complete real-time innovator journeys &amp; documents · {filtered.length} total</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="adm-btn adm-btn-outline"
            onClick={() => {
              const headers = ["Full Name", "Email", "Phone", "Status", "Joined Date"];
              const rows = userList.map((u) => [
                u.full_name || "",
                u.email || "",
                u.phone || "",
                u.status || "active",
                u.created_at ? new Date(u.created_at).toLocaleDateString() : "",
              ]);
              const csv = "\uFEFF" + [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `ciel-users-${new Date().toISOString().split("T")[0]}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download size={14} /> Export Users CSV
          </button>
        </div>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search">
          <Search size={16} className="adm-search-icon" />
          <input
            type="search"
            placeholder=""
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="adm-search-input"
          />
        </div>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="adm-empty-cell">No user profiles found.</td>
              </tr>
            ) : (
              filtered.map((p, i) => (
                <tr key={p.id}>
                  <td className="adm-td-muted">{i + 1}</td>
                  <td>
                    <span className="adm-td-primary">{p.full_name || "—"}</span>
                  </td>
                  <td>
                    <span className="adm-td-secondary">{p.email || "—"}</span>
                  </td>
                  <td>
                    <span className="adm-td-secondary">{p.phone || "—"}</span>
                  </td>
                  <td>
                    <span
                      className={`badge ${p.status === "active" ? "badge-brand" : "badge-neutral"}`}
                      style={{ textTransform: "capitalize", fontSize: 11 }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <span className="adm-td-secondary">
                      {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(p.created_at))}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="adm-btn adm-btn-outline"
                        style={{ padding: "4px 8px", fontSize: 11, color: "var(--ciel-gold-bright)", borderColor: "rgba(212, 175, 55, 0.3)" }}
                        onClick={() => setSelectedUserForJourney(p)}
                        title="View Live Innovator Journey & Uploaded Documents"
                      >
                        <Eye size={13} /> View Journey
                      </button>
                      {p.status === "active" ? (
                        <button
                          className="adm-btn adm-btn-outline"
                          style={{ padding: "4px 8px", fontSize: 11, color: "#FF8080" }}
                          onClick={() => toggleStatus(p.id, "suspended")}
                        >
                          <UserX size={13} /> Suspend
                        </button>
                      ) : (
                        <button
                          className="adm-btn adm-btn-outline"
                          style={{ padding: "4px 8px", fontSize: 11, color: "#7ADFA8" }}
                          onClick={() => toggleStatus(p.id, "active")}
                        >
                          <UserCheck size={13} /> Activate
                        </button>
                      )}
                      <button
                        className="adm-btn adm-btn-outline"
                        style={{ padding: "4px 8px", fontSize: 11, color: "#FF8080" }}
                        onClick={() => deleteUser(p.id)}
                        title="Delete user account from CIEL ERP"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Innovator Whole Journey & Documents Modal */}
      {selectedUserForJourney && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="luxury-card"
            style={{
              width: "100%",
              maxWidth: 860,
              maxHeight: "90vh",
              overflowY: "auto",
              padding: 32,
              background: "#0E1118",
              border: "1px solid rgba(212, 175, 55, 0.35)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.9)",
            }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--line)" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div className="card-icon-wrap" style={{ width: 46, height: 46, margin: 0 }}>
                  <Eye size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: 20, color: "var(--text-white)", margin: 0 }}>
                    Innovator Journey &amp; Uploaded Documents
                  </h2>
                  <span style={{ fontSize: 13, color: "var(--ciel-gold-bright)" }}>
                    {selectedUserForJourney.full_name || "Innovator"} · {selectedUserForJourney.email || "No Email"}
                  </span>
                </div>
              </div>
              <button
                className="adm-btn adm-btn-outline"
                onClick={() => setSelectedUserForJourney(null)}
                style={{ padding: "6px 10px" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* User & Venture Identity */}
            {(() => {
              const userReg = registrations.find(
                (r) =>
                  (r.email && selectedUserForJourney.email && r.email.toLowerCase() === selectedUserForJourney.email.toLowerCase()) ||
                  (r.fullName && selectedUserForJourney.full_name && r.fullName.toLowerCase() === selectedUserForJourney.full_name.toLowerCase())
              );

              const userProject =
                projects.find(
                  (p) =>
                    (selectedUserForJourney.email && p.leaderEmail?.toLowerCase() === selectedUserForJourney.email.toLowerCase()) ||
                    (selectedUserForJourney.full_name && p.leaderName?.toLowerCase() === selectedUserForJourney.full_name.toLowerCase()) ||
                    (userReg?.teamName && p.teamName?.toLowerCase() === userReg.teamName.toLowerCase()) ||
                    (p.teamId === selectedUserForJourney.id) ||
                    (p.id === selectedUserForJourney.id)
                ) || projects[0] || null;

              const teamName = userProject?.name || userProject?.teamName || userReg?.teamName || "Venture Project";
              const problemStatement = userProject?.problemStatement || userReg?.problemStatement || "Problem statement pending submission by founder.";
              const role = userReg?.role ? userReg.role.replace("_", " ").toUpperCase() : "INNOVATOR";
              const institution = userReg?.institution || "—";
              const rollNumber = userReg?.rollNumber || "—";
              const stage = userProject?.stage || "idea";
              const progress = userProject?.progress ?? 25;
              const milestones = userProject?.journeyMilestones || [];
              const userDocs = [
                ...(userProject?.documents || []),
                ...(userProject?.pitchDeck && !(userProject?.documents || []).some((d) => d.url === userProject.pitchDeck)
                  ? [
                      {
                        id: "pitch-deck-pdf",
                        title: `${teamName} Pitch Deck`,
                        category: "Pitch Deck",
                        filename: "Pitch_Deck.pdf",
                        format: "PDF",
                        size: "Verified PDF",
                        date: "Recent",
                        url: userProject.pitchDeck,
                      },
                    ]
                  : []),
              ];
              const traction = userProject?.traction || {
                funding: "Not Sanctioned Yet",
                activePilots: "0 Pilots Active",
                iprStatus: "Not Filed",
                mrr: "₹0 / mo",
              };
              const grantStatus = userProject?.grantStatus || "under_review";

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {/* 1. Innovator Profile Grid */}
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--line)", borderRadius: 12, padding: 20 }}>
                    <h3 style={{ fontSize: 15, color: "var(--text-white)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                      <UserCheck size={16} className="text-gold" /> Institutional &amp; Account Overview
                    </h3>
                    <div className="grid-2" style={{ gap: 16 }}>
                      <div>
                        <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block" }}>Full Name</span>
                        <strong style={{ fontSize: 14, color: "var(--text-white)" }}>{selectedUserForJourney.full_name || "—"}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block" }}>Phone Number</span>
                        <strong style={{ fontSize: 14, color: "var(--text-white)" }}>{selectedUserForJourney.phone || "Not provided"}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block" }}>Campus / Institution</span>
                        <strong style={{ fontSize: 14, color: "var(--text-white)" }}>{institution}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block" }}>Student Roll ID</span>
                        <strong style={{ fontSize: 14, color: "var(--text-white)" }}>{rollNumber}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block" }}>Registered Role</span>
                        <span className="badge badge-brand" style={{ fontSize: 11, marginTop: 4 }}>{role}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block" }}>Registration Date</span>
                        <strong style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                          {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(selectedUserForJourney.created_at))}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* 2. Real-Time Venture Project & Stage */}
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--line)", borderRadius: 12, padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <h3 style={{ fontSize: 15, color: "var(--text-white)", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                        <Rocket size={16} className="text-gold" /> Registered Venture Project
                      </h3>
                      <span className="badge badge-brand" style={{ textTransform: "uppercase" }}>
                        STAGE: {stage} ({progress}% PROGRESS)
                      </span>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block" }}>Project / Venture Name</span>
                      <strong style={{ fontSize: 16, color: "var(--ciel-gold-bright)" }}>{teamName}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block" }}>Problem Statement</span>
                      <p style={{ fontSize: 13.5, color: "var(--text-secondary)", margin: "4px 0 0", lineHeight: 1.6 }}>
                        {problemStatement}
                      </p>
                    </div>
                  </div>

                  {/* 3. Real-Time Traction & Metrics */}
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--line)", borderRadius: 12, padding: 20 }}>
                    <h3 style={{ fontSize: 15, color: "var(--text-white)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                      <TrendingUp size={16} className="text-gold" /> Venture Traction &amp; Financials
                    </h3>
                    <div className="grid-2" style={{ gap: 14 }}>
                      <div style={{ padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid var(--line)" }}>
                        <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block" }}>Grant / Funding Status</span>
                        <strong style={{ fontSize: 14, color: "var(--ciel-gold-bright)" }}>{traction.funding || "Not Sanctioned Yet"}</strong>
                      </div>
                      <div style={{ padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid var(--line)" }}>
                        <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block" }}>Active User Pilots</span>
                        <strong style={{ fontSize: 14, color: "#60A5FA" }}>{traction.activePilots || "0 Pilots Active"}</strong>
                      </div>
                      <div style={{ padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid var(--line)" }}>
                        <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block" }}>IPR &amp; Patents</span>
                        <strong style={{ fontSize: 14, color: "#34D399" }}>{traction.iprStatus || "Not Filed"}</strong>
                      </div>
                      <div style={{ padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid var(--line)" }}>
                        <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block" }}>Monthly Revenue / Run-Rate</span>
                        <strong style={{ fontSize: 14, color: "var(--text-white)" }}>{traction.mrr || "₹0 / mo"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* 4. Live Synchronized Journey Milestones */}
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--line)", borderRadius: 12, padding: 20 }}>
                    <h3 style={{ fontSize: 15, color: "var(--text-white)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                      <Calendar size={16} className="text-gold" /> Innovation Journey Milestone Log ({milestones.length})
                    </h3>
                    {milestones.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "24px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px dashed var(--line)" }}>
                        <Clock size={24} className="text-gold" style={{ margin: "0 auto 8px", opacity: 0.8 }} />
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
                          No journey milestones logged yet by this founder in their innovator dashboard.
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {milestones.map((m) => (
                          <div key={m.id} style={{ display: "flex", gap: 14, padding: 14, background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid var(--line)" }}>
                            <CheckCircle2 size={18} style={{ color: "#10B981", marginTop: 2, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                                <strong style={{ fontSize: 13.5, color: "var(--text-white)" }}>{m.title}</strong>
                                <span className="badge badge-brand" style={{ fontSize: 10, textTransform: "uppercase" }}>{m.stage}</span>
                              </div>
                              <p style={{ fontSize: 12.5, color: "var(--text-secondary)", margin: "4px 0" }}>{m.description}</p>
                              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Logged on {m.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 5. Live Uploaded Documents & Pitch Decks */}
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--line)", borderRadius: 12, padding: 20 }}>
                    <h3 style={{ fontSize: 15, color: "var(--text-white)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                      <FileText size={16} className="text-gold" /> Uploaded Venture Documents &amp; Pitch Decks ({userDocs.length})
                    </h3>
                    {userDocs.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "24px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px dashed var(--line)" }}>
                        <FileText size={24} className="text-gold" style={{ margin: "0 auto 8px", opacity: 0.8 }} />
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
                          No documents or pitch decks uploaded yet by this innovator.
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {userDocs.map((doc) => (
                          <div key={doc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid var(--line)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <FileCheck size={22} className="text-gold" />
                              <div>
                                <strong style={{ color: "var(--text-white)", fontSize: 14, display: "block" }}>
                                  {doc.title || doc.filename}
                                </strong>
                                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                  {doc.category} · {doc.format} · {doc.size} · {doc.date}
                                </span>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                              <a
                                className="adm-btn adm-btn-outline"
                                style={{ padding: "6px 12px", fontSize: 12 }}
                                href={doc.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Download size={13} /> View / Download
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 6. Admin Evaluation & Grant Sanction Action */}
                  <div style={{ background: "rgba(212, 175, 55, 0.06)", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: 12, padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <ShieldCheck size={18} className="text-gold" />
                      <strong style={{ color: "var(--ciel-gold-bright)", fontSize: 14.5 }}>
                        CIEL Incubation &amp; Pre-Seed Grant Evaluation
                      </strong>
                    </div>

                    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
                      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Current Status:</span>
                      <span className={`badge ${grantStatus === "approved" ? "badge-brand" : "badge-neutral"}`} style={{ textTransform: "uppercase" }}>
                        {grantStatus.replace("_", " ")}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        className="adm-btn adm-btn-primary"
                        style={{ padding: "6px 12px", fontSize: 12 }}
                        disabled={grantSaving}
                        onClick={async () => {
                          if (!userProject) return;
                          setGrantSaving(true);
                          try {
                            const res = await fetch("/api/admin/projects", {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                projectId: userProject.id,
                                grantStatus: "approved",
                                reviewerNotes: "Incubation Grant Sanctioned by CIEL Evaluation Board.",
                              }),
                            });
                            if (res.ok) {
                              setGrantMsg("Incubation & Pre-Seed Grant Sanctioned!");
                            }
                          } catch {
                            // Ignore
                          } finally {
                            setGrantSaving(false);
                          }
                        }}
                      >
                        ✓ Sanction / Approve Grant
                      </button>

                      <button
                        type="button"
                        className="adm-btn adm-btn-outline"
                        style={{ padding: "6px 12px", fontSize: 12 }}
                        disabled={grantSaving}
                        onClick={async () => {
                          if (!userProject) return;
                          setGrantSaving(true);
                          try {
                            await fetch("/api/admin/projects", {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                projectId: userProject.id,
                                grantStatus: "under_review",
                                reviewerNotes: "Project dossier under formal evaluation by CIEL.",
                              }),
                            });
                            setGrantMsg("Status updated to Under Review.");
                          } catch {
                            // Ignore
                          } finally {
                            setGrantSaving(false);
                          }
                        }}
                      >
                        Set Under Review
                      </button>
                    </div>

                    {grantMsg && (
                      <span style={{ fontSize: 12, color: "#34D399", marginTop: 8, display: "block" }}>
                        {grantMsg}
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Modal Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
              <button className="adm-btn adm-btn-outline" onClick={() => setSelectedUserForJourney(null)}>
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** 3. REGISTRATIONS MANAGEMENT ERP TAB */
function ERPRegistrationsTab({ rows, eventTitle }: { rows: RegistrationRow[]; eventTitle: string }) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | RegistrationRow["role"]>("all");

  const filtered = rows.filter((r) => {
    const roleOk = roleFilter === "all" || r.role === roleFilter;
    const q = query.trim().toLowerCase();
    const textOk =
      !q ||
      [r.fullName, r.email, r.phone, r.institution, r.className, r.rollNumber, r.teamName, r.problemStatement]
        .some((v) => v.toLowerCase().includes(q));
    return roleOk && textOk;
  });

  return (
    <div className="adm-tab-content">
      <div className="adm-section-head">
        <div>
          <h2>Event &amp; Venture Registrations</h2>
          <p>{eventTitle} · {filtered.length} of {rows.length} records</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a className="adm-btn adm-btn-outline" href="/admin/export">
            <Download size={14} /> Export CSV
          </a>
        </div>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search">
          <Search size={16} className="adm-search-icon" />
          <input
            type="search"
            placeholder=""
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="adm-search-input"
          />
        </div>
        <select
          className="adm-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
        >
          <option value="all">All Roles</option>
          <option value="team_leader">Team Leaders</option>
          <option value="team_member">Team Members</option>
          <option value="solo">Solo</option>
        </select>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Participant</th>
              <th>Campus / Class</th>
              <th>Roll No.</th>
              <th>Role</th>
              <th>Team Name</th>
              <th>Problem Statement</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="adm-empty-cell">No registration records found.</td>
              </tr>
            ) : (
              filtered.map((r, i) => (
                <tr key={r.id}>
                  <td className="adm-td-muted">{i + 1}</td>
                  <td>
                    <span className="adm-td-primary">{r.fullName}</span>
                    <span className="adm-td-secondary">{r.email}</span>
                    <span className="adm-td-secondary">{r.phone}</span>
                  </td>
                  <td>
                    <span className="adm-td-primary">{r.institution}</span>
                    <span className="adm-td-secondary">{r.className}</span>
                  </td>
                  <td className="adm-td-mono">{r.rollNumber}</td>
                  <td>
                    <span className={`adm-role-badge adm-role-${r.role}`}>
                      {ROLE_LABELS[r.role]}
                    </span>
                  </td>
                  <td className="adm-td-primary">{r.teamName}</td>
                  <td className="adm-td-problem" title={r.problemStatement}>
                    {r.problemStatement.length > 70 ? `${r.problemStatement.slice(0, 70)}...` : r.problemStatement}
                  </td>
                  <td className="adm-td-secondary">
                    {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(r.createdAt))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** 4. GALLERY MANAGEMENT ERP TAB */
function ERPGalleryTab({ initialImages }: { initialImages: GalleryImage[] }) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedNames(Array.from(files).map((f) => f.name));
      setAlertMsg(null);
    } else {
      setSelectedNames([]);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const files = fileRef.current?.files;
    if (!files || files.length === 0) {
      setAlertMsg({ type: "error", text: "Please choose at least one image file to upload." });
      return;
    }

    setUploading(true);
    setAlertMsg(null);

    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("images", f));

      const res = await fetch("/admin/gallery", { method: "POST", body: fd });
      const json = await res.json().catch(() => null);

      if (res.ok && json?.ok) {
        const newFiles = json.files || [{ filename: json.filename, url: json.url || `/gallery/${json.filename}` }];
        // Optimistically prepend then sync
        setImages((prev) => {
          const existing = new Set(prev.map((p) => p.filename));
          const toAdd = newFiles.filter((n: any) => !existing.has(n.filename));
          return [...toAdd, ...prev];
        });
        setSelectedNames([]);
        if (fileRef.current) fileRef.current.value = "";
        setAlertMsg({
          type: "success",
          text: `✅ Successfully uploaded ${newFiles.length} image${newFiles.length > 1 ? "s" : ""} to the gallery!`,
        });

        // Sync fresh list from server
        try {
          const freshRes = await fetch("/admin/gallery");
          if (freshRes.ok) {
            const freshJson = await freshRes.json();
            if (freshJson.images && Array.isArray(freshJson.images)) {
              setImages(freshJson.images);
            }
          }
        } catch {
          // ignore
        }
      } else {
        setAlertMsg({
          type: "error",
          text: json?.error || "Failed to upload image. Please ensure it is a valid image under 25MB.",
        });
      }
    } catch (err: any) {
      setAlertMsg({
        type: "error",
        text: err?.message || "Network error while uploading image.",
      });
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(filename: string) {
    if (!window.confirm(`Delete image "${filename}" from gallery?`)) return;

    setDeleting(filename);
    try {
      const res = await fetch(`/admin/gallery?file=${encodeURIComponent(filename)}`, { method: "DELETE" });
      const json = await res.json().catch(() => null);
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.filename !== filename));
        setAlertMsg({ type: "success", text: `Removed "${filename}" successfully.` });
      } else {
        setAlertMsg({ type: "error", text: json?.error || "Failed to delete image." });
      }
    } catch {
      setAlertMsg({ type: "error", text: "Network error while deleting image." });
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="adm-tab-content">
      <div className="adm-section-head">
        <div>
          <h2>Gallery &amp; Media Management</h2>
          <p>Upload and manage event images displayed on the public gallery · {images.length} images</p>
        </div>
      </div>

      {alertMsg && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "10px",
            marginBottom: "18px",
            fontSize: "13.5px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: alertMsg.type === "success" ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
            color: alertMsg.type === "success" ? "#34d399" : "#f87171",
            border: `1px solid ${alertMsg.type === "success" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
          }}
        >
          <span>{alertMsg.text}</span>
          <button
            onClick={() => setAlertMsg(null)}
            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: "2px" }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div className="adm-upload-card">
        <div className="adm-upload-icon"><Upload size={22} /></div>
        <div style={{ flex: 1 }}>
          <h3 className="adm-upload-title">Upload New Media</h3>
          <p className="adm-upload-desc">
            {selectedNames.length > 0
              ? `Selected (${selectedNames.length}): ${selectedNames.join(", ")}`
              : "Select one or multiple JPG, PNG, WebP, GIF, or AVIF files (up to 25MB each)"}
          </p>
        </div>
        <form onSubmit={handleUpload} className="adm-upload-form" style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.avif,.svg"
            multiple
            className="adm-file-input"
            id="erp-gallery-file"
            onChange={handleFileSelect}
          />
          <label
            htmlFor="erp-gallery-file"
            className="adm-btn adm-btn-outline adm-file-label"
            style={{ cursor: "pointer", borderColor: selectedNames.length > 0 ? "var(--ciel-gold)" : undefined }}
          >
            <ImageIcon size={14} />
            {selectedNames.length > 0 ? `${selectedNames.length} File${selectedNames.length > 1 ? "s" : ""} Chosen` : "Choose Images"}
          </label>
          <button type="submit" className="adm-btn adm-btn-primary" disabled={uploading || selectedNames.length === 0}>
            {uploading ? <RefreshCw size={14} className="adm-spin" /> : <Upload size={14} />}
            {uploading ? "Uploading..." : "Upload to Gallery"}
          </button>
        </form>
      </div>

      {images.length === 0 ? (
        <div className="adm-gallery-empty">
          <ImageIcon size={38} style={{ opacity: 0.6 }} />
          <h3 style={{ margin: "10px 0 4px", fontSize: "16px", color: "var(--ciel-gold)" }}>No Gallery Images Yet</h3>
          <p>Click &quot;Choose Images&quot; above to upload event photographs to the public gallery.</p>
        </div>
      ) : (
        <div className="adm-gallery-grid">
          {images.map((img) => (
            <div key={img.filename} className="adm-gallery-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.filename} className="adm-gallery-img" />
              <div className="adm-gallery-overlay">
                <span className="adm-gallery-filename">{img.filename}</span>
                <button
                  className="adm-gallery-del"
                  onClick={() => handleDelete(img.filename)}
                  disabled={deleting === img.filename}
                  title="Delete image"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** 5. MENTORS MANAGEMENT ERP TAB */
function ERPMentorsTab({ initialMentors }: { initialMentors: MentorItem[] }) {
  const [mentors, setMentors] = useState<MentorItem[]>(initialMentors);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingMentor, setEditingMentor] = useState<MentorItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    designation: "",
    organization: "",
    category: "industry" as MentorItem["category"],
    expertise: "",
    avatar: "",
    linkedinUrl: "",
  });

  const filtered = mentors.filter((m) => {
    const q = query.trim().toLowerCase();
    return !q || [m.name, m.designation, m.organization, m.category].some((v) => v.toLowerCase().includes(q));
  });

  function resetForm() {
    setShowModal(false);
    setEditingMentor(null);
    setForm({ name: "", designation: "", organization: "", category: "industry", expertise: "", avatar: "", linkedinUrl: "" });
  }

  function handleEditMentor(m: MentorItem) {
    setEditingMentor(m);
    setForm({
      name: m.name,
      designation: m.designation,
      organization: m.organization || "",
      category: m.category || "industry",
      expertise: Array.isArray(m.expertise) ? m.expertise.join(", ") : "",
      avatar: m.avatar || "",
      linkedinUrl: m.linkedinUrl || "",
    });
    setShowModal(true);
  }

  async function handleAddOrEditMentor(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.designation) return;

    setSubmitting(true);
    try {
      const expertiseArr = form.expertise ? form.expertise.split(",").map((s) => s.trim()).filter(Boolean) : [];

      if (editingMentor) {
        const res = await fetch("/api/admin/mentors", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingMentor.id,
            ...form,
            expertise: expertiseArr,
          }),
        });

        if (res.ok) {
          const updated = await res.json();
          setMentors((prev) => prev.map((m) => (m.id === editingMentor.id ? updated : m)));
          resetForm();
        } else {
          const err = await res.json();
          alert(err.error || "Failed to update mentor.");
        }
      } else {
        const res = await fetch("/api/admin/mentors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            expertise: expertiseArr,
          }),
        });

        if (res.ok) {
          const created = await res.json();
          setMentors((prev) => [created, ...prev]);
          resetForm();
        } else {
          const err = await res.json();
          alert(err.error || "Failed to add mentor.");
        }
      }
    } catch {
      alert("Error saving mentor.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to remove this mentor?")) return;
    try {
      const res = await fetch(`/api/admin/mentors?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        setMentors((prev) => prev.filter((m) => m.id !== id));
      }
    } catch {
      alert("Failed to delete mentor.");
    }
  }

  return (
    <div className="adm-tab-content">
      <div className="adm-section-head">
        <div>
          <h2>Mentors &amp; Advisory Directory</h2>
          <p>Manage domain advisors, venture partners, and faculty mentors · {mentors.length} active mentors</p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Add New Mentor
        </button>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search">
          <Search size={16} className="adm-search-icon" />
          <input
            type="search"
            placeholder=""
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="adm-search-input"
          />
        </div>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Mentor</th>
              <th>Designation</th>
              <th>Organization</th>
              <th>Category</th>
              <th>LinkedIn</th>
              <th>Core Expertise</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="adm-empty-cell">No mentors found.</td>
              </tr>
            ) : (
              filtered.map((m, i) => (
                <tr key={m.id}>
                  <td className="adm-td-muted">{i + 1}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <AvatarDisplay avatar={m.avatar} name={m.name} size={32} />
                      <span className="adm-td-primary">{m.name}</span>
                    </div>
                  </td>
                  <td className="adm-td-secondary">{m.designation}</td>
                  <td className="adm-td-secondary">{m.organization}</td>
                  <td>
                    <span className="badge badge-brand" style={{ textTransform: "uppercase", fontSize: 10 }}>
                      {m.category}
                    </span>
                  </td>
                  <td>
                    {m.linkedinUrl ? (
                      <a href={m.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: "#60A5FA", display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                        <LinkedInIcon size={14} /> Profile
                      </a>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: 12 }}>—</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {m.expertise.map((exp) => (
                        <span className="badge badge-neutral" style={{ fontSize: 10 }} key={exp}>
                          {exp}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="adm-btn adm-btn-outline" style={{ padding: "4px 8px" }} title="Edit Mentor" onClick={() => handleEditMentor(m)}>
                        <Edit size={14} />
                      </button>
                      <button className="adm-btn adm-btn-outline" style={{ padding: "4px 8px", color: "#FF8080" }} title="Delete Mentor" onClick={() => handleDelete(m.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 }}>
          <div style={{ background: "var(--charcoal-card)", border: "1px solid var(--ciel-gold-border)", borderRadius: "var(--radius-lg)", padding: 28, width: "100%", maxWidth: 520 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ color: "var(--text-white)", fontSize: 18, margin: 0 }}>
                {editingMentor ? "Edit Mentor / Advisor" : "Add New Mentor / Advisor"}
              </h3>
              <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }} onClick={resetForm}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddOrEditMentor} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="field-label">Full Name *</label>
                <input required className="input" placeholder="" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Designation / Title *</label>
                <input required className="input" placeholder="" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Organization / Firm</label>
                <input className="input" placeholder="" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Category</label>
                <select className="adm-select" style={{ width: "100%" }} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })}>
                  <option value="industry">Industry Expert</option>
                  <option value="investor">Venture Capital / Investor</option>
                  <option value="academic">Academic &amp; Research</option>
                  <option value="alumni">CIEL Alumni Founder</option>
                </select>
              </div>

              <div>
                <label className="field-label">LinkedIn Profile URL (Optional)</label>
                <input className="input" type="url" placeholder="" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Core Expertise (Comma separated)</label>
                <input className="input" placeholder="" value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Photo Image (Upload or URL / Initials)</label>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <label className="adm-btn adm-btn-outline" style={{ cursor: "pointer", fontSize: 12, padding: "6px 12px" }}>
                    <Upload size={14} /> Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadPhotoFile(file);
                          if (url) setForm({ ...form, avatar: url });
                        }
                      }}
                    />
                  </label>
                  <input
                    className="input"
                    style={{ flex: 1, minWidth: 160 }}
                    placeholder=""
                    value={form.avatar}
                    onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  />
                </div>
                {form.avatar && (form.avatar.startsWith("/") || form.avatar.startsWith("http")) && (
                  <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.avatar} alt="Preview" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--ciel-gold)" }} />
                    <span style={{ fontSize: 12, color: "#34D399" }}>✓ Photo Uploaded / Selected</span>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
                <button type="button" className="adm-btn adm-btn-outline" onClick={resetForm}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn-primary" disabled={submitting}>
                  {submitting ? (editingMentor ? "Saving..." : "Adding...") : (editingMentor ? "Save Changes" : "Add Mentor")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/** 6. STUDENT COUNCIL MANAGEMENT ERP TAB */
function ERPCouncilTab({ initialCouncil }: { initialCouncil: StudentCouncilLeadItem[] }) {
  const [council, setCouncil] = useState<StudentCouncilLeadItem[]>(initialCouncil);
  const [councilQuery, setCouncilQuery] = useState("");
  const [functionalQuery, setFunctionalQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalCategory, setModalCategory] = useState<"council" | "functional">("council");
  const [editingLead, setEditingLead] = useState<StudentCouncilLeadItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    branch: "",
    year: "",
    avatar: "",
    linkedinUrl: "",
    category: "council" as "council" | "functional",
    institute: "Chetana's Institue of Management and Research",
  });

  const councilLeads = council.filter((sc) => sc.category !== "functional");
  const functionalLeads = council.filter((sc) => sc.category === "functional");

  const filteredCouncil = councilLeads.filter((sc) => {
    const q = councilQuery.trim().toLowerCase();
    return !q || [sc.name, sc.role, sc.branch, sc.year, sc.institute].some((v) => (v || "").toLowerCase().includes(q));
  });

  const filteredFunctional = functionalLeads.filter((sc) => {
    const q = functionalQuery.trim().toLowerCase();
    return !q || [sc.name, sc.role, sc.branch, sc.year, sc.institute].some((v) => (v || "").toLowerCase().includes(q));
  });

  function resetCouncilForm() {
    setShowModal(false);
    setEditingLead(null);
    setForm({
      name: "",
      role: "",
      branch: "",
      year: "",
      avatar: "",
      linkedinUrl: "",
      category: "council",
      institute: "Chetana's Institue of Management and Research",
    });
  }

  function openAddModal(cat: "council" | "functional") {
    setEditingLead(null);
    setModalCategory(cat);
    setForm({
      name: "",
      role: "",
      branch: "",
      year: "3rd Year",
      avatar: "",
      linkedinUrl: "",
      category: cat,
      institute: "Chetana's Institue of Management and Research",
    });
    setShowModal(true);
  }

  function handleEditLead(sc: StudentCouncilLeadItem) {
    setEditingLead(sc);
    const cat = (sc.category || "council") as "council" | "functional";
    setModalCategory(cat);
    setForm({
      name: sc.name,
      role: sc.role,
      branch: sc.branch || "",
      year: sc.year || "",
      avatar: sc.avatar || "",
      linkedinUrl: sc.linkedinUrl || "",
      category: cat,
      institute: sc.institute || "Chetana's Institue of Management and Research",
    });
    setShowModal(true);
  }

  async function handleAddOrEditLead(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.role) return;

    setSubmitting(true);
    try {
      if (editingLead) {
        const res = await fetch("/api/admin/student-council", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingLead.id || editingLead.name,
            ...form,
            category: modalCategory,
          }),
        });

        if (res.ok) {
          const updated = await res.json();
          setCouncil((prev) =>
            prev.map((item) =>
              (item.id && item.id === editingLead.id) || item.name.toLowerCase() === editingLead.name.toLowerCase()
                ? updated
                : item
            )
          );
          resetCouncilForm();
        } else {
          const err = await res.json();
          alert(err.error || "Failed to update student leader.");
        }
      } else {
        const res = await fetch("/api/admin/student-council", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            category: modalCategory,
          }),
        });

        if (res.ok) {
          const created = await res.json();
          setCouncil((prev) => [...prev, created]);
          resetCouncilForm();
        } else {
          const err = await res.json();
          alert(err.error || "Failed to add student leader.");
        }
      }
    } catch {
      alert("Error saving student leader.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to remove this student leader?")) return;
    try {
      const res = await fetch(`/api/admin/student-council?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        setCouncil((prev) => prev.filter((sc) => sc.id !== id && sc.name !== id));
      }
    } catch {
      alert("Failed to delete student leader.");
    }
  }

  const FUNCTIONAL_TRACKS = [
    "Student Lead — 1. Innovation & Research",
    "Student Lead — 2. Incubation & Start-up Support",
    "Student Lead — 3. Skill Development & Training",
    "Student Lead — 4. Industry & Investor Relations",
    "Student Lead — 5. Events & Outreach",
    "Student Lead — 6. Monitoring & Evaluation",
  ];

  return (
    <div className="adm-tab-content">
      {/* ─── SECTION 1: STUDENT INNOVATION COUNCIL (SIC) ─── */}
      <div className="adm-section-head">
        <div>
          <h2>Student Innovation Council (SIC)</h2>
          <p>Manage elected student office bearers, hackathon leads &amp; lab managers · {councilLeads.length} council leads</p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={() => openAddModal("council")}>
          <Plus size={15} /> Add Council Lead
        </button>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search">
          <Search size={16} className="adm-search-icon" />
          <input
            type="search"
            placeholder="Search council leaders by name, designation, branch..."
            value={councilQuery}
            onChange={(e) => setCouncilQuery(e.target.value)}
            className="adm-search-input"
          />
        </div>
      </div>

      <div className="adm-table-wrap" style={{ marginBottom: 48 }}>
        <table className="adm-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Leader</th>
              <th>Council Designation / Role</th>
              <th>Branch / Department</th>
              <th>Academic Year</th>
              <th>LinkedIn</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCouncil.length === 0 ? (
              <tr>
                <td colSpan={7} className="adm-empty-cell">No student council members found.</td>
              </tr>
            ) : (
              filteredCouncil.map((sc, i) => (
                <tr key={sc.id || sc.name}>
                  <td className="adm-td-muted">{i + 1}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <AvatarDisplay avatar={sc.avatar} name={sc.name} size={32} />
                      <span className="adm-td-primary">{sc.name}</span>
                    </div>
                  </td>
                  <td className="adm-td-primary" style={{ color: "var(--ciel-gold-bright)" }}>{sc.role}</td>
                  <td className="adm-td-secondary">{sc.branch}</td>
                  <td className="adm-td-secondary">{sc.year}</td>
                  <td>
                    {sc.linkedinUrl ? (
                      <a href={sc.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: "#60A5FA", display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                        <LinkedInIcon size={14} /> Profile
                      </a>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: 12 }}>—</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="adm-btn adm-btn-outline" style={{ padding: "4px 8px" }} title="Edit Member" onClick={() => handleEditLead(sc)}>
                        <Edit size={14} />
                      </button>
                      <button className="adm-btn adm-btn-outline" style={{ padding: "4px 8px", color: "#FF8080" }} title="Delete Member" onClick={() => handleDelete(sc.id || sc.name)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ─── SECTION 2: STUDENT'S FUNCTIONAL COMMITTEE (SEPARATE SECTION) ─── */}
      <div className="adm-section-head" style={{ paddingTop: 28, borderTop: "1px solid var(--ciel-gold-border)" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--ciel-gold-bright)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            <Award size={15} /> Student Operational Tracks
          </div>
          <h2>Student&apos;s Functional Committee</h2>
          <p>Manage student coordinators &amp; track leads across the 6 core innovation sections · {functionalLeads.length} student members</p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={() => openAddModal("functional")}>
          <Plus size={15} /> Add Member
        </button>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search">
          <Search size={16} className="adm-search-icon" />
          <input
            type="search"
            placeholder="Search student functional members by name, section, branch..."
            value={functionalQuery}
            onChange={(e) => setFunctionalQuery(e.target.value)}
            className="adm-search-input"
          />
        </div>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Leader</th>
              <th>Functional Committee Section / Role</th>
              <th>Branch / Department</th>
              <th>Academic Year</th>
              <th>LinkedIn</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFunctional.length === 0 ? (
              <tr>
                <td colSpan={7} className="adm-empty-cell" style={{ padding: "36px 16px", textAlign: "center" }}>
                  <Award size={30} style={{ color: "var(--ciel-gold)", margin: "0 auto 10px", opacity: 0.8 }} />
                  <div style={{ color: "var(--text-white)", fontWeight: 600, fontSize: 15, marginBottom: 4 }}>No Student&apos;s Functional Committee members added yet.</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: 13, maxWidth: 500, margin: "0 auto" }}>
                    Click &ldquo;+ Add Member&rdquo; above to assign student coordinators to CIEL&apos;s 6 core innovation sections.
                  </div>
                </td>
              </tr>
            ) : (
              filteredFunctional.map((sc, i) => (
                <tr key={sc.id || sc.name}>
                  <td className="adm-td-muted">{i + 1}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <AvatarDisplay avatar={sc.avatar} name={sc.name} size={32} />
                      <span className="adm-td-primary">{sc.name}</span>
                    </div>
                  </td>
                  <td className="adm-td-primary" style={{ color: "var(--ciel-gold-bright)" }}>
                    <span className="badge badge-brand" style={{ fontSize: 12 }}>{sc.role}</span>
                  </td>
                  <td className="adm-td-secondary">{sc.branch}</td>
                  <td className="adm-td-secondary">{sc.year}</td>
                  <td>
                    {sc.linkedinUrl ? (
                      <a href={sc.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: "#60A5FA", display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                        <LinkedInIcon size={14} /> Profile
                      </a>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: 12 }}>—</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="adm-btn adm-btn-outline" style={{ padding: "4px 8px" }} title="Edit Member" onClick={() => handleEditLead(sc)}>
                        <Edit size={14} />
                      </button>
                      <button className="adm-btn adm-btn-outline" style={{ padding: "4px 8px", color: "#FF8080" }} title="Delete Member" onClick={() => handleDelete(sc.id || sc.name)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 }}>
          <div style={{ background: "var(--charcoal-card)", border: "1px solid var(--ciel-gold-border)", borderRadius: "var(--radius-lg)", padding: 28, width: "100%", maxWidth: 480 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ color: "var(--text-white)", fontSize: 18, margin: 0 }}>
                {editingLead
                  ? (modalCategory === "functional" ? "Edit Functional Committee Member" : "Edit Student Council Member")
                  : (modalCategory === "functional" ? "Add Member to Student's Functional Committee" : "Add Member to Student Innovation Council")}
              </h3>
              <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }} onClick={resetCouncilForm}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddOrEditLead} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="field-label">Target Committee *</label>
                <input
                  className="input"
                  disabled
                  value={modalCategory === "functional" ? "Student's Functional Committee" : "Student Innovation Council (SIC)"}
                  style={{ opacity: 0.9, background: "rgba(255,255,255,0.05)", cursor: "not-allowed" }}
                />
              </div>

              <div>
                <label className="field-label">Institute / College *</label>
                <select
                  className="adm-select"
                  style={{ width: "100%" }}
                  value={form.institute}
                  onChange={(e) => setForm({ ...form, institute: e.target.value })}
                  required
                >
                  <option value="Chetana's Institue of Management and Research">
                    Chetana&apos;s Institue of Management and Research (CIMR)
                  </option>
                  <option value="Chetana's R.K Institute of Management and Research">
                    Chetana&apos;s R.K Institute of Management and Research (CRKIMR)
                  </option>
                  <option value="Chetana's SFC">
                    Chetana&apos;s SFC (Self-Financing Courses)
                  </option>
                  <option value="Chetana's H.S college of commerce and Smt. Kusumtai Chaudhari College of Arts">
                    Chetana&apos;s H.S college of commerce and Smt. Kusumtai Chaudhari College of Arts
                  </option>
                </select>
              </div>

              <div>
                <label className="field-label">Member Name *</label>
                <input required className="input" placeholder="" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>

              {modalCategory === "functional" ? (
                <div>
                  <label className="field-label">Functional Committee Section *</label>
                  <select
                    className="adm-select"
                    style={{ width: "100%", marginBottom: 8 }}
                    value={
                      [
                        "1: Innovation and Research",
                        "2: Incubation and start-up support",
                        "3: Skill Development and Training",
                        "4: Industry and Investor",
                        "5: Events and OutReach",
                        "6: Monitoring And eveluation",
                      ].find((s) =>
                        form.role.toLowerCase().includes(s.split(":")[1]?.trim().toLowerCase())
                      ) || ""
                    }
                    onChange={(e) => {
                      const sec = e.target.value;
                      if (sec) {
                        setForm({ ...form, role: `Student Lead — ${sec}` });
                      }
                    }}
                    required
                  >
                    <option value="">-- Select One of 6 Sections --</option>
                    <option value="1: Innovation and Research">Section 1: Innovation and Research</option>
                    <option value="2: Incubation and start-up support">Section 2: Incubation and start-up support</option>
                    <option value="3: Skill Development and Training">Section 3: Skill Development and Training</option>
                    <option value="4: Industry and Investor">Section 4: Industry and Investor</option>
                    <option value="5: Events and OutReach">Section 5: Events and OutReach</option>
                    <option value="6: Monitoring And eveluation">Section 6: Monitoring And eveluation</option>
                  </select>

                  <label className="field-label" style={{ fontSize: 12 }}>Role / Designation Format</label>
                  <input
                    required
                    className="input"
                    placeholder=""
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  />
                </div>
              ) : (
                <div>
                  <label className="field-label">Council Designation / Role *</label>
                  <input required className="input" placeholder="" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="field-label">Department / Branch</label>
                  <input className="input" placeholder="" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} />
                </div>
                <div>
                  <label className="field-label">Academic Year</label>
                  <input className="input" placeholder="" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="field-label">LinkedIn Profile URL (Optional)</label>
                <input className="input" type="url" placeholder="" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Photo Image (Upload or URL / Initials)</label>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <label className="adm-btn adm-btn-outline" style={{ cursor: "pointer", fontSize: 12, padding: "6px 12px" }}>
                    <Upload size={14} /> Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadPhotoFile(file);
                          if (url) setForm({ ...form, avatar: url });
                        }
                      }}
                    />
                  </label>
                  <input
                    className="input"
                    style={{ flex: 1, minWidth: 160 }}
                    placeholder=""
                    value={form.avatar}
                    onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  />
                </div>
                {form.avatar && (form.avatar.startsWith("/") || form.avatar.startsWith("http")) && (
                  <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.avatar} alt="Preview" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--ciel-gold)" }} />
                    <span style={{ fontSize: 12, color: "#34D399" }}>✓ Photo Uploaded / Selected</span>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
                <button type="button" className="adm-btn adm-btn-outline" onClick={resetCouncilForm}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn-primary" disabled={submitting}>
                  {submitting ? (editingLead ? "Saving..." : "Adding...") : (editingLead ? "Save Changes" : "Add Member")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/** 7. GOVERNANCE MANAGEMENT ERP TAB */
function ERPGovernanceTab({ initialGovernance }: { initialGovernance: GovernanceCommitteeItem[] }) {
  const [governance, setGovernance] = useState<GovernanceCommitteeItem[]>(initialGovernance);
  const [showCommitteeModal, setShowCommitteeModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<{ committeeName: string; name: string } | null>(null);
  const [editingCommittee, setEditingCommittee] = useState<string | null>(null);
  const [selectedCommittee, setSelectedCommittee] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [commForm, setCommForm] = useState({ name: "", description: "" });
  const [memberForm, setMemberForm] = useState({ committeeName: "", name: "", role: "", linkedinUrl: "", avatar: "" });

  function resetCommForm() {
    setShowCommitteeModal(false);
    setEditingCommittee(null);
    setCommForm({ name: "", description: "" });
  }

  function resetMemberForm() {
    setShowMemberModal(false);
    setEditingMember(null);
    setMemberForm({ committeeName: "", name: "", role: "", linkedinUrl: "", avatar: "" });
  }

  function handleEditCommittee(comm: GovernanceCommitteeItem) {
    setEditingCommittee(comm.name);
    setCommForm({ name: comm.name, description: comm.description });
    setShowCommitteeModal(true);
  }

  function handleEditMember(commName: string, m: { name: string; role: string; avatar?: string; linkedinUrl?: string }) {
    setEditingMember({ committeeName: commName, name: m.name });
    setSelectedCommittee(commName);
    setMemberForm({
      committeeName: commName,
      name: m.name,
      role: m.role,
      linkedinUrl: m.linkedinUrl || "",
      avatar: m.avatar || "",
    });
    setShowMemberModal(true);
  }

  async function handleAddOrEditCommittee(e: React.FormEvent) {
    e.preventDefault();
    if (!commForm.name) return;

    setSubmitting(true);
    try {
      if (editingCommittee) {
        const res = await fetch("/api/admin/governance", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update_committee",
            originalCommitteeName: editingCommittee,
            committeeName: commForm.name,
            description: commForm.description,
          }),
        });

        if (res.ok) {
          setGovernance((prev) =>
            prev.map((g) =>
              g.name.toLowerCase() === editingCommittee.toLowerCase()
                ? { ...g, name: commForm.name, description: commForm.description }
                : g
            )
          );
          resetCommForm();
        } else {
          const err = await res.json();
          alert(err.error || "Failed to update committee.");
        }
      } else {
        const res = await fetch("/api/admin/governance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "add_committee", committeeName: commForm.name, description: commForm.description }),
        });

        if (res.ok) {
          const created = await res.json();
          setGovernance((prev) => {
            const idx = prev.findIndex((g) => g.name.toLowerCase() === commForm.name.toLowerCase());
            if (idx >= 0) {
              const updated = [...prev];
              updated[idx].description = commForm.description;
              return updated;
            }
            return [...prev, created];
          });
          resetCommForm();
        } else {
          const err = await res.json();
          alert(err.error || "Failed to add committee.");
        }
      }
    } catch {
      alert("Error saving committee.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddOrEditMember(e: React.FormEvent) {
    e.preventDefault();
    const cName = memberForm.committeeName || selectedCommittee || governance[0]?.name;
    if (!cName) {
      alert("Please select or add a committee first.");
      return;
    }
    if (!memberForm.name.trim()) {
      alert("Please enter the member's name.");
      return;
    }
    if (!memberForm.role.trim()) {
      alert("Please specify the member's role.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingMember) {
        const res = await fetch("/api/admin/governance", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update_member",
            committeeName: editingMember.committeeName,
            originalMemberName: editingMember.name,
            memberName: memberForm.name.trim(),
            role: memberForm.role.trim(),
            linkedinUrl: memberForm.linkedinUrl?.trim() || "",
            avatar: memberForm.avatar?.trim() || "",
          }),
        });

        if (res.ok) {
          setGovernance((prev) =>
            prev.map((g) => {
              if (g.name.toLowerCase() === editingMember.committeeName.toLowerCase()) {
                return {
                  ...g,
                  members: g.members.map((m) =>
                    m.name.toLowerCase() === editingMember.name.toLowerCase()
                      ? {
                          name: memberForm.name.trim(),
                          role: memberForm.role.trim(),
                          linkedinUrl: memberForm.linkedinUrl?.trim() || undefined,
                          avatar: memberForm.avatar?.trim() || undefined,
                        }
                      : m
                  ),
                };
              }
              return g;
            })
          );
          resetMemberForm();
        } else {
          const err = await res.json();
          alert(err.error || "Failed to update member.");
        }
      } else {
        const res = await fetch("/api/admin/governance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "add_member",
            committeeName: cName,
            memberName: memberForm.name.trim(),
            role: memberForm.role.trim(),
            linkedinUrl: memberForm.linkedinUrl?.trim() || "",
            avatar: memberForm.avatar?.trim() || "",
          }),
        });

        if (res.ok) {
          setGovernance((prev) =>
            prev.map((g) => {
              if (g.name.toLowerCase() === cName.toLowerCase()) {
                return {
                  ...g,
                  members: [...g.members, { name: memberForm.name.trim(), role: memberForm.role.trim(), linkedinUrl: memberForm.linkedinUrl?.trim() || undefined, avatar: memberForm.avatar?.trim() || undefined }],
                };
              }
              return g;
            })
          );
          resetMemberForm();
        } else {
          const err = await res.json();
          alert(err.error || "Failed to add member.");
        }
      }
    } catch {
      alert("Error saving member.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteMember(committeeName: string, memberName: string) {
    if (!confirm(`Delete ${memberName} from ${committeeName}?`)) return;
    try {
      const res = await fetch(`/api/admin/governance?committee=${encodeURIComponent(committeeName)}&member=${encodeURIComponent(memberName)}`, { method: "DELETE" });
      if (res.ok) {
        setGovernance((prev) =>
          prev.map((g) => {
            if (g.name.toLowerCase() === committeeName.toLowerCase()) {
              return { ...g, members: g.members.filter((m) => m.name.toLowerCase() !== memberName.toLowerCase()) };
            }
            return g;
          })
        );
      }
    } catch {
      alert("Failed to delete member.");
    }
  }

  async function handleDeleteCommittee(committeeName: string) {
    if (!confirm(`Are you sure you want to delete the entire committee "${committeeName}"?`)) return;
    try {
      const res = await fetch(`/api/admin/governance?type=committee&committee=${encodeURIComponent(committeeName)}`, { method: "DELETE" });
      if (res.ok) {
        setGovernance((prev) => prev.filter((g) => g.name.toLowerCase() !== committeeName.toLowerCase()));
      }
    } catch {
      alert("Failed to delete committee.");
    }
  }

  return (
    <div className="adm-tab-content">
      <div className="adm-section-head">
        <div>
          <h2>Governance &amp; Committees Management</h2>
          <p>Institutional steering board, incubation evaluation panel, and IPR ethics cell</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="adm-btn adm-btn-outline" onClick={() => setShowCommitteeModal(true)}>
            <Plus size={14} /> Add Committee
          </button>
          <button
            className="adm-btn adm-btn-primary"
            onClick={() => {
              const def = governance[0]?.name || "";
              setSelectedCommittee(def);
              setMemberForm({ committeeName: def, name: "", role: "", linkedinUrl: "", avatar: "" });
              setShowMemberModal(true);
            }}
          >
            <UserPlus size={14} /> Add Committee Member
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {governance.map((comm) => (
          <div key={comm.name} className="adm-table-wrap" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, color: "var(--text-white)", margin: 0 }}>{comm.name}</h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{comm.description}</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="adm-btn adm-btn-outline"
                  style={{ padding: "4px 8px" }}
                  title="Edit Committee"
                  onClick={() => handleEditCommittee(comm)}
                >
                  <Edit size={13} />
                </button>
                <button
                  className="adm-btn adm-btn-outline"
                  style={{ padding: "4px 10px", fontSize: 12 }}
                  onClick={() => {
                    setSelectedCommittee(comm.name);
                    setMemberForm({ committeeName: comm.name, name: "", role: "", linkedinUrl: "", avatar: "" });
                    setShowMemberModal(true);
                  }}
                >
                  <UserPlus size={13} /> Add Member
                </button>
                <button
                  className="adm-btn adm-btn-outline"
                  style={{ padding: "4px 8px", color: "#FF8080" }}
                  onClick={() => handleDeleteCommittee(comm.name)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <div className="grid-3" style={{ gap: 12 }}>
              {comm.members.map((m) => (
                <div
                  key={m.name}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid var(--line)",
                    borderRadius: "var(--radius-sm)",
                    padding: 14,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <AvatarDisplay avatar={m.avatar} name={m.name} size={32} />
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <strong style={{ display: "block", color: "var(--text-white)", fontSize: 14 }}>{m.name}</strong>
                        {m.linkedinUrl && (
                          <a href={m.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: "#60A5FA", display: "inline-flex" }} title="LinkedIn Profile">
                            <LinkedInIcon size={13} />
                          </a>
                        )}
                      </div>
                      <span style={{ fontSize: 12, color: "var(--ciel-gold-bright)" }}>{m.role}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    <button
                      style={{ background: "none", border: "none", color: "var(--ciel-gold-bright)", cursor: "pointer", padding: 4 }}
                      onClick={() => handleEditMember(comm.name, m)}
                      title="Edit Member"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      style={{ background: "none", border: "none", color: "#FF8080", cursor: "pointer", padding: 4 }}
                      onClick={() => handleDeleteMember(comm.name, m.name)}
                      title="Remove Member"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit Committee */}
      {showCommitteeModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 }}>
          <div style={{ background: "var(--charcoal-card)", border: "1px solid var(--ciel-gold-border)", borderRadius: "var(--radius-lg)", padding: 28, width: "100%", maxWidth: 480 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ color: "var(--text-white)", fontSize: 18, margin: 0 }}>
                {editingCommittee ? "Edit Governance Committee" : "Add Governance Committee"}
              </h3>
              <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }} onClick={resetCommForm}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddOrEditCommittee} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="field-label">Committee Name *</label>
                <input required className="input" placeholder="" value={commForm.name} onChange={(e) => setCommForm({ ...commForm, name: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Description / Scope</label>
                <textarea className="input" rows={3} placeholder="" value={commForm.description} onChange={(e) => setCommForm({ ...commForm, description: e.target.value })} />
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
                <button type="button" className="adm-btn adm-btn-outline" onClick={resetCommForm}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn-primary" disabled={submitting}>
                  {submitting ? (editingCommittee ? "Saving..." : "Adding...") : (editingCommittee ? "Save Changes" : "Add Committee")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add/Edit Member */}
      {showMemberModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 }}>
          <div style={{ background: "var(--charcoal-card)", border: "1px solid var(--ciel-gold-border)", borderRadius: "var(--radius-lg)", padding: 28, width: "100%", maxWidth: 480 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ color: "var(--text-white)", fontSize: 18, margin: 0 }}>
                {editingMember ? "Edit Member in Committee" : "Add Member to Governance Committee"}
              </h3>
              <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }} onClick={resetMemberForm}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddOrEditMember} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="field-label">Target Committee *</label>
                <select
                  className="adm-select"
                  style={{ width: "100%" }}
                  value={memberForm.committeeName || selectedCommittee}
                  onChange={(e) => {
                    setSelectedCommittee(e.target.value);
                    setMemberForm({ ...memberForm, committeeName: e.target.value });
                  }}
                >
                  {governance.map((g) => (
                    <option key={g.name} value={g.name}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label">Member Name *</label>
                <input required className="input" placeholder="" value={memberForm.name} onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} />
              </div>

              {((memberForm.committeeName || selectedCommittee).toLowerCase().includes("functional")) ? (
                <div>
                  <label className="field-label">Functional Committee Section *</label>
                  <select
                    className="adm-select"
                    style={{ width: "100%", marginBottom: 8 }}
                    value={
                      [
                        "1: Innovation and Research",
                        "2: Incubation and start-up support",
                        "3: Skill Development and Training",
                        "4: Industry and Investor",
                        "5: Events and OutReach",
                        "6: Monitoring And eveluation",
                      ].find((s) =>
                        memberForm.role.toLowerCase().includes(s.split(":")[1]?.trim().toLowerCase())
                      ) || ""
                    }
                    onChange={(e) => {
                      const sec = e.target.value;
                      if (sec) {
                        setMemberForm({ ...memberForm, role: `Lead — ${sec}` });
                      }
                    }}
                    required
                  >
                    <option value="">-- Select One of 6 Sections --</option>
                    <option value="1: Innovation and Research">Section 1: Innovation and Research</option>
                    <option value="2: Incubation and start-up support">Section 2: Incubation and start-up support</option>
                    <option value="3: Skill Development and Training">Section 3: Skill Development and Training</option>
                    <option value="4: Industry and Investor">Section 4: Industry and Investor</option>
                    <option value="5: Events and OutReach">Section 5: Events and OutReach</option>
                    <option value="6: Monitoring And eveluation">Section 6: Monitoring And eveluation</option>
                  </select>

                  <label className="field-label" style={{ fontSize: 12 }}>Role / Designation Format</label>
                  <input
                    required
                    className="input"
                    placeholder=""
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                  />
                </div>
              ) : (
                <div>
                  <label className="field-label">Designation / Role in Committee *</label>
                  <input required className="input" placeholder="" value={memberForm.role} onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })} />
                </div>
              )}

              <div>
                <label className="field-label">LinkedIn Profile URL (Optional)</label>
                <input className="input" type="url" placeholder="" value={memberForm.linkedinUrl} onChange={(e) => setMemberForm({ ...memberForm, linkedinUrl: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Photo Image (Upload or URL / Initials)</label>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <label className="adm-btn adm-btn-outline" style={{ cursor: "pointer", fontSize: 12, padding: "6px 12px" }}>
                    <Upload size={14} /> Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadPhotoFile(file);
                          if (url) setMemberForm({ ...memberForm, avatar: url });
                        }
                      }}
                    />
                  </label>
                  <input
                    className="input"
                    style={{ flex: 1, minWidth: 160 }}
                    placeholder=""
                    value={memberForm.avatar || ""}
                    onChange={(e) => setMemberForm({ ...memberForm, avatar: e.target.value })}
                  />
                </div>
                {memberForm.avatar && (memberForm.avatar.startsWith("/") || memberForm.avatar.startsWith("http")) && (
                  <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={memberForm.avatar} alt="Preview" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--ciel-gold)" }} />
                    <span style={{ fontSize: 12, color: "#34D399" }}>✓ Photo Uploaded / Selected</span>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
                <button type="button" className="adm-btn adm-btn-outline" onClick={resetMemberForm}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn-primary" disabled={submitting}>
                  {submitting ? (editingMember ? "Saving..." : "Adding...") : (editingMember ? "Save Changes" : "Add Member")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/** 8. VENTURE PROJECTS & INNOVATION JOURNEY ERP TAB */
function ERPProjectsTab({ initialProjects = [] }: { initialProjects?: VentureProjectItem[] }) {
  const [projects, setProjects] = useState<VentureProjectItem[]>(initialProjects);
  const [query, setQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<VentureProjectItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    stage: "prototype" as VentureProjectItem["stage"],
    progress: 50,
    grantStatus: "under_review" as VentureProjectItem["grantStatus"],
    reviewerNotes: "",
  });

  // Sync projects from API
  useEffect(() => {
    fetch("/api/admin/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = projects.filter((p) => {
    const q = query.trim().toLowerCase();
    return !q || [p.name, p.teamName, p.leaderName, p.problemStatement, p.stage].some((v) => v?.toLowerCase().includes(q));
  });

  async function handleUpdateReview(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProject) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProject.id,
          ...reviewForm,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.project) {
          setProjects((prev) => prev.map((p) => (p.id === json.project.id ? json.project : p)));
        }
        setSelectedProject(null);
      } else {
        alert("Failed to update project review.");
      }
    } catch {
      alert("Error updating review.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="adm-tab-content">
      <div className="adm-section-head">
        <div>
          <h2>Venture Projects &amp; Innovation Journey ERP</h2>
          <p>Monitor startup progress, review innovation stages, and allocate seed grant approvals · {projects.length} active ventures</p>
        </div>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search">
          <Search size={16} className="adm-search-icon" />
          <input
            type="search"
            placeholder=""
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="adm-search-input"
          />
        </div>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Venture Name</th>
              <th>Problem Summary</th>
              <th>Stage</th>
              <th>Progress</th>
              <th>Grant Status</th>
              <th>Pitch Deck</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="adm-empty-cell">No venture projects found.</td>
              </tr>
            ) : (
              filtered.map((p, i) => (
                <tr key={p.id}>
                  <td className="adm-td-muted">{i + 1}</td>
                  <td>
                    <span className="adm-td-primary">{p.name}</span>
                    <span className="adm-td-secondary">Team: {p.teamName}</span>
                  </td>
                  <td className="adm-td-problem" title={p.problemStatement}>
                    {p.problemStatement.length > 60 ? `${p.problemStatement.slice(0, 60)}...` : p.problemStatement}
                  </td>
                  <td>
                    <span className="badge badge-brand" style={{ textTransform: "uppercase", fontSize: 10 }}>
                      {p.stage}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 60, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                        <div style={{ width: `${p.progress}%`, height: "100%", background: "var(--ciel-gold-bright)" }} />
                      </div>
                      <span style={{ fontSize: 11, color: "var(--text-white)" }}>{p.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        fontSize: 10,
                        textTransform: "uppercase",
                        background: p.grantStatus === "approved" || p.grantStatus === "grant_awarded" ? "rgba(16,185,129,0.15)" : "rgba(212,175,55,0.15)",
                        color: p.grantStatus === "approved" || p.grantStatus === "grant_awarded" ? "#10B981" : "var(--ciel-gold-bright)",
                        border: `1px solid ${p.grantStatus === "approved" || p.grantStatus === "grant_awarded" ? "#10B981" : "var(--ciel-gold-border)"}`,
                      }}
                    >
                      {p.grantStatus ? p.grantStatus.replace("_", " ") : "under review"}
                    </span>
                  </td>
                  <td>
                    {p.pitchDeck ? (
                      <a href={p.pitchDeck} target="_blank" rel="noreferrer" style={{ color: "#60A5FA", display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                        <FileText size={14} /> PDF
                      </a>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: 12 }}>Pending</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="adm-btn adm-btn-primary"
                      style={{ padding: "4px 10px", fontSize: 11 }}
                      onClick={() => {
                        setSelectedProject(p);
                        setReviewForm({
                          stage: p.stage || "prototype",
                          progress: p.progress ?? 50,
                          grantStatus: p.grantStatus || "under_review",
                          reviewerNotes: p.reviewerNotes || "",
                        });
                      }}
                    >
                      Review &amp; Approval
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Review & Approval Modal */}
      {selectedProject && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 }}>
          <form onSubmit={handleUpdateReview} style={{ background: "var(--charcoal-card)", border: "1px solid var(--ciel-gold-border)", borderRadius: "var(--radius-lg)", padding: 28, width: "100%", maxWidth: 520 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ color: "var(--text-white)", fontSize: 18, margin: 0 }}>Review Venture: {selectedProject.name}</h3>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Team: {selectedProject.teamName}</span>
              </div>
              <button type="button" style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }} onClick={() => setSelectedProject(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
              <div>
                <label className="field-label">Innovation Stage</label>
                <select className="adm-select" style={{ width: "100%" }} value={reviewForm.stage} onChange={(e) => setReviewForm({ ...reviewForm, stage: e.target.value as any })}>
                  {["idea", "prototype", "validation", "incubation", "funding", "market", "scale"].map((s) => (
                    <option key={s} value={s}>{s.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label">Overall Progress ({reviewForm.progress}%)</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={reviewForm.progress}
                  onChange={(e) => setReviewForm({ ...reviewForm, progress: parseInt(e.target.value) })}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label className="field-label">Incubation Grant &amp; Approval Status</label>
                <select className="adm-select" style={{ width: "100%" }} value={reviewForm.grantStatus} onChange={(e) => setReviewForm({ ...reviewForm, grantStatus: e.target.value as any })}>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved for Incubation</option>
                  <option value="grant_awarded">Seed Grant Awarded (up to ₹5L)</option>
                  <option value="needs_revision">Needs Revision / Resubmission</option>
                </select>
              </div>

              <div>
                <label className="field-label">Admin Reviewer Feedback / Notes</label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder=""
                  value={reviewForm.reviewerNotes}
                  onChange={(e) => setReviewForm({ ...reviewForm, reviewerNotes: e.target.value })}
                />
              </div>

              {selectedProject.journeyMilestones && selectedProject.journeyMilestones.length > 0 && (
                <div>
                  <label className="field-label">User Logged Milestones ({selectedProject.journeyMilestones.length})</label>
                  <div style={{ maxHeight: 120, overflowY: "auto", background: "rgba(0,0,0,0.3)", padding: 10, borderRadius: 6 }}>
                    {selectedProject.journeyMilestones.map((m) => (
                      <div key={m.id} style={{ fontSize: 12, borderBottom: "1px dashed var(--line)", paddingBottom: 6, marginBottom: 6 }}>
                        <strong style={{ color: "var(--ciel-gold-bright)" }}>[{m.stage.toUpperCase()}]</strong> {m.title} - <span style={{ color: "var(--text-muted)" }}>{m.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button type="button" className="adm-btn adm-btn-outline" onClick={() => setSelectedProject(null)}>Cancel</button>
              <button type="submit" className="adm-btn adm-btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : "Save Review"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ─── EVENTS ERP TAB ─────────────────────────────────────────────────────────

function ERPEventsTab({ initialEvents = [] }: { initialEvents?: CielEventItem[] }) {
  const [events, setEvents] = useState<CielEventItem[]>(initialEvents);
  const [isAdding, setIsAdding] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CielEventItem | null>(null);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    category: "Hackathon",
    date: "",
    startTime: "",
    endTime: "",
    time: "",
    venue: "",
    desc: "",
    posterUrl: "",
  });

  function resetEventForm() {
    setForm({ title: "", category: "Hackathon", date: "", startTime: "", endTime: "", time: "", venue: "", desc: "", posterUrl: "" });
    setIsAdding(false);
    setEditingEvent(null);
  }

  function handleEditClick(ev: CielEventItem) {
    setEditingEvent(ev);
    let startTime = "";
    let endTime = "";
    if (ev.time && ev.time.includes("-")) {
      const parts = ev.time.split("-").map((p) => p.trim());
      startTime = parts[0] || "";
      endTime = parts[1] || "";
    }
    setForm({
      title: ev.title,
      category: ev.category || "Hackathon",
      date: ev.date || "",
      startTime,
      endTime,
      time: ev.time || "",
      venue: ev.venue || "",
      desc: ev.desc || "",
      posterUrl: ev.posterUrl || "",
    });
    setIsAdding(true);
  }

  async function handlePosterUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPoster(true);

    try {
      const data = new FormData();
      data.append("image", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: data });
      const json = await res.json();
      if (res.ok && json.url) {
        setForm((prev) => ({ ...prev, posterUrl: json.url }));
      } else {
        alert(json.error || "Poster upload failed");
      }
    } catch {
      alert("Error uploading poster");
    } finally {
      setUploadingPoster(false);
    }
  }

  async function handleAddOrEditEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.date) {
      alert("Title and Date are required");
      return;
    }
    setSubmitting(true);

    try {
      const timeFormatted = form.startTime
        ? (form.endTime ? `${form.startTime} - ${form.endTime}` : form.startTime)
        : form.time;

      if (editingEvent) {
        const res = await fetch("/api/admin/events", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingEvent.id,
            ...form,
            time: timeFormatted,
          }),
        });
        const json = await res.json();
        if (res.ok && json.event) {
          setEvents((prev) => prev.map((e) => (e.id === editingEvent.id ? json.event : e)));
          resetEventForm();
        } else {
          alert(json.error || "Failed to update event");
        }
      } else {
        const res = await fetch("/api/admin/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            time: timeFormatted,
          }),
        });
        const json = await res.json();
        if (res.ok && json.event) {
          setEvents((prev) => [json.event, ...prev]);
          resetEventForm();
        } else {
          alert(json.error || "Failed to add event");
        }
      }
    } catch {
      alert("Error saving event");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/admin/events?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
    } catch {
      alert("Failed to delete event");
    }
  }

  return (
    <div className="adm-tab-content">
      <div className="adm-section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Events &amp; Hackathons Management</h2>
          <p>Configure campus competitions, workshops, and upload optional posters</p>
        </div>
        <button
          className="adm-btn adm-btn-primary"
          onClick={() => {
            if (isAdding) resetEventForm();
            else setIsAdding(true);
          }}
        >
          <Plus size={16} /> {isAdding ? "Close Form" : "Add New Event"}
        </button>
      </div>

      {isAdding && (
        <div className="adm-table-wrap" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, color: "var(--text-white)", marginBottom: 16 }}>
            {editingEvent ? "Edit Event" : "Add New Event"}
          </h3>
          <form onSubmit={handleAddOrEditEvent} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label className="field-label">Event Title *</label>
                <input className="input" required placeholder="" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Category</label>
                <select className="adm-select" style={{ width: "100%" }} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Demo Day">Demo Day</option>
                  <option value="Ideathon">Ideathon</option>
                  <option value="Bootcamp">Bootcamp</option>
                  <option value="Masterclass">Masterclass</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label className="field-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Calendar size={15} className="text-gold" /> Select Date from Calendar *
                </label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    type="date"
                    className="input"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    onClick={(e) => (e.currentTarget as any).showPicker?.()}
                    style={{ cursor: "pointer", width: "100%", paddingRight: 38, fontSize: 14 }}
                  />
                  <button
                    type="button"
                    title="Open Calendar Picker"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      input?.showPicker?.();
                      input?.focus();
                    }}
                    style={{
                      position: "absolute",
                      right: 10,
                      background: "none",
                      border: "none",
                      color: "var(--ciel-gold-bright)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Calendar size={18} />
                  </button>
                </div>
              </div>

              <div>
                <label className="field-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Clock size={15} className="text-gold" /> Select Time from Clock
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input
                      type="time"
                      className="input"
                      value={form.startTime}
                      onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                      onClick={(e) => (e.currentTarget as any).showPicker?.()}
                      style={{ cursor: "pointer", width: "100%", paddingRight: 32, fontSize: 13.5 }}
                    />
                    <button
                      type="button"
                      title="Open Start Clock"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        input?.showPicker?.();
                        input?.focus();
                      }}
                      style={{
                        position: "absolute",
                        right: 8,
                        background: "none",
                        border: "none",
                        color: "var(--ciel-gold-bright)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Clock size={16} />
                    </button>
                  </div>

                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input
                      type="time"
                      className="input"
                      value={form.endTime}
                      onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                      onClick={(e) => (e.currentTarget as any).showPicker?.()}
                      style={{ cursor: "pointer", width: "100%", paddingRight: 32, fontSize: 13.5 }}
                    />
                    <button
                      type="button"
                      title="Open End Clock"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        input?.showPicker?.();
                        input?.focus();
                      }}
                      style={{
                        position: "absolute",
                        right: 8,
                        background: "none",
                        border: "none",
                        color: "var(--ciel-gold-bright)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Clock size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="field-label">Venue / Campus Location</label>
              <input
                className="input"
                placeholder=""
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
              />
            </div>

            <div>
              <label className="field-label">Event Description</label>
              <textarea className="input" rows={3} placeholder="" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
            </div>

            <div>
              <label className="field-label">Event Poster Image (Optional)</label>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <input type="file" ref={posterInputRef} accept="image/*" style={{ display: "none" }} onChange={handlePosterUpload} />
                <button type="button" className="adm-btn adm-btn-outline" onClick={() => posterInputRef.current?.click()} disabled={uploadingPoster}>
                  <Upload size={14} /> {uploadingPoster ? "Uploading Poster..." : "Upload Poster Image"}
                </button>
                {form.posterUrl && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <img src={form.posterUrl} alt="Poster preview" style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }} />
                    <span style={{ fontSize: 12, color: "#34D399" }}>Poster Uploaded!</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button type="button" className="adm-btn adm-btn-outline" onClick={resetEventForm}>Cancel</button>
              <button type="submit" className="adm-btn adm-btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : (editingEvent ? "Save Changes" : "Publish Event")}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Poster</th>
              <th>Event Title</th>
              <th>Category</th>
              <th>Date &amp; Time</th>
              <th>Venue</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 24, color: "var(--text-muted)" }}>No events configured yet.</td></tr>
            ) : (
              events.map((ev) => (
                <tr key={ev.id}>
                  <td>
                    {ev.posterUrl ? (
                      <img src={ev.posterUrl} alt={ev.title} style={{ width: 44, height: 44, borderRadius: 6, objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: 6, background: "rgba(255,255,255,0.06)", display: "grid", placeItems: "center" }}>
                        <Calendar size={18} />
                      </div>
                    )}
                  </td>
                  <td>
                    <strong style={{ color: "var(--text-white)", display: "block" }}>{ev.title}</strong>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{ev.desc.slice(0, 60)}...</span>
                  </td>
                  <td><span className="badge badge-brand">{ev.category}</span></td>
                  <td>
                    <span style={{ display: "block", color: "var(--ciel-gold-bright)" }}>{ev.date}</span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{ev.time}</span>
                  </td>
                  <td>{ev.venue}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="adm-icon-btn" title="Edit Event" onClick={() => handleEditClick(ev)}>
                        <Edit size={16} />
                      </button>
                      <button className="adm-icon-btn text-danger" title="Delete Event" onClick={() => handleDelete(ev.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



// ─── DOWNLOADS ERP TAB ──────────────────────────────────────────────────────

function ERPDownloadsTab({ initialDownloads = [] }: { initialDownloads?: DownloadItem[] }) {
  const [downloads, setDownloads] = useState<DownloadItem[]>(initialDownloads);
  const [isAdding, setIsAdding] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DownloadItem | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const docInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    category: "policy",
    format: "PDF",
    fileSize: "1.5 MB",
    description: "",
    fileUrl: "",
  });

  function resetDocForm() {
    setForm({ title: "", category: "policy", format: "PDF", fileSize: "1.5 MB", description: "", fileUrl: "" });
    setIsAdding(false);
    setEditingDoc(null);
  }

  function handleEditClick(doc: DownloadItem) {
    setEditingDoc(doc);
    setForm({
      title: doc.title,
      category: doc.category || "policy",
      format: doc.format || "PDF",
      fileSize: doc.fileSize || "1.5 MB",
      description: doc.description || "",
      fileUrl: doc.fileUrl || "",
    });
    setIsAdding(true);
  }

  async function handleDocFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(true);

    try {
      const data = new FormData();
      data.append("image", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: data });
      const json = await res.json();
      if (res.ok && json.url) {
        setForm((prev) => ({
          ...prev,
          fileUrl: json.url,
          format: file.name.split(".").pop()?.toUpperCase() || "PDF",
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        }));
      } else {
        alert(json.error || "File upload failed");
      }
    } catch {
      alert("Error uploading document");
    } finally {
      setUploadingDoc(false);
    }
  }

  async function handleAddOrEditDoc(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description) {
      alert("Title and Description are required");
      return;
    }
    setSubmitting(true);

    try {
      if (editingDoc) {
        const res = await fetch("/api/admin/downloads", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingDoc.id,
            ...form,
          }),
        });
        const json = await res.json();
        if (res.ok && json.download) {
          setDownloads((prev) => prev.map((d) => (d.id === editingDoc.id ? json.download : d)));
          resetDocForm();
        } else {
          alert(json.error || "Failed to update document");
        }
      } else {
        const res = await fetch("/api/admin/downloads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const json = await res.json();
        if (res.ok && json.download) {
          setDownloads((prev) => [json.download, ...prev]);
          resetDocForm();
        } else {
          alert(json.error || "Failed to add document");
        }
      }
    } catch {
      alert("Error saving document");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this policy manual?")) return;
    try {
      const res = await fetch(`/api/admin/downloads?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        setDownloads((prev) => prev.filter((d) => d.id !== id));
      }
    } catch {
      alert("Failed to delete document");
    }
  }

  return (
    <div className="adm-tab-content">
      <div className="adm-section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Policy Manuals &amp; Documents Repository</h2>
          <p>Upload and manage institutional policies, IPR handbooks, and pitch templates</p>
        </div>
        <button
          className="adm-btn adm-btn-primary"
          onClick={() => {
            if (isAdding) resetDocForm();
            else setIsAdding(true);
          }}
        >
          <Plus size={16} /> {isAdding ? "Close Form" : "Upload New Policy Document"}
        </button>
      </div>

      {isAdding && (
        <div className="adm-table-wrap" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, color: "var(--text-white)", marginBottom: 16 }}>
            {editingDoc ? "Edit Policy Manual or Document" : "Upload Policy Manual or Document"}
          </h3>
          <form onSubmit={handleAddOrEditDoc} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
              <div>
                <label className="field-label">Document Title *</label>
                <input className="input" required placeholder="" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Category</label>
                <select className="adm-select" style={{ width: "100%" }} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="policy">Policy Handbook</option>
                  <option value="manual">Operational Manual</option>
                  <option value="form">Application Form</option>
                  <option value="report">Impact Report</option>
                  <option value="template">Pitch Template</option>
                </select>
              </div>
            </div>

            <div>
              <label className="field-label">Description *</label>
              <textarea className="input" rows={2} required placeholder="" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div>
              <label className="field-label">Policy File Document (PDF / DOCX / ZIP)</label>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <input type="file" ref={docInputRef} accept=".pdf,.doc,.docx,.zip" style={{ display: "none" }} onChange={handleDocFileUpload} />
                <button type="button" className="adm-btn adm-btn-outline" onClick={() => docInputRef.current?.click()} disabled={uploadingDoc}>
                  <Upload size={14} /> {uploadingDoc ? "Uploading Document..." : "Choose File to Upload"}
                </button>
                {form.fileUrl && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FileText size={16} className="text-gold" />
                    <span style={{ fontSize: 12, color: "#34D399" }}>Uploaded! ({form.format} - {form.fileSize})</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button type="button" className="adm-btn adm-btn-outline" onClick={resetDocForm}>Cancel</button>
              <button type="submit" className="adm-btn adm-btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : (editingDoc ? "Save Changes" : "Publish Document")}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Document Title</th>
              <th>Category</th>
              <th>Format</th>
              <th>Size</th>
              <th>Updated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {downloads.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 24, color: "var(--text-muted)" }}>No policy documents uploaded.</td></tr>
            ) : (
              downloads.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <strong style={{ color: "var(--text-white)", display: "block" }}>{doc.title}</strong>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{doc.description}</span>
                  </td>
                  <td><span className="badge badge-brand" style={{ textTransform: "uppercase" }}>{doc.category}</span></td>
                  <td><span className="badge badge-neutral">{doc.format}</span></td>
                  <td>{doc.fileSize}</td>
                  <td><span style={{ color: "var(--ciel-gold-bright)" }}>{doc.updatedAt}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      {doc.fileUrl ? (
                        <a href={doc.fileUrl} download target="_blank" rel="noreferrer" className="adm-icon-btn text-gold" title="Download Document">
                          <Download size={16} />
                        </a>
                      ) : null}
                      <button className="adm-icon-btn" title="Edit Document" onClick={() => handleEditClick(doc)}>
                        <Edit size={16} />
                      </button>
                      <button className="adm-icon-btn text-danger" title="Delete Document" onClick={() => handleDelete(doc.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── GOOGLE FORMS TAB COMPONENT ─────────────────────────────────────────────

function ERPGoogleFormsTab({ initialForms }: { initialForms: GoogleFormItem[] }) {
  const [forms, setForms] = useState<GoogleFormItem[]>(initialForms);
  const [isAdding, setIsAdding] = useState(false);
  const [editingForm, setEditingForm] = useState<GoogleFormItem | null>(null);
  const [previewForm, setPreviewForm] = useState<GoogleFormItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formState, setFormState] = useState({
    title: "",
    description: "",
    category: "Incubation",
    formUrl: "",
    isActive: true,
  });

  const resetForm = () => {
    setFormState({ title: "", description: "", category: "Incubation", formUrl: "", isActive: true });
    setIsAdding(false);
    setEditingForm(null);
  };

  const handleEditClick = (form: GoogleFormItem) => {
    setEditingForm(form);
    setFormState({
      title: form.title,
      description: form.description || "",
      category: form.category || "General",
      formUrl: form.formUrl || form.embedUrl,
      isActive: form.isActive !== false,
    });
    setIsAdding(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.formUrl) {
      alert("Title and Google Form URL are required");
      return;
    }
    setSubmitting(true);

    try {
      if (editingForm) {
        const res = await fetch("/api/admin/google-forms", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingForm.id, ...formState }),
        });
        const json = await res.json();
        if (res.ok && json.form) {
          setForms((prev) => prev.map((f) => (f.id === editingForm.id ? json.form : f)));
          resetForm();
        } else {
          alert(json.error || "Failed to update form");
        }
      } else {
        const res = await fetch("/api/admin/google-forms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formState),
        });
        const json = await res.json();
        if (res.ok && json.form) {
          setForms((prev) => [json.form, ...prev]);
          resetForm();
        } else {
          alert(json.error || "Failed to add form");
        }
      }
    } catch {
      alert("An error occurred while saving the Google Form");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (form: GoogleFormItem) => {
    try {
      const res = await fetch("/api/admin/google-forms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: form.id, isActive: !form.isActive }),
      });
      const json = await res.json();
      if (res.ok && json.form) {
        setForms((prev) => prev.map((f) => (f.id === form.id ? json.form : f)));
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Google Form?")) return;
    try {
      const res = await fetch(`/api/admin/google-forms?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        setForms((prev) => prev.filter((f) => f.id !== id));
      } else {
        alert("Failed to delete form");
      }
    } catch {
      alert("Error deleting form");
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="adm-tab-content">
      <div className="adm-section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Google Forms Management</h2>
          <p>Configure, edit, and publish Google Forms embedded inside iframe containers across the website.</p>
        </div>
        <button
          className="button button-primary button-small"
          onClick={() => {
            resetForm();
            setIsAdding(true);
          }}
        >
          <Plus size={16} /> Add New Form Link
        </button>
      </div>

      {/* Add / Edit Form Modal */}
      {isAdding && (
        <div className="adm-card" style={{ marginBottom: 24, padding: 24, background: "var(--ciel-card-bg, #111827)", borderRadius: 12, border: "1px solid var(--ciel-gold-border, rgba(217,119,6,0.3))" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, color: "var(--text-white)", margin: 0 }}>
              {editingForm ? "Edit Google Form Details" : "Add Google Form Link"}
            </h3>
            <button className="adm-icon-btn" onClick={resetForm}><X size={18} /></button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label className="field-label">Form Title *</label>
                <input
                  type="text"
                  className="input"
                  required
                  placeholder=""
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                />
              </div>
              <div>
                <label className="field-label">Category</label>
                <select
                  className="input"
                  value={formState.category}
                  onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                >
                  <option value="Incubation">Incubation</option>
                  <option value="Events">Events & Hackathons</option>
                  <option value="Feedback">Feedback & Survey</option>
                  <option value="Grants">Grants & Funding</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <div>
              <label className="field-label">Google Form Share/View URL *</label>
              <input
                type="url"
                className="input"
                required
                placeholder=""
                value={formState.formUrl}
                onChange={(e) => setFormState({ ...formState, formUrl: e.target.value })}
              />
              <span style={{ fontSize: 12, color: "var(--ciel-gold-bright)", display: "block", marginTop: 4 }}>
                ℹ️ Paste any valid Google Form link. It will automatically convert to the embedded iframe URL format (appending <code>?embedded=true</code>).
              </span>
            </div>

            <div>
              <label className="field-label">Description / Guidance</label>
              <textarea
                className="input"
                rows={3}
                placeholder=""
                value={formState.description}
                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                id="form-is-active"
                checked={formState.isActive}
                onChange={(e) => setFormState({ ...formState, isActive: e.target.checked })}
              />
              <label htmlFor="form-is-active" style={{ fontSize: 14, color: "var(--text-white)", cursor: "pointer" }}>
                Active &amp; Published on Public Forms Hub (`/forms`)
              </label>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
              <button type="button" className="button button-ghost" onClick={resetForm}>Cancel</button>
              <button type="submit" className="button button-primary" disabled={submitting}>
                {submitting ? "Saving..." : editingForm ? "Update Form" : "Publish Form"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewForm && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "var(--ciel-card-bg, #0f172a)", width: "100%", maxWidth: 900, height: "90vh", borderRadius: 16, border: "1px solid var(--ciel-gold-border)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ margin: 0, color: "var(--text-white)", fontSize: 18 }}>Preview: {previewForm.title}</h3>
                <span style={{ fontSize: 12, color: "var(--ciel-gold-bright)" }}>Category: {previewForm.category || "General"}</span>
              </div>
              <button className="button button-ghost button-small" onClick={() => setPreviewForm(null)}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, background: "#ffffff" }}>
              <iframe
                src={previewForm.embedUrl}
                width="100%"
                height="100%"
                style={{ border: "none" }}
                title={previewForm.title}
              />
            </div>
          </div>
        </div>
      )}

      {/* Forms Table */}
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Form Details</th>
              <th>Category</th>
              <th>Status</th>
              <th>Embed URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>No Google Forms configured yet. Click &quot;Add New Form Link&quot; above.</td></tr>
            ) : (
              forms.map((form) => (
                <tr key={form.id}>
                  <td>
                    <strong style={{ color: "var(--text-white)", display: "block" }}>{form.title}</strong>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{form.description || "No description"}</span>
                  </td>
                  <td>
                    <span className="badge badge-brand">{form.category || "General"}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleActive(form)}
                      className={`badge ${form.isActive !== false ? "badge-success" : "badge-neutral"}`}
                      style={{ border: "none", cursor: "pointer" }}
                      title="Click to toggle status"
                    >
                      {form.isActive !== false ? "Active (Public)" : "Inactive"}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <code style={{ fontSize: 11, background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: 4, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {form.embedUrl}
                      </code>
                      <button
                        className="adm-icon-btn"
                        title="Copy embed URL"
                        onClick={() => copyToClipboard(form.embedUrl, form.id)}
                      >
                        {copiedId === form.id ? <CheckCircle2 size={14} style={{ color: "#22c55e" }} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="adm-icon-btn text-gold"
                        title="Preview Live Iframe"
                        onClick={() => setPreviewForm(form)}
                      >
                        <Eye size={16} />
                      </button>
                      <a
                        href={form.formUrl || form.embedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="adm-icon-btn text-primary"
                        title="Open in Direct Tab"
                      >
                        <ExternalLink size={16} />
                      </a>
                      <button
                        className="adm-icon-btn"
                        title="Edit Form Details"
                        onClick={() => handleEditClick(form)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="adm-icon-btn text-danger"
                        title="Delete Form"
                        onClick={() => handleDelete(form.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ELEVATOR PITCHES ERP TAB ───────────────────────────────────────────────

function ERPPitchesTab({ initialPitches = [] }: { initialPitches?: ElevatorPitchItem[] }) {
  const [pitches, setPitches] = useState<ElevatorPitchItem[]>(initialPitches);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Video source switch: "device" (upload from computer) vs "url" (YouTube, Vimeo, etc.)
  const [videoSource, setVideoSource] = useState<"device" | "url">("device");

  // Form fields
  const [title, setTitle] = useState("");
  const [founder, setFounder] = useState("");
  const [startup, setStartup] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [description, setDescription] = useState("");

  // Device upload states
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoFileName, setVideoFileName] = useState("");
  const [videoFileSize, setVideoFileSize] = useState("");
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  // Admin watch modal preview
  const [previewPitch, setPreviewPitch] = useState<ElevatorPitchItem | null>(null);

  // Admin edit modal state
  const [editingPitch, setEditingPitch] = useState<ElevatorPitchItem | null>(null);
  const [editStartup, setEditStartup] = useState("");
  const [editFounder, setEditFounder] = useState("");
  const [editVideoUrl, setEditVideoUrl] = useState("");
  const [editThumbnailUrl, setEditThumbnailUrl] = useState("");
  const [editVideoSource, setEditVideoSource] = useState<"device" | "url">("device");
  const [editUploadingVideo, setEditUploadingVideo] = useState(false);
  const [editUploadProgress, setEditUploadProgress] = useState(0);
  const [editVideoFileName, setEditVideoFileName] = useState("");
  const [editVideoFileSize, setEditVideoFileSize] = useState("");
  const [editIsDragOver, setEditIsDragOver] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editMsg, setEditMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function extractYTId(url: string): string | null {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    return m ? m[1] : null;
  }

  function isDirectVideo(url: string): boolean {
    if (!url) return false;
    if (url.startsWith("/uploads/") || url.startsWith("data:video/") || url.startsWith("blob:")) return true;
    return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url);
  }

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }

  function handleVideoUrlChange(v: string) {
    setVideoUrl(v);
    const ytId = extractYTId(v);
    if (ytId && !thumbnailUrl) {
      setThumbnailUrl(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
    }
  }

  async function handleVideoFileSelect(file: File) {
    if (!file) return;
    const MAX_VIDEO_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB
    if (file.size > MAX_VIDEO_SIZE) {
      setMsg({ type: "err", text: "Video file exceeds 2 GB limit." });
      return;
    }

    setVideoFileName(file.name);
    setVideoFileSize(formatBytes(file.size));
    const localUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(localUrl);
    setUploadingVideo(true);
    setUploadProgress(0);
    setMsg(null);

    // 1. Direct Supabase Cloud Upload (bypasses Vercel 4.5MB limits & works seamlessly on production)
    try {
      const signRes = await fetch("/api/admin/upload/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "video/mp4",
        }),
      });
      const signData = await signRes.json();

      if (signRes.ok && signData.signedUrl) {
        const formData = new FormData();
        formData.append("cacheControl", "3600");
        formData.append("", file);

        let uploadSuccess = false;
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", signData.signedUrl);
          xhr.setRequestHeader("x-upsert", "true");

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && e.total > 0) {
              const pct = Math.round((e.loaded / e.total) * 100);
              setUploadProgress(pct);
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              setVideoUrl(signData.publicUrl);
              setMsg({
                type: "ok",
                text: `Video "${file.name}" (${formatBytes(file.size)}) uploaded successfully to Supabase Cloud!`,
              });
              uploadSuccess = true;
              resolve();
            } else if (xhr.status === 413 || xhr.status === 400) {
              reject(new Error("FILE_SIZE_LIMIT"));
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          };

          xhr.onerror = () => reject(new Error("Network error"));
          xhr.send(formData);
        });

        if (uploadSuccess) return;
      }
    } catch (err: any) {
      if (err.message === "FILE_SIZE_LIMIT" || file.size > 50 * 1024 * 1024) {
        setMsg({
          type: "err",
          text: `Video size is ${formatBytes(file.size)}. Supabase Storage Free Tier has a 50 MB limit per file. Please compress this video to under 50 MB, or use a YouTube/Vimeo URL.`,
        });
        return;
      }
      // Otherwise fall back to route upload
    } finally {
      setUploadingVideo(false);
      setUploadProgress(0);
    }

    // 2. Fallback upload to local server
    try {
      setUploadingVideo(true);
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/upload");
        xhr.setRequestHeader("Content-Type", file.type || "video/mp4");
        xhr.setRequestHeader("x-filename", encodeURIComponent(file.name));

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && e.total > 0) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(pct);
          }
        };

        xhr.onload = () => {
          try {
            const json = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300 && json.url) {
              setVideoUrl(json.url);
              setMsg({ type: "ok", text: `Video "${file.name}" uploaded successfully!` });
              resolve();
            } else {
              setMsg({ type: "err", text: json.error || "Failed to upload video from device." });
              reject(new Error(json.error || "Upload failed"));
            }
          } catch {
            setMsg({ type: "err", text: "Failed to parse upload response." });
            reject(new Error("Parse error"));
          }
        };

        xhr.onerror = () => {
          setMsg({ type: "err", text: "Network error while uploading video." });
          reject(new Error("Network error"));
        };

        xhr.send(file);
      });
    } catch {
      // Error message handled in callbacks
    } finally {
      setUploadingVideo(false);
      setUploadProgress(0);
    }
  }

  function resetForm() {
    setTitle("");
    setFounder("");
    setStartup("");
    setVideoUrl("");
    setThumbnailUrl("");
    setDescription("");
    setVideoFileName("");
    setVideoFileSize("");
    setVideoPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const sTitle = (startup || title).trim();
    const fName = founder.trim();

    if (!sTitle) {
      setMsg({ type: "err", text: "Please enter the startup title." });
      return;
    }
    if (!videoUrl.trim()) {
      setMsg({
        type: "err",
        text:
          videoSource === "device"
            ? "Please select and wait for your video to upload from device."
            : "Please provide a valid video URL.",
      });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/pitches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: sTitle,
          founder: fName,
          startup: sTitle,
          videoUrl,
          thumbnailUrl: thumbnailUrl || undefined,
          description: "",
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setPitches((prev) => [json.pitch, ...prev]);
        resetForm();
        setMsg({ type: "ok", text: "Elevator pitch published successfully and is now live on the home page!" });
      } else {
        setMsg({ type: "err", text: json.error || "Failed to add pitch." });
      }
    } catch {
      setMsg({ type: "err", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, pitchTitle: string) {
    if (!confirm(`Delete the pitch "${pitchTitle}" from the home page?`)) return;
    const prev = pitches;
    setPitches((p) => p.filter((x) => x.id !== id));
    try {
      const res = await fetch(`/api/admin/pitches?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        setPitches(prev);
        alert("Failed to delete pitch.");
      }
    } catch {
      setPitches(prev);
      alert("Network error.");
    }
  }

  function handleStartEdit(pitch: ElevatorPitchItem) {
    setEditingPitch(pitch);
    setEditStartup(pitch.startup || pitch.title);
    setEditFounder(pitch.founder || "");
    setEditVideoUrl(pitch.videoUrl);
    setEditThumbnailUrl(pitch.thumbnailUrl || "");
    setEditVideoSource(isDirectVideo(pitch.videoUrl) ? "device" : "url");
    setEditVideoFileName("");
    setEditVideoFileSize("");
    setEditMsg(null);
  }

  async function handleEditVideoFileSelect(file: File) {
    if (!file) return;
    const MAX_VIDEO_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB
    if (file.size > MAX_VIDEO_SIZE) {
      setEditMsg({ type: "err", text: "Video file exceeds 2 GB limit." });
      return;
    }

    setEditVideoFileName(file.name);
    setEditVideoFileSize(formatBytes(file.size));
    setEditUploadingVideo(true);
    setEditUploadProgress(0);
    setEditMsg(null);

    // 1. Direct Supabase Cloud Upload
    try {
      const signRes = await fetch("/api/admin/upload/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "video/mp4",
        }),
      });
      const signData = await signRes.json();

      if (signRes.ok && signData.signedUrl) {
        const formData = new FormData();
        formData.append("cacheControl", "3600");
        formData.append("", file);

        let uploadSuccess = false;
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", signData.signedUrl);
          xhr.setRequestHeader("x-upsert", "true");

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && e.total > 0) {
              const pct = Math.round((e.loaded / e.total) * 100);
              setEditUploadProgress(pct);
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              setEditVideoUrl(signData.publicUrl);
              setEditMsg({
                type: "ok",
                text: `New video "${file.name}" (${formatBytes(file.size)}) uploaded successfully to Supabase Cloud!`,
              });
              uploadSuccess = true;
              resolve();
            } else if (xhr.status === 413 || xhr.status === 400) {
              reject(new Error("FILE_SIZE_LIMIT"));
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          };

          xhr.onerror = () => reject(new Error("Network error"));
          xhr.send(formData);
        });

        if (uploadSuccess) return;
      }
    } catch (err: any) {
      if (err.message === "FILE_SIZE_LIMIT" || file.size > 50 * 1024 * 1024) {
        setEditMsg({
          type: "err",
          text: `Video size is ${formatBytes(file.size)}. Supabase Storage Free Tier has a 50 MB limit per file. Please compress this video or use a YouTube URL.`,
        });
        return;
      }
    } finally {
      setEditUploadingVideo(false);
      setEditUploadProgress(0);
    }

    // 2. Fallback upload to local server
    try {
      setEditUploadingVideo(true);
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/upload");
        xhr.setRequestHeader("Content-Type", file.type || "video/mp4");
        xhr.setRequestHeader("x-filename", encodeURIComponent(file.name));

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && e.total > 0) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setEditUploadProgress(pct);
          }
        };

        xhr.onload = () => {
          try {
            const json = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300 && json.url) {
              setEditVideoUrl(json.url);
              setEditMsg({ type: "ok", text: `Video "${file.name}" uploaded successfully!` });
              resolve();
            } else {
              setEditMsg({ type: "err", text: json.error || "Failed to upload video from device." });
              reject(new Error(json.error || "Upload failed"));
            }
          } catch {
            setEditMsg({ type: "err", text: "Failed to parse upload response." });
            reject(new Error("Parse error"));
          }
        };

        xhr.onerror = () => {
          setEditMsg({ type: "err", text: "Network error while uploading video." });
          reject(new Error("Network error"));
        };

        xhr.send(file);
      });
    } catch {
      // Handled
    } finally {
      setEditUploadingVideo(false);
      setEditUploadProgress(0);
    }
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPitch) return;
    const sTitle = editStartup.trim();
    const fName = editFounder.trim();

    if (!sTitle) {
      setEditMsg({ type: "err", text: "Please enter the startup title." });
      return;
    }
    if (!editVideoUrl.trim()) {
      setEditMsg({ type: "err", text: "Please provide a valid video URL or upload a video." });
      return;
    }

    setEditSaving(true);
    setEditMsg(null);
    try {
      const res = await fetch("/api/admin/pitches", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingPitch.id,
          title: sTitle,
          founder: fName,
          startup: sTitle,
          videoUrl: editVideoUrl.trim(),
          thumbnailUrl: editThumbnailUrl.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setPitches((prev) => prev.map((p) => (p.id === editingPitch.id ? json.pitch : p)));
        setEditingPitch(null);
        setMsg({ type: "ok", text: `Pitch "${sTitle}" updated successfully!` });
      } else {
        setEditMsg({ type: "err", text: json.error || "Failed to update pitch." });
      }
    } catch {
      setEditMsg({ type: "err", text: "Network error. Please try again." });
    } finally {
      setEditSaving(false);
    }
  }


  return (
    <div className="adm-tab-content">
      <div className="adm-section-head">
        <div>
          <h2>Elevator Pitch Videos</h2>
          <p>Add short startup pitch videos shown on the public home page · {pitches.length} published</p>
        </div>
      </div>

      {/* Compact Add Form */}
      <div className="adm-table-wrap" style={{ padding: "16px 20px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <h3 style={{ fontSize: 15, color: "var(--text-white)", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <Video size={16} style={{ color: "var(--ciel-gold)" }} /> Add Elevator Pitch
          </h3>
          <div className="pitch-source-selector" style={{ margin: 0 }}>
            <button
              type="button"
              className={`pitch-source-btn ${videoSource === "device" ? "active" : ""}`}
              style={{ padding: "4px 12px", fontSize: 12 }}
              onClick={() => { setVideoSource("device"); setMsg(null); }}
            >
              <Upload size={13} /> Device Video
            </button>
            <button
              type="button"
              className={`pitch-source-btn ${videoSource === "url" ? "active" : ""}`}
              style={{ padding: "4px 12px", fontSize: 12 }}
              onClick={() => { setVideoSource("url"); setMsg(null); }}
            >
              <Globe size={13} /> Web URL
            </button>
          </div>
        </div>

        <form onSubmit={handleAdd}>
          <div className="pitch-compact-grid">
            <div className="field" style={{ margin: 0 }}>
              <label className="field-label" style={{ fontSize: 12, marginBottom: 4 }}>Startup Title *</label>
              <input
                className="input"
                style={{ padding: "8px 12px", fontSize: 13, height: 38 }}
                placeholder="e.g. AgriTech Dynamics"
                value={startup}
                onChange={(e) => {
                  setStartup(e.target.value);
                  setTitle(e.target.value);
                }}
                required
              />
            </div>

            <div className="field" style={{ margin: 0 }}>
              <label className="field-label" style={{ fontSize: 12, marginBottom: 4 }}>Founder's Name (Optional)</label>
              <input
                className="input"
                style={{ padding: "8px 12px", fontSize: 13, height: 38 }}
                placeholder="e.g. Rohan Deshmukh (optional)"
                value={founder}
                onChange={(e) => setFounder(e.target.value)}
              />
            </div>

            <div className="field" style={{ margin: 0 }}>
              <label className="field-label" style={{ fontSize: 12, marginBottom: 4 }}>
                {videoSource === "device" ? "Video File (MP4, WebM, MOV) *" : "Video URL (YouTube/Vimeo) *"}
              </label>
              {videoSource === "device" ? (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleVideoFileSelect(f);
                    }}
                  />
                  {!videoUrl && !uploadingVideo ? (
                    <div
                      className={`pitch-compact-dropzone ${isDragOver ? "dragover" : ""}`}
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragOver(false);
                        const f = e.dataTransfer.files?.[0];
                        if (f) handleVideoFileSelect(f);
                      }}
                    >
                      <Upload size={14} style={{ color: "var(--ciel-gold)" }} />
                      <span>Choose or drop video file (up to 2 GB)</span>
                    </div>
                  ) : uploadingVideo ? (
                    <div className="pitch-compact-progress" title={`Uploading ${videoFileName} (${uploadProgress}%)`}>
                      <div className="pitch-compact-progress-bar" style={{ width: `${Math.max(6, uploadProgress)}%` }} />
                      <div className="pitch-compact-progress-content">
                        <RefreshCw size={13} className="spin text-gold" style={{ flexShrink: 0 }} />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                          Uploading {videoFileName}…
                        </span>
                        <span style={{ fontWeight: 700, color: "var(--ciel-gold)", marginLeft: "auto", flexShrink: 0 }}>
                          {uploadProgress}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="pitch-compact-file">
                      <CheckCircle2 size={15} style={{ color: "#10b981", flexShrink: 0 }} />
                      <span className="pitch-compact-name" title={videoFileName}>{videoFileName || "Uploaded Video"}</span>
                      {videoFileSize && <span style={{ opacity: 0.6, fontSize: 11 }}>({videoFileSize})</span>}
                      {(videoUrl || videoPreviewUrl) && (
                        <button
                          type="button"
                          onClick={() => setPreviewPitch({
                            id: "temp-preview",
                            title: startup || "Video Preview",
                            startup: startup || "Video Preview",
                            videoUrl: videoUrl || videoPreviewUrl,
                            createdAt: "",
                          })}
                          style={{
                            background: "rgba(212,175,55,0.15)",
                            border: "1px solid rgba(212,175,55,0.4)",
                            color: "var(--ciel-gold)",
                            cursor: "pointer",
                            padding: "2px 8px",
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            marginLeft: 4,
                          }}
                          title="Preview video playback"
                        >
                          <Play size={10} fill="currentColor" /> Play Test
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setVideoUrl("");
                          setVideoPreviewUrl("");
                          setVideoFileName("");
                          setVideoFileSize("");
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 2, marginLeft: "auto", display: "flex", alignItems: "center" }}
                        title="Change video"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <input
                  className="input"
                  style={{ padding: "8px 12px", fontSize: 13, height: 38 }}
                  placeholder="https://youtu.be/... or https://vimeo.com/..."
                  value={videoUrl}
                  onChange={(e) => handleVideoUrlChange(e.target.value)}
                  required={videoSource === "url"}
                />
              )}
            </div>

            <div>
              <button
                className="adm-btn adm-btn-primary"
                type="submit"
                disabled={saving || uploadingVideo}
                style={{ padding: "8px 18px", fontSize: 13, height: 38, whiteSpace: "nowrap" }}
              >
                {saving ? <RefreshCw size={14} className="spin" /> : <Plus size={14} />}
                {saving ? "Publishing…" : "Publish Pitch"}
              </button>
            </div>
          </div>

          {msg && (
            <div className={`alert ${msg.type === "ok" ? "alert-success" : "alert-error"}`} style={{ padding: "8px 12px", marginTop: 10, fontSize: 13 }}>
              {msg.text}
            </div>
          )}
        </form>
      </div>

      {/* Pitch Cards */}
      {pitches.length === 0 ? (
        <div className="adm-table-wrap" style={{ padding: 32, textAlign: "center" }}>
          <Video size={40} style={{ color: "var(--ciel-gold)", opacity: 0.4, margin: "0 auto 12px" }} />
          <p style={{ color: "var(--text-secondary)" }}>No elevator pitches yet. Add your first video above.</p>
        </div>
      ) : (
        <div className="pitch-admin-grid">
          {pitches.map((pitch) => {
            const ytId = extractYTId(pitch.videoUrl);
            const thumb = pitch.thumbnailUrl || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : "");
            const direct = isDirectVideo(pitch.videoUrl);
            return (
              <div key={pitch.id} className="pitch-admin-card">
                <div style={{ position: "relative" }}>
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb}
                      alt={pitch.title}
                      className="pitch-admin-thumb"
                      style={{ objectPosition: "center top" }}
                    />
                  ) : direct ? (
                    <video
                      src={`${pitch.videoUrl}#t=0.5`}
                      className="pitch-admin-thumb"
                      style={{ objectPosition: "center top" }}
                      preload="metadata"
                      muted
                      playsInline
                    />
                  ) : (
                    <div className="pitch-admin-thumb-placeholder">
                      <Video size={28} style={{ color: "var(--ciel-gold)", opacity: 0.4 }} />
                    </div>
                  )}
                  <span
                    className="pitch-badge-source"
                    style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.8)" }}
                  >
                    {direct ? "Device Video" : ytId ? "YouTube" : "Web URL"}
                  </span>
                </div>
                <div className="pitch-admin-info">
                  <p className="pitch-admin-title">{pitch.startup || pitch.title}</p>
                  {pitch.founder ? (
                    <p className="pitch-admin-meta">Founder: <strong>{pitch.founder}</strong></p>
                  ) : null}
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button
                      type="button"
                      className="adm-btn adm-btn-secondary"
                      style={{ fontSize: 12, padding: "5px 10px", flex: 1, justifyContent: "center" }}
                      onClick={() => setPreviewPitch(pitch)}
                    >
                      <Play size={12} fill="currentColor" /> Watch
                    </button>
                    <button
                      type="button"
                      className="adm-btn adm-btn-secondary"
                      style={{ fontSize: 12, padding: "5px 10px", flex: 1, justifyContent: "center" }}
                      title="Edit Pitch"
                      onClick={() => handleStartEdit(pitch)}
                    >
                      <Edit size={12} /> Edit
                    </button>
                    <button
                      type="button"
                      className="adm-btn adm-btn-danger"
                      style={{ fontSize: 12, padding: "5px 10px" }}
                      title="Delete Pitch"
                      onClick={() => handleDelete(pitch.id, pitch.startup || pitch.title)}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Watch Modal */}
      {previewPitch && (
        <div
          className="pitch-modal-overlay"
          onClick={() => setPreviewPitch(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="pitch-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="pitch-modal-header">
              <div>
                <h3 className="pitch-modal-title">{previewPitch.startup || previewPitch.title}</h3>
                {previewPitch.founder ? (
                  <p className="pitch-modal-meta">Founder: <strong>{previewPitch.founder}</strong></p>
                ) : null}
              </div>
              <button
                className="pitch-modal-close"
                onClick={() => setPreviewPitch(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="pitch-modal-player">
              {isDirectVideo(previewPitch.videoUrl) ? (
                <video
                  key={previewPitch.videoUrl}
                  src={previewPitch.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  style={{ width: "100%", height: "100%", objectFit: "contain", background: "#000" }}
                >
                  <source src={previewPitch.videoUrl} type="video/mp4" />
                  Your browser does not support playing this video.
                </video>
              ) : (
                <iframe
                  src={
                    extractYTId(previewPitch.videoUrl)
                      ? `https://www.youtube.com/embed/${extractYTId(previewPitch.videoUrl)}?autoplay=1`
                      : previewPitch.videoUrl
                  }
                  title={previewPitch.title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  style={{ width: "100%", height: "100%", border: "none" }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Edit Modal */}
      {editingPitch && (
        <div
          className="pitch-modal-overlay"
          onClick={() => {
            if (!editSaving && !editUploadingVideo) setEditingPitch(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="pitch-modal-box"
            style={{ maxWidth: 540, padding: 0, overflow: "hidden", borderRadius: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="pitch-modal-header"
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--line)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div>
                <h3 className="pitch-modal-title" style={{ fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <Edit size={16} style={{ color: "var(--ciel-gold)" }} /> Edit Elevator Pitch
                </h3>
                <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>
                  Update details or replace video for &ldquo;{editingPitch.startup || editingPitch.title}&rdquo;
                </p>
              </div>
              <button
                className="pitch-modal-close"
                onClick={() => setEditingPitch(null)}
                aria-label="Close"
                disabled={editSaving || editUploadingVideo}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ padding: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="field" style={{ margin: 0 }}>
                  <label className="field-label" style={{ fontSize: 12, marginBottom: 4 }}>
                    Startup Title *
                  </label>
                  <input
                    className="input"
                    style={{ padding: "8px 12px", fontSize: 13, height: 38, width: "100%" }}
                    placeholder="e.g. AgriTech Dynamics"
                    value={editStartup}
                    onChange={(e) => setEditStartup(e.target.value)}
                    required
                  />
                </div>

                <div className="field" style={{ margin: 0 }}>
                  <label className="field-label" style={{ fontSize: 12, marginBottom: 4 }}>
                    Founder&apos;s Name (Optional)
                  </label>
                  <input
                    className="input"
                    style={{ padding: "8px 12px", fontSize: 13, height: 38, width: "100%" }}
                    placeholder="e.g. Rohan Deshmukh (optional)"
                    value={editFounder}
                    onChange={(e) => setEditFounder(e.target.value)}
                  />
                </div>

                {/* Video Source Switcher */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label className="field-label" style={{ fontSize: 12, margin: 0 }}>
                      Video Source
                    </label>
                    <div className="pitch-source-selector" style={{ margin: 0 }}>
                      <button
                        type="button"
                        className={`pitch-source-btn ${editVideoSource === "device" ? "active" : ""}`}
                        style={{ padding: "3px 10px", fontSize: 11 }}
                        onClick={() => {
                          setEditVideoSource("device");
                          setEditMsg(null);
                        }}
                      >
                        <Upload size={11} /> Device Video
                      </button>
                      <button
                        type="button"
                        className={`pitch-source-btn ${editVideoSource === "url" ? "active" : ""}`}
                        style={{ padding: "3px 10px", fontSize: 11 }}
                        onClick={() => {
                          setEditVideoSource("url");
                          setEditMsg(null);
                        }}
                      >
                        <Globe size={11} /> Web URL
                      </button>
                    </div>
                  </div>

                  {editVideoSource === "device" ? (
                    <div>
                      <input
                        type="file"
                        ref={editFileInputRef}
                        accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleEditVideoFileSelect(f);
                        }}
                      />
                      {editUploadingVideo ? (
                        <div className="pitch-compact-progress" title={`Uploading ${editVideoFileName} (${editUploadProgress}%)`}>
                          <div className="pitch-compact-progress-bar" style={{ width: `${Math.max(6, editUploadProgress)}%` }} />
                          <div className="pitch-compact-progress-content">
                            <RefreshCw size={13} className="spin text-gold" style={{ flexShrink: 0 }} />
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                              Uploading {editVideoFileName}…
                            </span>
                            <span style={{ fontWeight: 700, color: "var(--ciel-gold)", marginLeft: "auto", flexShrink: 0 }}>
                              {editUploadProgress}%
                            </span>
                          </div>
                        </div>
                      ) : editVideoUrl ? (
                        <div className="pitch-compact-file" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px" }}>
                          <CheckCircle2 size={15} style={{ color: "#10b981", flexShrink: 0 }} />
                          <span
                            className="pitch-compact-name"
                            style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12 }}
                            title={editVideoFileName || editVideoUrl}
                          >
                            {editVideoFileName ? editVideoFileName : (isDirectVideo(editVideoUrl) ? "Current Video Attached" : editVideoUrl)}
                          </span>
                          {editVideoFileSize && <span style={{ opacity: 0.6, fontSize: 11 }}>({editVideoFileSize})</span>}
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewPitch({
                                id: "temp-preview",
                                title: editStartup || "Preview",
                                startup: editStartup || "Preview",
                                videoUrl: editVideoUrl,
                                createdAt: "",
                              })
                            }
                            style={{
                              background: "rgba(212,175,55,0.15)",
                              border: "1px solid rgba(212,175,55,0.4)",
                              color: "var(--ciel-gold)",
                              cursor: "pointer",
                              padding: "3px 8px",
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                            title="Preview video playback"
                          >
                            <Play size={10} fill="currentColor" /> Play
                          </button>
                          <button
                            type="button"
                            onClick={() => editFileInputRef.current?.click()}
                            style={{
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid var(--line)",
                              color: "var(--text-white)",
                              cursor: "pointer",
                              padding: "3px 8px",
                              borderRadius: 4,
                              fontSize: 11,
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                            title="Replace video file"
                          >
                            <Upload size={10} /> Replace
                          </button>
                        </div>
                      ) : (
                        <div
                          className={`pitch-compact-dropzone ${editIsDragOver ? "dragover" : ""}`}
                          onClick={() => editFileInputRef.current?.click()}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setEditIsDragOver(true);
                          }}
                          onDragLeave={() => setEditIsDragOver(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setEditIsDragOver(false);
                            const f = e.dataTransfer.files?.[0];
                            if (f) handleEditVideoFileSelect(f);
                          }}
                        >
                          <Upload size={14} style={{ color: "var(--ciel-gold)" }} />
                          <span>Choose or drop new video file (up to 2 GB)</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      className="input"
                      style={{ padding: "8px 12px", fontSize: 13, height: 38, width: "100%" }}
                      placeholder="https://youtu.be/... or https://vimeo.com/..."
                      value={editVideoUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditVideoUrl(val);
                        const ytId = extractYTId(val);
                        if (ytId) {
                          setEditThumbnailUrl(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
                        }
                      }}
                      required={editVideoSource === "url"}
                    />
                  )}
                </div>

                {editMsg && (
                  <div
                    className={`alert ${editMsg.type === "ok" ? "alert-success" : "alert-error"}`}
                    style={{ padding: "8px 12px", margin: 0, fontSize: 13 }}
                  >
                    {editMsg.text}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                  <button
                    type="button"
                    className="adm-btn adm-btn-secondary"
                    onClick={() => setEditingPitch(null)}
                    disabled={editSaving || editUploadingVideo}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="adm-btn adm-btn-primary"
                    disabled={editSaving || editUploadingVideo}
                    style={{ minWidth: 120, justifyContent: "center" }}
                  >
                    {editSaving ? (
                      <>
                        <RefreshCw size={13} className="spin" /> Saving…
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={13} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// ─── MAIN ADMIN ERP COMPONENT ───────────────────────────────────────────────

export function AdminDashboardClient({
  registrations,
  profiles,
  images,
  initialMentors = [],
  initialCouncil = [],
  initialGovernance = [],
  initialEvents = [],
  initialDownloads = [],
  initialGoogleForms = [],
  initialProjects = [],
  initialPitches = [],
  stats,
  eventTitle,
}: Props) {
  const [projects, setProjects] = useState<VentureProjectItem[]>(initialProjects);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const applyTheme = (t: "dark" | "light") => {
    setTheme(t);
    localStorage.setItem("ciel_admin_theme", t);
    document.documentElement.setAttribute("data-theme", t);
    document.body.setAttribute("data-theme", t);
    if (t === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }

    const targets = document.querySelectorAll(".admin-portal, .admin-login-page, .adm-shell");
    targets.forEach((el) => el.setAttribute("data-theme", t));
  };

  useEffect(() => {
    const saved = (localStorage.getItem("ciel_admin_theme") as "dark" | "light") || "dark";
    applyTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
  };

  return (
    <div className="adm-shell" data-theme={theme}>
      {/* Sidebar Navigation */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-brand" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px", padding: "12px 16px" }}>
          <Logo href="/admin/dashboard" size="small" />
          <span style={{ fontSize: "11px", color: "var(--ciel-gold-dark)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, marginLeft: "4px", marginTop: "-14px" }}>
            ERP Admin Portal
          </span>
        </div>

        <nav className="adm-nav">
          <button className={`adm-nav-item ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
            <BarChart3 size={16} /> Dashboard
          </button>

          <button className={`adm-nav-item ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
            <UserCheck size={16} /> Users <span className="adm-nav-badge">{stats.totalUsers}</span>
          </button>

          <button className={`adm-nav-item ${activeTab === "projects" ? "active" : ""}`} onClick={() => setActiveTab("projects")}>
            <FolderGit2 size={16} /> Projects <span className="adm-nav-badge">{stats.teamCount}</span>
          </button>

          <button className={`adm-nav-item ${activeTab === "gallery" ? "active" : ""}`} onClick={() => setActiveTab("gallery")}>
            <ImageIcon size={16} /> Gallery <span className="adm-nav-badge">{stats.totalImages}</span>
          </button>

          <button className={`adm-nav-item ${activeTab === "events" ? "active" : ""}`} onClick={() => setActiveTab("events")}>
            <Calendar size={16} /> Events &amp; Workshops
          </button>

          <button className={`adm-nav-item ${activeTab === "mentors" ? "active" : ""}`} onClick={() => setActiveTab("mentors")}>
            <UserStar size={16} /> Mentors Directory
          </button>

          <button className={`adm-nav-item ${activeTab === "student-council" ? "active" : ""}`} onClick={() => setActiveTab("student-council")}>
            <GraduationCap size={16} /> Student Council
          </button>

          <button className={`adm-nav-item ${activeTab === "governance" ? "active" : ""}`} onClick={() => setActiveTab("governance")}>
            <Building2 size={16} /> Governance Committees
          </button>

          <button className={`adm-nav-item ${activeTab === "downloads" ? "active" : ""}`} onClick={() => setActiveTab("downloads")}>
            <Download size={16} /> Downloads &amp; Policies
          </button>

          <button className={`adm-nav-item ${activeTab === "google-forms" ? "active" : ""}`} onClick={() => setActiveTab("google-forms")}>
            <FileSpreadsheet size={16} /> Google Forms
          </button>

          <button className={`adm-nav-item ${activeTab === "pitches" ? "active" : ""}`} onClick={() => setActiveTab("pitches")}>
            <Video size={16} /> Elevator Pitches {stats.pitchesCount !== undefined && stats.pitchesCount > 0 && <span className="adm-nav-badge">{stats.pitchesCount}</span>}
          </button>

          <button className={`adm-nav-item ${activeTab === "analytics" ? "active" : ""}`} onClick={() => setActiveTab("analytics")}>
            <TrendingUp size={16} /> Incubation Analytics
          </button>

          <button className={`adm-nav-item ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>
            <Settings size={16} /> Settings
          </button>
        </nav>

        {/* Sidebar Stats Bar */}
        <div className="adm-sidebar-stats">
          <div className="adm-sidebar-stat"><Users size={13} /> <span>{stats.teamCount} Teams</span></div>
          <div className="adm-sidebar-stat"><UserStar size={13} /> <span>{stats.leaderCount} Leaders</span></div>
          <div className="adm-sidebar-stat"><Zap size={13} /> <span>{stats.soloCount} Solo</span></div>
        </div>

        {/* Logout */}
        <form action="/admin/logout" method="POST" className="adm-sidebar-footer">
          <button type="submit" className="adm-logout-btn">
            <LogOut size={15} /> Sign Out
          </button>
        </form>
      </aside>

      {/* Main ERP Body */}
      <main className="adm-main">
        {/* ERP Top Bar */}
        <div className="adm-topbar">
          <div className="adm-topbar-breadcrumb">
            <span>Admin ERP</span>
            <ChevronRight size={14} />
            <span style={{ color: "var(--ciel-gold-bright)", textTransform: "capitalize" }}>
              {activeTab.replace("-", " ")}
            </span>
          </div>
          <div className="adm-topbar-right" style={{ gap: "16px", display: "flex", alignItems: "center" }}>
            <button
              onClick={toggleTheme}
              className="adm-btn adm-btn-outline"
              style={{ padding: "6px 12px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? <Sun size={14} style={{ color: "#fbbf24" }} /> : <Moon size={14} style={{ color: "#2563eb" }} />}
              <span>{theme === "dark" ? "Light Theme" : "Dark Theme"}</span>
            </button>

            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Clock size={14} />
              <span>
                {new Intl.DateTimeFormat("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Asia/Kolkata",
                }).format(new Date())}
              </span>
            </div>
          </div>
        </div>

        {/* Render Tab Views */}
        {activeTab === "dashboard" && <ERPDashboardTab stats={stats} />}
        {activeTab === "users" && <ERPUsersTab profiles={profiles} registrations={registrations} projects={projects} />}
        {activeTab === "registrations" && <ERPRegistrationsTab rows={registrations} eventTitle={eventTitle} />}
        {activeTab === "projects" && <ERPProjectsTab />}
        {activeTab === "gallery" && <ERPGalleryTab initialImages={images} />}
        {activeTab === "mentors" && <ERPMentorsTab initialMentors={initialMentors} />}
        {activeTab === "student-council" && <ERPCouncilTab initialCouncil={initialCouncil} />}
        {activeTab === "governance" && <ERPGovernanceTab initialGovernance={initialGovernance} />}
        {activeTab === "events" && <ERPEventsTab initialEvents={initialEvents} />}
        {activeTab === "downloads" && <ERPDownloadsTab initialDownloads={initialDownloads} />}
        {activeTab === "google-forms" && <ERPGoogleFormsTab initialForms={initialGoogleForms} />}
        {activeTab === "pitches" && <ERPPitchesTab initialPitches={initialPitches} />}
        {activeTab === "partners" && (
          <div className="adm-tab-content">
            <div className="adm-section-head"><h2>Corporate MoUs &amp; Partners</h2><p>Manage industry alliances and seed syndicates</p></div>
            <div className="adm-table-wrap" style={{ padding: 24 }}><p style={{ color: "var(--text-secondary)" }}>Active MoUs: 30+ institutional alliances.</p></div>
          </div>
        )}
        {activeTab === "analytics" && <ERPDashboardTab stats={stats} />}
        {activeTab === "settings" && (
          <div className="adm-tab-content">
            <div className="adm-section-head"><h2>System &amp; Security Settings</h2><p>Admin credentials &amp; ERP configuration</p></div>
            <div className="adm-table-wrap" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, color: "var(--text-white)", marginBottom: 12 }}>Admin Master Credentials</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
                Master admin authentication configured via <code>ADMIN_USERNAME</code> and <code>ADMIN_PASSWORD</code> in <code>.env.local</code>.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
