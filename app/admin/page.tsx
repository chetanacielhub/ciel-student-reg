import type { Metadata } from "next";
import Link from "next/link";
import {
  Download,
  ShieldCheck,
  UserRound,
  UsersRound,
  UserStar,
  Zap,
} from "lucide-react";
import {
  RegistrationsTable,
  type AdminRegistrationRow,
} from "@/components/admin/registrations-table";
import { requireAdmin } from "@/lib/auth";
import { EVENT_SLUG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

type RawRegistration = {
  id: string;
  role: "team_leader" | "team_member" | "solo";
  roll_number: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string | null;
    phone: string | null;
  } | null;
  institutions: { name: string } | null;
  classes: { name: string } | null;
  teams: { name: string; problem_statement: string } | null;
};

export default async function AdminPage() {
  const { supabase } = await requireAdmin();
  const { data: event } = await supabase
    .from("events")
    .select("id,title")
    .eq("slug", EVENT_SLUG)
    .maybeSingle();

  const { data } = event
    ? await supabase
        .from("event_registrations")
        .select(
          `
            id,
            role,
            roll_number,
            created_at,
            profiles:user_id(full_name,email,phone),
            institutions:institution_id(name),
            classes:class_id(name),
            teams:team_id(name,problem_statement)
          `,
        )
        .eq("event_id", event.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  const rawRows = (data ?? []) as unknown as RawRegistration[];
  const rows: AdminRegistrationRow[] = rawRows.map((row) => ({
    id: row.id,
    fullName: row.profiles?.full_name || "Unnamed participant",
    email: row.profiles?.email || "—",
    phone: row.profiles?.phone || "—",
    institution: row.institutions?.name || "—",
    className: row.classes?.name || "—",
    rollNumber: row.roll_number,
    role: row.role,
    teamName: row.teams?.name || "—",
    problemStatement: row.teams?.problem_statement || "—",
    createdAt: row.created_at,
  }));

  const teamCount = new Set(rows.map((row) => row.teamName)).size;
  const leaderCount = rows.filter((row) => row.role === "team_leader").length;
  const memberCount = rows.filter((row) => row.role === "team_member").length;
  const soloCount = rows.filter((row) => row.role === "solo").length;

  return (
    <section className="shell page-section">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            <ShieldCheck size={14} aria-hidden="true" />
            Protected administrator view
          </span>
          <h1>Registration dashboard</h1>
          <p>
            {event?.title ?? "Configured event"}: review participants, contact
            details, academic information, team assignments, and problem statements.
          </p>
        </div>
        <Link className="button button-dark" href="/admin/export">
          <Download size={17} aria-hidden="true" />
          Export CSV
        </Link>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon">
            <UserRound size={20} aria-hidden="true" />
          </div>
          <div>
            <span>Total registrations</span>
            <strong>{rows.length.toLocaleString("en-IN")}</strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon">
            <UsersRound size={20} aria-hidden="true" />
          </div>
          <div>
            <span>Teams / projects</span>
            <strong>{teamCount.toLocaleString("en-IN")}</strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon">
            <UserStar size={20} aria-hidden="true" />
          </div>
          <div>
            <span>Leaders / members</span>
            <strong>
              {leaderCount.toLocaleString("en-IN")} / {memberCount.toLocaleString("en-IN")}
            </strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon">
            <Zap size={20} aria-hidden="true" />
          </div>
          <div>
            <span>Solo participants</span>
            <strong>{soloCount.toLocaleString("en-IN")}</strong>
          </div>
        </article>
      </div>

      <RegistrationsTable rows={rows} />
    </section>
  );
}
