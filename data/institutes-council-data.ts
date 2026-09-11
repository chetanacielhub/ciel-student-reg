import type { StudentCouncilLeadItem } from "@/lib/types";

export interface InstituteCouncilInfo {
  id: string;
  code: string;
  name: string;
  shortName: string;
  badge: string;
  tagline: string;
  description: string;
  stats: {
    activeMembers: string;
    councilSeats: string;
    tracks: string;
    programs: string;
  };
  sicDescription: string;
  functionalDescription: string;
  defaultSicLeads: StudentCouncilLeadItem[];
  defaultFunctionalLeads: StudentCouncilLeadItem[];
}

export const INSTITUTES_DATA: InstituteCouncilInfo[] = [
  {
    id: "cimr",
    code: "CIMR",
    name: "Chetana's Institue of Management and Research",
    shortName: "CIMR",
    badge: "Autonomous Management Post-Graduate",
    tagline: "Postgraduate Venture Incubation, Strategic Business Upscaling & Corporate Hackathons",
    description:
      "Chetana's Institute of Management & Research (CIMR) drives rigorous managerial innovation, consulting sprints, and venture creation through its dedicated student council and functional vertical track coordinators.",
    stats: {
      activeMembers: "Active Campus Cell",
      councilSeats: "Executive Officers",
      tracks: "6 Core CIEL Tracks",
      programs: "PGDM General, Marketing, Finance & Business Analytics",
    },
    sicDescription:
      "The CIMR Student Innovation Council spearheads cross-departmental business upscaling bootcamps, elevator pitch competitions, and mentor-led seed funding evaluation sessions.",
    functionalDescription:
      "Dedicated postgraduate track leads collaborating with faculty and industry mentors across all six operational incubation verticals.",
    defaultSicLeads: [],
    defaultFunctionalLeads: [],
  },
  {
    id: "crkimr",
    code: "CRKIMR",
    name: "Chetana's R.K Institute of Management and Research",
    shortName: "CRKIMR",
    badge: "University of Mumbai Affiliated MMS",
    tagline: "Management Excellence, Tech-Driven Operations & Sustainable Enterprise Innovation",
    description:
      "Chetana's R.K. Institute of Management & Research (CRKIMR) empowers students to translate management theories into sustainable commercial enterprises, high-impact consulting projects, and tech ventures.",
    stats: {
      activeMembers: "Active Campus Cell",
      councilSeats: "Executive Officers",
      tracks: "6 Core CIEL Tracks",
      programs: "MMS (Finance, Marketing, Operations & Systems)",
    },
    sicDescription:
      "The CRKIMR Council orchestrates seed funding demo days, investor roundtables, and university-level entrepreneurship challenges under CIEL.",
    functionalDescription:
      "Specialized MMS track representatives managing operations, mentor pairing, and regulatory incubation compliance.",
    defaultSicLeads: [],
    defaultFunctionalLeads: [],
  },
  {
    id: "sfc",
    code: "SFC",
    name: "Chetana's SFC",
    shortName: "Chetana's SFC",
    badge: "Undergraduate Self-Financing Courses",
    tagline: "Grassroots Prototyping, Intercollegiate Hackathons & Fast-Track Tech Startups",
    description:
      "Chetana's Self-Financing Courses (SFC) wing unites dynamic undergraduate talent across management, accounting, banking, media, and technology to foster rapid prototyping and early-stage startup ventures.",
    stats: {
      activeMembers: "Active Campus Cell",
      councilSeats: "Executive Officers",
      tracks: "6 Core CIEL Tracks",
      programs: "BMS, BAF, BBI, BFM, BAMMC & B.Sc IT",
    },
    sicDescription:
      "The SFC Council hosts 36-hour campus hackathons, digital media summits, student venture pitch contests, and hands-on makerspace workshops.",
    functionalDescription:
      "Dynamic undergraduate coordinators heading hands-on operations, tech lab logistics, and cross-college innovation tie-ups.",
    defaultSicLeads: [],
    defaultFunctionalLeads: [],
  },
  {
    id: "hs-arts",
    code: "HS-ARTS",
    name: "Chetana's H.S college of commerce and Smt. Kusumtai Chaudhari College of Arts",
    shortName: "H.S. Commerce & Arts",
    badge: "Degree College Commerce, Economics & Liberal Arts",
    tagline: "Commerce Innovation, Social Enterprise Incubation & Grassroots Rural Impact",
    description:
      "Chetana's H.S. College of Commerce & Economics and Smt. Kusumtai Chaudhari College of Arts combine commerce acumen and social sciences to incubate grassroots initiatives, sustainable retail, and social impact enterprises.",
    stats: {
      activeMembers: "Active Campus Cell",
      councilSeats: "Executive Officers",
      tracks: "6 Core CIEL Tracks",
      programs: "B.Com, B.A., Economics, Commerce & Arts",
    },
    sicDescription:
      "The Commerce & Arts Council drives grassroots rural development hackathons, financial literacy tool development, and creative enterprise pitch sessions.",
    functionalDescription:
      "Student coordinators leading social entrepreneurship, community outreach, and commerce incubator verticals.",
    defaultSicLeads: [],
    defaultFunctionalLeads: [],
  },
];

export const INSTITUTES_LIST = [
  "Chetana's Institue of Management and Research",
  "Chetana's R.K Institute of Management and Research",
  "Chetana's SFC",
  "Chetana's H.S college of commerce and Smt. Kusumtai Chaudhari College of Arts",
];

export function normalizeInstituteName(rawName?: string | null): string {
  if (!rawName) return INSTITUTES_LIST[0];
  const lower = rawName.toLowerCase().trim();
  if (lower.includes("r.k") || lower.includes("rk") || lower.includes("crkimr")) {
    return "Chetana's R.K Institute of Management and Research";
  }
  if (lower.includes("sfc") || lower.includes("self financ") || lower.includes("self-financ")) {
    return "Chetana's SFC";
  }
  if (lower.includes("h.s") || lower.includes("hs") || lower.includes("commerce") || lower.includes("kusumtai") || lower.includes("arts")) {
    return "Chetana's H.S college of commerce and Smt. Kusumtai Chaudhari College of Arts";
  }
  if (lower.includes("cimr") || lower.includes("management and research") || lower.includes("institue of management")) {
    return "Chetana's Institue of Management and Research";
  }
  return rawName;
}
