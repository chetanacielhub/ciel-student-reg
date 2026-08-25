import type {
  DownloadItem,
  MentorItem,
  ProjectItem,
  StartupShowcaseItem,
} from "./types";

export const CIEL_METRICS = [
  { label: "Startups Incubated", value: "65+", prefix: "" },
  { label: "Seed Funding Granted", value: "₹2.5 Cr+", prefix: "" },
  { label: "Patents & IPR Filed", value: "42+", prefix: "" },
  { label: "Industry MoUs Signed", value: "30+", prefix: "" },
  { label: "Jobs & Internships Created", value: "450+", prefix: "" },
  { label: "Student Innovators", value: "1,800+", prefix: "" },
];

export const FEATURED_STARTUPS: StartupShowcaseItem[] = [
  {
    id: "st-1",
    name: "AgriTech Dynamics",
    sector: "Agritech & IoT",
    stage: "market",
    founder: "Rohan Deshmukh (Student Innovator)",
    description: "AI-driven soil moisture telemetry and automated drip irrigation controller for precision farming.",
    logo: "/logo.png",
    fundingRaised: "₹25 Lakhs",
    website: "https://ciel-incubator.edu",
  },
  {
    id: "st-2",
    name: "MedPulse Systems",
    sector: "HealthTech & Medical Devices",
    stage: "incubation",
    founder: "Dr. Ananya Sharma & Team",
    description: "Low-cost non-invasive vital signs monitor for rural healthcare centers and primary clinics.",
    logo: "/logo.png",
    fundingRaised: "₹15 Lakhs",
    website: "https://ciel-incubator.edu",
  },
  {
    id: "st-3",
    name: "EcoClean Tech",
    sector: "CleanTech & Waste Management",
    stage: "scale",
    founder: "Vikram Patil",
    description: "Biopolymer-based packaging alternative derived from agricultural crop residue.",
    logo: "/logo.png",
    fundingRaised: "₹50 Lakhs",
    website: "https://ciel-incubator.edu",
  },
  {
    id: "st-4",
    name: "CyberShield AI",
    sector: "Cybersecurity & SaaS",
    stage: "mvp",
    founder: "Siddharth Verma",
    description: "Automated vulnerability scanner and threat intelligence portal tailored for MSMEs.",
    logo: "/logo.png",
    fundingRaised: "₹10 Lakhs",
    website: "https://ciel-incubator.edu",
  },
];

export const CIEL_MENTORS: MentorItem[] = [
  {
    id: "m-1",
    name: "Dr. Rajesh Kulkarni",
    designation: "Chief Innovation Advisor",
    organization: "Ex-Director, Tech Ventures",
    expertise: ["Venture Capital", "IP Strategy", "DeepTech"],
    avatar: "RK",
    category: "industry",
  },
  {
    id: "m-2",
    name: "Sunita Nambiar",
    designation: "Managing Partner",
    organization: "Vanguard Seed Fund",
    expertise: ["Early Stage Angel Funding", "Go-To-Market", "SaaS Scale"],
    avatar: "SN",
    category: "investor",
  },
  {
    id: "m-3",
    name: "Prof. Arvind Mehta",
    designation: "Head of Research & IPR",
    organization: "Chetana Institute",
    expertise: ["Patent Drafting", "Tech Transfer", "Material Sciences"],
    avatar: "AM",
    category: "academic",
  },
  {
    id: "m-4",
    name: "Priya Nair",
    designation: "Founder & CEO",
    organization: "GreenGrid Energy (CIEL Alumnus)",
    expertise: ["CleanTech", "Hardware Prototyping", "Supply Chain"],
    avatar: "PN",
    category: "alumni",
  },
];

export const CIEL_DOWNLOADS: DownloadItem[] = [
  {
    id: "d-1",
    title: "CIEL Incubation & Seed Support Policy Handbook",
    category: "policy",
    fileSize: "2.4 MB",
    format: "PDF",
    updatedAt: "2026-01-15",
    description: "Official guidelines covering equity terms, seed grant disbursal, lab usage, and IP sharing ratio.",
  },
  {
    id: "d-2",
    title: "Institutional Intellectual Property (IPR) Policy",
    category: "policy",
    fileSize: "1.8 MB",
    format: "PDF",
    updatedAt: "2025-11-20",
    description: "Comprehensive policy regarding student/faculty patent ownership, commercialization, and royalties.",
  },
  {
    id: "d-3",
    title: "Incubation Application & Pitch Deck Template",
    category: "template",
    fileSize: "5.1 MB",
    format: "ZIP",
    updatedAt: "2026-02-01",
    description: "Standard slide structure, financial projection sheet, and executive summary format required for evaluation.",
  },
  {
    id: "d-4",
    title: "Student Innovation Council Charter & Constitution",
    category: "manual",
    fileSize: "1.2 MB",
    format: "PDF",
    updatedAt: "2025-09-10",
    description: "Operational framework, roles, selection criteria, and event hosting guidelines for student leaders.",
  },
  {
    id: "d-5",
    title: "Annual Incubation & Impact Report 2025-26",
    category: "report",
    fileSize: "8.6 MB",
    format: "PDF",
    updatedAt: "2026-01-05",
    description: "Performance metrics, graduate startups, grant allocations, patent filings, and industry partnerships.",
  },
];

export const GOVERNANCE_COMMITTEES = [
  {
    id: "governing-committee",
    name: "Governing Committee",
    description: "Apex institutional decision-making body establishing strategic governance policies, resource allocations, and venture acceleration mandates for CIEL.",
    members: [
      { name: "Dr. B. R. Patil", role: "Chairman, Governing Board" },
      { name: "Prof. S. R. Joshi", role: "Director, Chetana Institute" },
      { name: "Dr. Rajesh Kulkarni", role: "CEO, CIEL Innovation Hub" },
      { name: "Mr. Anand Rathi", role: "Industry Representative (Managing Director, Rathi Tech)" },
    ],
  },
  {
    id: "joint-steering-committee",
    name: "Joint-Steering Committee",
    description: "Provides operational leadership, interdisciplinary academic integration, cross-faculty research synergy, and ecosystem partner alignment.",
    members: [
      { name: "Prof. Arvind Mehta", role: "Chair, Joint-Steering & Research" },
      { name: "Dr. Smita Rao", role: "Director of Academic Partnerships" },
      { name: "Sunita Nambiar", role: "Venture Partner, Lead Investor" },
      { name: "Karan Johar", role: "Senior Partner, Angel Network" },
    ],
  },
  {
    id: "functional-committee",
    name: "Functional Committee",
    description: "Operational leadership bodies executing CIEL's 6 core innovation tracks, each spearheaded by a dedicated committee lead.",
    members: [
      { name: "Dr. Arvind Mehta", role: "Lead — 1. Innovation and Research" },
      { name: "Dr. Rajesh Kulkarni", role: "Lead — 2. Incubation and Start-up Support" },
      { name: "Prof. Smita Rao", role: "Lead — 3. Skill Development and Training" },
      { name: "Mr. Anand Rathi", role: "Lead — 4. Industry and Investor" },
      { name: "Ms. Meera Fernandez", role: "Lead — 5. Events and Outreach" },
      { name: "Prof. S. R. Joshi", role: "Lead — 6. Monitoring and Evaluation" },
    ],
  },
];

export const STUDENT_COUNCIL_LEADS = [
  { name: "Aarav Sharma", role: "President, Student Innovation Council", branch: "Computer Engineering", year: "Final Year" },
  { name: "Neha Kadam", role: "Vice President, Hackathons & Competitions", branch: "Information Technology", year: "Final Year" },
  { name: "Rishi Verma", role: "Lead, Prototyping & Makerspace Labs", branch: "Mechanical Engineering", year: "Pre-Final Year" },
  { name: "Ananya Roy", role: "Lead, Women Entrepreneurship Cell", branch: "Electronics & Telecom", year: "Pre-Final Year" },
  { name: "Devansh Mehta", role: "Lead, Industry Outreach & Media", branch: "Management Studies", year: "Final Year" },
];

export const DEFAULT_GOOGLE_FORMS = [
  {
    id: "gf-1",
    title: "CiEL Registration",
    description: "Official registration form for Centre for Innovation & Entrepreneurship Learning (CiEL) incubation program.",
    category: "Incubation",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSe4TiDARd-MAr5xgmzHlu7tf2UnVU6uJ_uU4fx3fdNknzi1mw/viewform?usp=header",
    embedUrl: "https://docs.google.com/forms/d/e/1FAIpQLSe4TiDARd-MAr5xgmzHlu7tf2UnVU6uJ_uU4fx3fdNknzi1mw/viewform?embedded=true",
    isActive: true,
    createdAt: "2026-02-01T10:00:00.000Z",
  },
  {
    id: "gf-2",
    title: "SiC for CiEL",
    description: "Application and membership registration form for the Student Innovation Council (SiC) at CiEL.",
    category: "Student Council",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLScCGydXqb45XNLxuc_t1WMmRg0j3rePsmGBjSzZU_1s2R-VNA/viewform",
    embedUrl: "https://docs.google.com/forms/d/e/1FAIpQLScCGydXqb45XNLxuc_t1WMmRg0j3rePsmGBjSzZU_1s2R-VNA/viewform?embedded=true",
    isActive: true,
    createdAt: "2026-02-10T12:30:00.000Z",
  },
];


