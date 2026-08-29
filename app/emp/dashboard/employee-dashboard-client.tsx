"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EmpSessionData } from "@/lib/emp-auth";
import { EmpThemeToggle } from "../emp-theme-toggle";
import { Logo } from "@/components/ui/logo";
import {
  AttendanceRecord,
  TaskRecord,
  MonthlyReportRecord,
  AttendanceStatus,
  TaskStatus,
  TaskPriority,
} from "@/lib/emp-store";
import {
  Calendar,
  Clock,
  CheckSquare,
  FileText,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  X,
  Filter,
  User,
  MapPin,
  Compass,
  Navigation,
  Target,
  RefreshCw,
  TrendingUp,
  Zap,
  Activity,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Printer,
  Eye,
  Award,
  BarChart3,
  Copy,
  Check,
  CalendarDays,
} from "lucide-react";

export default function EmployeeDashboardClient({ user }: { user: EmpSessionData }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"attendance" | "tasks" | "monthly_report">("attendance");

  const todayStr = new Date().toISOString().split("T")[0];
  const currentMonthStr = new Date().toISOString().slice(0, 7); // e.g. "2026-08"

  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // State
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);

  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>("all");

  // Monthly Report state
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReportRecord[]>([]);
  const [monthlyReportForm, setMonthlyReportForm] = useState({
    key_achievements: "",
    major_challenges: "",
    next_month_goals: "",
    learnings_skills: "",
    support_needed: "",
    notes: "",
  });
  const [previewReportModal, setPreviewReportModal] = useState<MonthlyReportRecord | null>(null);
  const [copiedStatus, setCopiedStatus] = useState(false);

  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Geolocation state
  const [geoStatus, setGeoStatus] = useState<{
    loading: boolean;
    lat: number | null;
    lng: number | null;
    distanceMeters: number | null;
    isWithinGeofence: boolean | null;
    error: string | null;
  }>({
    loading: false,
    lat: null,
    lng: null,
    distanceMeters: null,
    isWithinGeofence: null,
    error: null,
  });

  // Task Modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskRecord | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState<TaskPriority>("Medium");
  const [taskStatus, setTaskStatus] = useState<TaskStatus>("Pending");

  // Task Delete Confirmation Modal
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const attRes = await fetch("/emp/api/attendance");
      const attData = await attRes.json();
      if (attData.success) {
        setAttendanceRecords(attData.data);
        const todayRec = attData.data.find((r: AttendanceRecord) => r.date === todayStr);
        setTodayAttendance(todayRec || null);
      }

      const taskRes = await fetch("/emp/api/tasks");
      const taskData = await taskRes.json();
      if (taskData.success) {
        setTasks(taskData.data);
      }

      const repRes = await fetch("/emp/api/monthly-reports");
      const repData = await repRes.json();
      if (repData.success) {
        setMonthlyReports(repData.data);
      }
    } catch {
      setActionMessage({ type: "error", text: "Failed to load dashboard data." });
    } finally {
      setLoading(false);
    }
  };

  // Sync form data whenever selectedMonth or monthlyReports list changes
  useEffect(() => {
    const existing = monthlyReports.find((r) => r.month === selectedMonth);
    if (existing) {
      setMonthlyReportForm({
        key_achievements: existing.key_achievements || "",
        major_challenges: existing.major_challenges || "",
        next_month_goals: existing.next_month_goals || "",
        learnings_skills: existing.learnings_skills || "",
        support_needed: existing.support_needed || "",
        notes: existing.notes || "",
      });
    } else {
      setMonthlyReportForm({
        key_achievements: "",
        major_challenges: "",
        next_month_goals: "",
        learnings_skills: "",
        support_needed: "",
        notes: "",
      });
    }
  }, [selectedMonth, monthlyReports]);

  const triggerAutoLocationCheck = (bypass: boolean = false) => {
    setGeoStatus((prev) => ({ ...prev, loading: true, error: null }));

    const processCoordinates = async (latitude: number, longitude: number) => {
      try {
        const res = await fetch("/emp/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "auto_location",
            latitude,
            longitude,
            bypassGeofence: bypass,
          }),
        });

        const data = await res.json();
        const geofence = data.geofence;

        setGeoStatus({
          loading: false,
          lat: latitude,
          lng: longitude,
          distanceMeters: geofence ? geofence.distanceMeters : null,
          isWithinGeofence: geofence ? geofence.isWithinGeofence : null,
          error: data.success ? null : data.error,
        });

        if (data.success) {
          setActionMessage({
            type: "success",
            text: `🎯 Verified! You are within ${geofence?.distanceMeters}m of Chetana Institute. Marked Present!`,
          });
          loadDashboardData();
        } else {
          setActionMessage({ type: "error", text: data.error || "Location verification failed." });
        }
      } catch {
        setGeoStatus((prev) => ({ ...prev, loading: false, error: "Network error during location verification." }));
      }
    };

    if (bypass) {
      processCoordinates(19.062828, 72.854651);
      return;
    }

    if (!navigator.geolocation) {
      const msg = "Geolocation is not supported by your browser.";
      setGeoStatus((prev) => ({ ...prev, loading: false, error: msg }));
      setActionMessage({ type: "error", text: `⚠️ ${msg}` });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        processCoordinates(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        let errMsg = "GPS error. Please enable location permissions in your browser.";
        if (err.code === 1) {
          errMsg = "Location access was denied. Please click the lock icon in your address bar and allow Location access to check-in.";
        } else if (err.code === 2) {
          errMsg = "Device GPS / Location is turned OFF. Please turn ON your device location services and click 'Detect Location'.";
        } else if (err.code === 3) {
          errMsg = "GPS request timed out. Please ensure GPS is enabled and try again.";
        }
        setGeoStatus((prev) => ({
          ...prev,
          loading: false,
          error: errMsg,
        }));
        setActionMessage({
          type: "error",
          text: `⚠️ Location Off / Permission Denied: ${errMsg}`,
        });
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    loadDashboardData();
    triggerAutoLocationCheck(false);
  }, []);

  const handleLogout = async () => {
    await fetch("/emp/api/auth/logout", { method: "POST" });
    router.push("/emp/login");
    router.refresh();
  };

  const handleMarkAttendance = async (status: AttendanceStatus, action?: "check_in" | "check_out" | "set_status") => {
    try {
      const res = await fetch("/emp/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, action }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ type: "success", text: `Attendance updated: ${status}` });
        loadDashboardData();
      } else {
        setActionMessage({ type: "error", text: data.error || "Failed to mark attendance." });
      }
    } catch {
      setActionMessage({ type: "error", text: "Error recording attendance." });
    }
  };

  const openNewTaskModal = () => {
    setEditingTask(null);
    setTaskTitle("");
    setTaskDesc("");
    setTaskPriority("Medium");
    setTaskStatus("Pending");
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (t: TaskRecord) => {
    setEditingTask(t);
    setTaskTitle(t.title);
    setTaskDesc(t.description || "");
    setTaskPriority(t.priority);
    setTaskStatus(t.status);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      if (editingTask) {
        const res = await fetch("/emp/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingTask.id,
            title: taskTitle,
            description: taskDesc,
            priority: taskPriority,
            status: taskStatus,
          }),
        });
        const data = await res.json();
        if (data.success && data.data) {
          setActionMessage({ type: "success", text: "Task updated successfully." });
          setTasks((prev) => prev.map((t) => (t.id === data.data.id ? data.data : t)));
          setIsTaskModalOpen(false);
          setEditingTask(null);
          setTaskTitle("");
          setTaskDesc("");
          loadDashboardData();
        } else {
          setActionMessage({ type: "error", text: data.error || "Failed to update task." });
        }
      } else {
        const res = await fetch("/emp/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: taskTitle.trim(),
            description: taskDesc.trim(),
            priority: taskPriority,
            status: taskStatus,
          }),
        });
        const data = await res.json();
        if (data.success && data.data) {
          setActionMessage({ type: "success", text: "New task created!" });
          setTasks((prev) => [data.data, ...prev.filter((t) => t.id !== data.data.id)]);
          setIsTaskModalOpen(false);
          setEditingTask(null);
          setTaskTitle("");
          setTaskDesc("");
          loadDashboardData();
        } else {
          setActionMessage({ type: "error", text: data.error || "Failed to create task." });
        }
      }
    } catch {
      setActionMessage({ type: "error", text: "Task operation failed." });
    }
  };

  const handleQuickStatusChange = async (t: TaskRecord, newStatus: TaskStatus) => {
    try {
      const res = await fetch("/emp/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: t.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        loadDashboardData();
      }
    } catch {
      setActionMessage({ type: "error", text: "Failed to change task status." });
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTaskId) return;
    try {
      const res = await fetch(`/emp/api/tasks?id=${deletingTaskId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ type: "success", text: "Task deleted." });
        setDeletingTaskId(null);
        loadDashboardData();
      } else {
        setActionMessage({ type: "error", text: data.error || "Failed to delete task." });
      }
    } catch {
      setActionMessage({ type: "error", text: "Delete operation failed." });
    }
  };

  // Helper for formatting Month strings "YYYY-MM" -> "August 2026"
  const formatMonthLabel = (monthStr: string) => {
    try {
      const [year, month] = monthStr.split("-").map(Number);
      const d = new Date(year, month - 1, 1);
      return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } catch {
      return monthStr;
    }
  };

  const shiftMonth = (delta: number) => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const d = new Date(year, month - 1 + delta, 1);
    const nextMonthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    setSelectedMonth(nextMonthStr);
  };

  // Monthly Report saving
  const handleSaveMonthlyReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!monthlyReportForm.key_achievements.trim()) {
      setActionMessage({ type: "error", text: "Key achievements & deliverables are required." });
      return;
    }
    if (!monthlyReportForm.next_month_goals.trim()) {
      setActionMessage({ type: "error", text: "Next month goals & priorities are required." });
      return;
    }

    try {
      const res = await fetch("/emp/api/monthly-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: selectedMonth,
          ...monthlyReportForm,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setActionMessage({
          type: "success",
          text: `🎉 Monthly Report for ${formatMonthLabel(selectedMonth)} saved successfully!`,
        });
        loadDashboardData();
      } else {
        setActionMessage({ type: "error", text: data.error || "Failed to save monthly report." });
      }
    } catch {
      setActionMessage({ type: "error", text: "Failed to save monthly report." });
    }
  };

  // Monthly Analytics for the selected month
  const selectedMonthAttendance = attendanceRecords.filter((a) => a.date?.startsWith(selectedMonth));
  const monthPresentCount = selectedMonthAttendance.filter((a) => a.status === "Present").length;
  const monthHalfDayCount = selectedMonthAttendance.filter((a) => a.status === "Half Day").length;
  const monthAbsentCount = selectedMonthAttendance.filter((a) => a.status === "Absent" || a.status === "Leave").length;
  const monthTotalLoggedDays = selectedMonthAttendance.length;
  const monthAttendanceRate =
    monthTotalLoggedDays > 0
      ? Math.round(((monthPresentCount + monthHalfDayCount * 0.5) / monthTotalLoggedDays) * 100)
      : 100;

  const selectedMonthTasks = tasks.filter(
    (t) => t.date?.startsWith(selectedMonth) || t.created_at?.startsWith(selectedMonth)
  );
  const monthCompletedTasks = selectedMonthTasks.filter((t) => t.status === "Completed");
  const monthPendingTasks = selectedMonthTasks.filter((t) => t.status !== "Completed");
  const monthTaskCompletionRate =
    selectedMonthTasks.length > 0
      ? Math.round((monthCompletedTasks.length / selectedMonthTasks.length) * 100)
      : 0;

  const currentSelectedReport = monthlyReports.find((r) => r.month === selectedMonth);
  const isMonthSubmitted = !!currentSelectedReport;

  // Auto-Fill Assistant
  const handleAutoFillMonthlySummary = () => {
    const completedList = monthCompletedTasks
      .map((t) => `• ${t.title}${t.description ? ` — ${t.description}` : ""}`)
      .join("\n");

    const achievementsDraft = `Key Milestones Delivered in ${formatMonthLabel(selectedMonth)}:
${completedList || "• Executed sprint deliverables and operational workflows for CIEL programs."}

Performance & Attendance Overview:
• Verified Attendance: ${monthAttendanceRate}% (${monthPresentCount} Days Present${
      monthHalfDayCount > 0 ? `, ${monthHalfDayCount} Half-Days` : ""
    } out of ${monthTotalLoggedDays || 1} logged sessions).
• Task Delivery: Completed ${monthCompletedTasks.length} tasks (${monthTaskCompletionRate}% completion rate).`;

    const goalsDraft =
      monthPendingTasks.length > 0
        ? `Upcoming Objectives for ${formatMonthLabel(
            (() => {
              const [y, m] = selectedMonth.split("-").map(Number);
              const d = new Date(y, m, 1);
              return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            })()
          )}:
${monthPendingTasks.map((t) => `• Complete & deploy: ${t.title}`).join("\n")}
• Continuously improve operational velocity and maintain high reliability standards.`
        : `Key Priorities for Upcoming Month:
• Accelerate next phase feature releases and institutional workflows.
• Enhance platform engagement, student registration pipelines, and operational readiness.`;

    setMonthlyReportForm((prev) => ({
      ...prev,
      key_achievements: prev.key_achievements ? `${prev.key_achievements}\n\n${achievementsDraft}` : achievementsDraft,
      next_month_goals: prev.next_month_goals || goalsDraft,
    }));

    setActionMessage({
      type: "success",
      text: "✨ Auto-filled report draft from your verified tasks and attendance metrics!",
    });
  };

  const copyReportSummary = () => {
    const reportText = `CIEL EMPLOYEE MONTHLY PERFORMANCE REPORT
Employee: ${user.name} (${user.email})
Month: ${formatMonthLabel(selectedMonth)}

[KEY ACHIEVEMENTS & DELIVERABLES]
${monthlyReportForm.key_achievements || "N/A"}

[NEXT MONTH GOALS & PRIORITIES]
${monthlyReportForm.next_month_goals || "N/A"}

[CHALLENGES & BOTTLENECKS]
${monthlyReportForm.major_challenges || "None noted"}

[SKILL DEVELOPMENT & LEARNINGS]
${monthlyReportForm.learnings_skills || "None noted"}

[SUPPORT NEEDED]
${monthlyReportForm.support_needed || "None requested"}`;

    navigator.clipboard.writeText(reportText);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2500);
  };

  const filteredTasks = tasks.filter((t) => {
    if (taskStatusFilter === "all") return true;
    const s = (t.status || "Pending").toLowerCase().replace(/\s+/g, "");
    return s === taskStatusFilter;
  });

  // Overall computed stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getUserInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="emp-portal emp-dash-root">
      {/* ─── TOPBAR ──────────────────────────────────────────── */}
      <header className="emp-topbar">
        <div className="emp-topbar-left">
          <Logo href="/emp/dashboard" size="small" />
          <div className="emp-topbar-divider" />
          <span className="emp-topbar-badge">Employee Portal</span>
        </div>

        <div className="emp-topbar-center">
          <div className="emp-topbar-date">
            <Calendar size={14} />
            <span>{currentDateFormatted}</span>
          </div>
        </div>

        <div className="emp-topbar-right">
          <div className="emp-topbar-user">
            <div className="emp-topbar-avatar">{getUserInitials(user.name)}</div>
            <div className="emp-topbar-user-info">
              <span className="emp-topbar-user-name">{user.name}</span>
              <span className="emp-topbar-user-role">
                <span className="emp-role-dot emp-role-dot-emp" />
                Employee
              </span>
            </div>
          </div>
          <EmpThemeToggle />
          <button onClick={handleLogout} className="emp-topbar-logout" title="Sign out">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* ─── LAYOUT ──────────────────────────────────────────── */}
      <div className="emp-dash-layout">
        {/* SIDEBAR */}
        <aside className="emp-sidebar">
          <nav className="emp-sidenav">
            {[
              { id: "attendance" as const, icon: <Clock size={18} />, label: "Attendance", badge: null },
              { id: "tasks" as const, icon: <CheckSquare size={18} />, label: "My Tasks", badge: tasks.length },
              {
                id: "monthly_report" as const,
                icon: <FileText size={18} />,
                label: "Monthly Report",
                badge: isMonthSubmitted ? null : "Pending",
              },
            ].map((item) => (
              <button
                key={item.id}
                className={`emp-sidenav-item ${activeTab === item.id ? "emp-sidenav-item-active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="emp-sidenav-icon">{item.icon}</span>
                <span className="emp-sidenav-label">{item.label}</span>
                {item.badge !== null && (
                  <span
                    className={`emp-sidenav-badge ${
                      typeof item.badge === "string" ? "emp-sidenav-badge-alert" : ""
                    }`}
                    style={typeof item.badge === "string" ? { background: "rgba(245,158,11,0.2)", color: "#fbbf24", fontSize: "11px", padding: "2px 8px" } : {}}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar stats summary */}
          <div className="emp-sidebar-stats">
            <div className="emp-sidebar-stat">
              <span className="emp-sidebar-stat-val" style={{ color: "#f59e0b" }}>
                {pendingTasks}
              </span>
              <span className="emp-sidebar-stat-label">Pending</span>
            </div>
            <div className="emp-sidebar-stat">
              <span className="emp-sidebar-stat-val" style={{ color: "#38bdf8" }}>
                {inProgressTasks}
              </span>
              <span className="emp-sidebar-stat-label">In Progress</span>
            </div>
            <div className="emp-sidebar-stat">
              <span className="emp-sidebar-stat-val" style={{ color: "#34d399" }}>
                {completedTasks}
              </span>
              <span className="emp-sidebar-stat-label">Completed</span>
            </div>
          </div>

          <div className="emp-sidebar-progress-card">
            <div className="emp-progress-label">
              <span>Overall Task Completion</span>
              <span style={{ fontWeight: 700, color: "#818cf8" }}>{completionRate}%</span>
            </div>
            <div className="emp-progress-bar">
              <div className="emp-progress-fill" style={{ width: `${completionRate}%` }} />
            </div>
          </div>

          {/* Current Month Quick Status */}
          <div className="emp-sidebar-status-box" style={{ marginTop: "16px", padding: "14px", background: "var(--emp-surface-2)", borderRadius: "10px", border: "1px solid var(--emp-border)" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--emp-text-faint)", letterSpacing: "0.5px", marginBottom: "4px" }}>
              Monthly Status
            </div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: isMonthSubmitted ? "#34d399" : "#fbbf24", display: "flex", alignItems: "center", gap: "6px" }}>
              {isMonthSubmitted ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
              {isMonthSubmitted ? `${formatMonthLabel(currentMonthStr)} Submitted` : `${formatMonthLabel(currentMonthStr)} Pending`}
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="emp-dash-main">
          {actionMessage && (
            <div
              className={`emp-action-banner ${
                actionMessage.type === "success" ? "emp-banner-success" : "emp-banner-error"
              }`}
            >
              {actionMessage.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{actionMessage.text}</span>
              <button className="emp-banner-close" onClick={() => setActionMessage(null)}>
                <X size={14} />
              </button>
            </div>
          )}

          {/* ─── TAB 1: ATTENDANCE ─────────────────────────────── */}
          {!loading && activeTab === "attendance" && (
            <div className="emp-dash-section">
              <div className="emp-dash-page-header">
                <div>
                  <h1 className="emp-dash-page-title">Attendance & GPS Geofence</h1>
                  <p className="emp-dash-page-sub">
                    Verify location inside Chetana Institute campus to record your attendance.
                  </p>
                </div>
                <button
                  className="emp-btn emp-btn-secondary emp-btn-sm"
                  onClick={() => triggerAutoLocationCheck(false)}
                  disabled={geoStatus.loading}
                >
                  <RefreshCw size={14} className={geoStatus.loading ? "spin-icon" : ""} />
                  {geoStatus.loading ? "Checking Location…" : "Detect Location"}
                </button>
              </div>

              {/* Geofence Status Banner */}
              <div
                className={`emp-geofence-banner ${
                  geoStatus.isWithinGeofence === true
                    ? "emp-geofence-in"
                    : geoStatus.isWithinGeofence === false
                    ? "emp-geofence-out"
                    : ""
                }`}
              >
                <div className="emp-geofence-info">
                  <div className="emp-geofence-icon">
                    {geoStatus.loading ? (
                      <Compass size={24} className="spin-icon" style={{ color: "#6366f1" }} />
                    ) : geoStatus.isWithinGeofence ? (
                      <Target size={24} style={{ color: "#10b981" }} />
                    ) : (
                      <MapPin size={24} style={{ color: "#f59e0b" }} />
                    )}
                  </div>
                  <div>
                    <h3 className="emp-geofence-title">
                      {geoStatus.loading
                        ? "Verifying GPS Coordinates…"
                        : geoStatus.isWithinGeofence === true
                        ? "Inside Chetana Institute Campus Zone"
                        : geoStatus.isWithinGeofence === false
                        ? "Outside Campus Geofence Boundary"
                        : "Campus Location Verification Required"}
                    </h3>
                    <p className="emp-geofence-sub">
                      {geoStatus.distanceMeters !== null
                        ? `Current Distance: ~${geoStatus.distanceMeters}m from campus center (Allowed radius: 2500m)`
                        : "Enable GPS location access to automatically verify attendance."}
                    </p>
                  </div>
                </div>

                <div className="emp-geofence-actions">
                  <button
                    className="emp-btn emp-btn-primary"
                    onClick={() => triggerAutoLocationCheck(false)}
                    disabled={geoStatus.loading}
                  >
                    <Navigation size={15} />
                    {geoStatus.loading ? "Verifying…" : "Verify & Check-In"}
                  </button>
                  <button
                    className="emp-btn emp-btn-ghost emp-btn-sm"
                    onClick={() => triggerAutoLocationCheck(true)}
                    title="Simulate Chetana Campus coordinates for testing"
                  >
                    ⚡ Demo Campus Check-In
                  </button>
                </div>
              </div>

              {/* Today's Card */}
              <div className="emp-dash-card emp-today-card">
                <div className="emp-dash-card-header">
                  <Clock size={16} />
                  <span>Today&apos;s Shift Overview — {todayStr}</span>
                </div>
                <div className="emp-today-grid">
                  <div className="emp-today-item">
                    <span className="emp-today-label">Status</span>
                    <span
                      className={`emp-chip emp-chip-${(
                        todayAttendance?.status || "Not Marked"
                      ).toLowerCase().replace(/\s+/g, "")}`}
                    >
                      {todayAttendance?.status || "Not Marked"}
                    </span>
                  </div>
                  <div className="emp-today-item">
                    <span className="emp-today-label">Check-In Time</span>
                    <span className="emp-today-val">
                      {todayAttendance?.check_in_time
                        ? new Date(todayAttendance.check_in_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </span>
                  </div>
                  <div className="emp-today-item">
                    <span className="emp-today-label">Check-Out Time</span>
                    <span className="emp-today-val">
                      {todayAttendance?.check_out_time
                        ? new Date(todayAttendance.check_out_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </span>
                  </div>
                  <div className="emp-today-item">
                    <span className="emp-today-label">Campus Verification</span>
                    <span className="emp-today-val" style={{ color: "#34d399", fontWeight: 600 }}>
                      {todayAttendance?.is_within_geofence ? "✓ GPS Verified" : "Manual / Pending"}
                    </span>
                  </div>
                </div>

                <div className="emp-today-actions">
                  <button
                    className="emp-btn emp-btn-primary"
                    onClick={() => handleMarkAttendance("Present", "check_in")}
                  >
                    Check In Now
                  </button>
                  <button
                    className="emp-btn emp-btn-secondary"
                    onClick={() => handleMarkAttendance("Present", "check_out")}
                  >
                    Check Out
                  </button>
                  <button
                    className="emp-btn emp-btn-ghost"
                    onClick={() => handleMarkAttendance("Half Day", "set_status")}
                  >
                    Half Day
                  </button>
                  <button
                    className="emp-btn emp-btn-ghost"
                    onClick={() => handleMarkAttendance("Leave", "set_status")}
                  >
                    Apply Leave
                  </button>
                </div>
              </div>

              {/* Attendance Log Table */}
              <div className="emp-dash-card">
                <div className="emp-dash-card-header">
                  <Activity size={16} />
                  <span>Recent Attendance History</span>
                </div>
                {attendanceRecords.length === 0 ? (
                  <div className="emp-dash-empty">No attendance records logged yet.</div>
                ) : (
                  <div className="emp-table-wrap">
                    <table className="emp-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Check-In</th>
                          <th>Check-Out</th>
                          <th>Location Verification</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceRecords.map((r) => (
                          <tr key={r.id}>
                            <td style={{ fontWeight: 600, color: "var(--emp-text)" }}>{r.date}</td>
                            <td>
                              <span
                                className={`emp-chip emp-chip-${(r.status || "present")
                                  .toLowerCase()
                                  .replace(/\s+/g, "")}`}
                              >
                                {r.status}
                              </span>
                            </td>
                            <td>
                              {r.check_in_time
                                ? new Date(r.check_in_time).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "—"}
                            </td>
                            <td>
                              {r.check_out_time
                                ? new Date(r.check_out_time).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "—"}
                            </td>
                            <td>
                              {r.is_within_geofence ? (
                                <span style={{ color: "#34d399", fontSize: "12.5px" }}>
                                  ✓ Chetana Campus ({r.distance_meters}m)
                                </span>
                              ) : (
                                <span style={{ color: "var(--emp-text-muted)", fontSize: "12.5px" }}>
                                  {r.distance_meters ? `${r.distance_meters}m` : "Standard log"}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── TAB 2: TASKS ─────────────────────────────────── */}
          {!loading && activeTab === "tasks" && (
            <div className="emp-dash-section">
              <div className="emp-dash-page-header">
                <div>
                  <h1 className="emp-dash-page-title">My Tasks & Deliverables</h1>
                  <p className="emp-dash-page-sub">
                    Manage daily action items, track status, and organize milestones.
                  </p>
                </div>
                <button className="emp-btn emp-btn-primary" onClick={openNewTaskModal}>
                  <Plus size={16} /> New Task
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="emp-task-filters">
                {[
                  { id: "all", label: `All (${tasks.length})` },
                  { id: "pending", label: `Pending (${pendingTasks})` },
                  { id: "inprogress", label: `In Progress (${inProgressTasks})` },
                  { id: "completed", label: `Completed (${completedTasks})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    className={`emp-task-filter-pill ${taskStatusFilter === f.id ? "emp-filter-active" : ""}`}
                    onClick={() => setTaskStatusFilter(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Task Cards */}
              {filteredTasks.length === 0 ? (
                <div className="emp-dash-card emp-dash-empty">
                  <CheckSquare size={36} style={{ color: "var(--emp-text-faint)", marginBottom: "8px" }} />
                  <p>No tasks found in this view.</p>
                  <button
                    className="emp-btn emp-btn-secondary emp-btn-sm"
                    style={{ marginTop: "12px" }}
                    onClick={openNewTaskModal}
                  >
                    Create a task
                  </button>
                </div>
              ) : (
                <div className="emp-task-list">
                  {filteredTasks.map((t) => (
                    <div key={t.id} className="emp-task-item">
                      <div className="emp-task-item-left">
                        <span
                          className={`emp-task-priority-dot emp-priority-${(
                            t.priority || "Medium"
                          ).toLowerCase()}`}
                        />
                        <div>
                          <div className="emp-task-title">{t.title}</div>
                          {t.description && <div className="emp-task-desc">{t.description}</div>}
                          <div className="emp-task-meta">
                            <span
                              className={`emp-chip emp-chip-${(t.priority || "Medium").toLowerCase()}`}
                            >
                              {t.priority || "Medium"} Priority
                            </span>
                            <span className="emp-task-date">{t.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="emp-task-item-right">
                        <select
                          className={`emp-status-select emp-chip emp-chip-${(t.status || "Pending")
                            .toLowerCase()
                            .replace(/\s+/g, "")}`}
                          value={t.status || "Pending"}
                          onChange={(e) => handleQuickStatusChange(t, e.target.value as TaskStatus)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <button
                          className="emp-icon-btn emp-icon-btn-blue"
                          onClick={() => openEditTaskModal(t)}
                          title="Edit Task"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="emp-icon-btn emp-icon-btn-red"
                          onClick={() => setDeletingTaskId(t.id)}
                          title="Delete Task"
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

          {/* ─── TAB 3: MONTHLY REPORT ────────────────────────── */}
          {!loading && activeTab === "monthly_report" && (
            <div className="emp-dash-section">
              <div className="emp-dash-page-header">
                <div>
                  <h1 className="emp-dash-page-title">Monthly Performance Report</h1>
                  <p className="emp-dash-page-sub">
                    Compile, review, and submit your monthly milestones, accomplishments, and next month goals for CIEL leadership.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <button
                    className="emp-btn emp-btn-secondary emp-btn-sm"
                    onClick={copyReportSummary}
                    title="Copy text summary to clipboard"
                  >
                    {copiedStatus ? <Check size={14} style={{ color: "#34d399" }} /> : <Copy size={14} />}
                    {copiedStatus ? "Copied!" : "Copy Summary"}
                  </button>
                  {isMonthSubmitted && (
                    <button
                      className="emp-btn emp-btn-primary emp-btn-sm"
                      onClick={() => setPreviewReportModal(currentSelectedReport || null)}
                    >
                      <Printer size={14} /> Executive Preview
                    </button>
                  )}
                </div>
              </div>

              {/* Month Selector Bar */}
              <div className="emp-month-bar">
                <div className="emp-month-controls">
                  <button
                    type="button"
                    className="emp-month-nav-btn"
                    onClick={() => shiftMonth(-1)}
                    title="Previous Month"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="emp-month-current-badge">
                    <CalendarDays size={16} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle", color: "#818cf8" }} />
                    {formatMonthLabel(selectedMonth)}
                  </div>
                  <button
                    type="button"
                    className="emp-month-nav-btn"
                    onClick={() => shiftMonth(1)}
                    title="Next Month"
                  >
                    <ChevronRight size={16} />
                  </button>

                  <input
                    type="month"
                    className="emp-input"
                    style={{ width: "auto", padding: "6px 12px", fontSize: "13px" }}
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {isMonthSubmitted ? (
                    <span className="emp-chip emp-chip-present" style={{ padding: "7px 14px", fontSize: "13px" }}>
                      <CheckCircle size={14} /> Submitted for {formatMonthLabel(selectedMonth)}
                    </span>
                  ) : (
                    <span className="emp-chip emp-chip-halfday" style={{ padding: "7px 14px", fontSize: "13px" }}>
                      <AlertCircle size={14} /> Draft / Pending Submission
                    </span>
                  )}
                </div>
              </div>

              {/* Monthly Performance Aggregation Grid */}
              <div className="emp-month-stats-grid">
                <div className="emp-month-stat-card">
                  <div className="emp-month-stat-header">
                    <span>Attendance Rate</span>
                    <Clock size={16} style={{ color: "#38bdf8" }} />
                  </div>
                  <div className="emp-month-stat-val" style={{ color: "#38bdf8" }}>
                    {monthAttendanceRate}%
                  </div>
                  <div className="emp-month-stat-sub">
                    {monthPresentCount} Present • {monthHalfDayCount} Half-day • {monthAbsentCount} Leave/Absent
                  </div>
                </div>

                <div className="emp-month-stat-card">
                  <div className="emp-month-stat-header">
                    <span>Deliverables Shipped</span>
                    <CheckSquare size={16} style={{ color: "#34d399" }} />
                  </div>
                  <div className="emp-month-stat-val" style={{ color: "#34d399" }}>
                    {monthCompletedTasks.length} / {selectedMonthTasks.length || 0}
                  </div>
                  <div className="emp-month-stat-sub">
                    {monthTaskCompletionRate}% task completion rate
                  </div>
                </div>

                <div className="emp-month-stat-card">
                  <div className="emp-month-stat-header">
                    <span>Working Sessions</span>
                    <Activity size={16} style={{ color: "#a855f7" }} />
                  </div>
                  <div className="emp-month-stat-val" style={{ color: "#a855f7" }}>
                    {monthTotalLoggedDays} Days
                  </div>
                  <div className="emp-month-stat-sub">Logged in system for {formatMonthLabel(selectedMonth)}</div>
                </div>

                <div className="emp-month-stat-card">
                  <div className="emp-month-stat-header">
                    <span>Report Status</span>
                    <Award size={16} style={{ color: isMonthSubmitted ? "#34d399" : "#fbbf24" }} />
                  </div>
                  <div className="emp-month-stat-val" style={{ fontSize: "16px", color: isMonthSubmitted ? "#34d399" : "#fbbf24", marginTop: "4px" }}>
                    {isMonthSubmitted ? "Submitted ✓" : "Pending Action"}
                  </div>
                  <div className="emp-month-stat-sub">
                    {currentSelectedReport?.updated_at
                      ? `Last updated: ${new Date(currentSelectedReport.updated_at).toLocaleDateString()}`
                      : "Ready to complete & submit"}
                  </div>
                </div>
              </div>

              {/* Form & Archive Layout */}
              <div className="emp-updates-layout">
                {/* Form */}
                <div className="emp-dash-card emp-updates-form-card">
                  <div
                    className="emp-dash-card-header"
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FileText size={16} />
                      <span>{formatMonthLabel(selectedMonth)} Performance Report</span>
                    </div>

                    <button
                      type="button"
                      className="emp-autofill-btn"
                      onClick={handleAutoFillMonthlySummary}
                      title="Automatically summarizes your completed tasks & attendance into the form"
                    >
                      <Sparkles size={13} />
                      Auto-Fill from Month Data
                    </button>
                  </div>

                  <form onSubmit={handleSaveMonthlyReport} className="emp-updates-form">
                    {/* Section 1 */}
                    <div className="emp-form-group">
                      <label className="emp-form-label">
                        1. Key Milestones, Achievements & Projects Delivered *
                      </label>
                      <textarea
                        className="emp-textarea"
                        placeholder=""
                        value={monthlyReportForm.key_achievements}
                        onChange={(e) =>
                          setMonthlyReportForm({ ...monthlyReportForm, key_achievements: e.target.value })
                        }
                        required
                        rows={4}
                      />
                    </div>

                    {/* Section 2 */}
                    <div className="emp-form-group">
                      <label className="emp-form-label">
                        2. Goals, Targets & Priorities for Next Month *
                      </label>
                      <textarea
                        className="emp-textarea"
                        placeholder=""
                        value={monthlyReportForm.next_month_goals}
                        onChange={(e) =>
                          setMonthlyReportForm({ ...monthlyReportForm, next_month_goals: e.target.value })
                        }
                        required
                        rows={3}
                      />
                    </div>

                    {/* Section 3 */}
                    <div className="emp-form-group">
                      <label className="emp-form-label">
                        3. Major Challenges Faced & Bottleneck Solutions{" "}
                        <span className="emp-form-optional">(optional)</span>
                      </label>
                      <textarea
                        className="emp-textarea"
                        placeholder=""
                        value={monthlyReportForm.major_challenges}
                        onChange={(e) =>
                          setMonthlyReportForm({ ...monthlyReportForm, major_challenges: e.target.value })
                        }
                        rows={3}
                      />
                    </div>

                    {/* Section 4 */}
                    <div className="emp-form-group">
                      <label className="emp-form-label">
                        4. Skill Development, Learnings & Process Improvements{" "}
                        <span className="emp-form-optional">(optional)</span>
                      </label>
                      <textarea
                        className="emp-textarea"
                        placeholder=""
                        value={monthlyReportForm.learnings_skills}
                        onChange={(e) =>
                          setMonthlyReportForm({ ...monthlyReportForm, learnings_skills: e.target.value })
                        }
                        rows={2}
                      />
                    </div>

                    {/* Section 5 */}
                    <div className="emp-form-group">
                      <label className="emp-form-label">
                        5. Support, Permissions or Resources Needed from CIEL Leadership{" "}
                        <span className="emp-form-optional">(optional)</span>
                      </label>
                      <input
                        type="text"
                        className="emp-input"
                        placeholder=""
                        value={monthlyReportForm.support_needed}
                        onChange={(e) =>
                          setMonthlyReportForm({ ...monthlyReportForm, support_needed: e.target.value })
                        }
                      />
                    </div>

                    {/* Section 6 */}
                    <div className="emp-form-group">
                      <label className="emp-form-label">
                        6. Additional Notes & Remarks{" "}
                        <span className="emp-form-optional">(optional)</span>
                      </label>
                      <input
                        type="text"
                        className="emp-input"
                        placeholder=""
                        value={monthlyReportForm.notes}
                        onChange={(e) =>
                          setMonthlyReportForm({ ...monthlyReportForm, notes: e.target.value })
                        }
                      />
                    </div>

                    <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "8px", flexWrap: "wrap" }}>
                      <button type="submit" className="emp-btn emp-btn-primary" style={{ width: "auto" }}>
                        <CheckCircle size={16} />
                        {isMonthSubmitted ? "Update Monthly Report" : "Submit Monthly Report"}
                      </button>

                      {isMonthSubmitted && (
                        <button
                          type="button"
                          className="emp-btn emp-btn-secondary"
                          style={{ width: "auto" }}
                          onClick={() => setPreviewReportModal(currentSelectedReport || null)}
                        >
                          <Eye size={15} />
                          Preview Executive Document
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* History & Archive */}
                <div className="emp-dash-card emp-updates-history-card">
                  <div className="emp-dash-card-header">
                    <Calendar size={16} />
                    <span>Submitted Monthly Archive</span>
                  </div>
                  {monthlyReports.length === 0 ? (
                    <div className="emp-dash-empty" style={{ padding: "32px 0" }}>
                      No monthly reports submitted yet.
                    </div>
                  ) : (
                    <div className="emp-updates-history">
                      {monthlyReports.map((r) => {
                        const isCurrent = r.month === selectedMonth;
                        return (
                          <div
                            key={r.id}
                            className={`emp-report-history-card ${isCurrent ? "emp-report-history-active" : ""}`}
                            onClick={() => setSelectedMonth(r.month)}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--emp-text)" }}>
                                {formatMonthLabel(r.month)}
                              </span>
                              <span className="emp-chip emp-chip-present" style={{ fontSize: "11px", padding: "2px 8px" }}>
                                Submitted
                              </span>
                            </div>
                            <p style={{ fontSize: "12.5px", color: "var(--emp-text-muted)", lineClamp: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", margin: 0 }}>
                              {r.key_achievements}
                            </p>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", fontSize: "11px", color: "var(--emp-text-faint)" }}>
                              <span>Updated {new Date(r.updated_at).toLocaleDateString()}</span>
                              <span style={{ color: "#818cf8", fontWeight: 600 }}>Click to Load ➔</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ─── TASK MODAL ──────────────────────────────────────── */}
      {isTaskModalOpen && (
        <div className="emp-modal-overlay">
          <div className="emp-modal">
            <div className="emp-modal-header">
              <div className="emp-modal-title-group">
                <div className="emp-modal-icon">{editingTask ? <Edit2 size={18} /> : <Plus size={18} />}</div>
                <h3 className="emp-modal-title">{editingTask ? "Edit Task" : "New Task"}</h3>
              </div>
              <button className="emp-modal-close" onClick={() => setIsTaskModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveTask}>
              <div className="emp-form-group">
                <label className="emp-form-label">Task Title *</label>
                <input
                  type="text"
                  className="emp-input"
                  placeholder=""
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="emp-form-group">
                <label className="emp-form-label">
                  Description <span className="emp-form-optional">(optional)</span>
                </label>
                <textarea
                  className="emp-textarea"
                  placeholder=""
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="emp-modal-selects">
                <div className="emp-form-group">
                  <label className="emp-form-label">Priority</label>
                  <select
                    className="emp-select"
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Status</label>
                  <select
                    className="emp-select"
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="emp-modal-footer">
                <button
                  type="button"
                  className="emp-btn emp-btn-ghost emp-btn-sm"
                  onClick={() => setIsTaskModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="emp-btn emp-btn-primary emp-btn-sm">
                  {editingTask ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── DELETE MODAL ────────────────────────────────────── */}
      {deletingTaskId && (
        <div className="emp-modal-overlay">
          <div className="emp-modal emp-modal-sm">
            <div className="emp-modal-delete-icon">
              <Trash2 size={28} />
            </div>
            <h3 className="emp-modal-title" style={{ textAlign: "center", marginBottom: "8px" }}>
              Delete Task?
            </h3>
            <p className="emp-modal-delete-sub">This action is permanent and cannot be undone.</p>
            <div className="emp-modal-footer">
              <button
                className="emp-btn emp-btn-ghost emp-btn-sm"
                onClick={() => setDeletingTaskId(null)}
              >
                Cancel
              </button>
              <button className="emp-btn emp-btn-danger emp-btn-sm" onClick={handleDeleteTask}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── EXECUTIVE MONTHLY REPORT PREVIEW MODAL ───────────── */}
      {previewReportModal && (
        <div className="emp-modal-overlay">
          <div className="emp-modal" style={{ maxWidth: "780px", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="emp-modal-header">
              <div className="emp-modal-title-group">
                <div className="emp-modal-icon">
                  <Award size={18} />
                </div>
                <h3 className="emp-modal-title">
                  Executive Performance Report — {formatMonthLabel(previewReportModal.month)}
                </h3>
              </div>
              <button className="emp-modal-close" onClick={() => setPreviewReportModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="emp-report-doc" style={{ marginTop: "10px" }}>
              {/* Document Header */}
              <div className="emp-report-doc-header">
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--emp-text)", margin: "0 0 4px 0" }}>
                    Chetana Institute of Education and Learning
                  </h2>
                  <div style={{ fontSize: "13px", color: "var(--emp-text-muted)" }}>
                    Employee Monthly Performance Dossier
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#818cf8" }}>
                    {formatMonthLabel(previewReportModal.month)}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--emp-text-faint)" }}>
                    Submitted: {new Date(previewReportModal.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Employee Bio Meta */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "12px",
                  padding: "12px 16px",
                  background: "var(--emp-surface-2)",
                  borderRadius: "10px",
                  marginBottom: "24px",
                  border: "1px solid var(--emp-border)",
                }}
              >
                <div>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--emp-text-faint)", fontWeight: 700, display: "block" }}>
                    Employee Name
                  </span>
                  <span style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--emp-text)" }}>{user.name}</span>
                </div>
                <div>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--emp-text-faint)", fontWeight: 700, display: "block" }}>
                    Email ID
                  </span>
                  <span style={{ fontSize: "13.5px", color: "var(--emp-text)" }}>{user.email}</span>
                </div>
                <div>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--emp-text-faint)", fontWeight: 700, display: "block" }}>
                    Status
                  </span>
                  <span className="emp-chip emp-chip-present" style={{ display: "inline-block", marginTop: "2px" }}>
                    Verified & Reviewed
                  </span>
                </div>
              </div>

              {/* Report Sections */}
              <div className="emp-report-section-block">
                <h4>
                  <Award size={14} /> 1. Key Milestones & Completed Deliverables
                </h4>
                <p>{previewReportModal.key_achievements}</p>
              </div>

              <div className="emp-report-section-block">
                <h4>
                  <Target size={14} /> 2. Goals & Priorities for Upcoming Month
                </h4>
                <p>{previewReportModal.next_month_goals}</p>
              </div>

              {previewReportModal.major_challenges && (
                <div className="emp-report-section-block">
                  <h4>
                    <AlertCircle size={14} /> 3. Challenges & Bottlenecks
                  </h4>
                  <p>{previewReportModal.major_challenges}</p>
                </div>
              )}

              {previewReportModal.learnings_skills && (
                <div className="emp-report-section-block">
                  <h4>
                    <TrendingUp size={14} /> 4. Professional Development & Learnings
                  </h4>
                  <p>{previewReportModal.learnings_skills}</p>
                </div>
              )}

              {previewReportModal.support_needed && (
                <div className="emp-report-section-block">
                  <h4>
                    <Sparkles size={14} /> 5. Resource & Management Support Needed
                  </h4>
                  <p>{previewReportModal.support_needed}</p>
                </div>
              )}

              {previewReportModal.notes && (
                <div className="emp-report-section-block">
                  <h4>
                    <FileText size={14} /> 6. Additional Notes
                  </h4>
                  <p>{previewReportModal.notes}</p>
                </div>
              )}
            </div>

            <div className="emp-modal-footer" style={{ marginTop: "20px" }}>
              <button
                type="button"
                className="emp-btn emp-btn-ghost emp-btn-sm"
                onClick={() => setPreviewReportModal(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="emp-btn emp-btn-primary emp-btn-sm"
                onClick={() => window.print()}
              >
                <Printer size={14} /> Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
