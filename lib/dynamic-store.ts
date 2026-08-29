import fs from "fs/promises";
import path from "path";
import { CIEL_MENTORS, GOVERNANCE_COMMITTEES, STUDENT_COUNCIL_LEADS, CIEL_DOWNLOADS, DEFAULT_GOOGLE_FORMS } from "./ciel-data";
import type { GovernanceCommitteeItem, JourneyMilestone, MentorItem, StudentCouncilLeadItem, VentureProjectItem, UserProfileItem, CielEventItem, NewsItem, DownloadItem, GoogleFormItem } from "./types";
import { createAdminClient } from "./supabase/admin";

type StoreData = {
  mentors: MentorItem[];
  studentCouncil: StudentCouncilLeadItem[];
  governance: GovernanceCommitteeItem[];
  projects?: VentureProjectItem[];
  userProfiles?: UserProfileItem[];
  registrations?: any[];
  events?: CielEventItem[];
  news?: NewsItem[];
  downloads?: DownloadItem[];
  googleForms?: GoogleFormItem[];
};

const STORE_PATH = path.join(process.cwd(), "data", "ciel-store.json");

/** Initialize initial store structure if not present */
function getInitialData(): StoreData {
  return {
    mentors: CIEL_MENTORS,
    studentCouncil: STUDENT_COUNCIL_LEADS.map((sc, idx) => ({
      id: `sc-${idx + 1}`,
      name: sc.name,
      role: sc.role,
      branch: sc.branch,
      year: sc.year,
      avatar: sc.name.split(" ").map((n) => n[0]).join(""),
    })),
    governance: GOVERNANCE_COMMITTEES.map((c, idx) => ({
      id: `gov-${idx + 1}`,
      name: c.name,
      description: c.description,
      members: c.members,
    })),
    googleForms: DEFAULT_GOOGLE_FORMS,
  };
}

/** Ensure directory and JSON file exist */
async function ensureStore(): Promise<StoreData> {
  try {
    const dir = path.dirname(STORE_PATH);
    await fs.mkdir(dir, { recursive: true });

    const content = await fs.readFile(STORE_PATH, "utf-8");
    const parsed = JSON.parse(content) as Partial<StoreData>;
    return {
      mentors: Array.isArray(parsed.mentors) ? parsed.mentors : getInitialData().mentors,
      studentCouncil: Array.isArray(parsed.studentCouncil) ? parsed.studentCouncil : getInitialData().studentCouncil,
      governance: Array.isArray(parsed.governance) ? parsed.governance : getInitialData().governance,
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      userProfiles: Array.isArray(parsed.userProfiles) ? parsed.userProfiles : [],
      registrations: Array.isArray(parsed.registrations) ? parsed.registrations : [],
      events: Array.isArray(parsed.events) ? parsed.events : [],
      news: Array.isArray(parsed.news) ? parsed.news : [],
      downloads: Array.isArray(parsed.downloads) ? parsed.downloads : CIEL_DOWNLOADS,
      googleForms: Array.isArray(parsed.googleForms) && parsed.googleForms.length > 0 ? parsed.googleForms : DEFAULT_GOOGLE_FORMS,
    };
  } catch {
    const initial = getInitialData();
    await fs.writeFile(STORE_PATH, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
}

/** Write store data back to JSON */
async function saveStore(data: StoreData): Promise<void> {
  const dir = path.dirname(STORE_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// ─── MENTORS ──────────────────────────────────────────────────────────────

export async function getMentors(): Promise<MentorItem[]> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("mentors").select("*").order("created_at", { ascending: false });
    if (data && data.length > 0) {
      return data.map((m: any) => ({
        id: m.id,
        name: m.name,
        designation: m.designation || m.title || "Advisor",
        organization: m.organization || "CIEL Advisory",
        expertise: Array.isArray(m.expertise) ? m.expertise : (m.expertise ? [m.expertise] : []),
        avatar: m.avatar || m.name.split(" ").map((n: string) => n[0]).join(""),
        category: m.category || "industry",
        linkedinUrl: m.linkedin_url || m.linkedinUrl,
      }));
    }
  } catch {
    // Fallback to file store
  }
  const store = await ensureStore();
  return store.mentors;
}

export async function addMentor(mentor: Omit<MentorItem, "id">): Promise<MentorItem> {
  const newMentor: MentorItem = {
    ...mentor,
    id: `m-${Date.now()}`,
    avatar: mentor.avatar || mentor.name.split(" ").map((n) => n[0]).join(""),
  };

  try {
    const supabase = createAdminClient();
    await supabase.from("mentors").insert({
      id: newMentor.id,
      name: newMentor.name,
      designation: newMentor.designation,
      organization: newMentor.organization,
      category: newMentor.category,
      expertise: newMentor.expertise,
      avatar: newMentor.avatar,
      linkedin_url: newMentor.linkedinUrl,
    });
  } catch {
    // Continue to save locally
  }

  const store = await ensureStore();
  store.mentors.unshift(newMentor);
  await saveStore(store);
  return newMentor;
}

export async function deleteMentor(id: string): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    await supabase.from("mentors").delete().eq("id", id);
  } catch {
    // Ignore
  }

  const store = await ensureStore();
  store.mentors = store.mentors.filter((m) => m.id !== id);
  await saveStore(store);
  return true;
}

// ─── STUDENT INNOVATION COUNCIL ──────────────────────────────────────────

export async function getStudentCouncilLeads(): Promise<StudentCouncilLeadItem[]> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("student_council").select("*").order("created_at", { ascending: true });
    if (data && data.length > 0) {
      return data.map((sc: any) => ({
        id: sc.id,
        name: sc.name,
        role: sc.role,
        branch: sc.branch,
        year: sc.year,
        avatar: sc.avatar || sc.name.split(" ").map((n: string) => n[0]).join(""),
        linkedinUrl: sc.linkedin_url || sc.linkedinUrl,
      }));
    }
  } catch {
    // Fallback
  }
  const store = await ensureStore();
  return store.studentCouncil;
}

export async function addStudentCouncilLead(lead: Omit<StudentCouncilLeadItem, "id">): Promise<StudentCouncilLeadItem> {
  const newLead: StudentCouncilLeadItem = {
    ...lead,
    id: `sc-${Date.now()}`,
    avatar: lead.avatar || lead.name.split(" ").map((n) => n[0]).join(""),
  };

  try {
    const supabase = createAdminClient();
    await supabase.from("student_council").insert({
      id: newLead.id,
      name: newLead.name,
      role: newLead.role,
      branch: newLead.branch,
      year: newLead.year,
      avatar: newLead.avatar,
      linkedin_url: newLead.linkedinUrl,
    });
  } catch {
    // Ignore
  }

  const store = await ensureStore();
  store.studentCouncil.push(newLead);
  await saveStore(store);
  return newLead;
}

export async function deleteStudentCouncilLead(id: string): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    await supabase.from("student_council").delete().eq("id", id);
  } catch {
    // Ignore
  }

  const store = await ensureStore();
  store.studentCouncil = store.studentCouncil.filter((sc) => sc.id !== id && sc.name !== id);
  await saveStore(store);
  return true;
}

// ─── GOVERNANCE ───────────────────────────────────────────────────────────

export async function getGovernanceCommittees(): Promise<GovernanceCommitteeItem[]> {
  try {
    const supabase = createAdminClient();
    const { data: committees } = await supabase.from("governance_committees").select("*").order("created_at", { ascending: true });
    if (committees && committees.length > 0) {
      const { data: members } = await supabase.from("governance_members").select("*");
      return committees.map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description || "",
        members: (members || [])
          .filter((m: any) => m.committee_id === c.id)
          .map((m: any) => ({
            id: m.id,
            name: m.name,
            role: m.role,
            linkedinUrl: m.linkedin_url || m.linkedinUrl,
            avatar: m.avatar,
          })),
      }));
    }
  } catch {
    // Fallback
  }

  const store = await ensureStore();
  return store.governance;
}

export async function addGovernanceCommittee(comm: { name: string; description: string }): Promise<GovernanceCommitteeItem> {
  const newComm: GovernanceCommitteeItem = {
    id: `gov-${Date.now()}`,
    name: comm.name,
    description: comm.description,
    members: [],
  };

  try {
    const supabase = createAdminClient();
    await supabase.from("governance_committees").insert({
      id: newComm.id,
      name: newComm.name,
      description: newComm.description,
    });
  } catch {
    // Ignore
  }

  const store = await ensureStore();
  const existing = store.governance.find((g) => g.name.toLowerCase() === comm.name.toLowerCase());
  if (existing) {
    existing.description = comm.description;
  } else {
    store.governance.push(newComm);
  }
  await saveStore(store);
  return newComm;
}

export async function addGovernanceMember(
  committeeName: string,
  member: { name: string; role: string; linkedinUrl?: string; avatar?: string }
): Promise<boolean> {
  const store = await ensureStore();
  let comm = store.governance.find((g) => g.name.toLowerCase() === committeeName.toLowerCase());
  if (!comm) {
    comm = {
      id: `gov-${Date.now()}`,
      name: committeeName,
      description: "CIEL Governance Committee",
      members: [],
    };
    store.governance.push(comm);
  }

  comm.members.push({ name: member.name, role: member.role, linkedinUrl: member.linkedinUrl, avatar: member.avatar });

  try {
    const supabase = createAdminClient();
    const { data: existingComm } = await supabase.from("governance_committees").select("id").eq("name", committeeName).maybeSingle();
    let cId = existingComm?.id;
    if (!cId) {
      const { data: newC } = await supabase.from("governance_committees").insert({ name: committeeName, description: comm.description }).select().single();
      cId = newC?.id;
    }
    if (cId) {
      await supabase.from("governance_members").insert({
        committee_id: cId,
        name: member.name,
        role: member.role,
        linkedin_url: member.linkedinUrl,
        avatar: member.avatar,
      });
    }
  } catch {
    // Ignore
  }

  await saveStore(store);
  return true;
}

export async function deleteGovernanceMember(committeeName: string, memberName: string): Promise<boolean> {
  const store = await ensureStore();
  const comm = store.governance.find((g) => g.name.toLowerCase() === committeeName.toLowerCase());
  if (comm) {
    comm.members = comm.members.filter((m) => m.name.toLowerCase() !== memberName.toLowerCase());
  }

  try {
    const supabase = createAdminClient();
    await supabase.from("governance_members").delete().eq("name", memberName);
  } catch {
    // Ignore
  }

  await saveStore(store);
  return true;
}

export async function deleteGovernanceCommittee(committeeName: string): Promise<boolean> {
  const store = await ensureStore();
  store.governance = store.governance.filter((g) => g.name.toLowerCase() !== committeeName.toLowerCase());

  try {
    const supabase = createAdminClient();
    await supabase.from("governance_committees").delete().eq("name", committeeName);
  } catch {
    // Ignore
  }

  await saveStore(store);
  return true;
}

// ─── VENTURE PROJECTS & INNOVATION JOURNEY ───────────────────────────────

export async function getVentureProjects(): Promise<VentureProjectItem[]> {
  try {
    const supabase = createAdminClient();
    const { data: projects } = await supabase.from("projects").select("*");
    if (projects && projects.length > 0) {
      return projects.map((p: any) => ({
        id: p.id,
        teamId: p.team_id,
        teamName: p.team_name || p.name,
        name: p.name,
        problemStatement: p.description || p.problem_statement || "",
        stage: p.stage || "idea",
        progress: p.progress ?? 20,
        pitchDeck: p.pitch_deck || "",
        websiteUrl: p.website_url || "",
        grantStatus: p.grant_status || "under_review",
        reviewerNotes: p.reviewer_notes || "",
        journeyMilestones: Array.isArray(p.journey_milestones) ? p.journey_milestones : [],
        updatedAt: p.updated_at || new Date().toISOString(),
      }));
    }
  } catch {
    // Fallback
  }

  const store = await ensureStore();
  return store.projects || [];
}

export async function getVentureProjectById(idOrTeamId: string): Promise<VentureProjectItem | null> {
  const projects = await getVentureProjects();
  return projects.find((p) => p.id === idOrTeamId || p.teamId === idOrTeamId) || projects[0] || null;
}

export async function updateVentureProject(
  id: string,
  updates: Partial<VentureProjectItem>
): Promise<VentureProjectItem | null> {
  const store = await ensureStore();
  if (!store.projects) store.projects = [];

  let idx = store.projects.findIndex(
    (p) =>
      p.id === id ||
      p.teamId === id ||
      (updates.leaderEmail && p.leaderEmail?.toLowerCase() === updates.leaderEmail.toLowerCase()) ||
      (updates.teamName && p.teamName?.toLowerCase() === updates.teamName.toLowerCase())
  );

  if (idx < 0) {
    const newProj: VentureProjectItem = {
      id: id || `proj-${Date.now()}`,
      teamName: updates.teamName || updates.name || "Innovator Venture",
      name: updates.name || "Innovator Venture",
      problemStatement: updates.problemStatement || "",
      stage: updates.stage || "idea",
      progress: updates.progress ?? 20,
      pitchDeck: updates.pitchDeck || "",
      websiteUrl: updates.websiteUrl || "",
      grantStatus: updates.grantStatus || "under_review",
      reviewerNotes: updates.reviewerNotes || "",
      journeyMilestones: updates.journeyMilestones || [],
      documents: updates.documents || [],
      traction: updates.traction,
      leaderEmail: updates.leaderEmail,
      leaderName: updates.leaderName,
      updatedAt: new Date().toISOString(),
    };
    store.projects.push(newProj);
    await saveStore(store);
    return newProj;
  }

  store.projects[idx] = {
    ...store.projects[idx],
    ...updates,
    documents: updates.documents !== undefined ? updates.documents : store.projects[idx].documents,
    traction: updates.traction !== undefined ? updates.traction : store.projects[idx].traction,
    updatedAt: new Date().toISOString(),
  };
  await saveStore(store);

  try {
    const supabase = createAdminClient();
    await supabase
      .from("projects")
      .update({
        name: updates.name,
        description: updates.problemStatement,
        stage: updates.stage,
        progress: updates.progress,
        pitch_deck: updates.pitchDeck,
        updated_at: new Date().toISOString(),
      })
      .eq("id", store.projects[idx].id);
  } catch {
    // Ignore
  }

  return store.projects[idx];
}

export async function addJourneyMilestone(
  projectId: string,
  milestone: Omit<JourneyMilestone, "id">,
  userEmail?: string
): Promise<JourneyMilestone | null> {
  const store = await ensureStore();
  if (!store.projects) store.projects = [];

  let project = store.projects.find(
    (p) =>
      p.id === projectId ||
      p.teamId === projectId ||
      (userEmail && p.leaderEmail?.toLowerCase() === userEmail.toLowerCase())
  );

  if (!project) {
    if (store.projects.length > 0) {
      project = store.projects[0];
    } else {
      project = {
        id: projectId || `proj-${Date.now()}`,
        teamName: "Innovator Venture",
        name: "Innovator Venture",
        problemStatement: "",
        stage: milestone.stage || "idea",
        progress: 25,
        journeyMilestones: [],
        documents: [],
        updatedAt: new Date().toISOString(),
      };
      store.projects.push(project);
    }
  }

  const newMilestone: JourneyMilestone = {
    id: `jm-${Date.now()}`,
    projectId: project.id,
    ...milestone,
  };

  if (!project.journeyMilestones) project.journeyMilestones = [];
  project.journeyMilestones.unshift(newMilestone);
  project.updatedAt = new Date().toISOString();

  await saveStore(store);
  return newMilestone;
}

export async function updateAdminProjectGrantStatus(
  projectId: string,
  data: { grantStatus: VentureProjectItem["grantStatus"]; reviewerNotes?: string; stage?: VentureProjectItem["stage"] }
): Promise<VentureProjectItem | null> {
  const store = await ensureStore();
  if (!store.projects) store.projects = [];

  let project = store.projects.find((p) => p.id === projectId || p.teamId === projectId);
  if (!project && store.projects.length > 0) {
    project = store.projects[0];
  }

  if (project) {
    if (data.grantStatus) project.grantStatus = data.grantStatus;
    if (data.reviewerNotes !== undefined) project.reviewerNotes = data.reviewerNotes;
    if (data.stage) project.stage = data.stage;
    project.updatedAt = new Date().toISOString();

    await saveStore(store);
    return project;
  }

  return null;
}

// ─── USER PROFILES (Database & Store Credential Persistence) ──────────────

export async function getStoreProfiles(): Promise<UserProfileItem[]> {
  let dbProfiles: UserProfileItem[] = [];

  try {
    const supabase = createAdminClient();
    const { data: p1 } = await supabase.from("profiles").select("*");
    if (p1 && p1.length > 0) {
      dbProfiles.push(
        ...p1.map((p: any) => ({
          id: p.id,
          full_name: p.full_name || p.fullName || "Innovator",
          email: p.email ? p.email.toLowerCase().trim() : null,
          phone: p.phone || null,
          password: p.password || undefined,
          created_at: p.created_at || new Date().toISOString(),
        }))
      );
    }
  } catch {
    // Ignore DB missing table
  }

  try {
    const supabase = createAdminClient();
    const { data: p2 } = await supabase.from("user_profiles").select("*");
    if (p2 && p2.length > 0) {
      dbProfiles.push(
        ...p2.map((p: any) => ({
          id: p.id,
          full_name: p.full_name || p.fullName || "Innovator",
          email: p.email ? p.email.toLowerCase().trim() : null,
          phone: p.phone || null,
          password: p.password || undefined,
          created_at: p.created_at || new Date().toISOString(),
        }))
      );
    }
  } catch {
    // Ignore DB missing table
  }

  const store = await ensureStore();
  const localProfiles = store.userProfiles || [];

  // Merge database profiles and local profiles by email
  const mergedMap = new Map<string, UserProfileItem>();

  for (const p of [...localProfiles, ...dbProfiles]) {
    if (p.email) {
      const key = p.email.toLowerCase().trim();
      const existing = mergedMap.get(key);
      if (!existing) {
        mergedMap.set(key, p);
      } else {
        // Prefer record with password
        mergedMap.set(key, {
          ...existing,
          ...p,
          password: p.password || existing.password,
        });
      }
    }
  }

  return Array.from(mergedMap.values());
}

export async function addStoreProfile(profile: UserProfileItem): Promise<void> {
  const store = await ensureStore();
  if (!store.userProfiles) store.userProfiles = [];

  const cleanProfile: UserProfileItem = {
    ...profile,
    email: profile.email ? profile.email.toLowerCase().trim() : null,
  };

  // 1. Try storing in Supabase PostgreSQL 'profiles' table
  try {
    const supabase = createAdminClient();
    await supabase.from("profiles").upsert(
      {
        id: cleanProfile.id,
        full_name: cleanProfile.full_name,
        email: cleanProfile.email,
        phone: cleanProfile.phone,
        password: cleanProfile.password,
        created_at: cleanProfile.created_at || new Date().toISOString(),
      },
      { onConflict: "email" }
    );
  } catch {
    // Try without onConflict
    try {
      const supabase = createAdminClient();
      await supabase.from("profiles").insert({
        id: cleanProfile.id,
        full_name: cleanProfile.full_name,
        email: cleanProfile.email,
        phone: cleanProfile.phone,
        password: cleanProfile.password,
        created_at: cleanProfile.created_at || new Date().toISOString(),
      });
    } catch {
      // Ignore DB table error
    }
  }

  // 2. Try storing in Supabase PostgreSQL 'user_profiles' table
  try {
    const supabase = createAdminClient();
    await supabase.from("user_profiles").upsert(
      {
        id: cleanProfile.id,
        full_name: cleanProfile.full_name,
        email: cleanProfile.email,
        phone: cleanProfile.phone,
        password: cleanProfile.password,
        created_at: cleanProfile.created_at || new Date().toISOString(),
      },
      { onConflict: "email" }
    );
  } catch {
    // Ignore DB table error
  }

  // 3. Save to local JSON store
  const existing = store.userProfiles.findIndex(
    (p) => p.email?.toLowerCase().trim() === cleanProfile.email?.toLowerCase().trim()
  );
  if (existing >= 0) {
    store.userProfiles[existing] = {
      ...store.userProfiles[existing],
      ...cleanProfile,
      password: cleanProfile.password || store.userProfiles[existing].password,
    };
  } else {
    store.userProfiles.push(cleanProfile);
  }

  await saveStore(store);
}

export async function getStoreRegistrations(): Promise<any[]> {
  const store = await ensureStore();
  return store.registrations || [];
}

export async function addStoreRegistration(reg: any): Promise<void> {
  const store = await ensureStore();
  if (!store.registrations) store.registrations = [];
  store.registrations.push(reg);
  await saveStore(store);
}

// ─── EVENTS MANAGEMENT ───────────────────────────────────────────────────

export async function getCielEvents(): Promise<CielEventItem[]> {
  const store = await ensureStore();
  return store.events || [
    {
      id: "ev-1",
      title: "CIEL Annual Innovation Hackathon 2026",
      category: "Hackathon",
      date: "March 15-16, 2026",
      time: "36-Hour Hackathon",
      venue: "CIEL Prototyping Labs & Makerspace",
      desc: "Join 500+ student coders, hardware builders, and designers competing for ₹2.5 Lakhs in seed grants and incubation slots.",
    },
    {
      id: "ev-2",
      title: "IPR & Patent Disclosure Workshop",
      category: "Workshop",
      date: "April 02, 2026",
      time: "02:00 PM - 05:00 PM",
      venue: "Auditorium & Virtual Stream",
      desc: "Master prior art searching, provisional patent drafting, and university IP ownership terms led by senior patent attorneys.",
    },
    {
      id: "ev-3",
      title: "Investor Demo Day & Venture Syndicate",
      category: "Demo Day",
      date: "April 28, 2026",
      time: "10:00 AM - 04:00 PM",
      venue: "Grand Executive Hall",
      desc: "Graduating cohort startups present before 25+ angel investors, VC partners, and corporate pilot evaluators.",
    },
  ];
}

export async function addCielEvent(event: Omit<CielEventItem, "id">): Promise<CielEventItem> {
  const newEvent: CielEventItem = {
    ...event,
    id: `ev-${Date.now()}`,
  };

  const store = await ensureStore();
  if (!store.events) store.events = [];
  store.events.unshift(newEvent);
  await saveStore(store);
  return newEvent;
}

export async function deleteCielEvent(id: string): Promise<boolean> {
  const store = await ensureStore();
  if (store.events) {
    store.events = store.events.filter((e) => e.id !== id);
    await saveStore(store);
  }
  return true;
}

// ─── NEWS & ANNOUNCEMENTS MANAGEMENT ─────────────────────────────────────

export async function getNewsItems(): Promise<NewsItem[]> {
  const store = await ensureStore();
  return store.news && store.news.length > 0
    ? store.news
    : [
        {
          id: "n-1",
          title: "CIEL Incubated Startup AgriTech Dynamics Secures ₹25 Lakhs Seed Grant",
          date: "February 01, 2026",
          category: "Funding Disbursement",
          summary: "The student-led IoT farming startup successfully completed Stage 2 evaluation and secured seed support for field deployment.",
        },
        {
          id: "n-2",
          title: "Chetana Institute Inks MoU with National Research Development Corporation",
          date: "January 18, 2026",
          category: "Strategic Partnership",
          summary: "New partnership facilitates joint technology transfer, patent commercialization, and prior art database access for student inventors.",
        },
        {
          id: "n-3",
          title: "CIEL Prototyping Cell Adds High-Precision 3D Printers & IoT Testbench",
          date: "December 14, 2025",
          category: "Infrastructure",
          summary: "Expanded makerspace capacity enables simultaneous hardware prototyping for over 30 incubated teams.",
        },
      ];
}

export async function addNewsItem(news: Omit<NewsItem, "id">): Promise<NewsItem> {
  const newNews: NewsItem = {
    ...news,
    id: `n-${Date.now()}`,
  };

  const store = await ensureStore();
  if (!store.news) store.news = [];
  store.news.unshift(newNews);
  await saveStore(store);
  return newNews;
}

export async function deleteNewsItem(id: string): Promise<boolean> {
  const store = await ensureStore();
  if (store.news) {
    store.news = store.news.filter((n) => n.id !== id);
    await saveStore(store);
  }
  return true;
}

// ─── POLICY MANUALS & DOCUMENTS MANAGEMENT ────────────────────────────────

export async function getDownloadDocs(): Promise<DownloadItem[]> {
  const store = await ensureStore();
  return store.downloads && store.downloads.length > 0 ? store.downloads : CIEL_DOWNLOADS;
}

export async function addDownloadDoc(doc: Omit<DownloadItem, "id">): Promise<DownloadItem> {
  const newDoc: DownloadItem = {
    ...doc,
    id: `d-${Date.now()}`,
  };

  const store = await ensureStore();
  if (!store.downloads) store.downloads = [...CIEL_DOWNLOADS];
  store.downloads.unshift(newDoc);
  await saveStore(store);
  return newDoc;
}

export async function deleteDownloadDoc(id: string): Promise<boolean> {
  const store = await ensureStore();
  if (store.downloads) {
    store.downloads = store.downloads.filter((d) => d.id !== id);
    await saveStore(store);
  }
  return true;
}

// ─── GOOGLE FORMS MANAGEMENT ────────────────────────────────────────────────

export function formatGoogleFormEmbedUrl(rawUrl: string): string {
  if (!rawUrl) return "";
  let trimmed = rawUrl.trim();

  // If user pasted a full <iframe src="..."> HTML embed code snippet
  if (trimmed.includes("<iframe") && trimmed.includes("src=")) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      trimmed = srcMatch[1];
    }
  }

  // If already contains embedded=true, return as is
  if (trimmed.includes("embedded=true")) return trimmed;

  // Replace edit/viewform with viewform?embedded=true
  if (trimmed.includes("/viewform")) {
    const [base] = trimmed.split("?");
    return `${base}?embedded=true`;
  }
  if (trimmed.includes("/edit")) {
    const base = trimmed.substring(0, trimmed.indexOf("/edit"));
    return `${base}/viewform?embedded=true`;
  }

  // Handle generic url params if viewform parameter absent
  if (trimmed.includes("docs.google.com/forms")) {
    if (trimmed.includes("?")) {
      return `${trimmed}&embedded=true`;
    }
    return `${trimmed}?embedded=true`;
  }

  return trimmed;
}

export async function getGoogleForms(onlyActive = false): Promise<GoogleFormItem[]> {
  const store = await ensureStore();
  const forms = store.googleForms && store.googleForms.length > 0 ? store.googleForms : DEFAULT_GOOGLE_FORMS;
  if (onlyActive) {
    return forms.filter((f) => f.isActive !== false);
  }
  return forms;
}

export async function addGoogleForm(form: {
  title: string;
  description?: string;
  category?: string;
  formUrl: string;
  embedUrl?: string;
  isActive?: boolean;
}): Promise<GoogleFormItem> {
  const store = await ensureStore();
  if (!store.googleForms) store.googleForms = [...DEFAULT_GOOGLE_FORMS];

  const embedUrl = form.embedUrl ? form.embedUrl : formatGoogleFormEmbedUrl(form.formUrl);

  const newForm: GoogleFormItem = {
    id: `gf-${Date.now()}`,
    title: form.title,
    description: form.description || "",
    category: form.category || "General",
    formUrl: form.formUrl,
    embedUrl,
    isActive: form.isActive !== undefined ? form.isActive : true,
    createdAt: new Date().toISOString(),
  };

  store.googleForms.unshift(newForm);
  await saveStore(store);
  return newForm;
}

export async function updateGoogleForm(
  id: string,
  updates: Partial<Omit<GoogleFormItem, "id">>
): Promise<GoogleFormItem | null> {
  const store = await ensureStore();
  if (!store.googleForms) store.googleForms = [...DEFAULT_GOOGLE_FORMS];

  const index = store.googleForms.findIndex((f) => f.id === id);
  if (index === -1) return null;

  const current = store.googleForms[index];
  const newFormUrl = updates.formUrl !== undefined ? updates.formUrl : current.formUrl;
  const newEmbedUrl = updates.embedUrl
    ? updates.embedUrl
    : updates.formUrl
    ? formatGoogleFormEmbedUrl(updates.formUrl)
    : current.embedUrl;

  const updatedItem: GoogleFormItem = {
    ...current,
    ...updates,
    formUrl: newFormUrl,
    embedUrl: newEmbedUrl,
  };

  store.googleForms[index] = updatedItem;
  await saveStore(store);
  return updatedItem;
}

export async function deleteGoogleForm(id: string): Promise<boolean> {
  const store = await ensureStore();
  if (store.googleForms) {
    store.googleForms = store.googleForms.filter((f) => f.id !== id);
    await saveStore(store);
  }
  return true;
}

