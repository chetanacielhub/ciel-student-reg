import { createAdminClient } from "./supabase/admin";

export type AttendanceStatus = "Present" | "Absent" | "Half Day" | "Leave";
export type TaskStatus = "Pending" | "In Progress" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High";

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string; // YYYY-MM-DD
  check_in_time: string | null;
  check_out_time: string | null;
  status: AttendanceStatus;
  created_at: string;
  updated_at: string;
  location_lat?: number | null;
  location_lng?: number | null;
  distance_meters?: number | null;
  is_within_geofence?: boolean | null;
}

export interface TaskRecord {
  id: string;
  employee_id: string;
  date: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  created_at: string;
  updated_at: string;
}

export interface DailyUpdateRecord {
  id: string;
  employee_id: string;
  date: string;
  work_completed: string;
  blockers: string;
  tomorrow_plan: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface MonthlyReportRecord {
  id: string;
  employee_id: string;
  month: string; // YYYY-MM e.g. "2026-08"
  key_achievements: string;
  major_challenges: string;
  next_month_goals: string;
  learnings_skills?: string;
  support_needed?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// In-memory fallback store (used when Supabase is unavailable)
// ---------------------------------------------------------------------------
const memStore = {
  attendance: [] as AttendanceRecord[],
  tasks: [] as TaskRecord[],
  dailyUpdates: [] as DailyUpdateRecord[],
  monthlyReports: [] as MonthlyReportRecord[],
};

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

/* ============================================================================
 * 1. ATTENDANCE OPERATIONS
 * ============================================================================ */

export async function getAttendanceRecords(filter?: {
  employee_id?: string;
  date?: string;
  status?: string;
}): Promise<AttendanceRecord[]> {
  try {
    const supabase = createAdminClient();
    let query = supabase.from("employee_attendance").select("*").order("date", { ascending: false });
    if (filter?.employee_id) query = query.eq("employee_id", filter.employee_id);
    if (filter?.date) query = query.eq("date", filter.date);
    if (filter?.status) query = query.ilike("status", filter.status);

    const { data, error } = await query;
    if (error) throw error;
    return (data as AttendanceRecord[]) || [];
  } catch {
    // In-memory fallback
    let records = [...memStore.attendance];
    if (filter?.employee_id) records = records.filter((r) => r.employee_id === filter.employee_id);
    if (filter?.date) records = records.filter((r) => r.date === filter.date);
    if (filter?.status) records = records.filter((r) => r.status.toLowerCase() === filter.status?.toLowerCase());
    return records.sort((a, b) => (b.date > a.date ? 1 : -1));
  }
}

export async function getTodayAttendance(employee_id: string): Promise<AttendanceRecord | null> {
  const today = getTodayString();
  const records = await getAttendanceRecords({ employee_id, date: today });
  return records.length > 0 ? records[0] : null;
}

export async function markAttendance(
  employee_id: string,
  status: AttendanceStatus,
  action?: "check_in" | "check_out" | "set_status" | "auto_location",
  location?: {
    lat: number;
    lng: number;
    distanceMeters: number;
    isWithinGeofence: boolean;
  }
): Promise<AttendanceRecord> {
  const today = getTodayString();
  const nowIso = new Date().toISOString();

  const locData = location
    ? {
        location_lat: location.lat,
        location_lng: location.lng,
        distance_meters: location.distanceMeters,
        is_within_geofence: location.isWithinGeofence,
      }
    : {};

  // Try Supabase first
  try {
    const supabase = createAdminClient();

    // Fetch existing record for today
    const { data: existing } = await supabase
      .from("employee_attendance")
      .select("*")
      .eq("employee_id", employee_id)
      .eq("date", today)
      .maybeSingle();

    let updatedRecord: AttendanceRecord;

    if (existing) {
      let check_in = existing.check_in_time;
      let check_out = existing.check_out_time;
      if ((action === "check_in" || action === "auto_location") && !check_in) check_in = nowIso;
      if (action === "check_out") check_out = nowIso;

      const { data, error } = await supabase
        .from("employee_attendance")
        .update({
          status: status || existing.status,
          check_in_time: check_in,
          check_out_time: check_out,
          updated_at: nowIso,
          ...locData,
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      updatedRecord = data as AttendanceRecord;
    } else {
      const check_in =
        action === "check_in" || action === "auto_location" || status === "Present" ? nowIso : null;

      const { data, error } = await supabase
        .from("employee_attendance")
        .insert({
          employee_id,
          date: today,
          status,
          check_in_time: check_in,
          check_out_time: null,
          created_at: nowIso,
          updated_at: nowIso,
          ...locData,
        })
        .select()
        .single();

      if (error) throw error;
      updatedRecord = data as AttendanceRecord;
    }

    return updatedRecord;
  } catch {
    // In-memory fallback
    const idx = memStore.attendance.findIndex(
      (r) => r.employee_id === employee_id && r.date === today
    );

    let updatedRecord: AttendanceRecord;
    if (idx >= 0) {
      const rec = memStore.attendance[idx];
      let check_in = rec.check_in_time;
      let check_out = rec.check_out_time;
      if ((action === "check_in" || action === "auto_location") && !check_in) check_in = nowIso;
      if (action === "check_out") check_out = nowIso;
      updatedRecord = { ...rec, status, check_in_time: check_in, check_out_time: check_out, updated_at: nowIso, ...locData };
      memStore.attendance[idx] = updatedRecord;
    } else {
      const check_in = action === "check_in" || action === "auto_location" || status === "Present" ? nowIso : null;
      updatedRecord = {
        id: newId("att"),
        employee_id,
        date: today,
        status,
        check_in_time: check_in,
        check_out_time: null,
        created_at: nowIso,
        updated_at: nowIso,
        ...locData,
      };
      memStore.attendance.unshift(updatedRecord);
    }
    return updatedRecord;
  }
}

/* ============================================================================
 * 2. TASK OPERATIONS
 * ============================================================================ */

export async function getTasks(filter?: {
  employee_id?: string;
  date?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}): Promise<TaskRecord[]> {
  try {
    const supabase = createAdminClient();
    let query = supabase.from("employee_tasks").select("*").order("created_at", { ascending: false });
    if (filter?.employee_id) query = query.eq("employee_id", filter.employee_id);
    if (filter?.date) query = query.eq("date", filter.date);
    if (filter?.status) query = query.eq("status", filter.status);
    if (filter?.priority) query = query.eq("priority", filter.priority);

    const { data, error } = await query;
    if (error) throw error;
    return (data as TaskRecord[]) || [];
  } catch {
    // In-memory fallback
    let records = [...memStore.tasks];
    if (filter?.employee_id) records = records.filter((t) => t.employee_id === filter.employee_id);
    if (filter?.date) records = records.filter((t) => t.date === filter.date);
    if (filter?.status) records = records.filter((t) => t.status === filter.status);
    if (filter?.priority) records = records.filter((t) => t.priority === filter.priority);
    return records.sort((a, b) => (b.created_at > a.created_at ? 1 : -1));
  }
}

export async function createTask(
  employee_id: string,
  title: string,
  description: string,
  priority: TaskPriority = "Medium",
  status: TaskStatus = "Pending",
  date?: string
): Promise<TaskRecord> {
  const taskDate = date || getTodayString();
  const nowIso = new Date().toISOString();

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("employee_tasks")
      .insert({
        employee_id,
        date: taskDate,
        title,
        description: description || "",
        status,
        priority,
        created_at: nowIso,
        updated_at: nowIso,
      })
      .select()
      .single();

    if (error) throw error;
    return data as TaskRecord;
  } catch {
    // In-memory fallback
    const newTask: TaskRecord = {
      id: newId("tsk"),
      employee_id,
      date: taskDate,
      title,
      description: description || "",
      status,
      priority,
      created_at: nowIso,
      updated_at: nowIso,
    };
    memStore.tasks.unshift(newTask);
    return newTask;
  }
}

export async function updateTask(
  task_id: string,
  employee_id: string,
  updates: Partial<Pick<TaskRecord, "title" | "description" | "status" | "priority" | "date" | "employee_id">>
): Promise<TaskRecord | null> {
  const nowIso = new Date().toISOString();
  const isSuperUser = employee_id === "admin" || employee_id === "emp-admin";

  try {
    const supabase = createAdminClient();
    let query = supabase
      .from("employee_tasks")
      .update({ ...updates, updated_at: nowIso })
      .eq("id", task_id);

    if (!isSuperUser) query = query.eq("employee_id", employee_id);

    const { data, error } = await query.select().single();
    if (error) throw error;
    return data as TaskRecord;
  } catch {
    // In-memory fallback
    const idx = memStore.tasks.findIndex(
      (t) => t.id === task_id && (t.employee_id === employee_id || isSuperUser)
    );
    if (idx < 0) return null;
    const updatedTask: TaskRecord = { ...memStore.tasks[idx], ...updates, updated_at: nowIso };
    memStore.tasks[idx] = updatedTask;
    return updatedTask;
  }
}

export async function deleteTask(task_id: string, employee_id: string): Promise<boolean> {
  const isSuperUser = employee_id === "admin" || employee_id === "emp-admin";

  try {
    const supabase = createAdminClient();
    let query = supabase.from("employee_tasks").delete().eq("id", task_id);
    if (!isSuperUser) query = query.eq("employee_id", employee_id);
    const { error } = await query;
    if (error) throw error;
    return true;
  } catch {
    // In-memory fallback
    const before = memStore.tasks.length;
    memStore.tasks = memStore.tasks.filter(
      (t) => !(t.id === task_id && (t.employee_id === employee_id || isSuperUser))
    );
    return memStore.tasks.length !== before;
  }
}

/* ============================================================================
 * 3. DAILY UPDATE OPERATIONS
 * ============================================================================ */

export async function getDailyUpdates(filter?: {
  employee_id?: string;
  date?: string;
}): Promise<DailyUpdateRecord[]> {
  try {
    const supabase = createAdminClient();
    let query = supabase.from("employee_daily_updates").select("*").order("date", { ascending: false });
    if (filter?.employee_id) query = query.eq("employee_id", filter.employee_id);
    if (filter?.date) query = query.eq("date", filter.date);

    const { data, error } = await query;
    if (error) throw error;
    return (data as DailyUpdateRecord[]) || [];
  } catch {
    let records = [...memStore.dailyUpdates];
    if (filter?.employee_id) records = records.filter((u) => u.employee_id === filter.employee_id);
    if (filter?.date) records = records.filter((u) => u.date === filter.date);
    return records.sort((a, b) => (b.date > a.date ? 1 : -1));
  }
}

export async function saveDailyUpdate(
  employee_id: string,
  data: {
    work_completed: string;
    blockers?: string;
    tomorrow_plan?: string;
    notes?: string;
    date?: string;
  }
): Promise<DailyUpdateRecord> {
  const updateDate = data.date || getTodayString();
  const nowIso = new Date().toISOString();

  try {
    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from("employee_daily_updates")
      .select("id")
      .eq("employee_id", employee_id)
      .eq("date", updateDate)
      .maybeSingle();

    let result: DailyUpdateRecord;

    if (existing) {
      const { data: updated, error } = await supabase
        .from("employee_daily_updates")
        .update({
          work_completed: data.work_completed,
          blockers: data.blockers || "",
          tomorrow_plan: data.tomorrow_plan || "",
          notes: data.notes || "",
          updated_at: nowIso,
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      result = updated as DailyUpdateRecord;
    } else {
      const { data: inserted, error } = await supabase
        .from("employee_daily_updates")
        .insert({
          employee_id,
          date: updateDate,
          work_completed: data.work_completed,
          blockers: data.blockers || "",
          tomorrow_plan: data.tomorrow_plan || "",
          notes: data.notes || "",
          created_at: nowIso,
          updated_at: nowIso,
        })
        .select()
        .single();

      if (error) throw error;
      result = inserted as DailyUpdateRecord;
    }

    return result;
  } catch {
    // In-memory fallback
    const idx = memStore.dailyUpdates.findIndex(
      (u) => u.employee_id === employee_id && u.date === updateDate
    );

    let record: DailyUpdateRecord;
    if (idx >= 0) {
      record = {
        ...memStore.dailyUpdates[idx],
        work_completed: data.work_completed,
        blockers: data.blockers || "",
        tomorrow_plan: data.tomorrow_plan || "",
        notes: data.notes || "",
        updated_at: nowIso,
      };
      memStore.dailyUpdates[idx] = record;
    } else {
      record = {
        id: newId("upd"),
        employee_id,
        date: updateDate,
        work_completed: data.work_completed,
        blockers: data.blockers || "",
        tomorrow_plan: data.tomorrow_plan || "",
        notes: data.notes || "",
        created_at: nowIso,
        updated_at: nowIso,
      };
      memStore.dailyUpdates.unshift(record);
    }
    return record;
  }
}

/* ============================================================================
 * 4. MONTHLY REPORT OPERATIONS
 * ============================================================================ */

export async function getMonthlyReports(filter?: {
  employee_id?: string;
  month?: string;
}): Promise<MonthlyReportRecord[]> {
  try {
    const supabase = createAdminClient();
    let query = supabase.from("employee_monthly_reports").select("*").order("month", { ascending: false });
    if (filter?.employee_id) query = query.eq("employee_id", filter.employee_id);
    if (filter?.month) query = query.eq("month", filter.month);

    const { data, error } = await query;
    if (error) throw error;
    return (data as MonthlyReportRecord[]) || [];
  } catch {
    let records = [...(memStore.monthlyReports || [])];
    if (filter?.employee_id) records = records.filter((r) => r.employee_id === filter.employee_id);
    if (filter?.month) records = records.filter((r) => r.month === filter.month);
    return records.sort((a, b) => (b.month > a.month ? 1 : b.created_at > a.created_at ? 1 : -1));
  }
}

export async function saveMonthlyReport(
  employee_id: string,
  data: {
    month: string;
    key_achievements: string;
    major_challenges?: string;
    next_month_goals: string;
    learnings_skills?: string;
    support_needed?: string;
    notes?: string;
  }
): Promise<MonthlyReportRecord> {
  const targetMonth = data.month || new Date().toISOString().slice(0, 7);
  const nowIso = new Date().toISOString();

  try {
    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from("employee_monthly_reports")
      .select("id")
      .eq("employee_id", employee_id)
      .eq("month", targetMonth)
      .maybeSingle();

    let result: MonthlyReportRecord;

    if (existing) {
      const { data: updated, error } = await supabase
        .from("employee_monthly_reports")
        .update({
          key_achievements: data.key_achievements,
          major_challenges: data.major_challenges || "",
          next_month_goals: data.next_month_goals,
          learnings_skills: data.learnings_skills || "",
          support_needed: data.support_needed || "",
          notes: data.notes || "",
          updated_at: nowIso,
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      result = updated as MonthlyReportRecord;
    } else {
      const { data: inserted, error } = await supabase
        .from("employee_monthly_reports")
        .insert({
          employee_id,
          month: targetMonth,
          key_achievements: data.key_achievements,
          major_challenges: data.major_challenges || "",
          next_month_goals: data.next_month_goals,
          learnings_skills: data.learnings_skills || "",
          support_needed: data.support_needed || "",
          notes: data.notes || "",
          created_at: nowIso,
          updated_at: nowIso,
        })
        .select()
        .single();

      if (error) throw error;
      result = inserted as MonthlyReportRecord;
    }

    return result;
  } catch {
    // In-memory fallback
    if (!memStore.monthlyReports) memStore.monthlyReports = [];

    const idx = memStore.monthlyReports.findIndex(
      (r) => r.employee_id === employee_id && r.month === targetMonth
    );

    let record: MonthlyReportRecord;
    if (idx >= 0) {
      record = {
        ...memStore.monthlyReports[idx],
        key_achievements: data.key_achievements,
        major_challenges: data.major_challenges || "",
        next_month_goals: data.next_month_goals,
        learnings_skills: data.learnings_skills || "",
        support_needed: data.support_needed || "",
        notes: data.notes || "",
        updated_at: nowIso,
      };
      memStore.monthlyReports[idx] = record;
    } else {
      record = {
        id: newId("mrep"),
        employee_id,
        month: targetMonth,
        key_achievements: data.key_achievements,
        major_challenges: data.major_challenges || "",
        next_month_goals: data.next_month_goals,
        learnings_skills: data.learnings_skills || "",
        support_needed: data.support_needed || "",
        notes: data.notes || "",
        created_at: nowIso,
        updated_at: nowIso,
      };
      memStore.monthlyReports.unshift(record);
    }
    return record;
  }
}

export async function deleteMonthlyReport(id: string, employee_id: string): Promise<boolean> {
  const isSuperUser = employee_id === "admin" || employee_id === "emp-admin";

  try {
    const supabase = createAdminClient();
    let query = supabase.from("employee_monthly_reports").delete().eq("id", id);
    if (!isSuperUser) query = query.eq("employee_id", employee_id);
    const { error } = await query;
    if (error) throw error;
    return true;
  } catch {
    if (!memStore.monthlyReports) return false;
    const before = memStore.monthlyReports.length;
    memStore.monthlyReports = memStore.monthlyReports.filter(
      (r) => !(r.id === id && (r.employee_id === employee_id || isSuperUser))
    );
    return memStore.monthlyReports.length !== before;
  }
}
