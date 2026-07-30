import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  ShieldCheck,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { EVENT_SLUG } from "@/lib/config";

export const metadata: Metadata = {
  title: "My team",
};

type Relation = { id?: string; name?: string; code?: string } | null;

type RegistrationRecord = {
  id: string;
  role: "team_leader" | "team_member" | "solo";
  roll_number: string;
  team_id: string;
  created_at: string;
  institutions: Relation;
  classes: Relation;
  teams: {
    id: string;
    name: string;
    kind: "team" | "solo";
    problem_statement: string;
    leader_id: string;
    created_at: string;
  } | null;
};

type MemberRecord = {
  id: string;
  user_id: string;
  role: "team_leader" | "team_member" | "solo";
  roll_number: string;
  profiles: {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
  } | null;
  institutions: Relation;
  classes: Relation;
};

const roleLabels = {
  team_leader: "Team leader",
  team_member: "Team member",
  solo: "Solo participant",
};

function initials(name?: string | null) {
  return (
    name
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; error?: string }>;
}) {
  const params = await searchParams;
  const { supabase, user } = await requireUser("/dashboard");

  const [{ data: profile }, { data: event }, { data: admin }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id,full_name,email,phone")
      .eq("id", user.id)
      .single(),
    supabase.from("events").select("id,title").eq("slug", EVENT_SLUG).maybeSingle(),
    supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  if (!event) {
    return (
      <div className="shell center-page">
        <section className="empty-state">
          <h2>No active event found</h2>
          <p>Ask the administrator to run the database seed or configure the event slug.</p>
        </section>
      </div>
    );
  }

  const { data: registrationData } = await supabase
    .from("event_registrations")
    .select(
      `
        id,
        role,
        roll_number,
        team_id,
        created_at,
        institutions:institution_id(id,name,code),
        classes:class_id(id,name),
        teams:team_id(id,name,kind,problem_statement,leader_id,created_at)
      `,
    )
    .eq("event_id", event.id)
    .eq("user_id", user.id)
    .maybeSingle();

  const registration = registrationData as unknown as RegistrationRecord | null;

  if (!registration) {
    return (
      <section className="shell page-section">
        <div className="page-heading">
          <div>
            <span className="eyebrow">
              <LayoutDashboard size={14} aria-hidden="true" />
              Participant dashboard
            </span>
            <h1>Hello, {profile?.full_name || "participant"}.</h1>
            <p>
              Your account is ready, but you have not completed the registration
              form for {event.title}.
            </p>
          </div>
        </div>

        <div className="empty-state">
          <div className="empty-icon">
            <UserRoundPlus size={26} aria-hidden="true" />
          </div>
          <h2>Complete your event registration</h2>
          <p>
            Select your institution, class, and participation type. Team members
            will need the exact team name created by their leader.
          </p>
          <Link className="button button-primary" href="/register">
            Open registration form
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
    );
  }

  const { data: membersData } = await supabase
    .from("event_registrations")
    .select(
      `
        id,
        user_id,
        role,
        roll_number,
        profiles:user_id(id,full_name,email,phone),
        institutions:institution_id(id,name,code),
        classes:class_id(id,name)
      `,
    )
    .eq("team_id", registration.team_id)
    .order("created_at", { ascending: true });

  const members = (membersData ?? []) as unknown as MemberRecord[];
  const team = registration.teams;

  return (
    <section className="shell page-section">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            <LayoutDashboard size={14} aria-hidden="true" />
            Participant dashboard
          </span>
          <h1>Your team is registered.</h1>
          <p>
            View the team or project, problem statement, and everyone currently
            connected to this registration.
          </p>
        </div>
        {admin ? (
          <Link className="button button-dark" href="/admin">
            <ShieldCheck size={17} aria-hidden="true" />
            Open admin dashboard
          </Link>
        ) : null}
      </div>

      {params.registered === "1" ? (
        <div className="alert alert-info" style={{ marginBottom: 18 }}>
          <CheckCircle2 size={18} aria-hidden="true" />
          <span>Your registration was submitted successfully.</span>
        </div>
      ) : null}

      {params.error === "admin_required" ? (
        <div className="alert alert-error" style={{ marginBottom: 18 }}>
          <ShieldCheck size={18} aria-hidden="true" />
          <span>Your account does not have administrator access.</span>
        </div>
      ) : null}

      <div className="dashboard-grid">
        <article className="dashboard-card profile-card">
          <h2>Your registration</h2>
          <div className="profile-head">
            <div className="avatar">{initials(profile?.full_name)}</div>
            <div>
              <strong>{profile?.full_name || "Participant"}</strong>
              <span>{profile?.email ?? user.email}</span>
            </div>
          </div>
          <div className="detail-list">
            <div className="detail-row">
              <span>Phone</span>
              <strong>{profile?.phone || "Not provided"}</strong>
            </div>
            <div className="detail-row">
              <span>Institution</span>
              <strong>{registration.institutions?.name ?? "—"}</strong>
            </div>
            <div className="detail-row">
              <span>Class</span>
              <strong>{registration.classes?.name ?? "—"}</strong>
            </div>
            <div className="detail-row">
              <span>Roll number</span>
              <strong>{registration.roll_number}</strong>
            </div>
            <div className="detail-row">
              <span>Role</span>
              <strong>{roleLabels[registration.role]}</strong>
            </div>
          </div>
        </article>

        <article className="dashboard-card team-card">
          <h2>{team?.kind === "solo" ? "Solo project" : "Team profile"}</h2>
          <div className="team-title-row">
            <div>
              <h3>{team?.name ?? "Team"}</h3>
              <span className="badge badge-brand" style={{ marginTop: 10 }}>
                {members.length} {members.length === 1 ? "participant" : "participants"}
              </span>
            </div>
            <UsersRound size={30} aria-hidden="true" />
          </div>
          <div className="problem-box">
            <span>Problem statement</span>
            <p>{team?.problem_statement ?? "No problem statement available."}</p>
          </div>
        </article>

        <article className="dashboard-card members-card">
          <h2>Team members</h2>
          <div className="member-list">
            {members.map((member) => (
              <div className="member-item" key={member.id}>
                <div className="member-avatar">
                  {initials(member.profiles?.full_name)}
                </div>
                <div>
                  <strong>{member.profiles?.full_name || "Participant"}</strong>
                  <span>
                    {roleLabels[member.role]} · {member.classes?.name ?? "Class"} · Roll {member.roll_number}
                  </span>
                  <span>{member.profiles?.phone || member.profiles?.email || ""}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
