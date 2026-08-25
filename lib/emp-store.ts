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

/** Helper to ensure local JSON store exists */
async function ensureLocalStore(): Promise<EmpStoreJson> {
  try {
    const dir = path.dirname(STORE_PATH);
    await fs.mkdir(dir, { recursive: true });
    const content = await fs.readFile(STORE_PATH, "utf-8");
    const parsed = JSON.parse(content);
    return {
      attendance: Array.isArray(parsed.attendance) ? parsed.attendance : [],
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      dailyUpdates: Array.isArray(parsed.dailyUpdates) ? parsed.dailyUpdates : [],
    };
  } catch {
    const initial: EmpStoreJson = {
      attendance: [],
      tasks: [],
      dailyUpdates: [],
    };
    const dir = path.dirname(STORE_PATH);
    await fs.mkdir(dir, { recursive: true });
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
  const store = await ensureLocalStore();
  let records = [...store.attendance];

  if (filter?.employee_id) {
    records = records.filter((r) => r.employee_id === filter.employee_id);
  }
  if (filter?.date) {
    records = records.filter((r) => r.date === filter.date);
  }
  if (filter?.status) {
    records = records.filter((r) => r.status.toLowerCase() === filter.status?.toLowerCase());
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

  const store = await ensureLocalStore();
  const existingIdx = store.attendance.findIndex(
    (r) => r.employee_id === employee_id && r.date === today
  );

  let updatedRecord: AttendanceRecord;

  if (existingIdx >= 0) {
    const rec = store.attendance[existingIdx];
    let check_in = rec.check_in_time;
    let check_out = rec.check_out_time;

    if ((action === "check_in" || action === "auto_location") && !check_in) check_in = nowIso;
    if (action === "check_out") check_out = nowIso;

    updatedRecord = {
      ...rec,
      status: status || rec.status,
      check_in_time: check_in,
      check_out_time: check_out,
      updated_at: nowIso,
      ...locData,
    };
    store.attendance[existingIdx] = updatedRecord;
  } else {
    const check_in = action === "check_in" || action === "auto_location" || status === "Present" ? nowIso : null;
    updatedRecord = {
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
    store.attendance.unshift(updatedRecord);
  }

  await writeLocalStore(store);

  // Optional Supabase sync
  try {
    const supabase = createAdminClient();
    await supabase.from("employee_attendance").upsert({
      id: updatedRecord.id,
      employee_id: updatedRecord.employee_id,
      date: updatedRecord.date,
      status: updatedRecord.status,
      check_in_time: updatedRecord.check_in_time,
      check_out_time: updatedRecord.check_out_time,
      created_at: updatedRecord.created_at,
      updated_at: updatedRecord.updated_at,
      ...locData,
    });
  } catch {
    // Non-blocking fallback
  }

  return updatedRecord;
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

  store.tasks.unshift(newTask);
  await writeLocalStore(store);

  // Optional Supabase sync
  try {
    const supabase = createAdminClient();
    await supabase.from("employee_tasks").insert({
      id: newTask.id,
      employee_id,
      date: taskDate,
      title,
      description: description || "",
      status,
      priority,
      created_at: nowIso,
      updated_at: nowIso,
    });
  } catch {
    // Non-blocking fallback
  }

  return newTask;
}

export async function updateTask(
  task_id: string,
  employee_id: string,
  updates: Partial<Pick<TaskRecord, "title" | "description" | "status" | "priority">>
): Promise<TaskRecord | null> {
  const nowIso = new Date().toISOString();
  const store = await ensureLocalStore();
  const idx = store.tasks.findIndex((t) => t.id === task_id && (t.employee_id === employee_id || employee_id === "admin"));

  if (idx < 0) return null;

  const existing = store.tasks[idx];
  const updatedTask: TaskRecord = {
    ...existing,
    ...updates,
    updated_at: nowIso,
  };

  store.tasks[idx] = updatedTask;
  await writeLocalStore(store);

  // Optional Supabase sync
  try {
    const supabase = createAdminClient();
    await supabase
      .from("employee_tasks")
      .update({
        ...updates,
        updated_at: nowIso,
      })
      .eq("id", task_id);
  } catch {
    // Non-blocking fallback
  }

  return updatedTask;
}

export async function deleteTask(task_id: string, employee_id: string): Promise<boolean> {
  const store = await ensureLocalStore();
  const initialLen = store.tasks.length;
  store.tasks = store.tasks.filter((t) => !(t.id === task_id && (t.employee_id === employee_id || employee_id === "admin")));

  if (store.tasks.length !== initialLen) {
    await writeLocalStore(store);

    try {
      const supabase = createAdminClient();
      await supabase.from("employee_tasks").delete().eq("id", task_id);
    } catch {
      // Non-blocking fallback
    }

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

  const store = await ensureLocalStore();
  const existingIdx = store.dailyUpdates.findIndex(
    (u) => u.employee_id === employee_id && u.date === updateDate
  );

  let updatedRecord: DailyUpdateRecord;

  if (existingIdx >= 0) {
    const existing = store.dailyUpdates[existingIdx];
    updatedRecord = {
      ...existing,
      work_completed: data.work_completed,
      blockers: data.blockers || "",
      tomorrow_plan: data.tomorrow_plan || "",
      notes: data.notes || "",
      updated_at: nowIso,
    };
    store.dailyUpdates[existingIdx] = updatedRecord;
  } else {
    updatedRecord = {
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
    store.dailyUpdates.unshift(updatedRecord);
  }

  await writeLocalStore(store);

  // Optional Supabase sync
  try {
    const supabase = createAdminClient();
    await supabase.from("employee_daily_updates").upsert({
      id: updatedRecord.id,
      employee_id: updatedRecord.employee_id,
      date: updatedRecord.date,
      work_completed: updatedRecord.work_completed,
      blockers: updatedRecord.blockers,
      tomorrow_plan: updatedRecord.tomorrow_plan,
      notes: updatedRecord.notes,
      created_at: updatedRecord.created_at,
      updated_at: updatedRecord.updated_at,
    });
  } catch {
    // Non-blocking fallback
  }

  return updatedRecord;
}
