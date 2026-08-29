import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, UserRoundPlus, Globe, LogOut } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { EVENT_SLUG } from "@/lib/config";
import { CIEL_DOWNLOADS } from "@/lib/ciel-data";
import { UserPortal } from "@/components/portal/user-portal";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
      .maybeSingle(),
    supabase.from("events").select("id,title").eq("slug", EVENT_SLUG).maybeSingle(),
  ]);

  // Load fallback profile from dynamic store if Supabase profile is missing
  const { getStoreProfiles, getStoreRegistrations, getVentureProjects } = await import("@/lib/dynamic-store");
  const storeProfiles = await getStoreProfiles();
  const matchedStoreProfile = storeProfiles.find((p) => p.email?.toLowerCase().trim() === user.email?.toLowerCase().trim());

  const activeProfile = {
    id: user.id,
    full_name: profile?.full_name || user.user_metadata?.full_name || matchedStoreProfile?.full_name || "Innovator",
    email: profile?.email || user.email || matchedStoreProfile?.email || "innovator@ciel.edu",
    phone: profile?.phone || matchedStoreProfile?.phone || "—",
  };

  // Attempt Supabase event_registrations query
  let registrationData: any = null;
  if (event?.id) {
    const { data } = await supabase
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

    registrationData = data;
  }

  // Fallback to dynamic store registration if Supabase row is empty
  const storeRegistrations = await getStoreRegistrations();
  const matchedReg = storeRegistrations.find(
    (r) => r.email?.toLowerCase().trim() === activeProfile.email.toLowerCase().trim() || r.userId === user.id
  );

  const projects = await getVentureProjects();
  const matchedProject = projects.find(
    (p) => p.leaderEmail?.toLowerCase().trim() === activeProfile.email.toLowerCase().trim() || (registrationData && p.teamId === registrationData.team_id)
  ) || projects[0];

  const registration = {
    id: registrationData?.id || matchedReg?.id || `reg-${Date.now()}`,
    role: (registrationData?.role || matchedReg?.role || "team_leader") as "team_leader" | "team_member" | "solo",
    roll_number: registrationData?.roll_number || matchedReg?.rollNumber || "1",
    created_at: registrationData?.created_at || matchedReg?.createdAt || new Date().toISOString(),
    institutions: registrationData?.institutions || { name: matchedReg?.institution || "Chetana Institute of Management & Research" },
    classes: registrationData?.classes || { name: matchedReg?.className || "MBA / PGDM - Final Year" },
    teams: registrationData?.teams || {
      id: matchedProject?.teamId || `team-${Date.now()}`,
      name: matchedProject?.teamName || matchedReg?.teamName || "Innovation Venture",
      kind: "team" as const,
      problem_statement: matchedProject?.problemStatement || matchedReg?.problemStatement || "DeepTech / Sustainability Solution",
      created_at: new Date().toISOString(),
    },
  };

  // Attempt Supabase team members query
  let members: MemberRecord[] = [];
  if (registrationData?.team_id) {
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
      .eq("team_id", registrationData.team_id)
      .order("created_at", { ascending: true });

    if (membersData) {
      members = membersData as unknown as MemberRecord[];
    }
  }

  if (members.length === 0) {
    members = [
      {
        id: `mem-1`,
        user_id: activeProfile.id,
        role: registration.role,
        roll_number: registration.roll_number,
        profiles: {
          id: activeProfile.id,
          full_name: activeProfile.full_name,
          email: activeProfile.email,
          phone: activeProfile.phone,
        },
        institutions: registration.institutions,
        classes: registration.classes,
      },
    ];
  }

  return (
    <div style={{ minHeight: "100vh", padding: "16px 24px 40px", maxWidth: 1440, margin: "0 auto" }}>
      {/* Sleek Participant Portal Top Bar */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px",
          marginBottom: 20,
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-md)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Logo href="/dashboard" size="small" />
          <div style={{ height: 20, width: 1, background: "var(--line)" }} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "var(--ciel-gold-bright)",
              background: "rgba(212, 175, 55, 0.1)",
              padding: "3px 10px",
              borderRadius: 20,
              border: "1px solid rgba(212, 175, 55, 0.25)",
            }}
          >
            Innovator Portal
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/"
            className="button button-ghost button-small"
            style={{ fontSize: 13, gap: 6 }}
          >
            <Globe size={14} /> Public Website
          </Link>

          <ThemeToggle />

          <form action="/auth/sign-out" method="post" style={{ margin: 0 }}>
            <button
              type="submit"
              className="btn-signout-red"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </form>
        </div>
      </header>

      {/* Main Portal Viewport */}
      <UserPortal
        profile={activeProfile}
        registration={registration}
        members={members}
        downloads={CIEL_DOWNLOADS}
      />
    </div>
  );
}
