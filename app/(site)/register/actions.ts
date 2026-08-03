"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
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

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  if (!claimsData?.claims?.sub) {
    return {
      ok: false,
      field: "form",
      message: "Your session expired. Sign in again and resubmit the form.",
    };
  }

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

  if (error) {
    const known = databaseErrors.find((item) => error.message.includes(item.key));
    return {
      ok: false,
      field: known?.field ?? "form",
      message:
        known?.message ??
        "We could not complete the registration. Review the form and try again.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin");

  return {
    ok: true,
    teamId: String((data as { team_id?: string } | null)?.team_id ?? ""),
  };
}
