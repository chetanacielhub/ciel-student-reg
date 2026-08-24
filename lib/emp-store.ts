import fs from "fs/promises";
import path from "path";
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

interface EmpStoreJson {
  attendance: AttendanceRecord[];
  tasks: TaskRecord[];
  dailyUpdates: DailyUpdateRecord[];
}

const STORE_PATH = path.join(process.cwd(), "data", "emp-store.json");

/** Helper to ensure local fallback file exists */
async function ensureLocalStore(): Promise<EmpStoreJson> {
  try {
    const dir = path.dirname(STORE_PATH);
    await fs.mkdir(dir, { recursive: true });
    const content = await fs.readFile(STORE_PATH, "utf-8");
    return JSON.parse(content);
  } catch {
    const initial: EmpStoreJson = {
      attendance: [],
      tasks: [],
      dailyUpdates: [],
    };
    await fs.writeFile(STORE_PATH, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
}

async function writeLocalStore(store: EmpStoreJson): Promise<void> {
  const dir = path.dirname(STORE_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

function getTodayString(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
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
    if (filter?.status) query = query.eq("status", filter.status);

    const { data, error } = await query;
    if (!error && data) return data as AttendanceRecord[];
  } catch {
    // Fall back to local store
  }

  const store = await ensureLocalStore();
  let records = [...store.attendance];

  if (filter?.employee_id) {
    records = records.filter((r) => r.employee_id === filter.employee_id);
  }
  if (filter?.date) {
    records = records.filter((r) => r.date === filter.date);
  }
  if (filter?.status) {
    records = records.filter((r) => r.status === filter.status);
  }

  return records.sort((a, b) => (b.date > a.date ? 1 : -1));
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
    const { data: existing } = await supabase
      .from("employee_attendance")
      .select("*")
      .eq("employee_id", employee_id)
      .eq("date", today)
      .maybeSingle();

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

      if (!error && data) return data as AttendanceRecord;
    } else {
      const check_in = action === "check_in" || action === "auto_location" || status === "Present" ? nowIso : null;
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

      if (!error && data) return data as AttendanceRecord;
    }
  } catch {
    // Fall back to local store
  }

  const store = await ensureLocalStore();
  const existingIdx = store.attendance.findIndex(
    (r) => r.employee_id === employee_id && r.date === today
  );

  if (existingIdx >= 0) {
    const rec = store.attendance[existingIdx];
    let check_in = rec.check_in_time;
    let check_out = rec.check_out_time;

    if ((action === "check_in" || action === "auto_location") && !check_in) check_in = nowIso;
    if (action === "check_out") check_out = nowIso;

    const updated: AttendanceRecord = {
      ...rec,
      status: status || rec.status,
      check_in_time: check_in,
      check_out_time: check_out,
      updated_at: nowIso,
      ...locData,
    };
    store.attendance[existingIdx] = updated;
    await writeLocalStore(store);
    return updated;
  } else {
    const check_in = action === "check_in" || action === "auto_location" || status === "Present" ? nowIso : null;
    const newRec: AttendanceRecord = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      employee_id,
      date: today,
      status,
      check_in_time: check_in,
      check_out_time: null,
      created_at: nowIso,
      updated_at: nowIso,
      ...locData,
    };
    store.attendance.push(newRec);
    await writeLocalStore(store);
    return newRec;
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
    if (!error && data) return data as TaskRecord[];
  } catch {
    // Fall back to local store
  }

  const store = await ensureLocalStore();
  let records = [...store.tasks];

  if (filter?.employee_id) {
    records = records.filter((t) => t.employee_id === filter.employee_id);
  }
  if (filter?.date) {
    records = records.filter((t) => t.date === filter.date);
  }
  if (filter?.status) {
    records = records.filter((t) => t.status === filter.status);
  }
  if (filter?.priority) {
    records = records.filter((t) => t.priority === filter.priority);
  }

  return records.sort((a, b) => (b.created_at > a.created_at ? 1 : -1));
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
        description,
        status,
        priority,
        created_at: nowIso,
        updated_at: nowIso,
      })
      .select()
      .single();

    if (!error && data) return data as TaskRecord;
  } catch {
    // Fall back
  }

  const store = await ensureLocalStore();
  const newTask: TaskRecord = {
    id: `tsk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    employee_id,
    date: taskDate,
    title,
    description: description || "",
    status,
    priority,
    created_at: nowIso,
    updated_at: nowIso,
  };

  store.tasks.push(newTask);
  await writeLocalStore(store);
  return newTask;
}

export async function updateTask(
  task_id: string,
  employee_id: string, // Strict owner check
  updates: Partial<Pick<TaskRecord, "title" | "description" | "status" | "priority">>
): Promise<TaskRecord | null> {
  const nowIso = new Date().toISOString();

  try {
    const supabase = createAdminClient();
    const { data: existing } = await supabase
      .from("employee_tasks")
      .select("*")
      .eq("id", task_id)
      .single();

    if (existing && existing.employee_id === employee_id) {
      const { data, error } = await supabase
        .from("employee_tasks")
        .update({
          ...updates,
          updated_at: nowIso,
        })
        .eq("id", task_id)
        .select()
        .single();

      if (!error && data) return data as TaskRecord;
    }
  } catch {
    // Fall back
  }

  const store = await ensureLocalStore();
  const idx = store.tasks.findIndex((t) => t.id === task_id && t.employee_id === employee_id);

  if (idx < 0) return null;

  const existing = store.tasks[idx];
  const updatedTask: TaskRecord = {
    ...existing,
    ...updates,
    updated_at: nowIso,
  };

  store.tasks[idx] = updatedTask;
  await writeLocalStore(store);
  return updatedTask;
}

export async function deleteTask(task_id: string, employee_id: string): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const { error, count } = await supabase
      .from("employee_tasks")
      .delete({ count: "exact" })
      .eq("id", task_id)
      .eq("employee_id", employee_id);

    if (!error && count && count > 0) return true;
  } catch {
    // Fall back
  }

  const store = await ensureLocalStore();
  const initialLen = store.tasks.length;
  store.tasks = store.tasks.filter((t) => !(t.id === task_id && t.employee_id === employee_id));

  if (store.tasks.length !== initialLen) {
    await writeLocalStore(store);
    return true;
  }

  return false;
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
    if (!error && data) return data as DailyUpdateRecord[];
  } catch {
    // Fall back
  }

  const store = await ensureLocalStore();
  let records = [...store.dailyUpdates];

  if (filter?.employee_id) {
    records = records.filter((u) => u.employee_id === filter.employee_id);
  }
  if (filter?.date) {
    records = records.filter((u) => u.date === filter.date);
  }

  return records.sort((a, b) => (b.date > a.date ? 1 : -1));
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
      .select("*")
      .eq("employee_id", employee_id)
      .eq("date", updateDate)
      .maybeSingle();

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

      if (!error && updated) return updated as DailyUpdateRecord;
    } else {
      const { data: created, error } = await supabase
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

      if (!error && created) return created as DailyUpdateRecord;
    }
  } catch {
    // Fall back
  }

  const store = await ensureLocalStore();
  const existingIdx = store.dailyUpdates.findIndex(
    (u) => u.employee_id === employee_id && u.date === updateDate
  );

  if (existingIdx >= 0) {
    const existing = store.dailyUpdates[existingIdx];
    const updated: DailyUpdateRecord = {
      ...existing,
      work_completed: data.work_completed,
      blockers: data.blockers || "",
      tomorrow_plan: data.tomorrow_plan || "",
      notes: data.notes || "",
      updated_at: nowIso,
    };
    store.dailyUpdates[existingIdx] = updated;
    await writeLocalStore(store);
    return updated;
  } else {
    const newRecord: DailyUpdateRecord = {
      id: `upd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      employee_id,
      date: updateDate,
      work_completed: data.work_completed,
      blockers: data.blockers || "",
      tomorrow_plan: data.tomorrow_plan || "",
      notes: data.notes || "",
      created_at: nowIso,
      updated_at: nowIso,
    };
    store.dailyUpdates.push(newRecord);
    await writeLocalStore(store);
    return newRecord;
  }
}
