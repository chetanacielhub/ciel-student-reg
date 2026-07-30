-- Seed one event and editable institution/class options.
-- Safe to run more than once.

insert into public.events (slug, title, description, venue, starts_at, registration_open)
values (
  'innovation-challenge-2026',
  'CIEL Innovation Challenge 2026',
  'Register as a team leader, team member, or solo participant.',
  'Chetana Campus, Bandra East, Mumbai',
  '2026-08-22 09:30:00+05:30',
  true
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  venue = excluded.venue,
  starts_at = excluded.starts_at;

insert into public.institutions (code, name)
values
  ('HSCCE', 'Chetana''s H.S. College of Commerce & Economics'),
  ('KCCA', 'Smt. Kusumtai Chaudhari College of Arts'),
  ('CIMR', 'Chetana''s Institute of Management & Research (CIMR)'),
  ('CRKIMR', 'Chetana''s R.K. Institute of Management & Research (CRKIMR)')
on conflict (code) do update set name = excluded.name, active = true;

-- H.S. College
insert into public.classes (institution_id, name, sort_order)
select i.id, x.name, x.sort_order
from public.institutions i
cross join (values
  ('FYBCom', 10), ('SYBCom', 20), ('TYBCom', 30),
  ('FYBAF', 40), ('SYBAF', 50), ('TYBAF', 60),
  ('FYBBI', 70), ('SYBBI', 80), ('TYBBI', 90),
  ('FYBMS', 100), ('SYBMS', 110), ('TYBMS', 120)
) as x(name, sort_order)
where i.code = 'HSCCE'
on conflict (institution_id, name) do update set sort_order = excluded.sort_order, active = true;

-- Arts College
insert into public.classes (institution_id, name, sort_order)
select i.id, x.name, x.sort_order
from public.institutions i
cross join (values
  ('FYBA', 10), ('SYBA', 20), ('TYBA', 30),
  ('FYBAMMC', 40), ('SYBAMMC', 50), ('TYBAMMC', 60)
) as x(name, sort_order)
where i.code = 'KCCA'
on conflict (institution_id, name) do update set sort_order = excluded.sort_order, active = true;

-- CIMR
insert into public.classes (institution_id, name, sort_order)
select i.id, x.name, x.sort_order
from public.institutions i
cross join (values
  ('PGDM Year 1', 10),
  ('PGDM Year 2', 20),
  ('PGDM Marketing Year 1', 30),
  ('PGDM Marketing Year 2', 40)
) as x(name, sort_order)
where i.code = 'CIMR'
on conflict (institution_id, name) do update set sort_order = excluded.sort_order, active = true;

-- CRKIMR
insert into public.classes (institution_id, name, sort_order)
select i.id, x.name, x.sort_order
from public.institutions i
cross join (values
  ('MMS Year 1', 10),
  ('MMS Year 2', 20)
) as x(name, sort_order)
where i.code = 'CRKIMR'
on conflict (institution_id, name) do update set sort_order = excluded.sort_order, active = true;
