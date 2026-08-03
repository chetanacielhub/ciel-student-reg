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
    name: "Joint Steering Committee",
    description: "Provides strategic leadership, governance oversight, and institutional alignment for CIEL initiatives.",
    members: [
      { name: "Dr. B. R. Patil", role: "Chairman, Governing Board" },
      { name: "Prof. S. R. Joshi", role: "Director, Chetana Institute" },
      { name: "Dr. Rajesh Kulkarni", role: "CEO, CIEL Innovation Hub" },
      { name: "Mr. Anand Rathi", role: "Industry Representative (Managing Director, Rathi Tech)" },
    ],
  },
  {
    name: "Incubation & Investment Committee",
    description: "Evaluates startup applications, recommends seed fund disbursements, and reviews quarterly milestone achievements.",
    members: [
      { name: "Sunita Nambiar", role: "Venture Partner, Lead Investor" },
      { name: "Prof. Arvind Mehta", role: "Head of Research & IPR" },
      { name: "Karan Johar", role: "Senior Partner, Angel Network" },
      { name: "Meera Fernandez", role: "Legal & Corporate Compliance Lead" },
    ],
  },
  {
    name: "Intellectual Property & Ethics Cell",
    description: "Manages prior art searches, patent drafting assistance, technology licensing agreements, and research ethics compliance.",
    members: [
      { name: "Prof. Arvind Mehta", role: "IPR Cell Chair" },
      { name: "Advocate Ramesh Iyer", role: "Senior Patent Attorney" },
      { name: "Dr. Smita Rao", role: "Technology Transfer Officer" },
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
