"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { EmpSessionData } from "@/lib/emp-auth";
import { EmpThemeToggle } from "../emp-theme-toggle";
import { Logo } from "@/components/ui/logo";
import type { AttendanceRecord, TaskRecord, MonthlyReportRecord } from "@/lib/emp-store";
import {
  Users,
  Calendar,
  Clock,
  CheckSquare,
  FileText,
  LogOut,
  Filter,
  ShieldCheck,
  Search,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Award,
  Eye,
  Printer,
  X,
  Target,
  TrendingUp,
  Sparkles,
  CalendarDays,
} from "lucide-react";

type EmployeeInfo = { id: string; name: string; email: string };

export default function EmployeeAdminClient({ adminUser }: { adminUser: EmpSessionData }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "attendance" | "tasks" | "monthly_reports">("overview");

  const todayStr = new Date().toISOString().split("T")[0];
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Dynamically loaded employee list from server
  const [employees, setEmployees] = useState<EmployeeInfo[]>([]);

  // Data states
  const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>([]);
  const [allTasks, setAllTasks] = useState<TaskRecord[]>([]);
  const [allMonthlyReports, setAllMonthlyReports] = useState<MonthlyReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Filters
  const [empFilter, setEmpFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // Modal preview
  const [previewModal, setPreviewModal] = useState<{
    report: MonthlyReportRecord;
    empName: string;
    empEmail: string;
  } | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    setDataError(null);
    try {
      const [empRes, attRes, taskRes, repRes] = await Promise.all([
        fetch("/emp/api/employees"),
        fetch("/emp/api/attendance"),
        fetch("/emp/api/tasks"),
        fetch("/emp/api/monthly-reports"),
      ]);

      const empData = await empRes.json();
      const attData = await attRes.json();
      const taskData = await taskRes.json();
      const repData = await repRes.json();

      if (empData.success) setEmployees(empData.data);
      if (attData.success) setAllAttendance(attData.data);
      else setDataError("Failed to load attendance data.");
      if (taskData.success) setAllTasks(taskData.data);
      if (repData.success) setAllMonthlyReports(repData.data);
    } catch {
      setDataError("Network error: could not reach the server. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleLogout = async () => {
    await fetch("/emp/api/auth/logout", { method: "POST" });
    router.push("/emp/login");
    router.refresh();
  };

  // Helper map for Employee name & email
  const getEmpName = (empId: string) => {
    const found = employees.find((e) => e.id === empId);
    return found ? found.name : empId;
  };

  const getEmpEmail = (empId: string) => {
    const found = employees.find((e) => e.id === empId);
    return found ? found.email : "";
  };

  const formatMonthLabel = (monthStr: string) => {
    try {
      const [year, month] = monthStr.split("-").map(Number);
      const d = new Date(year, month - 1, 1);
      return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } catch {
      return monthStr;
    }
  };

  // Filtered views
  const filteredAttendance = allAttendance.filter((a) => {
    if (empFilter !== "all" && a.employee_id !== empFilter) return false;
    if (dateFilter && a.date !== dateFilter) return false;
    if (statusFilter !== "all" && (a.status || "Present").toLowerCase().replace(/\s+/g, "") !== statusFilter) return false;
    return true;
  });

  const filteredTasks = allTasks.filter((t) => {
    if (empFilter !== "all" && t.employee_id !== empFilter) return false;
    if (dateFilter && t.date !== dateFilter) return false;
    if (statusFilter !== "all" && (t.status || "Pending").toLowerCase().replace(/\s+/g, "") !== statusFilter) return false;
    if (priorityFilter !== "all" && (t.priority || "Medium").toLowerCase() !== priorityFilter) return false;
    return true;
  });

  const filteredReports = allMonthlyReports.filter((r) => {
    if (empFilter !== "all" && r.employee_id !== empFilter) return false;
    if (monthFilter !== "all" && r.month !== monthFilter) return false;
    return true;
  });

  // Unique months available in reports
  const availableMonths = Array.from(new Set(allMonthlyReports.map((r) => r.month))).sort((a, b) => (b > a ? 1 : -1));
  if (!availableMonths.includes(currentMonthStr)) {
    availableMonths.unshift(currentMonthStr);
  }

  // Summary Metrics
  const totalEmployees = employees.length;
  const presentToday = allAttendance.filter((a) => a.date === todayStr && a.status === "Present").length;
  const absentToday = allAttendance.filter((a) => a.date === todayStr && (a.status === "Absent" || a.status === "Leave")).length;
  const pendingTasksTotal = allTasks.filter((t) => t.status === "Pending").length;
  const completedTasksTotal = allTasks.filter((t) => t.status === "Completed").length;

  const currentMonthReportsSubmitted = allMonthlyReports.filter((r) => r.month === currentMonthStr).length;

  return (
    <div className="emp-portal emp-dash-root" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ─── ADMIN HEADER ─── */}
      <header className="emp-topbar">
        <div className="emp-topbar-left">
          <Logo href="/emp/admin" size="small" />
          <div className="emp-topbar-divider" />
          <span className="emp-topbar-badge emp-topbar-badge-admin">
            <ShieldCheck size={14} style={{ display: "inline", marginRight: "4px" }} />
            Admin Intelligence Hub
          </span>
        </div>

        <div className="emp-topbar-center">
          <div className="emp-topbar-date">
            <Calendar size={14} />
            <span>{currentDateFormatted}</span>
          </div>
        </div>

        <div className="emp-topbar-right">
          <div className="emp-topbar-user">
            <div className="emp-topbar-avatar" style={{ background: "rgba(245, 158, 11, 0.2)", color: "#f59e0b", border: "1px solid #f59e0b" }}>
              AD
            </div>
            <div className="emp-topbar-user-info">
              <span className="emp-topbar-user-name">{adminUser.name}</span>
              <span className="emp-topbar-user-role" style={{ color: "#f59e0b" }}>
                <span className="emp-role-dot emp-role-dot-admin" style={{ background: "#f59e0b" }} />
                System Administrator
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

      {/* ─── MAIN CONTAINER ─── */}
      <main style={{ flex: 1, padding: "28px 32px", maxWidth: "1400px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {/* KPI Summary Grid */}
        <div className="emp-grid-4" style={{ marginBottom: "28px" }}>
          <div className="emp-card" style={{ padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--emp-text-muted)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              <span>Total Active Team</span>
              <Users size={18} style={{ color: "#6366f1" }} />
            </div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--emp-text)", marginTop: "8px", letterSpacing: "-0.5px" }}>{totalEmployees}</div>
            <div style={{ fontSize: "12px", color: "var(--emp-text-muted)", marginTop: "4px" }}>Registered Staff Members</div>
          </div>

          <div className="emp-card" style={{ padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--emp-text-muted)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              <span>Present Today</span>
              <Clock size={18} style={{ color: "#10b981" }} />
            </div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#10b981", marginTop: "8px", letterSpacing: "-0.5px" }}>{presentToday}</div>
            <div style={{ fontSize: "12px", color: "var(--emp-text-muted)", marginTop: "4px" }}>{absentToday} Absent / On Leave</div>
          </div>

          <div className="emp-card" style={{ padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--emp-text-muted)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              <span>Active Tasks</span>
              <CheckSquare size={18} style={{ color: "#f59e0b" }} />
            </div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#f59e0b", marginTop: "8px", letterSpacing: "-0.5px" }}>{pendingTasksTotal}</div>
            <div style={{ fontSize: "12px", color: "var(--emp-text-muted)", marginTop: "4px" }}>{completedTasksTotal} Tasks Completed</div>
          </div>

          <div className="emp-card" style={{ padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--emp-text-muted)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              <span>Monthly Reports ({formatMonthLabel(currentMonthStr)})</span>
              <FileText size={18} style={{ color: "#a855f7" }} />
            </div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#a855f7", marginTop: "8px", letterSpacing: "-0.5px" }}>
              {currentMonthReportsSubmitted} / {totalEmployees}
            </div>
            <div style={{ fontSize: "12px", color: "var(--emp-text-muted)", marginTop: "4px" }}>
              {totalEmployees - currentMonthReportsSubmitted} pending submissions
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="emp-tabs" style={{ marginBottom: "24px" }}>
          <button
            className={`emp-tab ${activeTab === "overview" ? "emp-tab-active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <Users size={16} style={{ display: "inline", marginRight: "8px", verticalAlign: "text-bottom" }} />
            All Employees Overview
          </button>
          <button
            className={`emp-tab ${activeTab === "attendance" ? "emp-tab-active" : ""}`}
            onClick={() => setActiveTab("attendance")}
          >
            <Clock size={16} style={{ display: "inline", marginRight: "8px", verticalAlign: "text-bottom" }} />
            Attendance Monitoring
          </button>
          <button
            className={`emp-tab ${activeTab === "tasks" ? "emp-tab-active" : ""}`}
            onClick={() => setActiveTab("tasks")}
          >
            <CheckSquare size={16} style={{ display: "inline", marginRight: "8px", verticalAlign: "text-bottom" }} />
            Employee Tasks ({allTasks.length})
          </button>
          <button
            className={`emp-tab ${activeTab === "monthly_reports" ? "emp-tab-active" : ""}`}
            onClick={() => setActiveTab("monthly_reports")}
          >
            <FileText size={16} style={{ display: "inline", marginRight: "8px", verticalAlign: "text-bottom" }} />
            Monthly Work Reports ({allMonthlyReports.length})
          </button>

          <button
            className="emp-tab"
            onClick={fetchAdminData}
            disabled={loading}
            style={{ marginLeft: "auto", opacity: loading ? 0.6 : 1 }}
          >
            <RefreshCw
              size={15}
              style={{
                display: "inline",
                marginRight: "6px",
                verticalAlign: "text-bottom",
                animation: loading ? "spin 1s linear infinite" : "none",
              }}
            />
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        {/* Error Banner */}
        {dataError && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "10px",
              padding: "14px 20px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#fca5a5",
            }}
          >
            <AlertCircle size={18} />
            <span style={{ fontSize: "14px" }}>{dataError}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
            <RefreshCw size={28} style={{ animation: "spin 1s linear infinite", marginBottom: "12px" }} />
            <p>Loading employee data...</p>
          </div>
        )}

        {/* TAB 1: ALL EMPLOYEES OVERVIEW */}
        {!loading && activeTab === "overview" && (
          <div>
            <div className="emp-section-header">
              <h2 className="emp-section-title">
                <Users size={20} /> Today&apos;s Employee Summary ({todayStr})
              </h2>
            </div>

            <div className="emp-grid-3">
              {employees.map((emp) => {
                const todayAtt = allAttendance.find((a) => a.employee_id === emp.id && a.date === todayStr);
                const empTasks = allTasks.filter((t) => t.employee_id === emp.id);
                const pendingTasks = empTasks.filter((t) => t.status === "Pending").length;
                const inProgressTasks = empTasks.filter((t) => t.status === "In Progress").length;
                const completedTasks = empTasks.filter((t) => t.status === "Completed").length;
                const currentMonthReport = allMonthlyReports.find(
                  (r) => r.employee_id === emp.id && r.month === currentMonthStr
                );

                return (
                  <div key={emp.id} className="emp-card" style={{ padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                      <div>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--emp-text)", margin: 0 }}>
                          {emp.name}
                        </h3>
                        <span style={{ fontSize: "12px", color: "var(--emp-text-muted)" }}>{emp.email}</span>
                      </div>
                      <span
                        className={`emp-chip emp-chip-${(todayAtt?.status || "Absent")
                          .toLowerCase()
                          .replace(/\s+/g, "")}`}
                      >
                        {todayAtt?.status || "Not Marked"}
                      </span>
                    </div>

                    <div style={{ fontSize: "13px", color: "var(--emp-text-muted)", marginBottom: "14px", display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div>
                        Check-in:{" "}
                        <strong style={{ color: "var(--emp-text)" }}>
                          {todayAtt?.check_in_time
                            ? new Date(todayAtt.check_in_time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </strong>
                      </div>
                      <div>
                        Check-out:{" "}
                        <strong style={{ color: "var(--emp-text)" }}>
                          {todayAtt?.check_out_time
                            ? new Date(todayAtt.check_out_time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </strong>
                      </div>
                    </div>

                    <div style={{ fontSize: "13px", marginBottom: "16px" }}>
                      <div style={{ fontWeight: 600, color: "var(--emp-text-muted)", marginBottom: "8px" }}>Task Metrics:</div>
                      <div className="emp-grid-3" style={{ gap: "8px", marginBottom: 0 }}>
                        <div style={{ background: "rgba(245, 158, 11, 0.1)", padding: "6px", borderRadius: "6px", textAlign: "center" }}>
                          <div style={{ fontSize: "16px", fontWeight: 800, color: "#fbbf24" }}>{pendingTasks}</div>
                          <div style={{ fontSize: "11px", color: "var(--emp-text-muted)" }}>Pending</div>
                        </div>
                        <div style={{ background: "rgba(59, 130, 246, 0.1)", padding: "6px", borderRadius: "6px", textAlign: "center" }}>
                          <div style={{ fontSize: "16px", fontWeight: 800, color: "#60a5fa" }}>{inProgressTasks}</div>
                          <div style={{ fontSize: "11px", color: "var(--emp-text-muted)" }}>In Progress</div>
                        </div>
                        <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "6px", borderRadius: "6px", textAlign: "center" }}>
                          <div style={{ fontSize: "16px", fontWeight: 800, color: "#34d399" }}>{completedTasks}</div>
                          <div style={{ fontSize: "11px", color: "var(--emp-text-muted)" }}>Completed</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: "12.5px", borderTop: "1px solid var(--emp-border)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "var(--emp-text-muted)" }}>
                        Monthly Report ({formatMonthLabel(currentMonthStr)}):
                      </span>
                      {currentMonthReport ? (
                        <button
                          className="emp-chip emp-chip-present"
                          style={{ cursor: "pointer", border: "none" }}
                          onClick={() =>
                            setPreviewModal({
                              report: currentMonthReport,
                              empName: emp.name,
                              empEmail: emp.email,
                            })
                          }
                        >
                          ✓ Submitted • View
                        </button>
                      ) : (
                        <span style={{ color: "#fbbf24", fontWeight: 600 }}>Pending</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE MONITORING */}
        {!loading && activeTab === "attendance" && (
          <div>
            <div className="emp-section-header">
              <h2 className="emp-section-title">
                <Clock size={20} /> Attendance Records Across All Employees
              </h2>
            </div>

            {/* Admin Filters */}
            <div className="emp-filter-bar">
              <div className="emp-filter-item">
                <Filter size={15} style={{ color: "#94a3b8" }} />
                <span className="emp-label" style={{ margin: 0 }}>
                  Employee:
                </span>
                <select
                  className="emp-select"
                  style={{ width: "auto" }}
                  value={empFilter}
                  onChange={(e) => setEmpFilter(e.target.value)}
                >
                  <option value="all">All Employees</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="emp-filter-item">
                <span className="emp-label" style={{ margin: 0 }}>
                  Date:
                </span>
                <input
                  type="date"
                  className="emp-input"
                  style={{ width: "auto" }}
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
                {dateFilter && (
                  <button
                    className="emp-btn emp-btn-secondary emp-btn-sm"
                    onClick={() => setDateFilter("")}
                  >
                    Clear Date
                  </button>
                )}
              </div>

              <div className="emp-filter-item">
                <span className="emp-label" style={{ margin: 0 }}>
                  Status:
                </span>
                <select
                  className="emp-select"
                  style={{ width: "auto" }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="present">Present</option>
                  <option value="halfday">Half Day</option>
                  <option value="absent">Absent</option>
                  <option value="leave">Leave</option>
                </select>
              </div>
            </div>

            {filteredAttendance.length === 0 ? (
              <div className="emp-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                No attendance records match the selected filters.
              </div>
            ) : (
              <div className="emp-table-wrap">
                <table className="emp-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Check-In</th>
                      <th>Check-Out</th>
                      <th>Geofence Verification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.map((a) => (
                      <tr key={a.id}>
                        <td>
                          <strong style={{ color: "var(--emp-text)" }}>{getEmpName(a.employee_id)}</strong>
                          <div style={{ fontSize: "11px", color: "var(--emp-text-muted)" }}>{getEmpEmail(a.employee_id)}</div>
                        </td>
                        <td>{a.date}</td>
                        <td>
                          <span
                            className={`emp-chip emp-chip-${(a.status || "present")
                              .toLowerCase()
                              .replace(/\s+/g, "")}`}
                          >
                            {a.status}
                          </span>
                        </td>
                        <td>
                          {a.check_in_time
                            ? new Date(a.check_in_time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </td>
                        <td>
                          {a.check_out_time
                            ? new Date(a.check_out_time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </td>
                        <td>
                          {a.is_within_geofence ? (
                            <span style={{ color: "#34d399", fontSize: "12.5px" }}>
                              ✓ Chetana Campus ({a.distance_meters}m)
                            </span>
                          ) : (
                            <span style={{ color: "var(--emp-text-muted)", fontSize: "12.5px" }}>
                              {a.distance_meters ? `${a.distance_meters}m` : "Standard entry"}
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
        )}

        {/* TAB 3: TASKS MONITORING */}
        {!loading && activeTab === "tasks" && (
          <div>
            <div className="emp-section-header">
              <h2 className="emp-section-title">
                <CheckSquare size={20} /> All Employee Tasks & Deliverables
              </h2>
            </div>

            {/* Filter Bar */}
            <div className="emp-filter-bar">
              <div className="emp-filter-item">
                <Filter size={15} style={{ color: "#94a3b8" }} />
                <span className="emp-label" style={{ margin: 0 }}>
                  Employee:
                </span>
                <select
                  className="emp-select"
                  style={{ width: "auto" }}
                  value={empFilter}
                  onChange={(e) => setEmpFilter(e.target.value)}
                >
                  <option value="all">All Employees</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="emp-filter-item">
                <span className="emp-label" style={{ margin: 0 }}>
                  Status:
                </span>
                <select
                  className="emp-select"
                  style={{ width: "auto" }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="inprogress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="emp-filter-item">
                <span className="emp-label" style={{ margin: 0 }}>
                  Priority:
                </span>
                <select
                  className="emp-select"
                  style={{ width: "auto" }}
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {filteredTasks.length === 0 ? (
              <div className="emp-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                No tasks match the selected filters.
              </div>
            ) : (
              <div className="emp-table-wrap">
                <table className="emp-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Task Title & Details</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Logged Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <strong style={{ color: "var(--emp-text)" }}>{getEmpName(t.employee_id)}</strong>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: "var(--emp-text)" }}>{t.title}</div>
                          {t.description && (
                            <div style={{ fontSize: "12px", color: "var(--emp-text-muted)", marginTop: "2px" }}>
                              {t.description}
                            </div>
                          )}
                        </td>
                        <td>
                          <span className={`emp-chip emp-chip-${(t.priority || "medium").toLowerCase()}`}>
                            {t.priority || "Medium"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`emp-chip emp-chip-${(t.status || "pending")
                              .toLowerCase()
                              .replace(/\s+/g, "")}`}
                          >
                            {t.status || "Pending"}
                          </span>
                        </td>
                        <td>{t.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MONTHLY WORK REPORTS */}
        {!loading && activeTab === "monthly_reports" && (
          <div>
            <div className="emp-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="emp-section-title">
                <FileText size={20} /> Employee Monthly Performance Reports
              </h2>
            </div>

            {/* Filter Bar */}
            <div className="emp-filter-bar">
              <div className="emp-filter-item">
                <Filter size={15} style={{ color: "#94a3b8" }} />
                <span className="emp-label" style={{ margin: 0 }}>
                  Employee:
                </span>
                <select
                  className="emp-select"
                  style={{ width: "auto" }}
                  value={empFilter}
                  onChange={(e) => setEmpFilter(e.target.value)}
                >
                  <option value="all">All Employees</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="emp-filter-item">
                <CalendarDays size={15} style={{ color: "#94a3b8" }} />
                <span className="emp-label" style={{ margin: 0 }}>
                  Month:
                </span>
                <select
                  className="emp-select"
                  style={{ width: "auto" }}
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                >
                  <option value="all">All Recorded Months</option>
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>
                      {formatMonthLabel(m)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredReports.length === 0 ? (
              <div className="emp-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                No monthly performance reports match the selected filters.
              </div>
            ) : (
              <div className="emp-table-wrap">
                <table className="emp-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Reporting Month</th>
                      <th>Key Deliverables & Milestones</th>
                      <th>Next Month Priorities</th>
                      <th>Challenges / Blockers</th>
                      <th>Submitted Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <strong style={{ color: "var(--emp-text)" }}>{getEmpName(r.employee_id)}</strong>
                          <div style={{ fontSize: "11px", color: "var(--emp-text-muted)" }}>
                            {getEmpEmail(r.employee_id)}
                          </div>
                        </td>
                        <td>
                          <span className="emp-chip emp-chip-inprogress" style={{ fontWeight: 700 }}>
                            {formatMonthLabel(r.month)}
                          </span>
                        </td>
                        <td style={{ maxWidth: "280px" }}>
                          <div style={{ whiteSpace: "pre-wrap", maxHeight: "80px", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {r.key_achievements}
                          </div>
                        </td>
                        <td style={{ maxWidth: "220px", color: "var(--emp-text-muted)" }}>
                          <div style={{ whiteSpace: "pre-wrap", maxHeight: "80px", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {r.next_month_goals}
                          </div>
                        </td>
                        <td style={{ color: r.major_challenges ? "#f87171" : "var(--emp-text-faint)", maxWidth: "180px" }}>
                          {r.major_challenges || "None noted"}
                        </td>
                        <td style={{ fontSize: "12px", color: "var(--emp-text-muted)" }}>
                          {new Date(r.updated_at).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            className="emp-btn emp-btn-secondary emp-btn-sm"
                            onClick={() =>
                              setPreviewModal({
                                report: r,
                                empName: getEmpName(r.employee_id),
                                empEmail: getEmpEmail(r.employee_id),
                              })
                            }
                          >
                            <Eye size={13} /> View Full Report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ─── FULL REPORT VIEW MODAL ─── */}
      {previewModal && (
        <div className="emp-modal-overlay">
          <div className="emp-modal" style={{ maxWidth: "800px", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="emp-modal-header">
              <div className="emp-modal-title-group">
                <div className="emp-modal-icon">
                  <Award size={18} />
                </div>
                <h3 className="emp-modal-title">
                  {previewModal.empName} — {formatMonthLabel(previewModal.report.month)} Performance Report
                </h3>
              </div>
              <button className="emp-modal-close" onClick={() => setPreviewModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="emp-report-doc" style={{ marginTop: "10px" }}>
              <div className="emp-report-doc-header">
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--emp-text)", margin: "0 0 4px 0" }}>
                    Chetana Institute of Education and Learning
                  </h2>
                  <div style={{ fontSize: "13px", color: "var(--emp-text-muted)" }}>
                    Employee Monthly Performance Review Dossier
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#818cf8" }}>
                    {formatMonthLabel(previewModal.report.month)}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--emp-text-faint)" }}>
                    Last Updated: {new Date(previewModal.report.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

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
                    Staff Member
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--emp-text)" }}>
                    {previewModal.empName}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--emp-text-faint)", fontWeight: 700, display: "block" }}>
                    Official Email
                  </span>
                  <span style={{ fontSize: "13.5px", color: "var(--emp-text)" }}>{previewModal.empEmail}</span>
                </div>
                <div>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--emp-text-faint)", fontWeight: 700, display: "block" }}>
                    Status
                  </span>
                  <span className="emp-chip emp-chip-present" style={{ display: "inline-block", marginTop: "2px" }}>
                    Submitted to Leadership
                  </span>
                </div>
              </div>

              <div className="emp-report-section-block">
                <h4>
                  <Award size={14} /> 1. Key Milestones & Completed Deliverables
                </h4>
                <p>{previewModal.report.key_achievements}</p>
              </div>

              <div className="emp-report-section-block">
                <h4>
                  <Target size={14} /> 2. Goals & Priorities for Upcoming Month
                </h4>
                <p>{previewModal.report.next_month_goals}</p>
              </div>

              {previewModal.report.major_challenges && (
                <div className="emp-report-section-block">
                  <h4>
                    <AlertCircle size={14} /> 3. Challenges & Bottlenecks
                  </h4>
                  <p>{previewModal.report.major_challenges}</p>
                </div>
              )}

              {previewModal.report.learnings_skills && (
                <div className="emp-report-section-block">
                  <h4>
                    <TrendingUp size={14} /> 4. Professional Development & Learnings
                  </h4>
                  <p>{previewModal.report.learnings_skills}</p>
                </div>
              )}

              {previewModal.report.support_needed && (
                <div className="emp-report-section-block">
                  <h4>
                    <Sparkles size={14} /> 5. Resource & Management Support Needed
                  </h4>
                  <p>{previewModal.report.support_needed}</p>
                </div>
              )}

              {previewModal.report.notes && (
                <div className="emp-report-section-block">
                  <h4>
                    <FileText size={14} /> 6. Additional Notes
                  </h4>
                  <p>{previewModal.report.notes}</p>
                </div>
              )}
            </div>

            <div className="emp-modal-footer" style={{ marginTop: "20px" }}>
              <button
                type="button"
                className="emp-btn emp-btn-ghost emp-btn-sm"
                onClick={() => setPreviewModal(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="emp-btn emp-btn-primary emp-btn-sm"
                onClick={() => window.print()}
              >
                <Printer size={14} /> Print / Save Dossier PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
