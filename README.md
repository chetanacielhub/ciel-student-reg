# Student Reg — Event Registration

A complete Next.js + Supabase starter for institution-level event registration. It supports secure account creation, conditional registration for team leaders, team members, and solo participants, a shared participant/team dashboard, and a protected administrator dashboard with CSV export.

## What is included

- Gmail/password account creation through Supabase Auth
- Full name and phone number captured during signup
- Email confirmation flow compatible with server-side Supabase sessions
- Institution dropdown with dependent class dropdown
- Roll-number validation and duplicate prevention
- Three registration modes:
  - **Team leader:** creates the official team and submits its problem statement
  - **Team member:** joins an existing team using its exact registered name
  - **Solo participant:** creates a one-person project/team and submits a problem statement
- Clear `team not found` error telling the member to ask the leader to register first
- Shared dashboard where participants can see people in their own team
- Admin-only dashboard with search, role filtering, totals, contact details, academic details, problem statements, and CSV export
- PostgreSQL Row Level Security (RLS)
- Atomic database registration function to prevent half-created teams and duplicate registrations
- Responsive interface for desktop, tablet, and mobile
- Vercel-ready configuration

## Registration flow

```text
Create account
  └─ Gmail + phone + password
      └─ Confirm Gmail
          └─ Institution → class → roll number
              └─ Choose role
                  ├─ Team leader → team name + problem → submit
                  ├─ Team member → exact existing team name → submit
                  └─ Solo → project name + problem → submit
                      └─ Shared team/profile dashboard
```

A team member can join only after the team leader has completed registration. Team matching is deliberately case-sensitive after trimming outer spaces. For example, `Green Spark` and `green spark` do not match during member lookup.

## Technology

- Next.js App Router
- React and TypeScript
- Supabase Auth and PostgreSQL
- `@supabase/ssr` cookie-based sessions
- Zod validation
- Lucide icons
- Plain responsive CSS
- Vercel deployment

## Project structure

```text
app/
  admin/                 Protected admin dashboard and CSV export
  auth/                  Signup, sign-in, confirmation, and sign-out
  dashboard/             Participant and shared-team profile
  register/              Conditional event registration
components/
  admin/                  Searchable registration table
  auth/                   Authentication forms
  registration/           Three-step conditional registration form
lib/
  supabase/               Browser, server, and Proxy clients
  auth.ts                 Route guards
  validation.ts           Zod schemas
supabase/
  migrations/             Tables, functions, constraints, RLS, grants
  seed.sql                Sample event, institutions, and classes
  make-admin.sql          Admin allow-list helper
  email-confirmation-template.html
proxy.ts                  Supabase session refresh and protected routes
```

## 1. Create the Supabase project

Create a Supabase project, then open **SQL Editor**.

Run these files in order:

1. `supabase/migrations/0001_event_registration.sql`
2. `supabase/seed.sql`

The seed creates a sample event with the slug `innovation-challenge-2026`, four editable institution options, and their class options.

## 2. Configure Supabase Auth

In **Authentication → URL Configuration**, configure:

- Local Site URL: `http://localhost:3000`
- Local Redirect URL: `http://localhost:3000/auth/confirm`
- Production Redirect URL: `https://YOUR_DOMAIN/auth/confirm`

In **Authentication → Email Templates → Confirm signup**, replace the template with the contents of:

```text
supabase/email-confirmation-template.html
```

The custom template sends the token hash to `/auth/confirm`, where the application verifies it and creates the browser session.

Keep email confirmation enabled for production.

## 3. Configure environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

Fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_EVENT_SLUG=innovation-challenge-2026
```

Use the publishable key shown in **Supabase Project Settings → API**. Do not place a service-role key in this project or in any `NEXT_PUBLIC_` variable.

## 4. Run locally

Node.js 20.9 or newer is required by the selected Next.js release.

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Additional checks:

```bash
npm run typecheck
npm run lint
npm run build
```

## 5. Create the first administrator

First create and confirm the administrator account through the normal signup screen. Then edit the email in:

```text
supabase/make-admin.sql
```

Run that file in Supabase SQL Editor. The account will then see an **Open admin dashboard** button on `/dashboard` and can access `/admin`.

Admin access is database allow-listed. A user cannot make themselves an admin from the browser.

## 6. Deploy to Vercel

1. Push this folder to a Git repository.
2. Import the repository into Vercel.
3. Add all variables from `.env.example` in **Project Settings → Environment Variables**.
4. Set `NEXT_PUBLIC_SITE_URL` to the production origin, such as `https://events.example.com`.
5. Deploy or redeploy after adding the variables.
6. Add the production `/auth/confirm` URL to Supabase Auth URL Configuration.

For Vercel preview deployments, add only the preview redirect patterns you actually intend to trust.

## Database model

```text
auth.users
   │
   └── profiles
          │
          └── event_registrations ── events
                  │        │
                  │        ├── institutions
                  │        └── classes
                  │
                  └── teams

profiles ── admin_users
```

### Important constraints

- One registration per account per event
- One roll number per event + institution + class
- One normalized team/project name per event
- A member can join only a normal team, not a solo project
- Class must belong to the selected institution
- Event registration requires a Gmail profile and a valid phone-number format
- Problem statement is required for leader and solo registration
- Team/project creation and registration happen in one transaction

## Security design

The browser never receives a Supabase service-role key.

RLS policies allow:

- Anyone to read active event, institution, and class reference data
- A participant to read their own profile and profiles in the same team
- A participant to read their own team and its registrations
- An allow-listed admin to read all registration records
- A user to update only their own `full_name` and `phone` profile columns

Direct browser inserts into `teams`, `event_registrations`, and `admin_users` are revoked. New registrations go through `register_for_event`, a validated `SECURITY DEFINER` PostgreSQL function. This makes leader team creation and the leader registration atomic and returns controlled errors such as `TEAM_NOT_FOUND` or `TEAM_NAME_TAKEN`.

## Phone-number behavior

This version collects the phone number during email/password signup and stores it in Supabase user metadata plus the `profiles` table. It does **not** send a phone OTP.

For verified mobile numbers, add a separate Supabase Phone Auth OTP step before event registration. Do not treat the current phone field as independently verified.

## Customizing the event

Edit `supabase/seed.sql` to change:

- Event title, date, venue, and description
- Institution names and codes
- Class/program options

Keep `NEXT_PUBLIC_EVENT_SLUG` equal to the event slug in the database.

To close registration without redeploying:

```sql
update public.events
set registration_open = false
where slug = 'innovation-challenge-2026';
```

To reopen it:

```sql
update public.events
set registration_open = true
where slug = 'innovation-challenge-2026';
```

## Acceptance-test checklist

1. Create and confirm a Gmail account.
2. Confirm an unregistered account is sent to `/register`.
3. Register a team leader with a new team name and problem statement.
4. Confirm the leader sees the team profile.
5. Create a second account and join with the exact team name.
6. Confirm both people see one another on the shared dashboard.
7. Try the wrong capitalization and confirm the member sees the `team not found` message.
8. Try registering the same account again and confirm it is redirected to the dashboard.
9. Try reusing the same institution/class/roll-number combination and confirm it is rejected.
10. Confirm a normal participant cannot open `/admin`.
11. Add an account using `make-admin.sql`, confirm the admin can search and filter all records, and export CSV.
12. Close the event in the database and confirm new registrations are blocked.

## Production recommendations

Before a large public event, consider adding rate limiting or CAPTCHA to signup, a privacy-policy link, consent wording approved by the institution, an admin audit log, team-size limits, a registration deadline, and a transactional email confirming final registration.
# ciel-student-reg
# ciel-student-reg
