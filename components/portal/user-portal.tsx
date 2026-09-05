"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Award,
  Bell,
  Briefcase,
  Calendar,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coins,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Folder,
  FolderGit2,
  FolderPlus,
  Globe,
  HelpCircle,
  KeyRound,
  Layers,
  LayoutDashboard,
  Lightbulb,
  LockKeyhole,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Rocket,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  Trophy,
  Upload,
  UserCheck,
  UserPlus,
  UserRound,
  UsersRound,
  X,
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

  // Editable Profile State
  const [currentProfile, setCurrentProfile] = useState(profile);
  const [currentRegistration, setCurrentRegistration] = useState(registration);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [profileForm, setProfileForm] = useState({
    fullName: profile?.full_name || "",
    phone: profile?.phone || "",
    rollNumber: registration.roll_number || "",
    institutionName: registration.institutions?.name || "Chetana Institute of Management & Research",
  });

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      const res = await fetch("/api/portal/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentProfile((prev) => (prev ? {
          ...prev,
          full_name: profileForm.fullName,
          phone: profileForm.phone,
        } : null));
        setCurrentRegistration((prev) => ({
          ...prev,
          roll_number: profileForm.rollNumber,
          institutions: { ...prev.institutions, name: profileForm.institutionName },
        }));
        setProfileMsg({ type: "success", text: "Profile details updated successfully!" });
        setIsEditingProfile(false);
      } else {
        setProfileMsg({ type: "error", text: data.error || "Failed to update profile." });
      }
    } catch {
      setProfileMsg({ type: "error", text: "Network error updating profile details." });
    } finally {
      setProfileSaving(false);
    }
  }

  // Live Venture Project State
  const [project, setProject] = useState({
    id: team?.id || "proj-1",
    name: team?.name || "My Venture Project",
    problemStatement: team?.problem_statement || "No problem statement submitted yet. Click 'Edit Venture' to add details.",
    stage: "idea" as "idea" | "prototype" | "validation" | "incubation" | "funding" | "market" | "scale",
    progress: 10,
    pitchDeck: "",
    grantStatus: "under_review" as "under_review" | "approved" | "grant_awarded" | "needs_revision",
    reviewerNotes: "",
    journeyMilestones: [] as Array<{
      id: string;
      stage: string;
      title: string;
      description: string;
      date: string;
      status: string;
    }>,
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
          if (p.documents && Array.isArray(p.documents)) {
            setUserDocuments(p.documents);
          }
          if (p.traction) {
            setTraction(p.traction);
          }
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
          teamName: team?.name || editForm.name,
          leaderEmail: currentProfile?.email,
          leaderName: currentProfile?.full_name,
          documents: userDocuments,
          traction: traction,
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
          userEmail: currentProfile?.email,
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
        setProject((prev) => ({ ...prev, pitchDeck: json.url }));
      } else {
        alert("Failed to upload pitch deck.");
      }
    } catch {
      alert("Error uploading pitch deck file.");
    }
  }

  // 1. REAL-TIME DOCUMENTS STATE & UPLOADER
  const [userDocuments, setUserDocuments] = useState<
    Array<{
      id: string;
      title: string;
      category: string;
      filename: string;
      format: string;
      size: string;
      date: string;
      url: string;
    }>
  >([]);
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);
  const [uploadDocForm, setUploadDocForm] = useState({
    title: "",
    category: "Pitch Deck",
    file: null as File | null,
  });
  const [docUploading, setDocUploading] = useState(false);

  async function handleAddDocument(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadDocForm.title.trim()) return;

    setDocUploading(true);
    let docUrl = "/uploads/Document_Attachment.pdf";
    let docSize = "1.5 MB";
    let docFilename = uploadDocForm.title.replace(/\s+/g, "_") + ".pdf";

    if (uploadDocForm.file) {
      docFilename = uploadDocForm.file.name;
      docSize = (uploadDocForm.file.size / (1024 * 1024)).toFixed(1) + " MB";
      const fd = new FormData();
      fd.append("image", uploadDocForm.file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (res.ok) {
          const json = await res.json();
          docUrl = json.url;
        }
      } catch {
        // Fallback to local URL
      }
    }

    const newDoc = {
      id: `doc-${Date.now()}`,
      title: uploadDocForm.title,
      category: uploadDocForm.category,
      filename: docFilename,
      format: docFilename.split(".").pop()?.toUpperCase() || "PDF",
      size: docSize,
      date: new Date().toISOString().split("T")[0],
      url: docUrl,
    };

    const updatedDocs = [newDoc, ...userDocuments];
    setUserDocuments(updatedDocs);
    setUploadDocForm({ title: "", category: "Pitch Deck", file: null });
    setDocUploading(false);
    setShowUploadDocModal(false);

    // Sync to backend project
    fetch("/api/portal/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: project.id,
        name: project.name,
        documents: updatedDocs,
        leaderEmail: currentProfile?.email,
        leaderName: currentProfile?.full_name,
      }),
    }).catch(() => {});
  }

  function handleDeleteDocument(id: string) {
    if (confirm("Are you sure you want to remove this document?")) {
      const updatedDocs = userDocuments.filter((d) => d.id !== id);
      setUserDocuments(updatedDocs);
      fetch("/api/portal/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: project.id,
          name: project.name,
          documents: updatedDocs,
          leaderEmail: currentProfile?.email,
          leaderName: currentProfile?.full_name,
        }),
      }).catch(() => {});
    }
  }

  // 2. REAL-TIME TRACTION & METRICS
  const [traction, setTraction] = useState({
    funding: "Not Sanctioned Yet",
    activePilots: "0 Pilots Active",
    iprStatus: "Not Filed",
    mrr: "₹0 / mo",
  });
  const [showTractionModal, setShowTractionModal] = useState(false);
  const [tractionForm, setTractionForm] = useState(traction);

  function handleSaveTraction(e: React.FormEvent) {
    e.preventDefault();
    setTraction(tractionForm);
    setShowTractionModal(false);

    // Sync to backend project
    fetch("/api/portal/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: project.id,
        name: project.name,
        traction: tractionForm,
        leaderEmail: currentProfile?.email,
        leaderName: currentProfile?.full_name,
      }),
    }).catch(() => {});
  }

  // 3. APPLICATIONS CENTER
  const [applications, setApplications] = useState<
    Array<{
      id: string;
      scheme: string;
      status: "approved" | "under_review" | "needs_revision" | "submitted";
      appliedDate: string;
      amount: string;
      remarks: string;
    }>
  >([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({
    scheme: "CIEL Pre-Seed Incubation Grant (₹3.5 Lakhs)",
    amount: "₹3,50,000",
    notes: "",
  });

  function handleApplyScheme(e: React.FormEvent) {
    e.preventDefault();
    const newApp = {
      id: `app-${Date.now()}`,
      scheme: applyForm.scheme,
      status: "submitted" as const,
      appliedDate: new Date().toISOString().split("T")[0],
      amount: applyForm.amount,
      remarks: "Application received and queued for review by CIEL Selection Committee.",
    };
    setApplications((prev) => [newApp, ...prev]);
    setApplyForm({ scheme: "CIEL Pre-Seed Incubation Grant (₹3.5 Lakhs)", amount: "₹3,50,000", notes: "" });
    setShowApplyModal(false);
  }

  // 4. MENTORSHIP SCHEDULER
  const [mentorSessions, setMentorSessions] = useState<
    Array<{
      id: string;
      mentorName: string;
      domain: string;
      date: string;
      time: string;
      topic: string;
      status: "confirmed" | "completed" | "pending";
      meetingLink: string;
    }>
  >([]);
  const [showBookMentorModal, setShowBookMentorModal] = useState(false);
  const [mentorForm, setMentorForm] = useState({
    mentorName: "Dr. Rajesh Verma",
    domain: "IoT Architecture & Embedded Sensors",
    date: new Date().toISOString().split("T")[0],
    time: "3:00 PM",
    topic: "",
  });

  function handleBookMentor(e: React.FormEvent) {
    e.preventDefault();
    if (!mentorForm.topic.trim()) return;
    const newSession = {
      id: `ms-${Date.now()}`,
      mentorName: mentorForm.mentorName,
      domain: mentorForm.domain,
      date: mentorForm.date,
      time: mentorForm.time,
      topic: mentorForm.topic,
      status: "confirmed" as const,
      meetingLink: "https://meet.google.com/ciel-mentor-session",
    };
    setMentorSessions((prev) => [newSession, ...prev]);
    setMentorForm({ mentorName: "Dr. Rajesh Verma", domain: "IoT Architecture & Hardware", date: "2026-03-18", time: "3:00 PM", topic: "" });
    setShowBookMentorModal(false);
  }

  // 5. EVENTS & HACKATHONS
  const [eventsList, setEventsList] = useState<
    Array<{
      id: string;
      title: string;
      date: string;
      location: string;
      category: string;
      isRegistered: boolean;
    }>
  >([]);

  function toggleEventRsvp(id: string) {
    setEventsList((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, isRegistered: !ev.isRegistered } : ev))
    );
  }

  // 6. VERIFIED CERTIFICATES
  const [certificatesList, setCertificatesList] = useState<
    Array<{
      id: string;
      title: string;
      certId: string;
      date: string;
      downloadUrl?: string;
    }>
  >([]);

  const [passwordForm, setPasswordForm] = useState({ newPassword: "", confirmPassword: "" });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);

    const newPwd = passwordForm.newPassword.trim();
    const confirmPwd = passwordForm.confirmPassword.trim();

    if (!newPwd || newPwd.length < 8) {
      setPasswordMsg({ type: "error", text: "New password must be at least 8 characters long." });
      return;
    }

    if (newPwd !== confirmPwd) {
      setPasswordMsg({ type: "error", text: "New password and confirmation do not match." });
      return;
    }

    setPasswordLoading(true);
    try {
      const userEmail = currentProfile?.email || profile?.email;
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPassword: newPwd,
          confirmPassword: confirmPwd,
          email: userEmail,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordMsg({ type: "success", text: "Password has been successfully updated!" });
        setPasswordForm({ newPassword: "", confirmPassword: "" });
      } else {
        setPasswordMsg({ type: "error", text: data.error || "Failed to update password." });
      }
    } catch {
      setPasswordMsg({ type: "error", text: "A network error occurred while resetting password." });
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "80vh", gap: 24, marginTop: 12 }}>
      {/* 1. NOTION / LINEAR STYLE SLEEK COMPACT SIDEBAR */}
      <aside
        className="portal-sidebar"
        style={{
          width: 240,
          flexShrink: 0,
          position: "sticky",
          top: 20,
          alignSelf: "flex-start",
        }}
      >
        <div style={{ padding: "0 4px 12px", borderBottom: "1px solid var(--line)", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #F5D77F, #D4AF37)",
                color: "#08090D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 14,
                boxShadow: "0 0 12px rgba(212, 175, 55, 0.25)",
                flexShrink: 0,
              }}
            >
              {getInitials(currentProfile?.full_name)}
            </div>
            <div style={{ overflow: "hidden" }}>
              <strong className="portal-user-name" style={{ fontSize: 13.5 }}>
                {currentProfile?.full_name || "Innovator Account"}
              </strong>
              <span className="portal-user-role" style={{ fontSize: 10.5 }}>
                {currentRegistration.role.replace("_", " ").toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Streamlined Compact Sidebar Nav Items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <button className={`adm-nav-item ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")} style={{ padding: "7px 10px", fontSize: 13 }}>
            <UserRound size={15} /> Profile
          </button>
          <button className={`adm-nav-item ${activeTab === "startup" ? "active" : ""}`} onClick={() => setActiveTab("startup")} style={{ padding: "7px 10px", fontSize: 13 }}>
            <Rocket size={15} /> My Startup
          </button>
          <button className={`adm-nav-item ${activeTab === "team" ? "active" : ""}`} onClick={() => setActiveTab("team")} style={{ padding: "7px 10px", fontSize: 13 }}>
            <UsersRound size={15} /> My Team <span className="adm-nav-badge">{members.length}</span>
          </button>
          <button className={`adm-nav-item ${activeTab === "documents" ? "active" : ""}`} onClick={() => setActiveTab("documents")} style={{ padding: "7px 10px", fontSize: 13 }}>
            <FileText size={15} /> Documents <span className="adm-nav-badge">{userDocuments.length}</span>
          </button>
          <button className={`adm-nav-item ${activeTab === "applications" ? "active" : ""}`} onClick={() => setActiveTab("applications")} style={{ padding: "7px 10px", fontSize: 13 }}>
            <ShieldCheck size={15} /> Applications <span className="adm-nav-badge">{applications.length}</span>
          </button>
          <button className={`adm-nav-item ${activeTab === "mentorship" ? "active" : ""}`} onClick={() => setActiveTab("mentorship")} style={{ padding: "7px 10px", fontSize: 13 }}>
            <UserCheck size={15} /> Mentorship
          </button>
          <button className={`adm-nav-item ${activeTab === "events" ? "active" : ""}`} onClick={() => setActiveTab("events")} style={{ padding: "7px 10px", fontSize: 13 }}>
            <Zap size={15} /> Events
          </button>
          <button className={`adm-nav-item ${activeTab === "certificates" ? "active" : ""}`} onClick={() => setActiveTab("certificates")} style={{ padding: "7px 10px", fontSize: 13 }}>
            <Award size={15} /> Certificates
          </button>
          <button className={`adm-nav-item ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")} style={{ padding: "7px 10px", fontSize: 13 }}>
            <Settings size={15} /> Settings
          </button>
        </nav>
      </aside>

      {/* 2. MAIN CONTENT VIEWPORT */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {/* TAB 1: PROFILE */}
        {activeTab === "profile" && (
          <div className="luxury-card" style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 22, color: "var(--text-white)", margin: 0 }}>Innovator Profile</h2>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Manage your personal credentials &amp; institutional profile</span>
              </div>
              <button
                type="button"
                className={`button ${isEditingProfile ? "button-secondary" : "button-primary"} button-small`}
                onClick={() => {
                  setIsEditingProfile(!isEditingProfile);
                  setProfileMsg(null);
                }}
              >
                {isEditingProfile ? (
                  <>
                    <X size={14} /> Cancel Editing
                  </>
                ) : (
                  <>
                    <Pencil size={14} /> Edit Profile Details
                  </>
                )}
              </button>
            </div>

            {profileMsg && (
              <div className={`alert alert-${profileMsg.type === "success" ? "success" : "danger"}`} style={{ marginBottom: 20 }}>
                {profileMsg.type === "success" ? <CheckCircle2 size={16} /> : <X size={16} />}
                <span>{profileMsg.text}</span>
              </div>
            )}

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 600 }}>
                <div>
                  <label style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, fullName: e.target.value }))}
                    placeholder=""
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>
                    Verified Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={currentProfile?.email || ""}
                    disabled
                    style={{ opacity: 0.7, cursor: "not-allowed" }}
                  />
                  <small style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4, display: "block" }}>
                    Email is linked to your secure login account.
                  </small>
                </div>

                <div>
                  <label style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>
                    Phone Contact
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder=""
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>
                    Campus / Institution
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.institutionName}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, institutionName: e.target.value }))}
                    placeholder=""
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>
                    Roll / Student ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.rollNumber}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, rollNumber: e.target.value }))}
                    placeholder=""
                    required
                  />
                </div>

                <div className="detail-row" style={{ marginTop: 4 }}>
                  <span>Portal Role</span>
                  <strong style={{ color: "var(--ciel-gold-bright)" }}>
                    {currentRegistration.role.replace("_", " ").toUpperCase()}
                  </strong>
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <button type="submit" className="button button-primary" disabled={profileSaving}>
                    <Save size={15} /> {profileSaving ? "Saving Changes..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => setIsEditingProfile(false)}
                    disabled={profileSaving}
                  >
                    <X size={15} /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="detail-list">
                <div className="detail-row">
                  <span>Full Name</span>
                  <strong>{currentProfile?.full_name || "—"}</strong>
                </div>
                <div className="detail-row">
                  <span>Verified Email</span>
                  <strong>{currentProfile?.email || "—"}</strong>
                </div>
                <div className="detail-row">
                  <span>Phone Contact</span>
                  <strong>{currentProfile?.phone || "Not provided"}</strong>
                </div>
                <div className="detail-row">
                  <span>Campus / Institution</span>
                  <strong>{currentRegistration.institutions?.name || "CIEL Campus"}</strong>
                </div>
                <div className="detail-row">
                  <span>Roll / Student ID</span>
                  <strong>{currentRegistration.roll_number || "—"}</strong>
                </div>
                <div className="detail-row">
                  <span>Portal Role</span>
                  <strong style={{ color: "var(--ciel-gold-bright)" }}>
                    {currentRegistration.role.replace("_", " ").toUpperCase()}
                  </strong>
                </div>
              </div>
            )}
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

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <span className="badge badge-brand" style={{ textTransform: "uppercase" }}>Stage: {project.stage}</span>
                <h2 style={{ fontSize: 26, margin: "8px 0 4px", color: "var(--text-white)" }}>{project.name}</h2>
                <span style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>Team Roster: {members.length} Members</span>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="button button-secondary button-small" onClick={() => setShowTractionModal(true)}>
                  <TrendingUp size={15} /> Edit Traction
                </button>
                <button className="button button-secondary button-small" onClick={() => setShowEditProjectModal(true)}>
                  <Settings size={15} /> Edit Venture
                </button>
                <button className="button button-primary button-small" onClick={() => setShowMilestoneModal(true)}>
                  <Plus size={15} /> Log Milestone
                </button>
              </div>
            </div>

            {/* REAL-TIME TRACTION & METRICS CARDS */}
            <div className="grid-4" style={{ marginBottom: 24, gap: 14 }}>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 10, border: "1px solid var(--line)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <Coins size={16} className="text-gold" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>FUNDING / GRANTS</span>
                </div>
                <strong style={{ fontSize: 15, color: "var(--ciel-gold-bright)", display: "block" }}>{traction.funding}</strong>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 10, border: "1px solid var(--line)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <Zap size={16} style={{ color: "#60A5FA" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>ACTIVE PILOTS</span>
                </div>
                <strong style={{ fontSize: 15, color: "var(--text-white)", display: "block" }}>{traction.activePilots}</strong>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 10, border: "1px solid var(--line)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <ShieldCheck size={16} style={{ color: "#10B981" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>IPR &amp; PATENTS</span>
                </div>
                <strong style={{ fontSize: 15, color: "var(--text-white)", display: "block" }}>{traction.iprStatus}</strong>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 10, border: "1px solid var(--line)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <TrendingUp size={16} style={{ color: "#F59E0B" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>MONTHLY RUN RATE</span>
                </div>
                <strong style={{ fontSize: 15, color: "var(--text-white)", display: "block" }}>{traction.mrr}</strong>
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
                {STAGES.map((st, idx) => {
                  const isActive = st.key === project.stage;
                  return (
                    <button
                      key={st.key}
                      type="button"
                      onClick={async () => {
                        const stageProgress = [10, 25, 40, 55, 70, 85, 100];
                        const newProgress = stageProgress[idx] ?? 10;
                        setProject((prev) => ({ ...prev, stage: st.key as typeof project.stage, progress: newProgress }));
                        setEditForm((prev) => ({ ...prev, stage: st.key as typeof project.stage, progress: newProgress }));
                        // Persist to API
                        try {
                          await fetch("/api/portal/projects", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              id: project.id,
                              name: project.name,
                              problemStatement: project.problemStatement,
                              stage: st.key,
                              progress: newProgress,
                              pitchDeck: project.pitchDeck,
                              teamName: team?.name || project.name,
                              leaderEmail: currentProfile?.email,
                              leaderName: currentProfile?.full_name,
                            }),
                          });
                        } catch { /* ignore — local state already updated */ }
                      }}
                      style={{
                        flex: 1,
                        padding: "10px 4px",
                        textAlign: "center",
                        borderRadius: 6,
                        background: isActive ? "linear-gradient(135deg, rgba(212,175,55,0.3), rgba(184,134,11,0.2))" : "rgba(255,255,255,0.03)",
                        border: isActive ? "1px solid var(--ciel-gold)" : "1px solid var(--line)",
                        cursor: "pointer",
                        transition: "background 0.18s, border-color 0.18s",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(212,175,55,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 700, color: isActive ? "var(--ciel-gold-bright)" : "var(--text-muted)", textTransform: "uppercase" }}>{st.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Attached Pitch Deck & Documents Quick Link */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid var(--line)", marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <FileCheck size={26} className="text-gold" />
                <div>
                  <strong style={{ color: "var(--text-white)", fontSize: 14.5, display: "block" }}>
                    Primary Venture Pitch Deck
                  </strong>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {project.pitchDeck ? "PDF Attached · Available in Documents Repository" : "No pitch deck attached yet"}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  className="button button-secondary button-small"
                  onClick={() => setShowUploadDocModal(true)}
                >
                  <Upload size={14} /> Upload New Deck
                </button>
                {project.pitchDeck && (
                  <a href={project.pitchDeck} target="_blank" rel="noreferrer" className="button button-primary button-small">
                    <Download size={14} /> Download PDF
                  </a>
                )}
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

              {project.journeyMilestones.length === 0 ? (
                <div style={{ textAlign: "center", padding: "36px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px dashed var(--line)" }}>
                  <Rocket size={32} className="text-gold" style={{ margin: "0 auto 10px", opacity: 0.8 }} />
                  <h4 style={{ fontSize: 15, color: "var(--text-white)", marginBottom: 4 }}>No Journey Milestones Logged Yet</h4>
                  <p style={{ fontSize: 12.5, color: "var(--text-secondary)", maxWidth: 380, margin: "0 auto 14px" }}>
                    Log prototypes, patent filings, user testing results, and achievements to build your official venture timeline.
                  </p>
                  <button className="button button-primary button-small" onClick={() => setShowMilestoneModal(true)}>
                    <Plus size={13} /> Log First Milestone
                  </button>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MY TEAM */}
        {activeTab === "team" && (
          <div className="luxury-card" style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 22, margin: 0 }}>Team Roster</h2>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Team Code / Name: <strong>{team?.name || project.name}</strong></span>
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
            {project.journeyMilestones.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px dashed var(--line)" }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>No milestones recorded for this project yet.</span>
              </div>
            ) : (
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
            )}
          </div>
        )}

        {/* TAB 5: DOCUMENTS & UPLOADER */}
        {activeTab === "documents" && (
          <div className="luxury-card" style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 22, color: "var(--text-white)", margin: 0 }}>Venture Documents &amp; Repository</h2>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Manage Pitch Decks, Financial Models, IPR Filings &amp; Agreements ({userDocuments.length} files)
                </span>
              </div>
              <button className="button button-primary button-small" onClick={() => setShowUploadDocModal(true)}>
                <Upload size={15} /> Upload Document
              </button>
            </div>

            {userDocuments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 24px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px dashed var(--line)" }}>
                <FileText size={36} className="text-gold" style={{ margin: "0 auto 12px", opacity: 0.8 }} />
                <h3 style={{ fontSize: 16, color: "var(--text-white)", marginBottom: 6 }}>No Documents Uploaded</h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 420, margin: "0 auto 18px" }}>
                  Upload your Pitch Deck, Technical BOM Schematics, Patent drafts, and MoU agreements.
                </p>
                <button className="button button-primary button-small" onClick={() => setShowUploadDocModal(true)}>
                  <Upload size={14} /> Upload First Document
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {userDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 16,
                      background: "rgba(255,255,255,0.025)",
                      borderRadius: 10,
                      border: "1px solid var(--line)",
                      flexWrap: "wrap",
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div className="card-icon-wrap" style={{ width: 44, height: 44, margin: 0 }}>
                        <FileText size={20} className="text-gold" />
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                          <strong style={{ color: "var(--text-white)", fontSize: 14.5 }}>{doc.title}</strong>
                          <span className="badge badge-brand" style={{ fontSize: 10 }}>{doc.category}</span>
                        </div>
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          {doc.filename} · {doc.format} · {doc.size} · Uploaded on {doc.date}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="button button-secondary button-small"
                        style={{ gap: 6 }}
                      >
                        <Download size={13} /> Download
                      </a>
                      <button
                        type="button"
                        className="button button-ghost button-small"
                        style={{ color: "#FF8080" }}
                        onClick={() => handleDeleteDocument(doc.id)}
                        title="Delete document"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: APPLICATIONS CENTER */}
        {activeTab === "applications" && (
          <div className="luxury-card" style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 22, color: "var(--text-white)", margin: 0 }}>Incubation &amp; Grant Applications</h2>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Track funding sanctions, computing allocations, and accelerator admissions
                </span>
              </div>
              <button className="button button-primary button-small" onClick={() => setShowApplyModal(true)}>
                <Plus size={15} /> Apply for New Grant / Scheme
              </button>
            </div>

            {applications.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 24px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px dashed var(--line)" }}>
                <ShieldCheck size={36} className="text-gold" style={{ margin: "0 auto 12px", opacity: 0.8 }} />
                <h3 style={{ fontSize: 16, color: "var(--text-white)", marginBottom: 6 }}>No Applications Submitted</h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 420, margin: "0 auto 18px" }}>
                  Apply for Pre-Seed Incubation Grants, MakerSpace computing lab desks, and Accelerator cohort admissions.
                </p>
                <button className="button button-primary button-small" onClick={() => setShowApplyModal(true)}>
                  <Plus size={14} /> Submit New Application
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {applications.map((app) => (
                  <div
                    key={app.id}
                    style={{
                      padding: 20,
                      background: "rgba(255,255,255,0.025)",
                      borderRadius: 10,
                      border: `1px solid ${app.status === "approved" ? "rgba(16, 185, 129, 0.4)" : "var(--line)"}`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <strong style={{ fontSize: 16, color: "var(--text-white)", display: "block" }}>{app.scheme}</strong>
                        <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
                          Applied on {app.appliedDate} · Sanction Target: {app.amount}
                        </span>
                      </div>
                      <span
                        className={`badge ${app.status === "approved" ? "badge-brand" : "badge-neutral"}`}
                        style={{ textTransform: "uppercase", fontSize: 11 }}
                      >
                        {app.status.replace("_", " ")}
                      </span>
                    </div>
                    {app.remarks && (
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "8px 0 0", padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 6 }}>
                        <strong>Committee Feedback:</strong> {app.remarks}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: MENTORSHIP SCHEDULER */}
        {activeTab === "mentorship" && (
          <div className="luxury-card" style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 22, color: "var(--text-white)", margin: 0 }}>1-on-1 Mentorship Sessions</h2>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Connect with CIEL domain experts, patent attorneys, and venture capitalists
                </span>
              </div>
              <button className="button button-primary button-small" onClick={() => setShowBookMentorModal(true)}>
                <UserCheck size={15} /> Schedule Mentor Session
              </button>
            </div>

            {mentorSessions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 24px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px dashed var(--line)" }}>
                <UserCheck size={36} className="text-gold" style={{ margin: "0 auto 12px", opacity: 0.8 }} />
                <h3 style={{ fontSize: 16, color: "var(--text-white)", marginBottom: 6 }}>No Mentorship Sessions Scheduled</h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 420, margin: "0 auto 18px" }}>
                  Connect with CIEL domain experts, patent attorneys, and venture mentors by scheduling 1-on-1 office hours.
                </p>
                <button className="button button-primary button-small" onClick={() => setShowBookMentorModal(true)}>
                  <Plus size={14} /> Schedule First Session
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {mentorSessions.map((ms) => (
                  <div
                    key={ms.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 18,
                      background: "rgba(255,255,255,0.025)",
                      borderRadius: 10,
                      border: "1px solid var(--line)",
                      flexWrap: "wrap",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <strong style={{ fontSize: 15, color: "var(--text-white)" }}>{ms.mentorName}</strong>
                        <span className="badge badge-brand" style={{ fontSize: 10 }}>{ms.domain}</span>
                      </div>
                      <span style={{ fontSize: 13, color: "var(--ciel-gold-bright)", display: "block" }}>
                        Topic: {ms.topic}
                      </span>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        Scheduled: {ms.date} at {ms.time}
                      </span>
                    </div>
                    <div>
                      {ms.meetingLink && ms.meetingLink.startsWith("http") ? (
                        <a
                          href={ms.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="button button-primary button-small"
                          style={{ gap: 6 }}
                        >
                          <ExternalLink size={13} /> Join Google Meet
                        </a>
                      ) : (
                        <span className="badge badge-neutral">PENDING CONFIRMATION</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: EVENTS & HACKATHONS */}
        {activeTab === "events" && (
          <div className="luxury-card" style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 22, color: "var(--text-white)", margin: 0 }}>Ecosystem Events &amp; Demo Days</h2>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Registered workshops, hackathons, and investor syndicate pitching sessions
                </span>
              </div>
              <Link href="/events" className="button button-secondary button-small">
                Explore All Events
              </Link>
            </div>

            {eventsList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 24px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px dashed var(--line)" }}>
                <Zap size={36} className="text-gold" style={{ margin: "0 auto 12px", opacity: 0.8 }} />
                <h3 style={{ fontSize: 16, color: "var(--text-white)", marginBottom: 6 }}>No Active Events Registered</h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 420, margin: "0 auto 18px" }}>
                  Discover upcoming hackathons, innovation challenges, and starting-from-scratch founder workshops.
                </p>
                <Link href="/events" className="button button-primary button-small">
                  Explore CIEL Events Calendar
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {eventsList.map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 18,
                      background: "rgba(255,255,255,0.025)",
                      borderRadius: 10,
                      border: `1px solid ${ev.isRegistered ? "rgba(212, 175, 55, 0.4)" : "var(--line)"}`,
                      flexWrap: "wrap",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <strong style={{ fontSize: 15, color: "var(--text-white)" }}>{ev.title}</strong>
                        <span className="badge badge-brand" style={{ fontSize: 10 }}>{ev.category}</span>
                      </div>
                      <span style={{ fontSize: 12.5, color: "var(--text-secondary)", display: "block" }}>
                        {ev.date} · Location: {ev.location}
                      </span>
                    </div>
                    <div>
                      <button
                        type="button"
                        className={`button ${ev.isRegistered ? "button-primary" : "button-secondary"} button-small`}
                        onClick={() => toggleEventRsvp(ev.id)}
                      >
                        {ev.isRegistered ? "✓ RSVP Confirmed" : "Register / Attend"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 9: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="luxury-card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, color: "var(--text-white)", marginBottom: 16 }}>System Notifications</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="alert alert-info"><Bell size={16} /> <span>Your team registration was verified by CIEL Incubation Board.</span></div>
              <div className="alert alert-info"><Clock size={16} /> <span>Welcome to CIEL Innovator Portal. Complete your startup profile to apply for pre-seed grants.</span></div>
            </div>
          </div>
        )}

        {/* TAB 10: DOWNLOADS */}
        {activeTab === "downloads" && (
          <div className="luxury-card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, color: "var(--text-white)", marginBottom: 16 }}>Official Downloads &amp; Toolkits</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {downloads.map((doc) => (
                <div key={doc.id} style={{ display: "flex", justifyContent: "space-between", padding: 14, background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid var(--line)", alignItems: "center" }}>
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

        {/* TAB 11: VERIFIED CERTIFICATES */}
        {activeTab === "certificates" && (
          <div className="luxury-card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, color: "var(--text-white)", marginBottom: 8 }}>Verified Credential Certificates</h2>
            <span style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 24 }}>
              Institutional verifiable credentials issued by Centre for Innovation &amp; Entrepreneurship Learning
            </span>

            {certificatesList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 24px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px dashed var(--line)" }}>
                <Award size={36} className="text-gold" style={{ margin: "0 auto 12px", opacity: 0.8 }} />
                <h3 style={{ fontSize: 16, color: "var(--text-white)", marginBottom: 6 }}>No Certificates Issued Yet</h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 440, margin: "0 auto 18px" }}>
                  Official verified credentials and milestone certificates will appear here once your incubation progress or cohort participation is verified by CIEL administration.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {certificatesList.map((cert) => (
                  <div
                    key={cert.id}
                    style={{
                      background: "linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(8, 9, 13, 0.95))",
                      border: "1px solid rgba(212, 175, 55, 0.4)",
                      borderRadius: 14,
                      padding: 28,
                      maxWidth: 640,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div>
                        <span className="badge badge-brand" style={{ marginBottom: 6 }}>OFFICIAL CREDENTIAL</span>
                        <h3 style={{ fontSize: 18, color: "var(--text-white)", margin: 0 }}>
                          {cert.title}
                        </h3>
                      </div>
                      <Award size={36} className="text-gold" />
                    </div>

                    <div className="detail-list" style={{ marginBottom: 20 }}>
                      <div className="detail-row">
                        <span>Innovator</span>
                        <strong>{currentProfile?.full_name || "Innovator Account"}</strong>
                      </div>
                      <div className="detail-row">
                        <span>Venture Project</span>
                        <strong>{project.name}</strong>
                      </div>
                      <div className="detail-row">
                        <span>Certificate ID</span>
                        <strong style={{ color: "var(--ciel-gold-bright)" }}>{cert.certId}</strong>
                      </div>
                      <div className="detail-row">
                        <span>Issue Date</span>
                        <strong>{cert.date}</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="button button-primary"
                      onClick={() => alert("Downloading official verified certificate PDF...")}
                      style={{ gap: 8 }}
                    >
                      <Download size={15} /> Download Signed Certificate PDF
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 12: SETTINGS */}
        {activeTab === "settings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Password Reset Card */}
            <div className="luxury-card" style={{ padding: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div className="card-icon-wrap" style={{ margin: 0, width: 44, height: 44 }}>
                  <KeyRound size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: 20, color: "var(--text-white)", margin: 0 }}>Reset Account Password</h2>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Update and secure your innovator portal login password</span>
                </div>
              </div>

              {passwordMsg && (
                <div className={`alert ${passwordMsg.type === "success" ? "alert-success" : "alert-error"}`} style={{ marginBottom: 18 }}>
                  {passwordMsg.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordReset} style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 440 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>
                    New Password (Min 8 Characters)
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="input"
                      placeholder="Enter new secure password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                      required
                      style={{ paddingRight: 40 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      style={{
                        position: "absolute",
                        right: 12,
                        background: "none",
                        border: "none",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        padding: 0,
                      }}
                      tabIndex={-1}
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>
                    Confirm New Password
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="input"
                      placeholder="Re-enter new password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      style={{ paddingRight: 40 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      style={{
                        position: "absolute",
                        right: 12,
                        background: "none",
                        border: "none",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        padding: 0,
                      }}
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="button button-primary"
                  disabled={passwordLoading}
                  style={{ width: "fit-content", marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}
                >
                  <LockKeyhole size={16} /> {passwordLoading ? "Updating Password..." : "Update Password"}
                </button>
              </form>
            </div>

            {/* Profile Preferences */}
            <div className="luxury-card" style={{ padding: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div className="card-icon-wrap" style={{ margin: 0, width: 44, height: 44 }}>
                  <Settings size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: 20, color: "var(--text-white)", margin: 0 }}>Contact Preferences</h2>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Manage your contact numbers and notifications</span>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); alert("Contact preferences saved!"); }} style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 440 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>Contact Phone Number</label>
                  <input type="text" className="input" defaultValue={currentProfile?.phone || ""} />
                </div>
                <button type="submit" className="button button-secondary" style={{ width: "fit-content" }}>Save Preferences</button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT VENTURE */}
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

        {/* MODAL: EDIT TRACTION METRICS */}
        {showTractionModal && (
          <div className="modal-backdrop" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <form onSubmit={handleSaveTraction} className="luxury-card" style={{ maxWidth: 480, width: "100%", padding: 32 }}>
              <h3 style={{ fontSize: 20, marginBottom: 16 }}>Update Venture Traction Metrics</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                <div>
                  <label className="field-label">Funding / Pre-Seed Grants</label>
                  <input
                    type="text"
                    className="input"
                    placeholder=""
                    value={tractionForm.funding}
                    onChange={(e) => setTractionForm({ ...tractionForm, funding: e.target.value })}
                  />
                </div>

                <div>
                  <label className="field-label">Active Pilots / Users</label>
                  <input
                    type="text"
                    className="input"
                    placeholder=""
                    value={tractionForm.activePilots}
                    onChange={(e) => setTractionForm({ ...tractionForm, activePilots: e.target.value })}
                  />
                </div>

                <div>
                  <label className="field-label">IPR &amp; Patent Status</label>
                  <input
                    type="text"
                    className="input"
                    placeholder=""
                    value={tractionForm.iprStatus}
                    onChange={(e) => setTractionForm({ ...tractionForm, iprStatus: e.target.value })}
                  />
                </div>

                <div>
                  <label className="field-label">Monthly Run Rate / Burn</label>
                  <input
                    type="text"
                    className="input"
                    placeholder=""
                    value={tractionForm.mrr}
                    onChange={(e) => setTractionForm({ ...tractionForm, mrr: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button type="button" className="button button-ghost" onClick={() => setShowTractionModal(false)}>Cancel</button>
                <button type="submit" className="button button-primary">
                  Save Traction Metrics
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: ADD MILESTONE */}
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
                    placeholder=""
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
                    placeholder=""
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

        {/* MODAL: UPLOAD DOCUMENT */}
        {showUploadDocModal && (
          <div className="modal-backdrop" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <form onSubmit={handleAddDocument} className="luxury-card" style={{ maxWidth: 480, width: "100%", padding: 32 }}>
              <h3 style={{ fontSize: 20, marginBottom: 16 }}>Upload Venture Document</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                <div>
                  <label className="field-label">Document Title *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder=""
                    value={uploadDocForm.title}
                    onChange={(e) => setUploadDocForm({ ...uploadDocForm, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="field-label">Category</label>
                  <select
                    className="select"
                    value={uploadDocForm.category}
                    onChange={(e) => setUploadDocForm({ ...uploadDocForm, category: e.target.value })}
                  >
                    <option value="Pitch Deck">Pitch Deck</option>
                    <option value="Technical Architecture">Technical Architecture</option>
                    <option value="IPR & Patents">IPR &amp; Patents</option>
                    <option value="Financial Model">Financial Model</option>
                    <option value="Legal & MoU">Legal &amp; MoU</option>
                    <option value="Compliance">Compliance &amp; Certificates</option>
                  </select>
                </div>

                <div>
                  <label className="field-label">Select File (.pdf, .pptx, .docx, .xlsx, .zip)</label>
                  <input
                    type="file"
                    className="input"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setUploadDocForm({ ...uploadDocForm, file: f });
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button type="button" className="button button-ghost" onClick={() => setShowUploadDocModal(false)}>Cancel</button>
                <button type="submit" className="button button-primary" disabled={docUploading}>
                  {docUploading ? "Uploading..." : "Save & Upload Document"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: APPLY FOR SCHEME */}
        {showApplyModal && (
          <div className="modal-backdrop" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <form onSubmit={handleApplyScheme} className="luxury-card" style={{ maxWidth: 500, width: "100%", padding: 32 }}>
              <h3 style={{ fontSize: 20, marginBottom: 16 }}>Apply for Incubation Scheme / Grant</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                <div>
                  <label className="field-label">Select Scheme</label>
                  <select
                    className="select"
                    value={applyForm.scheme}
                    onChange={(e) => setApplyForm({ ...applyForm, scheme: e.target.value })}
                  >
                    <option value="CIEL Pre-Seed Incubation Grant (₹3.5 Lakhs)">CIEL Pre-Seed Incubation Grant (₹3.5 Lakhs)</option>
                    <option value="MakerSpace Hardware Tech Lab Computing Allocation">MakerSpace Hardware Tech Lab Computing Allocation</option>
                    <option value="Startup Accelerator Cohort 2026 Fast-Track">Startup Accelerator Cohort 2026 Fast-Track</option>
                    <option value="CIEL Patent & Trademark Drafting Subsidy">CIEL Patent &amp; Trademark Drafting Subsidy</option>
                  </select>
                </div>

                <div>
                  <label className="field-label">Requested Sanction Target / Amount</label>
                  <input
                    type="text"
                    className="input"
                    value={applyForm.amount}
                    onChange={(e) => setApplyForm({ ...applyForm, amount: e.target.value })}
                  />
                </div>

                <div>
                  <label className="field-label">Executive Pitch &amp; Justification</label>
                  <textarea
                    className="input"
                    rows={3}
                    placeholder=""
                    value={applyForm.notes}
                    onChange={(e) => setApplyForm({ ...applyForm, notes: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button type="button" className="button button-ghost" onClick={() => setShowApplyModal(false)}>Cancel</button>
                <button type="submit" className="button button-primary">Submit Application</button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: BOOK MENTOR */}
        {showBookMentorModal && (
          <div className="modal-backdrop" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <form onSubmit={handleBookMentor} className="luxury-card" style={{ maxWidth: 500, width: "100%", padding: 32 }}>
              <h3 style={{ fontSize: 20, marginBottom: 16 }}>Schedule 1-on-1 Mentorship Session</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                <div>
                  <label className="field-label">Select Mentor</label>
                  <select
                    className="select"
                    value={mentorForm.mentorName}
                    onChange={(e) => setMentorForm({ ...mentorForm, mentorName: e.target.value })}
                  >
                    <option value="Dr. Rajesh Verma">Dr. Rajesh Verma (IoT Architecture & Embedded Sensors)</option>
                    <option value="Priya Sharma">Priya Sharma (Venture Capital & Unit Economics)</option>
                    <option value="Anand Deshmukh">Anand Deshmukh (IPR, Patents & DeepTech Commercialization)</option>
                    <option value="Dr. Sneha Patil">Dr. Sneha Patil (Go-To-Market & Institutional Sales)</option>
                  </select>
                </div>

                <div>
                  <label className="field-label">Session Topic / Discussion Agenda *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder=""
                    value={mentorForm.topic}
                    onChange={(e) => setMentorForm({ ...mentorForm, topic: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2" style={{ gap: 12 }}>
                  <div>
                    <label className="field-label">Preferred Date</label>
                    <input
                      type="date"
                      className="input"
                      value={mentorForm.date}
                      onChange={(e) => setMentorForm({ ...mentorForm, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="field-label">Time Slot</label>
                    <input
                      type="time"
                      className="input"
                      value={mentorForm.time}
                      onChange={(e) => setMentorForm({ ...mentorForm, time: e.target.value })}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button type="button" className="button button-ghost" onClick={() => setShowBookMentorModal(false)}>Cancel</button>
                <button type="submit" className="button button-primary">Confirm Booking</button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: INVITE MEMBER */}
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
                placeholder=""
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
      </main>
    </div>
  );
}
