/**
 * Curated knowledge base chunks for CIEL (Centre for Innovation & Entrepreneurship Learning).
 * Serves both as seed data for pgvector ingestion and as a zero-config fallback retrieval base.
 */

export interface KnowledgeChunk {
  id: string;
  sourceTitle: string;
  sourceType: "website" | "pdf" | "policy" | "charter" | "faq";
  sourceUrl?: string;
  pageNumber?: number;
  content: string;
  category: string;
  keywords: string[];
}

export const CIEL_SEED_KNOWLEDGE: KnowledgeChunk[] = [
  {
    id: "ciel-about-overview",
    sourceTitle: "CIEL Website",
    sourceType: "website",
    sourceUrl: "https://www.cielhub.org/about",
    category: "overview",
    keywords: ["what is ciel", "ciel", "about", "vision", "mission", "centre for innovation", "entrepreneurship"],
    content: `CIEL stands for Centre for Innovation & Entrepreneurship Learning. 
It is the premier institutional innovation hub and startup incubator established at Chetana's Institutes (Bandra East, Mumbai). 
CIEL fosters an end-to-end entrepreneurial ecosystem supporting students, faculty, alumni, and early-stage entrepreneurs across idea validation, prototype building, startup incubation, acceleration, patenting (IPR), and seed funding.
The ecosystem comprises over 200+ Student Innovation Council members, dozens of incubated student ventures, verified industry mentors, and institutional partner funds.`,
  },
  {
    id: "ciel-incubation-facilities",
    sourceTitle: "CIEL Brochure",
    sourceType: "pdf",
    sourceUrl: "https://www.cielhub.org/downloads",
    pageNumber: 4,
    category: "incubation",
    keywords: ["incubation", "facilities", "coworking", "labs", "support", "office", "infrastructure", "seed grant", "mentorship"],
    content: `CIEL Incubation Facilities & Support:
1. Dedicated Co-working & Startup Incubation Workspace: High-speed enterprise internet, ergonomic collaborative workbenches, conference rooms, and ideation pods.
2. Rapid Prototyping & Makerspace: Hardware testing benches, IoT sensor toolkits, 3D printing access, and design software workstations.
3. Seed Capital & Grant Facilitation: Access to institutional seed funds up to ₹5–10 Lakhs for promising MVPs, along with investor pitch days.
4. Dedicated 1-on-1 Mentorship: Weekly office hours with seasoned tech founders, venture capitalists, patent attorneys, and domain specialists.
5. Cloud & Tech Perks: Cloud credits (AWS, Google Cloud, Microsoft Azure) and developer tool licenses worth over $10,000.
6. Legal, Company Incorporation & Compliance Guidance: Free advisory on Private Limited registration, GST, trademark filings, and founder equity agreements.`,
  },
  {
    id: "ciel-incubation-policy",
    sourceTitle: "CIEL Incubation & Seed Support Policy Handbook",
    sourceType: "policy",
    sourceUrl: "https://www.cielhub.org/downloads",
    pageNumber: 8,
    category: "policy",
    keywords: ["policy", "equity", "seed support", "incubation policy", "tenure", "milestones", "handbook"],
    content: `CIEL Incubation & Seed Support Terms:
- Incubation Tenure: Initial residency of 12 months, extendable up to 24 months based on quarterly milestone evaluations.
- Equity Model: CIEL operates on a founder-friendly model, generally taking a nominal 2% to 5% equity or success fee for institutional support, mentorship, and seed facilities.
- Milestone Tracking: Incubatees undergo monthly check-ins on product development (MVP), traction, customer discovery, and financial burn rate.
- Access Criteria: Open to student innovators from Chetana and partner universities, alumni, and external early-stage startups selected via the CIEL Screening Committee.`,
  },
  {
    id: "ciel-accelerator-program",
    sourceTitle: "CIEL Website",
    sourceType: "website",
    sourceUrl: "https://www.cielhub.org/accelerator",
    category: "accelerator",
    keywords: ["accelerator", "acceleration", "scale", "growth", "revenue", "investors", "demo day"],
    content: `CIEL Accelerator Program:
A 16-week high-velocity acceleration cohort tailored for post-revenue or validated MVP startups seeking market scale and angel/institutional VC funding.
Key benefits include:
- Curated Go-To-Market (GTM) masterclasses by corporate leaders.
- Direct investor pipelines with angel networks, early-stage VC funds, and corporate innovation desks.
- Intensive Demo Day where selected startups pitch to institutional investors.
Accelerated ventures at CIEL include: 24 Organic Mantra (Organic Foods & Sustainable D2C), DryGrab (Moisture Care), GD (Brand Strategy), Summit Roof Cleaning, Byte Elephants (Enterprise Cloud Tech), and Lets Balance Kitchen.`,
  },
  {
    id: "ciel-student-startups",
    sourceTitle: "CIEL Website",
    sourceType: "website",
    sourceUrl: "https://www.cielhub.org/showcase",
    category: "startups",
    keywords: ["startups", "incubated startups", "projects", "ventures", "austrange", "hydra edge", "synko", "pravaah", "athena", "liminox", "handvoice"],
    content: `Notable Startups Incubated at CIEL:
- Austrange Solutions: Assistive hardware and software tools empowering specially abled individuals.
- Hydra Edge: Smart IoT & HealthTech brand utilizing AI telemetry to predict real-time hydration.
- Synko: FinTech & Smart Commerce companion assisting shoppers with AI pricing and deal optimization.
- Pravaah: Generative AI and FashionTech suite for fashion designers and creative workflows.
- Athena: AI-driven 3D visualization platform converting 2D images into augmented reality (AR).
- Nexora: AI-driven smart lifestyle and personal wardrobe styling intelligence.
- LogiApp: AI route optimization and fleet dispatch logistics engine.
- SatSecure: Automotive IoT sensor suite detecting road hazards and improving driver safety.
- Liminox: CleanTech IoT water quality monitoring system for telemetry and purity tracking.
- Handvoice: Computer vision sign language translator bridging communication for deaf communities.`,
  },
  {
    id: "ciel-sic-council",
    sourceTitle: "Student Innovation Council Charter & Constitution",
    sourceType: "charter",
    sourceUrl: "https://www.cielhub.org/student-council",
    pageNumber: 2,
    category: "student-council",
    keywords: ["sic", "student council", "student innovation council", "council", "membership", "leadership", "departments"],
    content: `Student Innovation Council (SiC) at CIEL:
The SiC is the student-led operational engine of CIEL consisting of approximately 200 student innovators and leaders across departments.
Council departments include:
1. Technical & Product Development: Organizing hackathons, dev bootcamps, and prototype workshops.
2. Startup Operations & Incubation Cell: Assisting student founders with registration, resources, and pitch prep.
3. Events & Outreach: Hosting annual flagship innovation summits, speaker panels, and startup expos.
4. Media, Creative & PR: Managing design, digital communication, photography, and storytelling.
5. Corporate & Sponsorship: Connecting with industry sponsors and ecosystem collaborators.
Students can join SiC by filling out the SiC membership application form at the beginning of each academic term.`,
  },
  {
    id: "ciel-mentors-advisors",
    sourceTitle: "CIEL Website",
    sourceType: "website",
    sourceUrl: "https://www.cielhub.org/mentors",
    category: "mentors",
    keywords: ["mentors", "advisors", "rajesh kulkarni", "sunita nambiar", "arvind mehta", "priya nair"],
    content: `CIEL Mentors & Advisory Panel:
- Dr. Rajesh Kulkarni: Chief Innovation Advisor, Ex-Director of Tech Ventures (Specialties: Venture Capital, IP Strategy, DeepTech).
- Sunita Nambiar: Managing Partner at Vanguard Seed Fund (Specialties: Early Stage Angel Funding, Go-To-Market, SaaS Scale).
- Prof. Arvind Mehta: Head of Research & IPR, Chetana Institute (Specialties: Patent Drafting, Tech Transfer, Material Sciences).
- Priya Nair: Founder & CEO of GreenGrid Energy, CIEL Alumnus (Specialties: CleanTech, Hardware Prototyping, Supply Chain).
Mentors conduct weekly clinic sessions and pitch evaluation panels for registered student teams.`,
  },
  {
    id: "ciel-ipr-patents",
    sourceTitle: "Institutional Intellectual Property (IPR) Policy",
    sourceType: "policy",
    sourceUrl: "https://www.cielhub.org/research-ipr",
    pageNumber: 5,
    category: "ipr",
    keywords: ["ipr", "patents", "intellectual property", "copyright", "trademark", "patent filing", "ownership", "commercialization"],
    content: `CIEL Intellectual Property (IPR) Policy:
- Student Ownership: Innovators retain ownership of inventions developed using standard institute resources.
- Patent Filing Assistance: CIEL's IPR Cell provides end-to-end support for prior art search, provisional patent drafting, and formal filing via empaneled patent attorneys.
- Financial Subsidy: Up to 100% of the patent filing fees can be subsidized by CIEL for shortlisted student inventions showing strong commercial potential.
- Technology Transfer: The CIEL tech-transfer office assists inventors with licensing agreements, royalties, and commercialization partnerships with industry players.`,
  },
  {
    id: "ciel-registration-apply",
    sourceTitle: "CIEL Website",
    sourceType: "website",
    sourceUrl: "https://www.cielhub.org/apply",
    category: "apply",
    keywords: ["how to apply", "apply", "register", "application", "registration", "google form", "admission", "selection"],
    content: `How to Apply to CIEL:
1. Online Application: Submit your venture details through the CIEL Registration portal or the official Google Form available on the CIEL website.
2. Pitch Deck Submission: Upload your executive summary or pitch deck covering the problem, solution, target market, business model, and founding team.
3. Preliminary Screening: The CIEL Innovation Committee reviews submissions on originality, feasibility, and market potential.
4. Pitch Presentation: Shortlisted teams present before the Incubation Panel.
5. Onboarding: Accepted teams receive incubator agreement, desk space allocation, mentor pairing, and prototyping access.`,
  },
  {
    id: "ciel-governance-leadership",
    sourceTitle: "CIEL Governance Committee",
    sourceType: "charter",
    sourceUrl: "https://www.cielhub.org/governance",
    pageNumber: 1,
    category: "governance",
    keywords: ["governance", "committee", "leadership", "dr b r patil", "prof s r joshi", "anand rathi"],
    content: `CIEL Institutional Leadership & Governance:
- Governing Board: Dr. B. R. Patil (Chairman, Governing Board), Prof. S. R. Joshi (Director, Chetana Institute), Dr. Rajesh Kulkarni (CEO, CIEL Innovation Hub), and Mr. Anand Rathi (Industry Representative, Managing Director at Rathi Tech).
- Joint-Steering Committee: Prof. Arvind Mehta (Chair, Joint-Steering & Research), Dr. Smita Rao (Academic Partnerships), Sunita Nambiar (Venture Partner), Karan Johar (Senior Partner, Angel Network).
- Functional Committees: Spearheaded across 6 tracks: 1. Innovation & Research, 2. Incubation & Startup Support, 3. Skill Development & Training, 4. Industry & Investor, 5. Events & Outreach, and 6. Monitoring & Evaluation.`,
  },
  {
    id: "ciel-contact-location",
    sourceTitle: "CIEL Website",
    sourceType: "website",
    sourceUrl: "https://www.cielhub.org/contact",
    category: "contact",
    keywords: ["contact", "location", "address", "email", "phone", "where is ciel", "chetana", "mumbai", "bandra"],
    content: `CIEL Contact & Location:
- Address: Centre for Innovation & Entrepreneurship Learning (CIEL), Chetana's Institutes, Survey No. 341, Govt Colony, Bandra (East), Mumbai, Maharashtra 400051.
- Official Website: https://www.cielhub.org
- Inquiries: Support for incubation, student innovation, partnerships, and event queries can be submitted via the contact form or email at info@cielhub.org.`,
  },
];
