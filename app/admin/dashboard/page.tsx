import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { EVENT_SLUG } from "@/lib/config";
import { getGovernanceCommittees, getMentors, getStudentCouncilLeads } from "@/lib/dynamic-store";
import { AdminDashboardClient } from "./admin-dashboard-client";
import path from "path";
import fs from "fs/promises";

export const metadata: Metadata = { title: "Admin Dashboard | CIEL" };

// Prevent static caching of admin data
export const dynamic = "force-dynamic";

async function getGalleryImages() {
  const dir = path.join(process.cwd(), "public", "gallery");
  try {
    const files = await fs.readdir(dir);
    return files
      .filter(
        (f) =>
          !f.startsWith(".") &&
          /\.(jpe?g|png|webp|gif|avif)$/i.test(f)
      )
      .map((filename) => ({ filename, url: `/gallery/${filename}` }));
  } catch {
    return [];
  }
}

export default async function AdminDashboardPage() {
  // Guard — only logged-in admins
  await requireAdminSession();

  const supabase = createAdminClient();

  // ── Fetch event ──────────────────────────────────────────────────────────
  const { data: event } = await supabase
    .from("events")
    .select("id,title")
    .eq("slug", EVENT_SLUG)
    .maybeSingle();

  // ── Fetch all registrations (with fallback if event is not seeded yet) ───
  let query = supabase
    .from("event_registrations")
    .select(
      `id, role, roll_number, created_at,
       profiles:user_id(full_name,email,phone),
       institutions:institution_id(name),
       classes:class_id(name),
       teams:team_id(name,problem_statement)`
    );

  if (event?.id) {
    query = query.eq("event_id", event.id);
  }

  const { data: rawRegs } = await query.order("created_at", { ascending: false });

  type RawReg = {
    id: string;
    role: "team_leader" | "team_member" | "solo";
    roll_number: string;
    created_at: string;
    profiles: { full_name: string; email: string | null; phone: string | null } | null;
    institutions: { name: string } | null;
    classes: { name: string } | null;
    teams: { name: string; problem_statement: string } | null;
  };

  const registrations = ((rawRegs ?? []) as unknown as RawReg[]).map((r) => ({
    id: r.id,
    fullName: r.profiles?.full_name || "Unnamed",
    email: r.profiles?.email || "—",
    phone: r.profiles?.phone || "—",
    institution: r.institutions?.name || "—",
    className: r.classes?.name || "—",
    rollNumber: r.roll_number || "—",
    role: r.role || "solo",
    teamName: r.teams?.name || "—",
    problemStatement: r.teams?.problem_statement || "—",
    createdAt: r.created_at || new Date().toISOString(),
  }));

  // ── Fetch all profiles (signed-in user accounts from DB + store) ──────────
  const { getStoreProfiles } = await import("@/lib/dynamic-store");
  const storeProfiles = await getStoreProfiles();

  const { data: rawProfiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, created_at")
    .order("created_at", { ascending: false });

  const dbProfiles = (rawProfiles ?? []) as {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    created_at: string;
  }[];

  // Merge database and store profiles by email
  const profilesMap = new Map<string, { id: string; full_name: string; email: string | null; phone: string | null; created_at: string }>();
  for (const p of [...storeProfiles, ...dbProfiles]) {
    const key = p.email ? p.email.toLowerCase().trim() : p.id;
    if (!profilesMap.has(key)) {
      profilesMap.set(key, {
        id: p.id,
        full_name: p.full_name || "Innovator",
        email: p.email,
        phone: p.phone,
        created_at: p.created_at || new Date().toISOString(),
      });
    }
  }
  const profiles = Array.from(profilesMap.values());

  // ── Gallery images ────────────────────────────────────────────────────────
  const images = await getGalleryImages();

  // ── Fetch dynamic store items ─────────────────────────────────────────────
  const { getCielEvents, getDownloadDocs, getGoogleForms, getVentureProjects } = await import("@/lib/dynamic-store");
  const [initialMentors, initialCouncil, initialGovernance, initialEvents, initialDownloads, initialGoogleForms, initialProjects] = await Promise.all([
    getMentors(),
    getStudentCouncilLeads(),
    getGovernanceCommittees(),
    getCielEvents(),
    getDownloadDocs(),
    getGoogleForms(false),
    getVentureProjects(),
  ]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const teamNames = new Set(registrations.map((r) => r.teamName).filter((n) => n !== "—"));
  const stats = {
    totalRegistrations: registrations.length,
    teamCount: teamNames.size || initialProjects.length,
    leaderCount: registrations.filter((r) => r.role === "team_leader").length,
    memberCount: registrations.filter((r) => r.role === "team_member").length,
    soloCount: registrations.filter((r) => r.role === "solo").length,
    totalUsers: profiles.length,
    totalImages: images.length,
    mentorCount: initialMentors.length,
    councilCount: initialCouncil.length,
    governanceCount: initialGovernance.length,
    eventsCount: initialEvents.length,
    downloadsCount: initialDownloads.length,
    formsCount: initialGoogleForms.length,
    projectsCount: initialProjects.length,
  };

  return (
    <AdminDashboardClient
      registrations={registrations}
      profiles={profiles}
      images={images}
      initialMentors={initialMentors}
      initialCouncil={initialCouncil}
      initialGovernance={initialGovernance}
      initialEvents={initialEvents}
      initialDownloads={initialDownloads}
      initialGoogleForms={initialGoogleForms}
      initialProjects={initialProjects}
      stats={stats}
      eventTitle={event?.title ?? "CIEL Incubation Program"}
    />
  );
}

