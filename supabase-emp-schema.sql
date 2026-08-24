-- ============================================================================
-- CIEL Employee Management Portal Schema (Supabase PostgreSQL Compatible)
-- ============================================================================

-- Enable required extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS public.employee_attendance (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id         TEXT NOT NULL, -- e.g. 'emp-1', 'emp-2', 'emp-3'
  date                DATE NOT NULL DEFAULT CURRENT_DATE,
  check_in_time       TIMESTAMPTZ,
  check_out_time      TIMESTAMPTZ,
  status              TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Half Day', 'Leave')),
  location_lat        DOUBLE PRECISION,
  location_lng        DOUBLE PRECISION,
  distance_meters     DOUBLE PRECISION,
  is_within_geofence  BOOLEAN,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_employee_date UNIQUE (employee_id, date)
);

-- 2. TASKS TABLE
CREATE TABLE IF NOT EXISTS public.employee_tasks (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id  TEXT NOT NULL,
  date         DATE NOT NULL DEFAULT CURRENT_DATE,
  title        TEXT NOT NULL,
  description  TEXT,
  status       TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed')),
  priority     TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DAILY WORK UPDATES TABLE
CREATE TABLE IF NOT EXISTS public.employee_daily_updates (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id     TEXT NOT NULL,
  date            DATE NOT NULL DEFAULT CURRENT_DATE,
  work_completed  TEXT NOT NULL,
  blockers        TEXT,
  tomorrow_plan   TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_employee_update_date UNIQUE (employee_id, date)
);

-- INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_emp_attendance_emp_date ON public.employee_attendance(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_emp_tasks_emp_date ON public.employee_tasks(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_emp_tasks_status ON public.employee_tasks(status);
CREATE INDEX IF NOT EXISTS idx_emp_updates_emp_date ON public.employee_daily_updates(employee_id, date);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.employee_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_daily_updates ENABLE ROW LEVEL SECURITY;

-- POLICIES (Allow service role and authenticated app operations)
CREATE POLICY "Allow public select for employee attendance" ON public.employee_attendance FOR SELECT USING (true);
CREATE POLICY "Allow public insert for employee attendance" ON public.employee_attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for employee attendance" ON public.employee_attendance FOR UPDATE USING (true);
CREATE POLICY "Allow public delete for employee attendance" ON public.employee_attendance FOR DELETE USING (true);

CREATE POLICY "Allow public select for employee tasks" ON public.employee_tasks FOR SELECT USING (true);
CREATE POLICY "Allow public insert for employee tasks" ON public.employee_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for employee tasks" ON public.employee_tasks FOR UPDATE USING (true);
CREATE POLICY "Allow public delete for employee tasks" ON public.employee_tasks FOR DELETE USING (true);

CREATE POLICY "Allow public select for employee updates" ON public.employee_daily_updates FOR SELECT USING (true);
CREATE POLICY "Allow public insert for employee updates" ON public.employee_daily_updates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for employee updates" ON public.employee_daily_updates FOR UPDATE USING (true);
CREATE POLICY "Allow public delete for employee updates" ON public.employee_daily_updates FOR DELETE USING (true);
