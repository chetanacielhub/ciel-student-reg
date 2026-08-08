"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { addStoreRegistration, updateVentureProject } from "@/lib/dynamic-store";
import type { ActionResult, RegistrationInput } from "@/lib/types";
import { registrationSchema } from "@/lib/validation";

type ActionErrorField = NonNullable<
  Extract<ActionResult, { ok: false }>["field"]
>;

const databaseErrors: Array<{
  key: string;
  field: ActionErrorField;
  message: string;
}> = [
    {
      key: "TEAM_NOT_FOUND",
      field: "teamName",
      message:
        "No team exists with this exact name. Ask your team leader to register first.",
    },
    {
      key: "TEAM_NAME_TAKEN",
      field: "teamName",
      message: "This team or project name is already registered for the event.",
    },
    {
      key: "ALREADY_REGISTERED",
      field: "form",
      message: "You are already registered for this event.",
    },
    {
      key: "DUPLICATE_REGISTRATION_OR_ROLL_NUMBER",
      field: "rollNumber",
      message:
        "This roll number is already registered in the selected institution and class.",
    },
    {
      key: "REGISTRATION_CLOSED",
      field: "form",
      message: "Registration for this event is currently closed.",
    },
    {
      key: "GMAIL_REQUIRED",
      field: "form",
      message: "Use a confirmed Gmail address before registering for the event.",
    },
    {
      key: "PHONE_REQUIRED",
      field: "form",
      message: "Add a valid phone number with country code before registering.",
    },
    {
      key: "INVALID_INSTITUTION",
      field: "institutionId",
      message: "Select a valid institution.",
    },
    {
      key: "INVALID_CLASS",
      field: "classId",
      message: "Select a valid class for this institution.",
    },
    {
      key: "PROBLEM_REQUIRED",
      field: "problemStatement",
      message: "Describe the problem your team or project is solving.",
    },
    {
      key: "TEAM_NAME_REQUIRED",
      field: "teamName",
      message: "Enter the team or project name.",
    },
  ];

export async function registerForEvent(input: RegistrationInput): Promise<ActionResult> {
  const parsed = registrationSchema.safeParse(input);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const issueField = issue.path[0];
    const field: ActionErrorField =
      issueField === "institutionId" ||
        issueField === "classId" ||
        issueField === "rollNumber" ||
        issueField === "role" ||
        issueField === "teamName" ||
        issueField === "problemStatement"
        ? issueField
        : "form";

    return {
      ok: false,
      field,
      message: issue.message,
    };
  }

  // 1. Resolve user from Supabase or fallback session cookie
  const supabase = await createClient();
  let userId: string | null = null;
  let userEmail: string = "innovator@ciel.edu";
  let userName: string = "Registered Innovator";

  try {
    const { data: claimsData } = await supabase.auth.getClaims();
    if (claimsData?.claims?.sub) {
      userId = claimsData.claims.sub as string;
    }
  } catch {
    // Ignore
  }

  if (!userId) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("ciel_user_session");
    if (sessionCookie?.value) {
      try {
        const parsedSession = JSON.parse(sessionCookie.value);
        if (parsedSession?.email) {
          userId = parsedSession.id || `usr-${Date.now()}`;
          userEmail = parsedSession.email;
          userName = parsedSession.fullName || "Registered Innovator";
        }
      } catch {
        // Ignore
      }
    }
  }

  if (!userId) {
    return {
      ok: false,
      field: "form",
      message: "Please sign in to register for the event.",
    };
  }

  // 2. Try Supabase RPC first
  let rpcSuccess = false;
  let teamId = `team-${Date.now()}`;

  try {
    const { data, error } = await supabase.rpc("register_for_event", {
      p_event_slug: parsed.data.eventSlug,
      p_institution_id: parsed.data.institutionId,
      p_class_id: parsed.data.classId,
      p_roll_number: parsed.data.rollNumber,
      p_role: parsed.data.role,
      p_team_name: parsed.data.teamName,
      p_problem_statement:
        parsed.data.role === "team_member"
          ? null
          : parsed.data.problemStatement ?? null,
    });

    if (!error) {
      rpcSuccess = true;
      if (data && (data as any).team_id) {
        teamId = String((data as any).team_id);
      }
    } else {
      const known = databaseErrors.find((item) => error.message.includes(item.key));
      if (known) {
        return {
          ok: false,
          field: known.field,
          message: known.message,
        };
      }
    }
  } catch {
    // RPC exception — fall back to store persistence
  }

  // 3. Fallback / Secondary persistence to local dynamic store & admin DB
  const regItem = {
    id: `reg-${Date.now()}`,
    userId,
    fullName: userName,
    email: userEmail,
    phone: "—",
    institution: parsed.data.institutionId,
    className: parsed.data.classId,
    rollNumber: parsed.data.rollNumber,
    role: parsed.data.role,
    teamName: parsed.data.teamName,
    problemStatement: parsed.data.problemStatement || "Innovation Project",
    createdAt: new Date().toISOString(),
  };

  await addStoreRegistration(regItem);

  // Sync to venture project tracker
  await updateVentureProject(teamId, {
    teamId,
    teamName: parsed.data.teamName,
    name: parsed.data.teamName,
    problemStatement: parsed.data.problemStatement || "Innovation Venture",
    stage: "idea",
    progress: 20,
    grantStatus: "under_review",
    journeyMilestones: [
      {
        id: `jm-${Date.now()}`,
        projectId: teamId,
        stage: "idea",
        title: "Registered for Incubation Program",
        description: `Project registered under ${parsed.data.teamName}. Problem statement: ${parsed.data.problemStatement || "Submitted"}`,
        date: new Date().toISOString().split("T")[0],
        status: "completed",
      },
    ],
  });

  // Try saving into Supabase admin table directly if RPC was not used
  if (!rpcSuccess) {
    try {
      const adminSupabase = createAdminClient();
      await adminSupabase.from("registrations").upsert(regItem);
    } catch {
      // Ignore
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin");
  revalidatePath("/admin/dashboard");

  return {
    ok: true,
    teamId,
  };
}
