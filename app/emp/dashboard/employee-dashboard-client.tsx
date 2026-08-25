"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EmpSessionData } from "@/lib/emp-auth";
import { EmpThemeToggle } from "../emp-theme-toggle";
import { Logo } from "@/components/ui/logo";
import { AttendanceRecord, TaskRecord, DailyUpdateRecord, AttendanceStatus, TaskStatus, TaskPriority } from "@/lib/emp-store";
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
} from "lucide-react";

export default function EmployeeDashboardClient({ user }: { user: EmpSessionData }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"attendance" | "tasks" | "daily_updates">("attendance");

  const todayStr = new Date().toISOString().split("T")[0];
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

  const [dailyUpdates, setDailyUpdates] = useState<DailyUpdateRecord[]>([]);
  const [todayUpdate, setTodayUpdate] = useState<{
    work_completed: string;
    blockers: string;
    tomorrow_plan: string;
    notes: string;
  }>({
    work_completed: "",
    blockers: "",
    tomorrow_plan: "",
    notes: "",
  });

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

      const updRes = await fetch("/emp/api/daily-updates");
      const updData = await updRes.json();
      if (updData.success) {
        setDailyUpdates(updData.data);
        const todayReport = updData.data.find((u: DailyUpdateRecord) => u.date === todayStr);
        if (todayReport) {
          setTodayUpdate({
            work_completed: todayReport.work_completed || "",
            blockers: todayReport.blockers || "",
            tomorrow_plan: todayReport.tomorrow_plan || "",
            notes: todayReport.notes || "",
          });
        }
      }
    } catch {
      setActionMessage({ type: "error", text: "Failed to load dashboard data." });
    } finally {
      setLoading(false);
    }
  };

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
      (pos) => { processCoordinates(pos.coords.latitude, pos.coords.longitude); },
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
          body: JSON.stringify({ id: editingTask.id, title: taskTitle, description: taskDesc, priority: taskPriority, status: taskStatus }),
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
          body: JSON.stringify({ title: taskTitle.trim(), description: taskDesc.trim(), priority: taskPriority, status: taskStatus }),
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
      if (data.success) { loadDashboardData(); }
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

  const handleSaveDailyUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todayUpdate.work_completed.trim()) {
      setActionMessage({ type: "error", text: "Work completed summary is required." });
      return;
    }
    try {
      const res = await fetch("/emp/api/daily-updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todayUpdate),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ type: "success", text: "Daily work update saved!" });
        loadDashboardData();
      } else {
        setActionMessage({ type: "error", text: data.error || "Failed to save update." });
      }
    } catch {
      setActionMessage({ type: "error", text: "Failed to save daily update." });
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (taskStatusFilter === "all") return true;
    const s = (t.status || "Pending").toLowerCase().replace(/\s+/g, "");
    return s === taskStatusFilter;
  });

  // Computed stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const todayReportSubmitted = dailyUpdates.some((u) => u.date === todayStr);

  const getUserInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

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
              { id: "daily_updates" as const, icon: <FileText size={18} />, label: "Daily Report", badge: null },
            ].map((item) => (
              <button
                key={item.id}
                className={`emp-sidenav-item ${activeTab === item.id ? "emp-sidenav-item-active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="emp-sidenav-icon">{item.icon}</span>
                <span className="emp-sidenav-label">{item.label}</span>
                {item.badge !== null && item.badge > 0 && (
                  <span className="emp-sidenav-badge">{item.badge}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar stats summary */}
          <div className="emp-sidebar-stats">
            <div className="emp-sidebar-stat">
              <span className="emp-sidebar-stat-val" style={{ color: "#f59e0b" }}>{pendingTasks}</span>
              <span className="emp-sidebar-stat-label">Pending</span>
            </div>
            <div className="emp-sidebar-stat">
              <span className="emp-sidebar-stat-val" style={{ color: "#60a5fa" }}>{inProgressTasks}</span>
              <span className="emp-sidebar-stat-label">Active</span>
            </div>
            <div className="emp-sidebar-stat">
              <span className="emp-sidebar-stat-val" style={{ color: "#34d399" }}>{completedTasks}</span>
              <span className="emp-sidebar-stat-label">Done</span>
            </div>
          </div>

          {/* Today's status summary */}
          <div className="emp-sidebar-today">
            <div className="emp-sidebar-today-title">Today</div>
            <div className="emp-sidebar-today-row">
              <span>Attendance</span>
              {todayAttendance ? (
                <span className={`emp-chip emp-chip-${(todayAttendance.status || "Present").toLowerCase().replace(/\s+/g, "")}`}>
                  {todayAttendance.status || "Present"}
                </span>
              ) : (
                <span className="emp-chip emp-chip-pending">Not Marked</span>
              )}
            </div>
            <div className="emp-sidebar-today-row">
              <span>Report</span>
              {todayReportSubmitted ? (
                <span className="emp-chip emp-chip-present">Submitted</span>
              ) : (
                <span className="emp-chip emp-chip-absent">Pending</span>
              )}
            </div>
            <div className="emp-sidebar-today-row">
              <span>Progress</span>
              <span className="emp-chip" style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)" }}>
                {completionRate}%
              </span>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="emp-dash-main">
          {/* Global alert */}
          {actionMessage && (
            <div className={`emp-dash-alert ${actionMessage.type === "success" ? "emp-dash-alert-success" : "emp-dash-alert-error"}`}>
              {actionMessage.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{actionMessage.text}</span>
              <button className="emp-dash-alert-close" onClick={() => setActionMessage(null)}>
                <X size={14} />
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="emp-dash-loading">
              <div className="emp-dash-spinner" />
              <span>Loading your workspace…</span>
            </div>
          )}

          {/* ─── TAB 1: ATTENDANCE ─────────────────────────────── */}
          {!loading && activeTab === "attendance" && (
            <div className="emp-dash-section">
              {/* Page header */}
              <div className="emp-dash-page-header">
                <div>
                  <h1 className="emp-dash-page-title">Attendance Management</h1>
                  <p className="emp-dash-page-sub">GPS-verified check-in powered by Chetana Campus geofence</p>
                </div>
              </div>

              {/* KPI Cards row */}
              <div className="emp-kpi-row">
                <div className="emp-kpi-card">
                  <div className="emp-kpi-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#34d399" }}>
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <div className="emp-kpi-value">{attendanceRecords.filter((r) => r.status === "Present").length}</div>
                    <div className="emp-kpi-label">Days Present</div>
                  </div>
                </div>
                <div className="emp-kpi-card">
                  <div className="emp-kpi-icon" style={{ background: "rgba(239,68,68,0.12)", color: "#f87171" }}>
                    <X size={20} />
                  </div>
                  <div>
                    <div className="emp-kpi-value">{attendanceRecords.filter((r) => r.status === "Absent").length}</div>
                    <div className="emp-kpi-label">Days Absent</div>
                  </div>
                </div>
                <div className="emp-kpi-card">
                  <div className="emp-kpi-icon" style={{ background: "rgba(245,158,11,0.12)", color: "#fbbf24" }}>
                    <Activity size={20} />
                  </div>
                  <div>
                    <div className="emp-kpi-value">{attendanceRecords.filter((r) => r.status === "Half Day").length}</div>
                    <div className="emp-kpi-label">Half Days</div>
                  </div>
                </div>
                <div className="emp-kpi-card">
                  <div className="emp-kpi-icon" style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8" }}>
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <div className="emp-kpi-value">
                      {attendanceRecords.length > 0
                        ? `${Math.round((attendanceRecords.filter((r) => r.status === "Present").length / attendanceRecords.length) * 100)}%`
                        : "—"}
                    </div>
                    <div className="emp-kpi-label">Attendance Rate</div>
                  </div>
                </div>
              </div>

              {/* Geofence Card */}
              <div className={`emp-geo-card ${geoStatus.isWithinGeofence === true ? "emp-geo-card-in" : geoStatus.isWithinGeofence === false ? "emp-geo-card-out" : ""}`}>
                <div className="emp-geo-card-header">
                  <div className="emp-geo-card-icon">
                    <Target size={22} />
                  </div>
                  <div>
                    <div className="emp-geo-card-title">Geo-Verified Campus Attendance</div>
                    <div className="emp-geo-card-sub">Chetana Institute of Management &amp; Research, Bandra East · 500m Campus Zone</div>
                  </div>
                  <div className="emp-geo-card-actions">
                    <button
                      className="emp-btn emp-btn-primary emp-btn-sm"
                      onClick={() => triggerAutoLocationCheck(false)}
                      disabled={geoStatus.loading}
                    >
                      <Compass size={14} className={geoStatus.loading ? "emp-spin" : ""} />
                      {geoStatus.loading ? "Detecting GPS…" : "Detect Location"}
                    </button>
                    <button
                      className="emp-btn emp-btn-success emp-btn-sm"
                      onClick={() => triggerAutoLocationCheck(true)}
                      disabled={geoStatus.loading}
                    >
                      <CheckCircle size={14} />
                      I&apos;m on Campus
                    </button>
                  </div>
                </div>

                {(geoStatus.distanceMeters !== null || geoStatus.error) && (
                  <div className="emp-geo-status-row">
                    {geoStatus.distanceMeters !== null && (
                      <div className="emp-geo-status-item">
                        <Navigation size={14} />
                        <span>Distance to Chetana Campus:</span>
                        <strong style={{ color: geoStatus.isWithinGeofence ? "#34d399" : "#fbbf24" }}>
                          {geoStatus.distanceMeters}m
                        </strong>
                      </div>
                    )}
                    {geoStatus.isWithinGeofence === true && (
                      <span className="emp-chip emp-chip-present"><CheckCircle size={11} /> Verified — Inside Campus Zone</span>
                    )}
                    {geoStatus.isWithinGeofence === false && (
                      <span className="emp-chip emp-chip-halfday"><MapPin size={11} /> Outside Zone · Click "I'm on Campus" to confirm</span>
                    )}
                    {geoStatus.error && (
                      <span className="emp-geo-error">{geoStatus.error}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Today Status + Actions */}
              <div className="emp-att-row">
                <div className="emp-dash-card emp-att-today">
                  <div className="emp-dash-card-header">Today&apos;s Status</div>
                  <div className="emp-att-today-status">
                    {todayAttendance ? (
                      <span className={`emp-badge-lg emp-badge-lg-${(todayAttendance.status || "Present").toLowerCase().replace(/\s+/g, "")}`}>
                        {todayAttendance.status || "Present"}
                      </span>
                    ) : (
                      <span className="emp-badge-lg emp-badge-lg-pending">Not Marked</span>
                    )}
                  </div>
                  <div className="emp-att-times">
                    <div className="emp-att-time-row">
                      <span>Check-in</span>
                      <strong>
                        {todayAttendance?.check_in_time
                          ? new Date(todayAttendance.check_in_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : "—"}
                      </strong>
                    </div>
                    <div className="emp-att-time-row">
                      <span>Check-out</span>
                      <strong>
                        {todayAttendance?.check_out_time
                          ? new Date(todayAttendance.check_out_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : "—"}
                      </strong>
                    </div>
                    {todayAttendance?.distance_meters != null && (
                      <div className="emp-att-time-row">
                        <span>GPS Distance</span>
                        <strong style={{ color: "#60a5fa" }}>{todayAttendance.distance_meters}m</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="emp-dash-card emp-att-actions">
                  <div className="emp-dash-card-header">Quick Actions</div>
                  <div className="emp-att-action-grid">
                    <button className="emp-att-action-btn emp-att-action-btn-green" onClick={() => triggerAutoLocationCheck(false)} disabled={geoStatus.loading}>
                      <Compass size={18} className={geoStatus.loading ? "emp-spin" : ""} />
                      <span>Auto Check-In</span>
                      <small>GPS Location</small>
                    </button>
                    <button className="emp-att-action-btn emp-att-action-btn-blue" onClick={() => handleMarkAttendance(todayAttendance?.status || "Present", "check_out")}>
                      <Clock size={18} />
                      <span>Check Out</span>
                      <small>End of Day</small>
                    </button>
                    <button className="emp-att-action-btn emp-att-action-btn-amber" onClick={() => handleMarkAttendance("Half Day", "set_status")}>
                      <Activity size={18} />
                      <span>Half Day</span>
                      <small>Half attendance</small>
                    </button>
                    <button className="emp-att-action-btn emp-att-action-btn-purple" onClick={() => handleMarkAttendance("Leave", "set_status")}>
                      <Calendar size={18} />
                      <span>Mark Leave</span>
                      <small>Apply leave</small>
                    </button>
                  </div>
                </div>
              </div>

              {/* Attendance History */}
              <div className="emp-dash-card">
                <div className="emp-dash-card-header">
                  <Clock size={16} />
                  Attendance History Log
                </div>
                {attendanceRecords.length === 0 ? (
                  <div className="emp-dash-empty">No attendance records yet.</div>
                ) : (
                  <div className="emp-table-wrap">
                    <table className="emp-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Check-in</th>
                          <th>Check-out</th>
                          <th>Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceRecords.map((r) => (
                          <tr key={r.id}>
                            <td className="emp-table-date">{r.date}</td>
                            <td>
                              <span className={`emp-chip emp-chip-${(r.status || "Present").toLowerCase().replace(/\s+/g, "")}`}>
                                {r.status || "Present"}
                              </span>
                            </td>
                            <td>{r.check_in_time ? new Date(r.check_in_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                            <td>{r.check_out_time ? new Date(r.check_out_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                            <td>
                              {r.distance_meters != null ? (
                                <span style={{ fontSize: "12px", color: r.is_within_geofence ? "#34d399" : "#fbbf24", display: "flex", alignItems: "center", gap: "4px" }}>
                                  <MapPin size={12} />{r.distance_meters}m
                                </span>
                              ) : (
                                <span style={{ fontSize: "12px", color: "#64748b" }}>Standard</span>
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

          {/* ─── TAB 2: TASKS ──────────────────────────────────── */}
          {!loading && activeTab === "tasks" && (
            <div className="emp-dash-section">
              <div className="emp-dash-page-header">
                <div>
                  <h1 className="emp-dash-page-title">My Tasks</h1>
                  <p className="emp-dash-page-sub">Create, track and manage your daily sprint tasks</p>
                </div>
                <button className="emp-btn emp-btn-primary" onClick={openNewTaskModal}>
                  <Plus size={16} />
                  Add Task
                </button>
              </div>

              {/* Task KPIs */}
              <div className="emp-kpi-row">
                {[
                  { label: "Total", value: totalTasks, color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
                  { label: "Pending", value: pendingTasks, color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
                  { label: "In Progress", value: inProgressTasks, color: "#60a5fa", bg: "rgba(59,130,246,0.12)" },
                  { label: "Completed", value: completedTasks, color: "#34d399", bg: "rgba(16,185,129,0.12)" },
                ].map((s) => (
                  <div key={s.label} className="emp-kpi-card" style={{ borderLeft: `3px solid ${s.color}` }}>
                    <div className="emp-kpi-icon" style={{ background: s.bg, color: s.color }}>
                      <Zap size={18} />
                    </div>
                    <div>
                      <div className="emp-kpi-value" style={{ color: s.color }}>{s.value}</div>
                      <div className="emp-kpi-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              {totalTasks > 0 && (
                <div className="emp-dash-card emp-progress-card">
                  <div className="emp-progress-header">
                    <span>Overall Completion</span>
                    <span className="emp-progress-pct">{completionRate}%</span>
                  </div>
                  <div className="emp-progress-track">
                    <div className="emp-progress-bar" style={{ width: `${completionRate}%` }} />
                  </div>
                </div>
              )}

              {/* Filter */}
              <div className="emp-filter-strip">
                <Filter size={14} />
                {["all", "pending", "inprogress", "completed"].map((f) => (
                  <button
                    key={f}
                    className={`emp-filter-pill ${taskStatusFilter === f ? "emp-filter-pill-active" : ""}`}
                    onClick={() => setTaskStatusFilter(f)}
                  >
                    {f === "all" ? "All" : f === "inprogress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              {filteredTasks.length === 0 ? (
                <div className="emp-dash-empty-card">
                  <CheckSquare size={40} />
                  <p>No tasks match this filter.</p>
                  <button className="emp-btn emp-btn-primary emp-btn-sm" onClick={openNewTaskModal}>
                    <Plus size={14} /> Create First Task
                  </button>
                </div>
              ) : (
                <div className="emp-task-list">
                  {filteredTasks.map((t) => (
                    <div key={t.id} className="emp-task-item">
                      <div className="emp-task-item-left">
                        <span className={`emp-task-priority-dot emp-priority-${(t.priority || "Medium").toLowerCase()}`} />
                        <div>
                          <div className="emp-task-title">{t.title}</div>
                          {t.description && <div className="emp-task-desc">{t.description}</div>}
                          <div className="emp-task-meta">
                            <span className={`emp-chip emp-chip-${(t.priority || "Medium").toLowerCase()}`}>{t.priority || "Medium"}</span>
                            <span className="emp-task-date">{t.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="emp-task-item-right">
                        <select
                          className={`emp-status-select emp-chip emp-chip-${(t.status || "Pending").toLowerCase().replace(/\s+/g, "")}`}
                          value={t.status || "Pending"}
                          onChange={(e) => handleQuickStatusChange(t, e.target.value as TaskStatus)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <button className="emp-icon-btn emp-icon-btn-blue" onClick={() => openEditTaskModal(t)} title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button className="emp-icon-btn emp-icon-btn-red" onClick={() => setDeletingTaskId(t.id)} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── TAB 3: DAILY UPDATES ──────────────────────────── */}
          {!loading && activeTab === "daily_updates" && (
            <div className="emp-dash-section">
              <div className="emp-dash-page-header">
                <div>
                  <h1 className="emp-dash-page-title">Daily Work Report</h1>
                  <p className="emp-dash-page-sub">Submit today's progress for management review</p>
                </div>
                {todayReportSubmitted && (
                  <span className="emp-chip emp-chip-present" style={{ padding: "8px 16px", fontSize: "13px" }}>
                    <CheckCircle size={14} /> Today Submitted
                  </span>
                )}
              </div>

              <div className="emp-updates-layout">
                {/* Form */}
                <div className="emp-dash-card emp-updates-form-card">
                  <div className="emp-dash-card-header">
                    <FileText size={16} />
                    Today&apos;s Report — {todayStr}
                  </div>
                  <form onSubmit={handleSaveDailyUpdate} className="emp-updates-form">
                    <div className="emp-form-group">
                      <label className="emp-form-label">Work Completed Today *</label>
                      <textarea
                        className="emp-textarea"
                        placeholder="Summarize tasks completed, modules delivered, milestones achieved…"
                        value={todayUpdate.work_completed}
                        onChange={(e) => setTodayUpdate({ ...todayUpdate, work_completed: e.target.value })}
                        required
                        rows={4}
                      />
                    </div>
                    <div className="emp-form-group">
                      <label className="emp-form-label">Blockers / Issues <span className="emp-form-optional">(optional)</span></label>
                      <textarea
                        className="emp-textarea"
                        placeholder="Any blockers, missing access, or dependencies holding you back…"
                        value={todayUpdate.blockers}
                        onChange={(e) => setTodayUpdate({ ...todayUpdate, blockers: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="emp-form-group">
                      <label className="emp-form-label">Plan for Tomorrow <span className="emp-form-optional">(optional)</span></label>
                      <textarea
                        className="emp-textarea"
                        placeholder="Key objectives and tasks planned for the next day…"
                        value={todayUpdate.tomorrow_plan}
                        onChange={(e) => setTodayUpdate({ ...todayUpdate, tomorrow_plan: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="emp-form-group">
                      <label className="emp-form-label">Notes <span className="emp-form-optional">(optional)</span></label>
                      <input
                        type="text"
                        className="emp-input"
                        placeholder="Additional notes for your manager…"
                        value={todayUpdate.notes}
                        onChange={(e) => setTodayUpdate({ ...todayUpdate, notes: e.target.value })}
                      />
                    </div>
                    <button type="submit" className="emp-btn emp-btn-primary" style={{ width: "auto" }}>
                      <CheckCircle size={16} />
                      Save Today&apos;s Report
                    </button>
                  </form>
                </div>

                {/* History */}
                <div className="emp-dash-card emp-updates-history-card">
                  <div className="emp-dash-card-header">Previous Reports</div>
                  {dailyUpdates.length === 0 ? (
                    <div className="emp-dash-empty" style={{ padding: "32px 0" }}>No reports submitted yet.</div>
                  ) : (
                    <div className="emp-updates-history">
                      {dailyUpdates.map((u) => (
                        <div key={u.id} className="emp-update-entry">
                          <div className="emp-update-entry-date">{u.date}</div>
                          <div className="emp-update-entry-work">{u.work_completed}</div>
                          {u.blockers && (
                            <div className="emp-update-entry-blocker">
                              <AlertCircle size={12} /> {u.blockers}
                            </div>
                          )}
                        </div>
                      ))}
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
                  placeholder="e.g. Implement Supabase DB connection"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="emp-form-group">
                <label className="emp-form-label">Description <span className="emp-form-optional">(optional)</span></label>
                <textarea
                  className="emp-textarea"
                  placeholder="Detailed description of deliverables…"
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="emp-modal-selects">
                <div className="emp-form-group">
                  <label className="emp-form-label">Priority</label>
                  <select className="emp-select" value={taskPriority} onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Status</label>
                  <select className="emp-select" value={taskStatus} onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="emp-modal-footer">
                <button type="button" className="emp-btn emp-btn-ghost emp-btn-sm" onClick={() => setIsTaskModalOpen(false)}>
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
            <div className="emp-modal-delete-icon"><Trash2 size={28} /></div>
            <h3 className="emp-modal-title" style={{ textAlign: "center", marginBottom: "8px" }}>Delete Task?</h3>
            <p className="emp-modal-delete-sub">This action is permanent and cannot be undone.</p>
            <div className="emp-modal-footer">
              <button className="emp-btn emp-btn-ghost emp-btn-sm" onClick={() => setDeletingTaskId(null)}>Cancel</button>
              <button className="emp-btn emp-btn-danger emp-btn-sm" onClick={handleDeleteTask}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
