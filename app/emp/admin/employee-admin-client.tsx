"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EmpSessionData, getAuthorizedEmpUsers } from "@/lib/emp-auth";
import { EmpThemeToggle } from "../layout";
import { Logo } from "@/components/ui/logo";
import { AttendanceRecord, TaskRecord, DailyUpdateRecord } from "@/lib/emp-store";
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
} from "lucide-react";

export default function EmployeeAdminClient({ adminUser }: { adminUser: EmpSessionData }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "attendance" | "tasks" | "updates">("overview");

  const todayStr = new Date().toISOString().split("T")[0];
  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Master Lists for All Employees
  const employees = [
    { id: "emp-1", name: "Employee 1", email: "employee1@ciel.edu.in" },
    { id: "emp-2", name: "Employee 2", email: "employee2@ciel.edu.in" },
    { id: "emp-3", name: "Employee 3", email: "employee3@ciel.edu.in" },
  ];

  // Data states
  const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>([]);
  const [allTasks, setAllTasks] = useState<TaskRecord[]>([]);
  const [allUpdates, setAllUpdates] = useState<DailyUpdateRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [empFilter, setEmpFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch attendance, tasks, updates across all employees
      const [attRes, taskRes, updRes] = await Promise.all([
        fetch("/emp/api/attendance"),
        fetch("/emp/api/tasks"),
        fetch("/emp/api/daily-updates"),
      ]);

      const attData = await attRes.json();
      const taskData = await taskRes.json();
      const updData = await updRes.json();

      if (attData.success) setAllAttendance(attData.data);
      if (taskData.success) setAllTasks(taskData.data);
      if (updData.success) setAllUpdates(updData.data);
    } catch {
      // Handle error gracefully
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

  // Helper map for Employee name
  const getEmpName = (empId: string) => {
    const found = employees.find((e) => e.id === empId);
    return found ? found.name : empId;
  };

  // Filtered views
  const filteredAttendance = allAttendance.filter((a) => {
    if (empFilter !== "all" && a.employee_id !== empFilter) return false;
    if (dateFilter && a.date !== dateFilter) return false;
    if (statusFilter !== "all" && a.status.toLowerCase().replace(/\s+/g, "") !== statusFilter) return false;
    return true;
  });

  const filteredTasks = allTasks.filter((t) => {
    if (empFilter !== "all" && t.employee_id !== empFilter) return false;
    if (dateFilter && t.date !== dateFilter) return false;
    if (statusFilter !== "all" && t.status.toLowerCase().replace(/\s+/g, "") !== statusFilter) return false;
    if (priorityFilter !== "all" && t.priority.toLowerCase() !== priorityFilter) return false;
    return true;
  });

  const filteredUpdates = allUpdates.filter((u) => {
    if (empFilter !== "all" && u.employee_id !== empFilter) return false;
    if (dateFilter && u.date !== dateFilter) return false;
    return true;
  });

  return (
    <div>
      {/* Top Header Navbar */}
      <header className="emp-navbar">
        <div className="emp-brand" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Logo href="/emp/admin" size="small" />
          <span className="emp-brand-badge" style={{ background: "linear-gradient(135deg, #f59e0b, #ea580c)", marginLeft: "-10px" }}>
            Admin Center
          </span>
        </div>

        <div className="emp-user-info">
          <div className="emp-user-meta">
            <div className="emp-user-name">{adminUser.name}</div>
            <div className="emp-user-role">
              <span className="emp-user-role-badge emp-role-admin">Employee Admin</span>
              <span>•</span>
              <Calendar size={13} style={{ display: "inline", marginBottom: "-1px" }} />
              <span>{currentDateFormatted}</span>
            </div>
          </div>

          <EmpThemeToggle />

          <button onClick={handleLogout} className="emp-btn-logout">
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="emp-container">
        {/* Navigation Tabs */}
        <div className="emp-tabs">
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
            Attendance Monitoring ({allAttendance.length})
          </button>
          <button
            className={`emp-tab ${activeTab === "tasks" ? "emp-tab-active" : ""}`}
            onClick={() => setActiveTab("tasks")}
          >
            <CheckSquare size={16} style={{ display: "inline", marginRight: "8px", verticalAlign: "text-bottom" }} />
            Employee Tasks ({allTasks.length})
          </button>
          <button
            className={`emp-tab ${activeTab === "updates" ? "emp-tab-active" : ""}`}
            onClick={() => setActiveTab("updates")}
          >
            <FileText size={16} style={{ display: "inline", marginRight: "8px", verticalAlign: "text-bottom" }} />
            Daily Work Reports ({allUpdates.length})
          </button>
        </div>

        {/* TAB 1: ALL EMPLOYEES OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <div className="emp-section-header">
              <h2 className="emp-section-title">
                <Users size={20} /> Today's Employee Summary ({todayStr})
              </h2>
            </div>

            <div className="emp-grid-3">
              {employees.map((emp) => {
                const todayAtt = allAttendance.find((a) => a.employee_id === emp.id && a.date === todayStr);
                const empTasks = allTasks.filter((t) => t.employee_id === emp.id);
                const pendingTasks = empTasks.filter((t) => t.status === "Pending").length;
                const inProgressTasks = empTasks.filter((t) => t.status === "In Progress").length;
                const completedTasks = empTasks.filter((t) => t.status === "Completed").length;
                const todayReport = allUpdates.find((u) => u.employee_id === emp.id && u.date === todayStr);

                return (
                  <div key={emp.id} className="emp-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                      <div>
                        <div style={{ fontSize: "18px", fontWeight: 800, color: "#ffffff" }}>{emp.name}</div>
                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>{emp.email}</div>
                      </div>
                      {todayAtt ? (
                        <span className={`emp-badge emp-badge-${todayAtt.status.toLowerCase().replace(/\s+/g, "")}`}>
                          {todayAtt.status}
                        </span>
                      ) : (
                        <span className="emp-badge emp-badge-pending">Not Marked</span>
                      )}
                    </div>

                    <div style={{ background: "rgba(30, 41, 59, 0.5)", padding: "12px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>
                      <div>
                        Check-in:{" "}
                        <strong>
                          {todayAtt?.check_in_time
                            ? new Date(todayAtt.check_in_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : "—"}
                        </strong>
                      </div>
                      <div>
                        Check-out:{" "}
                        <strong>
                          {todayAtt?.check_out_time
                            ? new Date(todayAtt.check_out_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : "—"}
                        </strong>
                      </div>
                    </div>

                    <div style={{ fontSize: "13px", marginBottom: "16px" }}>
                      <div style={{ fontWeight: 600, color: "#cbd5e1", marginBottom: "8px" }}>Task Metrics:</div>
                      <div className="emp-grid-3" style={{ gap: "8px", marginBottom: 0 }}>
                        <div style={{ background: "rgba(245, 158, 11, 0.1)", padding: "6px", borderRadius: "6px", textAlign: "center" }}>
                          <div style={{ fontSize: "16px", fontWeight: 800, color: "#fbbf24" }}>{pendingTasks}</div>
                          <div style={{ fontSize: "11px", color: "#cbd5e1" }}>Pending</div>
                        </div>
                        <div style={{ background: "rgba(59, 130, 246, 0.1)", padding: "6px", borderRadius: "6px", textAlign: "center" }}>
                          <div style={{ fontSize: "16px", fontWeight: 800, color: "#60a5fa" }}>{inProgressTasks}</div>
                          <div style={{ fontSize: "11px", color: "#cbd5e1" }}>In Progress</div>
                        </div>
                        <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "6px", borderRadius: "6px", textAlign: "center" }}>
                          <div style={{ fontSize: "16px", fontWeight: 800, color: "#34d399" }}>{completedTasks}</div>
                          <div style={{ fontSize: "11px", color: "#cbd5e1" }}>Completed</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "12px" }}>
                      <span style={{ color: "#94a3b8" }}>Today's Daily Report: </span>
                      {todayReport ? (
                        <span style={{ color: "#34d399", fontWeight: 600 }}>Submitted</span>
                      ) : (
                        <span style={{ color: "#f87171", fontWeight: 600 }}>Pending</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE MONITORING */}
        {activeTab === "attendance" && (
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
                <span className="emp-label" style={{ margin: 0 }}>Employee:</span>
                <select
                  className="emp-select"
                  style={{ width: "auto" }}
                  value={empFilter}
                  onChange={(e) => setEmpFilter(e.target.value)}
                >
                  <option value="all">All Employees</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>

              <div className="emp-filter-item">
                <span className="emp-label" style={{ margin: 0 }}>Date:</span>
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
                <span className="emp-label" style={{ margin: 0 }}>Status:</span>
                <select
                  className="emp-select"
                  style={{ width: "auto" }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="halfday">Half Day</option>
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
                      <th>Check-in Time</th>
                      <th>Check-out Time</th>
                      <th>Location Verification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.map((a) => (
                      <tr key={a.id}>
                        <td>
                          <strong style={{ color: "#ffffff" }}>{getEmpName(a.employee_id)}</strong>
                        </td>
                        <td>{a.date}</td>
                        <td>
                          <span className={`emp-badge emp-badge-${a.status.toLowerCase().replace(/\s+/g, "")}`}>
                            {a.status}
                          </span>
                        </td>
                        <td>
                          {a.check_in_time
                            ? new Date(a.check_in_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : "—"}
                        </td>
                        <td>
                          {a.check_out_time
                            ? new Date(a.check_out_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : "—"}
                        </td>
                        <td>
                          {a.distance_meters !== undefined && a.distance_meters !== null ? (
                            <span style={{ fontSize: "12px", color: a.is_within_geofence ? "#34d399" : "#fbbf24" }}>
                              {a.distance_meters}m from Chetana ({a.is_within_geofence ? "Valid 200m" : "Outside Zone"})
                            </span>
                          ) : (
                            <span style={{ fontSize: "12px", color: "#94a3b8" }}>Manual Entry</span>
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

        {/* TAB 3: EMPLOYEE TASKS VIEW */}
        {activeTab === "tasks" && (
          <div>
            <div className="emp-section-header">
              <h2 className="emp-section-title">
                <CheckSquare size={20} /> All Employee Tasks
              </h2>
            </div>

            {/* Filter Bar */}
            <div className="emp-filter-bar">
              <div className="emp-filter-item">
                <Filter size={15} style={{ color: "#94a3b8" }} />
                <span className="emp-label" style={{ margin: 0 }}>Employee:</span>
                <select
                  className="emp-select"
                  style={{ width: "auto" }}
                  value={empFilter}
                  onChange={(e) => setEmpFilter(e.target.value)}
                >
                  <option value="all">All Employees</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>

              <div className="emp-filter-item">
                <span className="emp-label" style={{ margin: 0 }}>Status:</span>
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
                <span className="emp-label" style={{ margin: 0 }}>Priority:</span>
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
                No task records match the selected filters.
              </div>
            ) : (
              <div className="emp-table-wrap">
                <table className="emp-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Date</th>
                      <th>Task Title</th>
                      <th>Description</th>
                      <th>Priority</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <strong style={{ color: "#ffffff" }}>{getEmpName(t.employee_id)}</strong>
                        </td>
                        <td>{t.date}</td>
                        <td>{t.title}</td>
                        <td style={{ maxWidth: "260px", color: "#94a3b8", fontSize: "13px" }}>
                          {t.description || "—"}
                        </td>
                        <td>
                          <span className={`emp-badge emp-badge-${t.priority.toLowerCase()}`}>
                            {t.priority}
                          </span>
                        </td>
                        <td>
                          <span className={`emp-badge emp-badge-${t.status.toLowerCase().replace(/\s+/g, "")}`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DAILY WORK REPORTS */}
        {activeTab === "updates" && (
          <div>
            <div className="emp-section-header">
              <h2 className="emp-section-title">
                <FileText size={20} /> Employee Daily Work Reports
              </h2>
            </div>

            {/* Filter Bar */}
            <div className="emp-filter-bar">
              <div className="emp-filter-item">
                <Filter size={15} style={{ color: "#94a3b8" }} />
                <span className="emp-label" style={{ margin: 0 }}>Employee:</span>
                <select
                  className="emp-select"
                  style={{ width: "auto" }}
                  value={empFilter}
                  onChange={(e) => setEmpFilter(e.target.value)}
                >
                  <option value="all">All Employees</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>

              <div className="emp-filter-item">
                <span className="emp-label" style={{ margin: 0 }}>Date:</span>
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
            </div>

            {filteredUpdates.length === 0 ? (
              <div className="emp-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                No daily work reports match the selected filters.
              </div>
            ) : (
              <div className="emp-table-wrap">
                <table className="emp-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Date</th>
                      <th>Work Completed</th>
                      <th>Blockers / Issues</th>
                      <th>Plan for Tomorrow</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUpdates.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <strong style={{ color: "#ffffff" }}>{getEmpName(u.employee_id)}</strong>
                        </td>
                        <td>{u.date}</td>
                        <td style={{ maxWidth: "260px" }}>{u.work_completed}</td>
                        <td style={{ color: u.blockers ? "#f87171" : "#94a3b8", maxWidth: "200px" }}>
                          {u.blockers || "None"}
                        </td>
                        <td style={{ maxWidth: "200px", color: "#cbd5e1" }}>{u.tomorrow_plan || "—"}</td>
                        <td style={{ color: "#94a3b8", fontSize: "13px" }}>{u.notes || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
