export type RegistrationRole = "team_leader" | "team_member" | "solo";

export type UserCategory =
  | "student"
  | "entrepreneur"
  | "startup"
  | "msme"
  | "industry_partner"
  | "investor"
  | "mentor"
  | "faculty"
  | "researcher"
  | "ngo"
  | "government"
  | "social_innovator";

export type InnovationStage =
  | "idea"
  | "validation"
  | "prototype"
  | "mvp"
  | "incubation"
  | "pilot"
  | "market"
  | "scale";

export type TeamMemberRole =
  | "founder"
  | "co_founder"
  | "developer"
  | "designer"
  | "marketing"
  | "finance"
  | "research"
  | "advisor"
  | "mentor";

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
  userCategory?: UserCategory;
  organizationName?: string;
  industrySector?: string;
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
        | "userCategory"
        | "form";
    };

export type ProjectItem = {
  id: string;
  name: string;
  problemStatement: string;
  solution: string;
  category: string;
  technology: string;
  stage: InnovationStage;
  pitchDeckUrl?: string;
  prototypeUrl?: string;
  milestones: string[];
  fundingAmount?: string;
  mentorsAssigned: string[];
  progressPercent: number;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: TeamMemberRole;
  avatarUrl?: string;
};

export type StartupShowcaseItem = {
  id: string;
  name: string;
  sector: string;
  stage: InnovationStage;
  founder: string;
  description: string;
  logo: string;
  fundingRaised?: string;
  website?: string;
};

export type MentorItem = {
  id: string;
  name: string;
  designation: string;
  organization: string;
  expertise: string[];
  avatar: string;
  category: "industry" | "academic" | "investor" | "alumni";
};

export type DownloadItem = {
  id: string;
  title: string;
  category: "policy" | "manual" | "form" | "report" | "template";
  fileSize: string;
  format: "PDF" | "DOCX" | "ZIP";
  updatedAt: string;
  description: string;
};
