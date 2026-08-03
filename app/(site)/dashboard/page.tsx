import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, UserRoundPlus } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { EVENT_SLUG } from "@/lib/config";
import { CIEL_DOWNLOADS } from "@/lib/ciel-data";
import { UserPortal } from "@/components/portal/user-portal";

export const metadata: Metadata = {
  title: "User Portal | CIEL Innovation Hub",
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
    full_name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  institutions: Relation;
  classes: Relation;
};

export default async function DashboardPage() {
  const { supabase, user } = await requireUser("/dashboard");

  const [{ data: profile }, { data: event }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id,full_name,email,phone")
      .eq("id", user.id)
      .single(),
    supabase.from("events").select("id,title").eq("slug", EVENT_SLUG).maybeSingle(),
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
      `
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
              User Portal
            </span>
            <h1>Welcome, {profile?.full_name || "Innovator"}.</h1>
            <p>
              Your verified account is active, but you have not yet completed your incubation registration.
            </p>
          </div>
        </div>

        <div className="empty-state">
          <div className="empty-icon">
            <UserRoundPlus size={28} aria-hidden="true" />
          </div>
          <h2>Complete Your Incubation Profile</h2>
          <p>
            Choose your campus, department, and participant category (Student, Entrepreneur, Startup, MSME, Mentor, Investor, Faculty, Researcher, NGO, Government).
          </p>
          <Link className="button button-primary" href="/register">
            Open Registration Form
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
      `
    )
    .eq("team_id", registration.team_id)
    .order("created_at", { ascending: true });

  const members = (membersData ?? []) as unknown as MemberRecord[];

  return (
    <section className="shell page-section">
      <div className="page-heading" style={{ marginBottom: 16 }}>
        <div>
          <span className="eyebrow">
            <LayoutDashboard size={14} aria-hidden="true" />
            CIEL User Portal
          </span>
          <h1>Venture Dashboard</h1>
        </div>
      </div>

      <UserPortal
        profile={profile}
        registration={{
          id: registration.id,
          role: registration.role,
          roll_number: registration.roll_number,
          created_at: registration.created_at,
          institutions: registration.institutions,
          classes: registration.classes,
          teams: registration.teams,
        }}
        members={members}
        downloads={CIEL_DOWNLOADS}
      />
    </section>
  );
}
