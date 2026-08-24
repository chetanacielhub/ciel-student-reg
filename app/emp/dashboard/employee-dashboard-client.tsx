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
} from "lucide-react";

export default function EmployeeDashboardClient({ user }: { user: EmpSessionData }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"attendance" | "tasks" | "daily_updates">("attendance");

  // Today's formatted date string
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

  // Geolocation state for Chetana Institute 200m Geofence
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

  // Fetch initial data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Attendance
      const attRes = await fetch("/emp/api/attendance");
      const attData = await attRes.json();
      if (attData.success) {
        setAttendanceRecords(attData.data);
        const todayRec = attData.data.find((r: AttendanceRecord) => r.date === todayStr);
        setTodayAttendance(todayRec || null);
      }

      // 2. Tasks
      const taskRes = await fetch("/emp/api/tasks");
      const taskData = await taskRes.json();
      if (taskData.success) {
        setTasks(taskData.data);
      }

      // 3. Daily Updates
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

  // Trigger Automatic Location Detection
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
            text: `🎯 Auto Location Verified! You are within ${geofence?.distanceMeters}m of Chetana Institute. Marked Present!`,
          });
          loadDashboardData();
        } else {
          setActionMessage({
            type: "error",
            text: data.error || "Location verification failed.",
          });
        }
      } catch {
        setGeoStatus((prev) => ({
          ...prev,
          loading: false,
          error: "Network error during location verification.",
        }));
      }
    };

    if (bypass) {
      // Simulate being physically inside Chetana Campus (19.062828, 72.854651)
      processCoordinates(19.062828, 72.854651);
      return;
    }

    if (!navigator.geolocation) {
      setGeoStatus((prev) => ({
        ...prev,
        loading: false,
        error: "Browser geolocation is not supported on this device.",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        processCoordinates(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setGeoStatus((prev) => ({
          ...prev,
          loading: false,
          error: `Geolocation error: ${err.message}. Please enable location permissions in your browser.`,
        }));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    loadDashboardData();
    // Auto-detect location on load
    triggerAutoLocationCheck(false);
  }, []);

  const handleLogout = async () => {
    await fetch("/emp/api/auth/logout", { method: "POST" });
    router.push("/emp/login");
    router.refresh();
  };

  // Attendance Handlers
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

  // Task Handlers
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
        // Update task
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
        if (data.success) {
          setActionMessage({ type: "success", text: "Task updated successfully." });
          setIsTaskModalOpen(false);
          loadDashboardData();
        } else {
          setActionMessage({ type: "error", text: data.error || "Failed to update task." });
        }
      } else {
        // Create task
        const res = await fetch("/emp/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: taskTitle,
            description: taskDesc,
            priority: taskPriority,
            status: taskStatus,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setActionMessage({ type: "success", text: "New task created!" });
          setIsTaskModalOpen(false);
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

  // Daily Update Handler
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

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (taskStatusFilter === "all") return true;
    return t.status.toLowerCase().replace(/\s+/g, "") === taskStatusFilter;
  });

  return (
    <div>
      {/* Top Header Navbar */}
      <header className="emp-navbar">
        <div className="emp-brand" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Logo href="/emp/dashboard" size="small" />
          <span className="emp-brand-badge" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", marginLeft: "-10px" }}>Portal</span>
        </div>

        <div className="emp-user-info">
          <div className="emp-user-meta">
            <div className="emp-user-name">{user.name}</div>
            <div className="emp-user-role">
              <span className="emp-user-role-badge emp-role-employee">Employee</span>
              <span>•</span>
              <Calendar size={13} style={{ display: "inline", marginBottom: "-1px" }} />
              <span>{currentDateFormatted}</span>
            </div>
          </div>

          <EmpThemeToggle />

          <button onClick={handleLogout} className="emp-btn-logout" title="Sign out of Employee Portal">
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="emp-container">
        {/* Banner Alert Message */}
        {actionMessage && (
          <div
            className={`emp-alert ${
              actionMessage.type === "success" ? "emp-alert-success" : "emp-alert-error"
            }`}
          >
            {actionMessage.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{actionMessage.text}</span>
            <button
              onClick={() => setActionMessage(null)}
              style={{ background: "none", border: "none", color: "inherit", marginLeft: "auto", cursor: "pointer" }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Dashboard Tabs */}
        <div className="emp-tabs">
          <button
            className={`emp-tab ${activeTab === "attendance" ? "emp-tab-active" : ""}`}
            onClick={() => setActiveTab("attendance")}
          >
            <Clock size={16} style={{ display: "inline", marginRight: "8px", verticalAlign: "text-bottom" }} />
            Attendance Management
          </button>
          <button
            className={`emp-tab ${activeTab === "tasks" ? "emp-tab-active" : ""}`}
            onClick={() => setActiveTab("tasks")}
          >
            <CheckSquare size={16} style={{ display: "inline", marginRight: "8px", verticalAlign: "text-bottom" }} />
            Daily Task Manager ({tasks.length})
          </button>
          <button
            className={`emp-tab ${activeTab === "daily_updates" ? "emp-tab-active" : ""}`}
            onClick={() => setActiveTab("daily_updates")}
          >
            <FileText size={16} style={{ display: "inline", marginRight: "8px", verticalAlign: "text-bottom" }} />
            Daily Work Update
          </button>
        </div>

        {/* TAB 1: ATTENDANCE */}
        {activeTab === "attendance" && (
          <div>
            {/* GEOFENCE AUTO LOCATION BANNER */}
            <div
              className={`emp-card emp-geofence-banner ${geoStatus.isWithinGeofence === true ? "emp-geofence-in" : geoStatus.isWithinGeofence === false ? "emp-geofence-out" : ""}`}
              style={{ marginBottom: "24px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <div className="emp-geofence-title" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", fontWeight: 800, marginBottom: "4px" }}>
                    <Target size={20} style={{ color: "#3b82f6" }} />
                    <span>Auto Location Attendance (Chetana Campus Zone)</span>
                  </div>
                  <div className="emp-geofence-sub" style={{ fontSize: "13px" }}>
                    Chetana Institute of Management &amp; Research, Bandra East • Multi-Point Campus Verification (500m Radius Tolerance)
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    className="emp-btn emp-btn-primary emp-btn-sm"
                    onClick={() => triggerAutoLocationCheck(false)}
                    disabled={geoStatus.loading}
                  >
                    <Compass size={14} className={geoStatus.loading ? "spin-icon" : ""} />
                    {geoStatus.loading ? "Detecting GPS..." : "Re-Detect Location"}
                  </button>

                  <button
                    className="emp-btn emp-btn-success emp-btn-sm"
                    onClick={() => triggerAutoLocationCheck(true)}
                    disabled={geoStatus.loading}
                    title="Mark Present immediately if sitting inside Chetana College Campus"
                  >
                    <CheckCircle size={14} />
                    I am on Chetana Campus (Mark Present)
                  </button>
                </div>
              </div>

              {/* Geofence Status Result Badge & Coordinate breakdown */}
              <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                {geoStatus.distanceMeters !== null && (
                  <div style={{ fontSize: "13px", color: "#cbd5e1" }}>
                    Detected Distance to Chetana Campus:{" "}
                    <strong style={{ color: geoStatus.isWithinGeofence ? "#34d399" : "#fbbf24" }}>
                      {geoStatus.distanceMeters} meters
                    </strong>
                  </div>
                )}

                {geoStatus.lat !== null && geoStatus.lng !== null && (
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                    Browser Coordinates: <code>{geoStatus.lat.toFixed(5)}, {geoStatus.lng.toFixed(5)}</code>
                  </div>
                )}

                {geoStatus.isWithinGeofence === true && (
                  <span className="emp-badge emp-badge-present">
                    <CheckCircle size={12} /> Verified Inside Campus Zone (Present)
                  </span>
                )}

                {geoStatus.isWithinGeofence === false && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span className="emp-badge emp-badge-halfday">
                      <MapPin size={12} /> Browser GPS Position Inaccurate ({geoStatus.distanceMeters}m away)
                    </span>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                      (Laptops & Wi-Fi IP location can be inaccurate. Click "I am on Chetana Campus" to confirm).
                    </span>
                  </div>
                )}

                {geoStatus.error && (
                  <div style={{ fontSize: "12px", color: "#f87171" }}>
                    {geoStatus.error}
                  </div>
                )}
              </div>
            </div>

            <div className="emp-grid-3">
              {/* Card 1: Today's Status */}
              <div className="emp-card">
                <div style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", marginBottom: "8px" }}>
                  Today's Attendance Status
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  {todayAttendance ? (
                    <span className={`emp-badge emp-badge-${todayAttendance.status.toLowerCase().replace(/\s+/g, "")}`}>
                      {todayAttendance.status}
                    </span>
                  ) : (
                    <span className="emp-badge emp-badge-pending">Not Marked</span>
                  )}
                </div>

                <div style={{ fontSize: "13px", color: "#cbd5e1", display: "grid", gap: "6px" }}>
                  <div>
                    Check-in Time:{" "}
                    <strong style={{ color: "#ffffff" }}>
                      {todayAttendance?.check_in_time
                        ? new Date(todayAttendance.check_in_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "Not checked in"}
                    </strong>
                  </div>
                  <div>
                    Check-out Time:{" "}
                    <strong style={{ color: "#ffffff" }}>
                      {todayAttendance?.check_out_time
                        ? new Date(todayAttendance.check_out_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "Not checked out"}
                    </strong>
                  </div>
                  {todayAttendance?.distance_meters !== undefined && todayAttendance?.distance_meters !== null && (
                    <div>
                      Verified Distance:{" "}
                      <strong style={{ color: "#60a5fa" }}>
                        {todayAttendance.distance_meters}m from Chetana Campus
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2: Manual / Additional Attendance Actions */}
              <div className="emp-card" style={{ gridColumn: "span 2" }}>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff", marginBottom: "16px" }}>
                  Attendance Actions
                </div>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button
                    className="emp-btn emp-btn-success emp-btn-sm"
                    onClick={() => triggerAutoLocationCheck(false)}
                    style={{ flex: 1, minWidth: "160px" }}
                  >
                    <Compass size={14} /> Auto Check-In (Location)
                  </button>

                  <button
                    className="emp-btn emp-btn-secondary emp-btn-sm"
                    onClick={() => handleMarkAttendance(todayAttendance?.status || "Present", "check_out")}
                    style={{ flex: 1, minWidth: "140px" }}
                  >
                    Check Out
                  </button>

                  <button
                    className="emp-btn emp-btn-secondary emp-btn-sm"
                    onClick={() => handleMarkAttendance("Half Day", "set_status")}
                  >
                    Mark Half Day
                  </button>

                  <button
                    className="emp-btn emp-btn-secondary emp-btn-sm"
                    onClick={() => handleMarkAttendance("Leave", "set_status")}
                  >
                    Mark Leave
                  </button>
                </div>
              </div>
            </div>

            {/* Attendance History Table */}
            <div className="emp-card">
              <div className="emp-section-header">
                <h2 className="emp-section-title">
                  <Clock size={20} /> Attendance History Log
                </h2>
              </div>

              {attendanceRecords.length === 0 ? (
                <div style={{ textTransform: "none", textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                  No historical attendance records found yet.
                </div>
              ) : (
                <div className="emp-table-wrap">
                  <table className="emp-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Check-in Time</th>
                        <th>Check-out Time</th>
                        <th>Location Verification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.map((r) => (
                        <tr key={r.id}>
                          <td>{r.date}</td>
                          <td>
                            <span className={`emp-badge emp-badge-${r.status.toLowerCase().replace(/\s+/g, "")}`}>
                              {r.status}
                            </span>
                          </td>
                          <td>
                            {r.check_in_time
                              ? new Date(r.check_in_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                              : "—"}
                          </td>
                          <td>
                            {r.check_out_time
                              ? new Date(r.check_out_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                              : "—"}
                          </td>
                          <td>
                            {r.distance_meters !== undefined && r.distance_meters !== null ? (
                              <span style={{ fontSize: "12px", color: r.is_within_geofence ? "#34d399" : "#fbbf24" }}>
                                <MapPin size={12} style={{ display: "inline", marginRight: "4px" }} />
                                {r.distance_meters}m from Chetana
                              </span>
                            ) : (
                              <span style={{ fontSize: "12px", color: "#94a3b8" }}>Standard</span>
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

        {/* TAB 2: TASKS */}
        {activeTab === "tasks" && (
          <div>
            <div className="emp-section-header">
              <h2 className="emp-section-title">
                <CheckSquare size={20} /> My Daily Tasks
              </h2>
              <button className="emp-btn emp-btn-primary emp-btn-sm" onClick={openNewTaskModal}>
                <Plus size={16} /> Add New Task
              </button>
            </div>

            {/* Filter Bar */}
            <div className="emp-filter-bar">
              <div className="emp-filter-item">
                <Filter size={15} style={{ color: "#94a3b8" }} />
                <span className="emp-label" style={{ margin: 0 }}>Filter by Status:</span>
                <select
                  className="emp-select"
                  style={{ width: "auto", padding: "6px 12px" }}
                  value={taskStatusFilter}
                  onChange={(e) => setTaskStatusFilter(e.target.value)}
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="inprogress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {filteredTasks.length === 0 ? (
              <div className="emp-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                No tasks match your current filter. Click "Add New Task" to create one.
              </div>
            ) : (
              <div className="emp-table-wrap">
                <table className="emp-table">
                  <thead>
                    <tr>
                      <th>Task Title</th>
                      <th>Description</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <strong style={{ color: "#ffffff" }}>{t.title}</strong>
                        </td>
                        <td style={{ maxWidth: "260px", color: "#94a3b8", fontSize: "13px" }}>
                          {t.description || "—"}
                        </td>
                        <td>
                          <span className={`emp-badge emp-badge-${t.priority.toLowerCase()}`}>
                            {t.priority}
                          </span>
                        </td>
                        <td>
                          <select
                            className={`emp-select emp-badge emp-badge-${t.status.toLowerCase().replace(/\s+/g, "")}`}
                            style={{ cursor: "pointer", border: "none" }}
                            value={t.status}
                            onChange={(e) => handleQuickStatusChange(t, e.target.value as TaskStatus)}
                          >
                            <option value="Pending" style={{ background: "#1e293b", color: "#ffffff" }}>Pending</option>
                            <option value="In Progress" style={{ background: "#1e293b", color: "#ffffff" }}>In Progress</option>
                            <option value="Completed" style={{ background: "#1e293b", color: "#ffffff" }}>Completed</option>
                          </select>
                        </td>
                        <td>{t.date}</td>
                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              className="emp-btn emp-btn-secondary emp-btn-sm"
                              onClick={() => openEditTaskModal(t)}
                              title="Edit task"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              className="emp-btn emp-btn-danger emp-btn-sm"
                              onClick={() => setDeletingTaskId(t.id)}
                              title="Delete task"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DAILY WORK UPDATE */}
        {activeTab === "daily_updates" && (
          <div>
            <div className="emp-grid-3">
              {/* Left Column: Form to submit/update today's work report */}
              <div className="emp-card" style={{ gridColumn: "span 2" }}>
                <h3 className="emp-section-title" style={{ fontSize: "16px", marginBottom: "16px" }}>
                  <FileText size={18} /> Today's Work Report ({todayStr})
                </h3>

                <form onSubmit={handleSaveDailyUpdate}>
                  <div className="emp-form-group">
                    <label className="emp-label">Work Completed Today *</label>
                    <textarea
                      className="emp-textarea"
                      placeholder="Summary of completed tasks, achievements, modules delivered..."
                      value={todayUpdate.work_completed}
                      onChange={(e) => setTodayUpdate({ ...todayUpdate, work_completed: e.target.value })}
                      required
                    />
                  </div>

                  <div className="emp-form-group">
                    <label className="emp-label">Problems / Blockers (Optional)</label>
                    <textarea
                      className="emp-textarea"
                      placeholder="Any technical blockers, missing access, dependencies..."
                      value={todayUpdate.blockers}
                      onChange={(e) => setTodayUpdate({ ...todayUpdate, blockers: e.target.value })}
                    />
                  </div>

                  <div className="emp-form-group">
                    <label className="emp-label">Plan for Tomorrow (Optional)</label>
                    <textarea
                      className="emp-textarea"
                      placeholder="Key objectives and tasks planned for tomorrow..."
                      value={todayUpdate.tomorrow_plan}
                      onChange={(e) => setTodayUpdate({ ...todayUpdate, tomorrow_plan: e.target.value })}
                    />
                  </div>

                  <div className="emp-form-group">
                    <label className="emp-label">Optional Notes</label>
                    <input
                      type="text"
                      className="emp-input"
                      placeholder="Additional notes for manager/team..."
                      value={todayUpdate.notes}
                      onChange={(e) => setTodayUpdate({ ...todayUpdate, notes: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="emp-btn emp-btn-primary" style={{ width: "auto" }}>
                    Save Today's Work Update
                  </button>
                </form>
              </div>

              {/* Right Column: Historical Reports */}
              <div className="emp-card">
                <h3 className="emp-section-title" style={{ fontSize: "16px", marginBottom: "16px" }}>
                  Previous Daily Updates
                </h3>

                {dailyUpdates.length === 0 ? (
                  <div style={{ color: "#94a3b8", fontSize: "13px" }}>No previous daily updates submitted.</div>
                ) : (
                  <div style={{ display: "grid", gap: "12px", maxHeight: "400px", overflowY: "auto" }}>
                    {dailyUpdates.map((u) => (
                      <div
                        key={u.id}
                        style={{
                          background: "rgba(30, 41, 59, 0.4)",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid rgba(255, 255, 255, 0.05)",
                        }}
                      >
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#3b82f6", marginBottom: "4px" }}>
                          {u.date}
                        </div>
                        <div style={{ fontSize: "13px", color: "#f1f5f9", fontWeight: 600 }}>{u.work_completed}</div>
                        {u.blockers && (
                          <div style={{ fontSize: "12px", color: "#f87171", marginTop: "4px" }}>
                            <strong>Blockers:</strong> {u.blockers}
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

      {/* CREATE / EDIT TASK MODAL */}
      {isTaskModalOpen && (
        <div className="emp-modal-overlay">
          <div className="emp-modal">
            <div className="emp-modal-header">
              <h3 className="emp-modal-title">
                {editingTask ? "Edit Task" : "Add New Daily Task"}
              </h3>
              <button className="emp-modal-close" onClick={() => setIsTaskModalOpen(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveTask}>
              <div className="emp-form-group">
                <label className="emp-label">Task Title *</label>
                <input
                  type="text"
                  className="emp-input"
                  placeholder="e.g. Implement Supabase DB connection"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                />
              </div>

              <div className="emp-form-group">
                <label className="emp-label">Description (Optional)</label>
                <textarea
                  className="emp-textarea"
                  placeholder="Detailed description of task deliverables..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                />
              </div>

              <div className="emp-grid-3" style={{ marginBottom: "20px" }}>
                <div>
                  <label className="emp-label">Priority</label>
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

                <div>
                  <label className="emp-label">Status</label>
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

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="emp-btn emp-btn-secondary emp-btn-sm"
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

      {/* DELETE CONFIRMATION MODAL */}
      {deletingTaskId && (
        <div className="emp-modal-overlay">
          <div className="emp-modal" style={{ maxWidth: "400px" }}>
            <h3 className="emp-modal-title" style={{ color: "#f87171", marginBottom: "12px" }}>
              Confirm Delete
            </h3>
            <p style={{ fontSize: "14px", color: "#cbd5e1", marginBottom: "20px" }}>
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                className="emp-btn emp-btn-secondary emp-btn-sm"
                onClick={() => setDeletingTaskId(null)}
              >
                Cancel
              </button>
              <button className="emp-btn emp-btn-danger emp-btn-sm" onClick={handleDeleteTask}>
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
