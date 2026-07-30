export type RegistrationRole = "team_leader" | "team_member" | "solo";

export type Institution = {
  id: string;
  code: string;
  name: string;
};

export type ClassOption = {
  id: string;
  institution_id: string;
  name: string;
  sort_order: number;
};

export type EventRecord = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  venue: string | null;
  starts_at: string | null;
  registration_open: boolean;
};

export type RegistrationInput = {
  eventSlug: string;
  institutionId: string;
  classId: string;
  rollNumber: string;
  role: RegistrationRole;
  teamName: string;
  problemStatement?: string;
};

export type ActionResult =
  | { ok: true; teamId: string }
  | {
      ok: false;
      message: string;
      field?:
        | "institutionId"
        | "classId"
        | "rollNumber"
        | "role"
        | "teamName"
        | "problemStatement"
        | "form";
    };
