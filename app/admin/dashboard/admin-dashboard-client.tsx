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
  Newspaper,
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
  X,
  Zap,
} from "lucide-react";
import { CIEL_DOWNLOADS } from "@/lib/ciel-data";
import type { GovernanceCommitteeItem, MentorItem, StudentCouncilLeadItem, VentureProjectItem, CielEventItem, NewsItem, DownloadItem } from "@/lib/types";
import { LinkedInIcon } from "@/components/ui/linkedin-icon";

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
};

type Props = {
  registrations: RegistrationRow[];
  profiles: ProfileRow[];
  images: GalleryImage[];
  initialMentors?: MentorItem[];
  initialCouncil?: StudentCouncilLeadItem[];
  initialGovernance?: GovernanceCommitteeItem[];
  initialEvents?: CielEventItem[];
  initialNews?: NewsItem[];
  initialDownloads?: DownloadItem[];
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
  | "news"
  | "downloads"
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
function ERPUsersTab({ profiles }: { profiles: ProfileRow[] }) {
  const [query, setQuery] = useState("");
  const [userList, setUserList] = useState(
    profiles.map((p) => ({ ...p, status: "active" as "active" | "suspended" | "pending" }))
  );

  const filtered = userList.filter((p) => {
    const q = query.trim().toLowerCase();
    return !q || [p.full_name, p.email ?? "", p.phone ?? ""].some((v) => v.toLowerCase().includes(q));
  });

  function toggleStatus(id: string, nextStatus: "active" | "suspended") {
    setUserList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u))
    );
  }

  function deleteUser(id: string) {
    if (confirm("Are you sure you want to delete this user record from ERP?")) {
      setUserList((prev) => prev.filter((u) => u.id !== id));
    }
  }

  return (
    <div className="adm-tab-content">
      <div className="adm-section-head">
        <div>
          <h2>User Accounts Management</h2>
          <p>Approve, suspend, or manage platform user credentials · {filtered.length} total</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="adm-btn adm-btn-outline" onClick={() => alert("Exporting Users CSV...")}>
            <Download size={14} /> Export Users CSV
          </button>
        </div>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search">
          <Search size={16} className="adm-search-icon" />
          <input
            type="search"
            placeholder="Search name, email, phone..."
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
                  <td className="adm-td-primary">{p.full_name || "—"}</td>
                  <td className="adm-td-secondary">{p.email || "—"}</td>
                  <td className="adm-td-secondary">{p.phone || "—"}</td>
                  <td>
                    <span
                      className={`badge ${p.status === "active" ? "badge-brand" : "badge-neutral"}`}
                      style={{ textTransform: "capitalize", fontSize: 11 }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="adm-td-secondary">
                    {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(p.created_at))}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
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
            placeholder="Search name, team, roll number, problem..."
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
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);

    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch("/admin/gallery", { method: "POST", body: fd });
    const json = await res.json();

    if (res.ok) {
      setImages((prev) => [{ filename: json.filename, url: `/gallery/${json.filename}` }, ...prev]);
      if (fileRef.current) fileRef.current.value = "";
    }
    setUploading(false);
  }

  async function handleDelete(filename: string) {
    setDeleting(filename);
    const res = await fetch(`/admin/gallery?file=${encodeURIComponent(filename)}`, { method: "DELETE" });
    if (res.ok) {
      setImages((prev) => prev.filter((img) => img.filename !== filename));
    }
    setDeleting(null);
  }

  return (
    <div className="adm-tab-content">
      <div className="adm-section-head">
        <div>
          <h2>Gallery &amp; Media Management</h2>
          <p>Upload and manage event images displayed on the public gallery · {images.length} images</p>
        </div>
      </div>

      <div className="adm-upload-card">
        <div className="adm-upload-icon"><Upload size={22} /></div>
        <div style={{ flex: 1 }}>
          <h3 className="adm-upload-title">Upload New Media</h3>
          <p className="adm-upload-desc">JPG, PNG, WebP, GIF or AVIF up to 10MB</p>
        </div>
        <form onSubmit={handleUpload} className="adm-upload-form">
          <input ref={fileRef} type="file" accept="image/*" className="adm-file-input" id="erp-gallery-file" />
          <label htmlFor="erp-gallery-file" className="adm-btn adm-btn-outline adm-file-label">
            <ImageIcon size={14} /> Choose File
          </label>
          <button type="submit" className="adm-btn adm-btn-primary" disabled={uploading}>
            {uploading ? <RefreshCw size={14} className="adm-spin" /> : <Upload size={14} />}
            {uploading ? "Uploading..." : "Upload Media"}
          </button>
        </form>
      </div>

      <div className="adm-gallery-grid">
        {images.map((img) => (
          <div key={img.filename} className="adm-gallery-item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.filename} className="adm-gallery-img" />
            <div className="adm-gallery-overlay">
              <span className="adm-gallery-filename">{img.filename}</span>
              <button className="adm-gallery-del" onClick={() => handleDelete(img.filename)} disabled={deleting === img.filename}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 5. MENTORS MANAGEMENT ERP TAB */
function ERPMentorsTab({ initialMentors }: { initialMentors: MentorItem[] }) {
  const [mentors, setMentors] = useState<MentorItem[]>(initialMentors);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
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

  async function handleAddMentor(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.designation) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/mentors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          expertise: form.expertise ? form.expertise.split(",").map((s) => s.trim()).filter(Boolean) : [],
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setMentors((prev) => [created, ...prev]);
        setShowModal(false);
        setForm({ name: "", designation: "", organization: "", category: "industry", expertise: "", avatar: "", linkedinUrl: "" });
      } else {
        const err = await res.json();
        alert(err.error || "Failed to add mentor.");
      }
    } catch {
      alert("Error adding mentor.");
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
            placeholder="Search mentor name, designation, organization..."
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
                    <button className="adm-btn adm-btn-outline" style={{ padding: "4px 8px", color: "#FF8080" }} onClick={() => handleDelete(m.id)}>
                      <Trash2 size={14} />
                    </button>
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
              <h3 style={{ color: "var(--text-white)", fontSize: 18, margin: 0 }}>Add New Mentor / Advisor</h3>
              <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }} onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMentor} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="field-label">Full Name *</label>
                <input required className="input" placeholder="e.g. Dr. Sunita Deshmukh" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Designation / Title *</label>
                <input required className="input" placeholder="e.g. Managing Partner / Senior VP" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Organization / Firm</label>
                <input className="input" placeholder="e.g. Vanguard Capital / Tech Hub" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
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
                <input className="input" type="url" placeholder="https://linkedin.com/in/username" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Core Expertise (Comma separated)</label>
                <input className="input" placeholder="e.g. Angel Funding, SaaS Scaling, Patent Strategy" value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} />
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
                    placeholder="https://... or Initials (e.g. SD)"
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
                <button type="button" className="adm-btn adm-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn-primary" disabled={submitting}>
                  {submitting ? "Adding..." : "Add Mentor"}
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
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    branch: "",
    year: "",
    avatar: "",
    linkedinUrl: "",
  });

  const filtered = council.filter((sc) => {
    const q = query.trim().toLowerCase();
    return !q || [sc.name, sc.role, sc.branch, sc.year].some((v) => v.toLowerCase().includes(q));
  });

  async function handleAddLead(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.role) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/student-council", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const created = await res.json();
        setCouncil((prev) => [...prev, created]);
        setShowModal(false);
        setForm({ name: "", role: "", branch: "", year: "", avatar: "", linkedinUrl: "" });
      } else {
        const err = await res.json();
        alert(err.error || "Failed to add council lead.");
      }
    } catch {
      alert("Error adding council lead.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to remove this student council lead?")) return;
    try {
      const res = await fetch(`/api/admin/student-council?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        setCouncil((prev) => prev.filter((sc) => sc.id !== id && sc.name !== id));
      }
    } catch {
      alert("Failed to delete council lead.");
    }
  }

  return (
    <div className="adm-tab-content">
      <div className="adm-section-head">
        <div>
          <h2>Student Innovation Council (SIC)</h2>
          <p>Manage elected student office bearers, hackathon leads &amp; lab managers · {council.length} council leads</p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Add Council Lead
        </button>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search">
          <Search size={16} className="adm-search-icon" />
          <input
            type="search"
            placeholder="Search council member name, role, department..."
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
              <th>Student Leader</th>
              <th>Council Designation / Role</th>
              <th>Branch / Department</th>
              <th>Academic Year</th>
              <th>LinkedIn</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="adm-empty-cell">No student council members found.</td>
              </tr>
            ) : (
              filtered.map((sc, i) => (
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
                    <button className="adm-btn adm-btn-outline" style={{ padding: "4px 8px", color: "#FF8080" }} onClick={() => handleDelete(sc.id || sc.name)}>
                      <Trash2 size={14} />
                    </button>
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
              <h3 style={{ color: "var(--text-white)", fontSize: 18, margin: 0 }}>Add Student Innovation Council Lead</h3>
              <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }} onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddLead} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="field-label">Student Name *</label>
                <input required className="input" placeholder="e.g. Aarav Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Council Designation / Role *</label>
                <input required className="input" placeholder="e.g. President, Student Innovation Council" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Department / Branch</label>
                <input className="input" placeholder="e.g. Computer Engineering" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Academic Year</label>
                <input className="input" placeholder="e.g. Final Year / Pre-Final Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
              </div>

              <div>
                <label className="field-label">LinkedIn Profile URL (Optional)</label>
                <input className="input" type="url" placeholder="https://linkedin.com/in/username" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} />
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
                    placeholder="https://... or Initials (e.g. AS)"
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
                <button type="button" className="adm-btn adm-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn-primary" disabled={submitting}>
                  {submitting ? "Adding..." : "Add Council Lead"}
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
  const [selectedCommittee, setSelectedCommittee] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [commForm, setCommForm] = useState({ name: "", description: "" });
  const [memberForm, setMemberForm] = useState({ committeeName: "", name: "", role: "", linkedinUrl: "", avatar: "" });

  async function handleAddCommittee(e: React.FormEvent) {
    e.preventDefault();
    if (!commForm.name) return;

    setSubmitting(true);
    try {
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
        setShowCommitteeModal(false);
        setCommForm({ name: "", description: "" });
      } else {
        const err = await res.json();
        alert(err.error || "Failed to add committee.");
      }
    } catch {
      alert("Error adding committee.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    const cName = memberForm.committeeName || selectedCommittee;
    if (!cName || !memberForm.name || !memberForm.role) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/governance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_member",
          committeeName: cName,
          memberName: memberForm.name,
          role: memberForm.role,
          linkedinUrl: memberForm.linkedinUrl,
          avatar: memberForm.avatar,
        }),
      });

      if (res.ok) {
        setGovernance((prev) =>
          prev.map((g) => {
            if (g.name.toLowerCase() === cName.toLowerCase()) {
              return {
                ...g,
                members: [...g.members, { name: memberForm.name, role: memberForm.role, linkedinUrl: memberForm.linkedinUrl, avatar: memberForm.avatar }],
              };
            }
            return g;
          })
        );
        setShowMemberModal(false);
        setMemberForm({ committeeName: "", name: "", role: "", linkedinUrl: "", avatar: "" });
      } else {
        const err = await res.json();
        alert(err.error || "Failed to add member.");
      }
    } catch {
      alert("Error adding member.");
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
          <button className="adm-btn adm-btn-primary" onClick={() => { setSelectedCommittee(governance[0]?.name || ""); setShowMemberModal(true); }}>
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
                  <button
                    style={{ background: "none", border: "none", color: "#FF8080", cursor: "pointer", padding: 4 }}
                    onClick={() => handleDeleteMember(comm.name, m.name)}
                    title="Remove Member"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Committee */}
      {showCommitteeModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 }}>
          <div style={{ background: "var(--charcoal-card)", border: "1px solid var(--ciel-gold-border)", borderRadius: "var(--radius-lg)", padding: 28, width: "100%", maxWidth: 480 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ color: "var(--text-white)", fontSize: 18, margin: 0 }}>Add Governance Committee</h3>
              <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }} onClick={() => setShowCommitteeModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCommittee} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="field-label">Committee Name *</label>
                <input required className="input" placeholder="e.g. Research &amp; Ethics Board" value={commForm.name} onChange={(e) => setCommForm({ ...commForm, name: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Description / Scope</label>
                <textarea className="input" rows={3} placeholder="Describes committee role and authority..." value={commForm.description} onChange={(e) => setCommForm({ ...commForm, description: e.target.value })} />
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
                <button type="button" className="adm-btn adm-btn-outline" onClick={() => setShowCommitteeModal(false)}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn-primary" disabled={submitting}>
                  {submitting ? "Adding..." : "Add Committee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Member */}
      {showMemberModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 }}>
          <div style={{ background: "var(--charcoal-card)", border: "1px solid var(--ciel-gold-border)", borderRadius: "var(--radius-lg)", padding: 28, width: "100%", maxWidth: 480 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ color: "var(--text-white)", fontSize: 18, margin: 0 }}>Add Member to Governance Committee</h3>
              <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }} onClick={() => setShowMemberModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMember} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
                <input required className="input" placeholder="e.g. Dr. B. R. Patil" value={memberForm.name} onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Designation / Role in Committee *</label>
                <input required className="input" placeholder="e.g. Chairman, Governing Board" value={memberForm.role} onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })} />
              </div>

              <div>
                <label className="field-label">LinkedIn Profile URL (Optional)</label>
                <input className="input" type="url" placeholder="https://linkedin.com/in/username" value={memberForm.linkedinUrl} onChange={(e) => setMemberForm({ ...memberForm, linkedinUrl: e.target.value })} />
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
                    placeholder="https://... or Initials (e.g. BP)"
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
                <button type="button" className="adm-btn adm-btn-outline" onClick={() => setShowMemberModal(false)}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn-primary" disabled={submitting}>
                  {submitting ? "Adding..." : "Add Member"}
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
            placeholder="Search venture name, problem statement, team leader..."
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
                  placeholder="Feedback notes visible to innovator on their portal..."
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
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    category: "Hackathon",
    date: "",
    time: "",
    venue: "",
    desc: "",
    posterUrl: "",
  });

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

  async function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.date) {
      alert("Title and Date are required");
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (res.ok && json.event) {
        setEvents((prev) => [json.event, ...prev]);
        setForm({ title: "", category: "Hackathon", date: "", time: "", venue: "", desc: "", posterUrl: "" });
        setIsAdding(false);
      } else {
        alert(json.error || "Failed to add event");
      }
    } catch {
      alert("Error adding event");
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
        <button className="adm-btn adm-btn-primary" onClick={() => setIsAdding(!isAdding)}>
          <Plus size={16} /> {isAdding ? "Close Form" : "Add New Event"}
        </button>
      </div>

      {isAdding && (
        <div className="adm-table-wrap" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, color: "var(--text-white)", marginBottom: 16 }}>Add New Event</h3>
          <form onSubmit={handleAddEvent} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label className="field-label">Event Title *</label>
                <input className="input" required placeholder="CIEL Annual Hackathon 2026" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div>
                <label className="field-label">Date *</label>
                <input className="input" required placeholder="March 15-16, 2026" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Time</label>
                <input className="input" placeholder="09:00 AM - 05:00 PM" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Venue</label>
                <input className="input" placeholder="CIEL Prototyping Labs" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="field-label">Event Description</label>
              <textarea className="input" rows={3} placeholder="Event details and registration instructions..." value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
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
              <button type="button" className="adm-btn adm-btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
              <button type="submit" className="adm-btn adm-btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : "Publish Event"}
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
                    <button className="adm-icon-btn text-danger" title="Delete Event" onClick={() => handleDelete(ev.id)}>
                      <Trash2 size={16} />
                    </button>
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

// ─── NEWS ERP TAB ───────────────────────────────────────────────────────────

function ERPNewsTab({ initialNews = [] }: { initialNews?: NewsItem[] }) {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "Funding Disbursement",
    date: "",
    summary: "",
  });

  async function handleAddNews(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.summary) {
      alert("Title and Summary are required");
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (res.ok && json.news) {
        setNews((prev) => [json.news, ...prev]);
        setForm({ title: "", category: "Funding Disbursement", date: "", summary: "" });
        setIsAdding(false);
      } else {
        alert(json.error || "Failed to add announcement");
      }
    } catch {
      alert("Error adding announcement");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const res = await fetch(`/api/admin/news?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        setNews((prev) => prev.filter((n) => n.id !== id));
      }
    } catch {
      alert("Failed to delete news item");
    }
  }

  return (
    <div className="adm-tab-content">
      <div className="adm-section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>News &amp; Announcements Management</h2>
          <p>Publish press bulletins, funding updates, and institutional news</p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={() => setIsAdding(!isAdding)}>
          <Plus size={16} /> {isAdding ? "Close Form" : "Publish Announcement"}
        </button>
      </div>

      {isAdding && (
        <div className="adm-table-wrap" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, color: "var(--text-white)", marginBottom: 16 }}>New Press Announcement</h3>
          <form onSubmit={handleAddNews} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
              <div>
                <label className="field-label">Headline / Title *</label>
                <input className="input" required placeholder="CIEL Startup Wins ₹25L Seed Fund" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>

              <div>
                <label className="field-label">Category</label>
                <select className="adm-select" style={{ width: "100%" }} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="Funding Disbursement">Funding Disbursement</option>
                  <option value="Strategic Partnership">Strategic Partnership</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Patent Grant">Patent Grant</option>
                  <option value="Award &amp; Recognition">Award &amp; Recognition</option>
                </select>
              </div>
            </div>

            <div>
              <label className="field-label">Date</label>
              <input className="input" placeholder="February 01, 2026" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>

            <div>
              <label className="field-label">Announcement Summary / Excerpt *</label>
              <textarea className="input" rows={3} required placeholder="Summary of press release..." value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button type="button" className="adm-btn adm-btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
              <button type="submit" className="adm-btn adm-btn-primary" disabled={submitting}>
                {submitting ? "Publishing..." : "Publish Announcement"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Headline</th>
              <th>Category</th>
              <th>Date</th>
              <th>Summary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {news.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 24, color: "var(--text-muted)" }}>No news items published.</td></tr>
            ) : (
              news.map((n) => (
                <tr key={n.id}>
                  <td><strong style={{ color: "var(--text-white)" }}>{n.title}</strong></td>
                  <td><span className="badge badge-brand">{n.category}</span></td>
                  <td><span style={{ color: "var(--ciel-gold-bright)" }}>{n.date}</span></td>
                  <td style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 300 }}>{n.summary}</td>
                  <td>
                    <button className="adm-icon-btn text-danger" title="Delete News" onClick={() => handleDelete(n.id)}>
                      <Trash2 size={16} />
                    </button>
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

  async function handleAddDoc(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description) {
      alert("Title and Description are required");
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (res.ok && json.download) {
        setDownloads((prev) => [json.download, ...prev]);
        setForm({ title: "", category: "policy", format: "PDF", fileSize: "1.5 MB", description: "", fileUrl: "" });
        setIsAdding(false);
      } else {
        alert(json.error || "Failed to add document");
      }
    } catch {
      alert("Error adding document");
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
        <button className="adm-btn adm-btn-primary" onClick={() => setIsAdding(!isAdding)}>
          <Plus size={16} /> {isAdding ? "Close Form" : "Upload New Policy Document"}
        </button>
      </div>

      {isAdding && (
        <div className="adm-table-wrap" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, color: "var(--text-white)", marginBottom: 16 }}>Upload Policy Manual or Document</h3>
          <form onSubmit={handleAddDoc} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
              <div>
                <label className="field-label">Document Title *</label>
                <input className="input" required placeholder="CIEL Incubation & Seed Support Policy Handbook" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
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
              <textarea className="input" rows={2} required placeholder="Summary of terms, equity share, and guidelines..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
              <button type="button" className="adm-btn adm-btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
              <button type="submit" className="adm-btn adm-btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : "Publish Document"}
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

// ─── MAIN ADMIN ERP COMPONENT ───────────────────────────────────────────────

export function AdminDashboardClient({
  registrations,
  profiles,
  images,
  initialMentors = [],
  initialCouncil = [],
  initialGovernance = [],
  initialEvents = [],
  initialNews = [],
  initialDownloads = [],
  stats,
  eventTitle,
}: Props) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  return (
    <div className="adm-shell">
      {/* Sidebar Navigation */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-brand">
          <ShieldCheck size={20} />
          <span>CIEL ERP Admin</span>
        </div>

        <nav className="adm-nav">
          <button className={`adm-nav-item ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
            <BarChart3 size={16} /> Dashboard
          </button>

          <button className={`adm-nav-item ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
            <UserCheck size={16} /> Users <span className="adm-nav-badge">{stats.totalUsers}</span>
          </button>

          <button className={`adm-nav-item ${activeTab === "registrations" ? "active" : ""}`} onClick={() => setActiveTab("registrations")}>
            <Users size={16} /> Registrations <span className="adm-nav-badge">{stats.totalRegistrations}</span>
          </button>

          <button className={`adm-nav-item ${activeTab === "projects" ? "active" : ""}`} onClick={() => setActiveTab("projects")}>
            <FolderGit2 size={16} /> Projects <span className="adm-nav-badge">{stats.teamCount}</span>
          </button>

          <button className={`adm-nav-item ${activeTab === "gallery" ? "active" : ""}`} onClick={() => setActiveTab("gallery")}>
            <ImageIcon size={16} /> Gallery <span className="adm-nav-badge">{stats.totalImages}</span>
          </button>

          <button className={`adm-nav-item ${activeTab === "mentors" ? "active" : ""}`} onClick={() => setActiveTab("mentors")}>
            <UserStar size={16} /> Mentors <span className="adm-nav-badge">{stats.mentorCount ?? initialMentors.length}</span>
          </button>

          <button className={`adm-nav-item ${activeTab === "student-council" ? "active" : ""}`} onClick={() => setActiveTab("student-council")}>
            <GraduationCap size={16} /> Student Council <span className="adm-nav-badge">{stats.councilCount ?? initialCouncil.length}</span>
          </button>

          <button className={`adm-nav-item ${activeTab === "governance" ? "active" : ""}`} onClick={() => setActiveTab("governance")}>
            <Shield size={16} /> Governance <span className="adm-nav-badge">{stats.governanceCount ?? initialGovernance.length}</span>
          </button>

          <button className={`adm-nav-item ${activeTab === "events" ? "active" : ""}`} onClick={() => setActiveTab("events")}>
            <Calendar size={16} /> Events <span className="adm-nav-badge">{initialEvents.length}</span>
          </button>

          <button className={`adm-nav-item ${activeTab === "news" ? "active" : ""}`} onClick={() => setActiveTab("news")}>
            <Newspaper size={16} /> News <span className="adm-nav-badge">{initialNews.length}</span>
          </button>

          <button className={`adm-nav-item ${activeTab === "downloads" ? "active" : ""}`} onClick={() => setActiveTab("downloads")}>
            <Download size={16} /> Downloads <span className="adm-nav-badge">{initialDownloads.length}</span>
          </button>

          <button className={`adm-nav-item ${activeTab === "partners" ? "active" : ""}`} onClick={() => setActiveTab("partners")}>
            <Handshake size={16} /> Partners
          </button>

          <button className={`adm-nav-item ${activeTab === "analytics" ? "active" : ""}`} onClick={() => setActiveTab("analytics")}>
            <Activity size={16} /> Analytics
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
          <div className="adm-topbar-right">
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

        {/* Render Tab Views */}
        {activeTab === "dashboard" && <ERPDashboardTab stats={stats} />}
        {activeTab === "users" && <ERPUsersTab profiles={profiles} />}
        {activeTab === "registrations" && <ERPRegistrationsTab rows={registrations} eventTitle={eventTitle} />}
        {activeTab === "projects" && <ERPProjectsTab />}
        {activeTab === "gallery" && <ERPGalleryTab initialImages={images} />}
        {activeTab === "mentors" && <ERPMentorsTab initialMentors={initialMentors} />}
        {activeTab === "student-council" && <ERPCouncilTab initialCouncil={initialCouncil} />}
        {activeTab === "governance" && <ERPGovernanceTab initialGovernance={initialGovernance} />}
        {activeTab === "events" && <ERPEventsTab initialEvents={initialEvents} />}
        {activeTab === "news" && <ERPNewsTab initialNews={initialNews} />}
        {activeTab === "downloads" && <ERPDownloadsTab initialDownloads={initialDownloads} />}
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
