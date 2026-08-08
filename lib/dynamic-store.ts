import fs from "fs/promises";
import path from "path";
import { CIEL_MENTORS, GOVERNANCE_COMMITTEES, STUDENT_COUNCIL_LEADS } from "./ciel-data";
import type { GovernanceCommitteeItem, MentorItem, StudentCouncilLeadItem } from "./types";
import { createAdminClient } from "./supabase/admin";

type StoreData = {
  mentors: MentorItem[];
  studentCouncil: StudentCouncilLeadItem[];
  governance: GovernanceCommitteeItem[];
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
