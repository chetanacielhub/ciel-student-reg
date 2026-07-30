-- Advance Event Registration
-- Run this file in Supabase Dashboard > SQL Editor, or with `supabase db push`.

create extension if not exists pgcrypto;
create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon, authenticated;

-- -----------------------------------------------------------------------------
-- Types
-- -----------------------------------------------------------------------------

do $$
begin
  create type public.registration_role as enum ('team_leader', 'team_member', 'solo');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.team_kind as enum ('team', 'solo');
exception
  when duplicate_object then null;
end $$;

-- -----------------------------------------------------------------------------
-- Core tables
-- -----------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  venue text,
  starts_at timestamptz,
  registration_open boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.institutions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  name text not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (institution_id, name)
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 100),
  name_key text not null,
  kind public.team_kind not null,
  leader_id uuid not null references public.profiles(id) on delete cascade,
  problem_statement text not null check (char_length(problem_statement) between 10 and 3000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, name_key)
);

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  institution_id uuid not null references public.institutions(id),
  class_id uuid not null references public.classes(id),
  roll_number text not null check (char_length(btrim(roll_number)) between 1 and 40),
  role public.registration_role not null,
  team_id uuid not null references public.teams(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, user_id),
  unique (event_id, institution_id, class_id, roll_number)
);

create table if not exists public.admin_users (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists registrations_user_idx
  on public.event_registrations(user_id);
create index if not exists registrations_team_idx
  on public.event_registrations(team_id);
create index if not exists registrations_event_idx
  on public.event_registrations(event_id);
create index if not exists teams_event_idx
  on public.teams(event_id);
create index if not exists classes_institution_idx
  on public.classes(institution_id);

-- -----------------------------------------------------------------------------
-- Utility functions and triggers
-- -----------------------------------------------------------------------------

create or replace function private.normalize_team_name(value text)
returns text
language sql
immutable
strict
set search_path = ''
as $$
  select lower(regexp_replace(btrim(value), '\s+', ' ', 'g'));
$$;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

drop trigger if exists teams_set_updated_at on public.teams;
create trigger teams_set_updated_at
before update on public.teams
for each row execute function private.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'phone', new.phone)
  )
  on conflict (id) do update
    set full_name = excluded.full_name,
        email = excluded.email,
        phone = excluded.phone;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_auth_user_updated on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create trigger on_auth_user_updated
after update of email, phone, raw_user_meta_data on auth.users
for each row execute function public.handle_new_user();

revoke all on function public.handle_new_user() from public;

-- -----------------------------------------------------------------------------
-- Authorization helpers. These run as the migration owner and avoid recursive
-- RLS lookups while still deriving identity from auth.uid().
-- -----------------------------------------------------------------------------

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users a
    where a.user_id = (select auth.uid())
  );
$$;

create or replace function private.user_team_ids()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select r.team_id
  from public.event_registrations r
  where r.user_id = (select auth.uid());
$$;

create or replace function private.can_view_profile(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    target_user_id = (select auth.uid())
    or private.is_admin()
    or exists (
      select 1
      from public.event_registrations mine
      join public.event_registrations theirs
        on theirs.team_id = mine.team_id
      where mine.user_id = (select auth.uid())
        and theirs.user_id = target_user_id
    );
$$;

-- -----------------------------------------------------------------------------
-- Atomic event registration RPC
-- -----------------------------------------------------------------------------

create or replace function public.register_for_event(
  p_event_slug text,
  p_institution_id uuid,
  p_class_id uuid,
  p_roll_number text,
  p_role public.registration_role,
  p_team_name text default null,
  p_problem_statement text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_event_id uuid;
  v_team_id uuid;
  v_team_name text;
  v_team_key text;
  v_problem text;
begin
  if v_user_id is null then
    raise exception using errcode = 'P0001', message = 'AUTH_REQUIRED';
  end if;

  if not exists (select 1 from public.profiles p where p.id = v_user_id) then
    raise exception using errcode = 'P0001', message = 'PROFILE_NOT_READY';
  end if;

  if not exists (
    select 1
    from auth.users u
    where u.id = v_user_id
      and u.email_confirmed_at is not null
      and lower(coalesce(u.email, '')) ~ '^[^@[:space:]]+@gmail\.com$'
  ) then
    raise exception using errcode = 'P0001', message = 'GMAIL_REQUIRED';
  end if;

  if not exists (
    select 1
    from public.profiles p
    where p.id = v_user_id
      and coalesce(p.phone, '') ~ '^\+?[1-9][0-9]{9,14}$'
  ) then
    raise exception using errcode = 'P0001', message = 'PHONE_REQUIRED';
  end if;

  select e.id
    into v_event_id
  from public.events e
  where e.slug = p_event_slug
    and e.registration_open = true;

  if v_event_id is null then
    raise exception using errcode = 'P0001', message = 'REGISTRATION_CLOSED';
  end if;

  if exists (
    select 1
    from public.event_registrations r
    where r.event_id = v_event_id
      and r.user_id = v_user_id
  ) then
    raise exception using errcode = 'P0001', message = 'ALREADY_REGISTERED';
  end if;

  if not exists (
    select 1
    from public.institutions i
    where i.id = p_institution_id
      and i.active = true
  ) then
    raise exception using errcode = 'P0001', message = 'INVALID_INSTITUTION';
  end if;

  if not exists (
    select 1
    from public.classes c
    where c.id = p_class_id
      and c.institution_id = p_institution_id
      and c.active = true
  ) then
    raise exception using errcode = 'P0001', message = 'INVALID_CLASS';
  end if;

  if p_roll_number is null or char_length(btrim(p_roll_number)) < 1 then
    raise exception using errcode = 'P0001', message = 'ROLL_NUMBER_REQUIRED';
  end if;

  if p_role = 'team_member' then
    if p_team_name is null or char_length(btrim(p_team_name)) < 2 then
      raise exception using errcode = 'P0001', message = 'TEAM_NAME_REQUIRED';
    end if;

    -- Deliberately exact (case-sensitive) after trimming outer spaces.
    select t.id
      into v_team_id
    from public.teams t
    where t.event_id = v_event_id
      and t.kind = 'team'
      and t.name = btrim(p_team_name);

    if v_team_id is null then
      raise exception using errcode = 'P0001', message = 'TEAM_NOT_FOUND';
    end if;

  elsif p_role in ('team_leader', 'solo') then
    if p_team_name is null or char_length(btrim(p_team_name)) < 2 then
      raise exception using errcode = 'P0001', message = 'TEAM_NAME_REQUIRED';
    end if;

    if p_problem_statement is null or char_length(btrim(p_problem_statement)) < 10 then
      raise exception using errcode = 'P0001', message = 'PROBLEM_REQUIRED';
    end if;

    v_team_name := regexp_replace(btrim(p_team_name), '\s+', ' ', 'g');
    v_team_key := private.normalize_team_name(v_team_name);
    v_problem := btrim(p_problem_statement);

    begin
      insert into public.teams (
        event_id,
        name,
        name_key,
        kind,
        leader_id,
        problem_statement
      )
      values (
        v_event_id,
        v_team_name,
        v_team_key,
        case when p_role = 'solo' then 'solo'::public.team_kind else 'team'::public.team_kind end,
        v_user_id,
        v_problem
      )
      returning id into v_team_id;
    exception
      when unique_violation then
        raise exception using errcode = 'P0001', message = 'TEAM_NAME_TAKEN';
    end;
  else
    raise exception using errcode = 'P0001', message = 'INVALID_ROLE';
  end if;

  begin
    insert into public.event_registrations (
      event_id,
      user_id,
      institution_id,
      class_id,
      roll_number,
      role,
      team_id
    )
    values (
      v_event_id,
      v_user_id,
      p_institution_id,
      p_class_id,
      btrim(p_roll_number),
      p_role,
      v_team_id
    );
  exception
    when unique_violation then
      raise exception using errcode = 'P0001', message = 'DUPLICATE_REGISTRATION_OR_ROLL_NUMBER';
  end;

  return jsonb_build_object(
    'ok', true,
    'event_id', v_event_id,
    'team_id', v_team_id,
    'role', p_role
  );
end;
$$;

revoke all on function public.register_for_event(text, uuid, uuid, text, public.registration_role, text, text) from public;
grant execute on function public.register_for_event(text, uuid, uuid, text, public.registration_role, text, text) to authenticated;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.institutions enable row level security;
alter table public.classes enable row level security;
alter table public.teams enable row level security;
alter table public.event_registrations enable row level security;
alter table public.admin_users enable row level security;

-- Public reference data
drop policy if exists "Events are publicly readable" on public.events;
create policy "Events are publicly readable"
on public.events for select
to anon, authenticated
using (true);

drop policy if exists "Institutions are publicly readable" on public.institutions;
create policy "Institutions are publicly readable"
on public.institutions for select
to anon, authenticated
using (active = true);

drop policy if exists "Classes are publicly readable" on public.classes;
create policy "Classes are publicly readable"
on public.classes for select
to anon, authenticated
using (active = true);

-- Profiles
drop policy if exists "Users can read their own and teammate profiles" on public.profiles;
create policy "Users can read their own and teammate profiles"
on public.profiles for select
to authenticated
using (private.can_view_profile(id));

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- Teams
drop policy if exists "Members can read their team" on public.teams;
create policy "Members can read their team"
on public.teams for select
to authenticated
using (
  private.is_admin()
  or id in (select private.user_team_ids())
);

-- Structural team updates are intentionally disabled for browser clients.
-- Add a validated RPC later if leaders need to rename a team or edit its problem.
drop policy if exists "Leaders can update their team" on public.teams;

-- Registrations
drop policy if exists "Users can read their team registrations" on public.event_registrations;
create policy "Users can read their team registrations"
on public.event_registrations for select
to authenticated
using (
  private.is_admin()
  or user_id = (select auth.uid())
  or team_id in (select private.user_team_ids())
);

-- Admin marker
drop policy if exists "Users can read their own admin status" on public.admin_users;
create policy "Users can read their own admin status"
on public.admin_users for select
to authenticated
using (user_id = (select auth.uid()) or private.is_admin());

-- Keep direct client writes narrow. Registration creation happens only through RPC.
revoke all on public.profiles from anon, authenticated;
revoke all on public.teams from anon, authenticated;
revoke all on public.event_registrations from anon, authenticated;
revoke all on public.admin_users from anon, authenticated;
revoke all on public.events from anon, authenticated;
revoke all on public.institutions from anon, authenticated;
revoke all on public.classes from anon, authenticated;

grant select on public.events, public.institutions, public.classes to anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone) on public.profiles to authenticated;
grant select on public.teams, public.event_registrations, public.admin_users to authenticated;
