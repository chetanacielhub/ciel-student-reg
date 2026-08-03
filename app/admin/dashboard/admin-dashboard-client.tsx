"use client";

import { useState, useRef } from "react";
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
import { CIEL_DOWNLOADS, CIEL_MENTORS } from "@/lib/ciel-data";

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
};

type Props = {
  registrations: RegistrationRow[];
  profiles: ProfileRow[];
  images: GalleryImage[];
  stats: AdminStats;
  eventTitle: string;
};

type AdminTab =
  | "dashboard"
  | "users"
  | "registrations"
  | "projects"
  | "gallery"
  | "events"
  | "news"
  | "downloads"
  | "mentors"
  | "partners"
  | "analytics"
  | "settings";

const ROLE_LABELS = {
  team_leader: "Team Leader",
  team_member: "Team Member",
  solo: "Solo",
};

// ─── ERP SUB-VIEWS ─────────────────────────────────────────────────────────

/** 1. DASHBOARD ERP OVERVIEW */
function ERPDashboardTab({ stats, registrations }: { stats: AdminStats; registrations: RegistrationRow[] }) {
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
          <button className="adm-btn adm-btn-outline" onClick={() => alert("Exporting Excel format...")}>
            Export Excel
          </button>
          <button className="adm-btn adm-btn-outline" onClick={() => alert("Generating PDF Report...")}>
            Export PDF
          </button>
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

// ─── MAIN ADMIN ERP COMPONENT ───────────────────────────────────────────────

export function AdminDashboardClient({
  registrations,
  profiles,
  images,
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

          <button className={`adm-nav-item ${activeTab === "events" ? "active" : ""}`} onClick={() => setActiveTab("events")}>
            <Calendar size={16} /> Events
          </button>

          <button className={`adm-nav-item ${activeTab === "news" ? "active" : ""}`} onClick={() => setActiveTab("news")}>
            <Newspaper size={16} /> News
          </button>

          <button className={`adm-nav-item ${activeTab === "downloads" ? "active" : ""}`} onClick={() => setActiveTab("downloads")}>
            <Download size={16} /> Downloads
          </button>

          <button className={`adm-nav-item ${activeTab === "mentors" ? "active" : ""}`} onClick={() => setActiveTab("mentors")}>
            <UserStar size={16} /> Mentors
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
            <span style={{ color: "var(--ciel-gold-bright)", textTransform: "capitalize" }}>{activeTab}</span>
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
        {activeTab === "dashboard" && <ERPDashboardTab stats={stats} registrations={registrations} />}
        {activeTab === "users" && <ERPUsersTab profiles={profiles} />}
        {activeTab === "registrations" && <ERPRegistrationsTab rows={registrations} eventTitle={eventTitle} />}
        {activeTab === "projects" && (
          <div className="adm-tab-content">
            <div className="adm-section-head"><h2>Venture Projects ERP</h2><p>Stage approval and milestone monitoring</p></div>
            <div className="adm-table-wrap" style={{ padding: 24 }}>
              <p style={{ color: "var(--text-secondary)" }}>Total Active Ventures: {stats.teamCount}. All registered ventures are mapped under stage reviews.</p>
            </div>
          </div>
        )}
        {activeTab === "gallery" && <ERPGalleryTab initialImages={images} />}
        {activeTab === "events" && (
          <div className="adm-tab-content">
            <div className="adm-section-head"><h2>Events &amp; Hackathons Management</h2><p>Configure campus competitions and workshop posters</p></div>
            <div className="adm-table-wrap" style={{ padding: 24 }}><p style={{ color: "var(--text-white)" }}>Event: {eventTitle} (Active)</p></div>
          </div>
        )}
        {activeTab === "news" && (
          <div className="adm-tab-content">
            <div className="adm-section-head"><h2>News &amp; Media Releases</h2><p>Publish announcements on the public portal</p></div>
            <div className="adm-table-wrap" style={{ padding: 24 }}><p style={{ color: "var(--text-secondary)" }}>Manage institutional press announcements.</p></div>
          </div>
        )}
        {activeTab === "downloads" && (
          <div className="adm-tab-content">
            <div className="adm-section-head"><h2>Policy Downloads Management</h2><p>Upload and manage PDF handbooks &amp; IP templates</p></div>
            <div className="adm-table-wrap" style={{ padding: 24 }}><p style={{ color: "var(--text-secondary)" }}>Repository files: {CIEL_DOWNLOADS.length} documents published.</p></div>
          </div>
        )}
        {activeTab === "mentors" && (
          <div className="adm-tab-content">
            <div className="adm-section-head"><h2>Mentors &amp; Advisors Directory</h2><p>Manage domain experts and 1-on-1 assignments</p></div>
            <div className="adm-table-wrap" style={{ padding: 24 }}><p style={{ color: "var(--text-secondary)" }}>Directory: {CIEL_MENTORS.length} active mentors listed.</p></div>
          </div>
        )}
        {activeTab === "partners" && (
          <div className="adm-tab-content">
            <div className="adm-section-head"><h2>Corporate MoUs &amp; Partners</h2><p>Manage industry alliances and seed syndicates</p></div>
            <div className="adm-table-wrap" style={{ padding: 24 }}><p style={{ color: "var(--text-secondary)" }}>Active MoUs: 30+ institutional alliances.</p></div>
          </div>
        )}
        {activeTab === "analytics" && <ERPDashboardTab stats={stats} registrations={registrations} />}
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
