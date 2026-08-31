-- ============================================================================
-- CIEL (Centre for Innovation & Entrepreneurship Learning)
-- Scalable Normalized Database Schema (Supabase PostgreSQL Compatible)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES (Auth readiness)
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  phone       TEXT,
  category    TEXT DEFAULT 'student', -- student, entrepreneur, startup, msme, mentor, investor, partner, faculty, researcher, ngo, government
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INSTITUTIONS & CLASSES
CREATE TABLE IF NOT EXISTS public.institutions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.classes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id  UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  sort_order      INT DEFAULT 0,
  active          BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TEAMS & VENTURE PROJECTS
CREATE TABLE IF NOT EXISTS public.teams (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              TEXT NOT NULL,
  kind              TEXT DEFAULT 'team', -- team, solo
  leader_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  problem_statement TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.projects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id     UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  stage       TEXT DEFAULT 'idea', -- idea, prototype, validation, incubation, funding, market, scale
  progress    INT DEFAULT 0, -- 0-100%
  pitch_deck  TEXT,
  website_url TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_members (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id     UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role        TEXT DEFAULT 'team_member', -- team_leader, co_founder, developer, designer, advisor
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EVENTS & REGISTRATIONS
CREATE TABLE IF NOT EXISTS public.events (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug              TEXT UNIQUE NOT NULL,
  title             TEXT NOT NULL,
  description       TEXT,
  venue             TEXT,
  starts_at         TIMESTAMPTZ,
  ends_at           TIMESTAMPTZ,
  registration_open BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id        UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution_id  UUID REFERENCES public.institutions(id),
  class_id        UUID REFERENCES public.classes(id),
  role            TEXT DEFAULT 'team_leader',
  roll_number     TEXT NOT NULL,
  team_id         UUID REFERENCES public.teams(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- 5. GALLERY & ALBUMS SYSTEM
CREATE TABLE IF NOT EXISTS public.albums (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gallery_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  album_id    UUID REFERENCES public.albums(id) ON DELETE SET NULL,
  filename    TEXT UNIQUE NOT NULL,
  url         TEXT NOT NULL,
  title       TEXT,
  category    TEXT DEFAULT 'general',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 6. APPLICATIONS & GRANTS
CREATE TABLE IF NOT EXISTS public.applications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id         UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  program_type    TEXT NOT NULL, -- incubation, seed_grant, accelerator, ipr_grant
  status          TEXT DEFAULT 'under_review', -- draft, under_review, approved, rejected
  reviewer_notes  TEXT,
  submitted_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NEWS, MENTORS, PARTNERS, DOWNLOADS
CREATE TABLE IF NOT EXISTS public.news (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  category     TEXT DEFAULT 'Announcement',
  summary      TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mentors (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  designation TEXT NOT NULL,
  organization TEXT,
  category    TEXT DEFAULT 'industry',
  expertise   TEXT[],
  avatar      TEXT,
  linkedin_url TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_council (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  role        TEXT NOT NULL,
  branch      TEXT NOT NULL,
  year        TEXT NOT NULL,
  avatar      TEXT,
  linkedin_url TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.governance_committees (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT UNIQUE NOT NULL,
  description TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.governance_members (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  committee_id  UUID REFERENCES public.governance_committees(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL,
  linkedin_url  TEXT,
  sort_order    INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.partners (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  type        TEXT NOT NULL, -- Government MoU, Venture Partner, Corporate MoU
  focus_area  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.downloads (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  category    TEXT NOT NULL,
  description TEXT,
  format      TEXT DEFAULT 'PDF',
  file_size   TEXT,
  url         TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 8. NOTIFICATIONS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  read        BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor       TEXT NOT NULL, -- admin, system, user_id
  action      TEXT NOT NULL, -- USER_REGISTERED, STATUS_CHANGED, GALLERY_UPLOADED
  details     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_council ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_members ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
CREATE POLICY "Public read access for events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read access for mentors" ON public.mentors FOR SELECT USING (true);
CREATE POLICY "Public read access for student_council" ON public.student_council FOR SELECT USING (true);
CREATE POLICY "Public read access for governance_committees" ON public.governance_committees FOR SELECT USING (true);
CREATE POLICY "Public read access for governance_members" ON public.governance_members FOR SELECT USING (true);

-- 9. EMPLOYEE PORTAL TABLES
CREATE TABLE IF NOT EXISTS public.employee_attendance (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id     TEXT NOT NULL,
  date            DATE NOT NULL,
  status          TEXT NOT NULL DEFAULT 'Present',
  check_in_time   TIMESTAMPTZ,
  check_out_time  TIMESTAMPTZ,
  location_lat    DOUBLE PRECISION,
  location_lng    DOUBLE PRECISION,
  distance_meters DOUBLE PRECISION,
  is_within_geofence BOOLEAN,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, date)
);

CREATE TABLE IF NOT EXISTS public.employee_tasks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id TEXT NOT NULL,
  date        DATE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'Pending',
  priority    TEXT NOT NULL DEFAULT 'Medium',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.employee_daily_updates (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id     TEXT NOT NULL,
  date            DATE NOT NULL,
  work_completed  TEXT NOT NULL,
  blockers        TEXT DEFAULT '',
  tomorrow_plan   TEXT DEFAULT '',
  notes           TEXT DEFAULT '',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, date)
);

CREATE TABLE IF NOT EXISTS public.employee_monthly_reports (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id       TEXT NOT NULL,
  month             TEXT NOT NULL, -- YYYY-MM
  key_achievements  TEXT NOT NULL,
  major_challenges  TEXT DEFAULT '',
  next_month_goals  TEXT NOT NULL,
  learnings_skills  TEXT DEFAULT '',
  support_needed    TEXT DEFAULT '',
  notes             TEXT DEFAULT '',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, month)
);

