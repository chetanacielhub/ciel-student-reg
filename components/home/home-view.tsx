"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Compass,
  Cpu,
  FileCheck2,
  Flame,
  Globe,
  GraduationCap,
  Heart,
  Images,
  Layers,
  Lightbulb,
  LineChart,
  MapPin,
  Microscope,
  Presentation,
  Quote,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Tv,
  UserCheck,
  Users,
  UsersRound,
  Zap,
} from "lucide-react";
import {
  FadeIn,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  GoldenParticleBackground,
  CounterAnimation,
  FloatingOrbs,
  ScrollProgressBar,
  MorphingBlob,
  TypewriterTitle,
} from "@/components/ui/motion";
import {
  CIEL_METRICS,
  FEATURED_STARTUPS,
  CIEL_MENTORS,
} from "@/lib/ciel-data";
import type { EventRecord } from "@/lib/types";

type HomeViewProps = {
  event: EventRecord | null;
};

const ANGLED_PANELS = [
  { id: "img1", src: "/img1.png" },
  { id: "img2", src: "/img2.png" },
  { id: "img3", src: "/img3.jpeg" },
  { id: "img4", src: "/img4.png" },
  { id: "img5", src: "/img5.png" },
  { id: "img6", src: "/img6b.png" },
];

const TESTIMONIALS = [
  {
    quote:
      "CIEL provided our startup with constant business upscaling seminars, tech lab access, conference room pitching sessions, and a wide mentor network that guided our venture from scratch to execution.",
    author: "Rohan Deshmukh",
    role: "Founder, AgriTech Dynamics",
    badge: "CIEL Incubated Founder",
  },
  {
    quote:
      "The rigorous governance structure and 1-on-1 mentorship at CIEL allowed our medical diagnostic device to achieve clinical validation and patent disclosure within 8 months.",
    author: "Dr. Ananya Sharma",
    role: "Co-Founder, MedPulse Systems",
    badge: "Faculty Innovator",
  },
  {
    quote:
      "CIEL's Student Innovation Council gave us the platform to run institution-wide hackathons. It bridges campus talent with serious venture capital opportunities.",
    author: "Aarav Sharma",
    role: "President, Student Innovation Council",
    badge: "Student Leader",
  },
];

function AngledImagePanel({ id, src }: { id: string; src?: string }) {
  const [imgSrc, setImgSrc] = useState<string | null>(src ?? `/${id}.png`);
  const [attempts, setAttempts] = useState(0);

  function handleError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    // Extract base path without extension for fallback attempts
    const basePath = src ? src.replace(/\.[^.]+$/, '') : `/${id}`;
    if (attempts === 0) {
      setAttempts(1);
      setImgSrc(`${basePath}.jpg`);
    } else if (attempts === 1) {
      setAttempts(2);
      setImgSrc(`${basePath}.jpeg`);
    } else if (attempts === 2) {
      setAttempts(3);
      setImgSrc(`${basePath}.webp`);
    } else if (attempts === 3) {
      setAttempts(4);
      setImgSrc(`${basePath}`);
    } else {
      setImgSrc(null); // Keep container blank
    }
  }

  return (
    <div className="angled-panel">
      {imgSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgSrc}
          alt={`Collage panel ${id}`}
          className="angled-panel-img"
          onError={handleError}
        />
      ) : (
        <div className="angled-panel-placeholder" />
      )}
    </div>
  );
}

export function HomeView({ event }: HomeViewProps) {
  const [activeWing, setActiveWing] = useState<"incubation" | "accelerator" | "impact">("incubation");
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  return (
    <div style={{ position: "relative" }}>
      {/* Scroll progress — fixed positioned, zero layout impact */}
      <ScrollProgressBar />

      {/* 1. REFERENCE DESIGN HERO SECTION WITH 6 ANGLED PANELS COLLAGE */}
      <section className="shell ref-hero-section">
        <GoldenParticleBackground />
        {/* Ambient floating orbs — absolute positioned, zero layout impact */}
        <FloatingOrbs />
        {/* Morphing organic blobs — absolute positioned, zero layout impact */}
        <MorphingBlob size={520} style={{ top: "-8%", right: "-6%" }} duration={13} />
        <MorphingBlob size={320} color="rgba(212,175,55,0.035)" style={{ bottom: "5%", left: "5%" }} duration={9} />

        <div className="ref-hero-grid" style={{ position: "relative", zIndex: 1 }}>
          {/* Left Hero Copy */}
          <div>
            <FadeIn delay={0.1}>
              <h1 className="ref-hero-title">
                <TypewriterTitle />
              </h1>
            </FadeIn>

            <FadeIn delay={0.25}>
              <h2 className="ref-hero-subtitle">
                Empowering Students. Enabling Startups. Building the Future.
              </h2>
            </FadeIn>

            <FadeIn delay={0.4}>
              <p className="ref-hero-desc">
                CIEL is the incubation cell of Chetana Institutions, fostering innovation, entrepreneurship and real-world impact through mentorship, resources and opportunities.
              </p>
            </FadeIn>

            <FadeIn delay={0.55}>
              <div className="ref-actions-row">
                <Link className="ref-btn-primary" href="/incubation">
                  Explore Programs
                  <ArrowRight size={16} />
                </Link>
                <Link className="ref-btn-secondary" href="/register">
                  For Startups
                  <ArrowRight size={16} />
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Right Hero Collage: 6 Angled Image Panels */}
          <FadeIn delay={0.3}>
            <div className="ref-angled-grid" aria-label="CIEL Innovation Collage">
              {ANGLED_PANELS.map((p) => (
                <AngledImagePanel key={p.id} id={p.id} src={p.src} />
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Bottom Row: Left 4 Features & Right KPI Card */}
        <div className="ref-bottom-row" style={{ position: "relative", zIndex: 1 }}>
          {/* 4 Feature Items */}
          <StaggerContainer className="ref-proof-features">
            <StaggerItem className="ref-feature-item">
              <div className="ref-feature-icon"><Users size={20} /></div>
              <span className="ref-feature-text">Student First Ecosystem</span>
            </StaggerItem>

            <StaggerItem className="ref-feature-item">
              <div className="ref-feature-icon"><Lightbulb size={20} /></div>
              <span className="ref-feature-text">Mentorship &amp; Expert Guidance</span>
            </StaggerItem>

            <StaggerItem className="ref-feature-item">
              <div className="ref-feature-icon"><Rocket size={20} /></div>
              <span className="ref-feature-text">From Idea to Impact</span>
            </StaggerItem>

            <StaggerItem className="ref-feature-item">
              <div className="ref-feature-icon"><Building2 size={20} /></div>
              <span className="ref-feature-text">Industry Partnerships</span>
            </StaggerItem>
          </StaggerContainer>

          {/* Right KPI Card */}
          <ScaleIn delay={0.4}>
            <div className="ref-kpi-card">
              <div className="ref-kpi-item">
                <div style={{ marginBottom: 6 }}><Users size={18} className="text-gold" /></div>
                <div className="ref-kpi-num">
                  <CounterAnimation value="~200" />
                </div>
                <div className="ref-kpi-label">Student Council Members</div>
              </div>

              <div className="ref-kpi-item">
                <div style={{ marginBottom: 6 }}><Rocket size={18} className="text-gold" /></div>
                <div className="ref-kpi-num">
                  <CounterAnimation value="10–12" />
                </div>
                <div className="ref-kpi-label">Startups Registered</div>
              </div>

              <div className="ref-kpi-item">
                <div style={{ marginBottom: 6 }}><Building2 size={18} className="text-gold" /></div>
                <div className="ref-kpi-num">
                  <CounterAnimation value="3–5" />
                </div>
                <div className="ref-kpi-label">Industry Partners</div>
              </div>

              <div className="ref-kpi-item">
                <div style={{ marginBottom: 6 }}><Trophy size={18} className="text-gold" /></div>
                <div className="ref-kpi-num">
                  <CounterAnimation value="∞" />
                </div>
                <div className="ref-kpi-label">Infinite Possibilities</div>
              </div>
            </div>
          </ScaleIn>
        </div>
      </section>

      {/* 2. VISION & MISSION SECTION */}
      <section className="shell page-section">
        <FadeIn>
          <div className="section-heading">
            <span className="eyebrow">
              <Compass size={14} className="text-gold" />
              Institutional Purpose
            </span>
            <h2>Vision &amp; Strategic Mission</h2>
            <p>Building an institutional bridge between academic research, student creativity, and industrial venture scale.</p>
          </div>
        </FadeIn>

        <div className="grid-2">
          <ScaleIn delay={0.1}>
            <article className="luxury-card">
              <div className="card-icon-wrap">
                <Compass size={28} />
              </div>
              <h3>Our Vision</h3>
              <p>
                To be a premier hub for nurturing an innovative mindset and entrepreneurial talents to produce significant, long-term solutions to global challenges.
              </p>
            </article>
          </ScaleIn>

          <ScaleIn delay={0.25}>
            <article className="luxury-card">
              <div className="card-icon-wrap">
                <Target size={28} />
              </div>
              <h3>Our Mission</h3>
              <p>
                Cultivating an ecosystem that allows individuals to translate ideas into significant initiatives through experiential learning, interdisciplinary collaboration, and strategic partnerships to generate long-term economic and social growth.
              </p>
            </article>
          </ScaleIn>
        </div>
      </section>

      {/* 3. ABOUT CIEL SECTION */}
      <section className="page-section" style={{ borderTop: "1px solid rgba(212, 175, 55, 0.15)", borderBottom: "1px solid rgba(212, 175, 55, 0.15)" }}>
        <div className="shell">
          <div className="grid-2" style={{ alignItems: "center" }}>
            <FadeIn>
              <span className="eyebrow">
                <Building2 size={14} className="text-gold" />
                Chetana Institute Ecosystem
              </span>
              <h2 style={{ fontSize: 32, margin: "14px 0 18px", fontFamily: "var(--font-serif-family)" }}>
                Centre for Innovation &amp; Entrepreneurship Learning
              </h2>
              <p style={{ fontSize: 15.5, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 24 }}>
                CIEL operates as an integrated institutional hub combining academic rigour with commercial venture building. We nurture multidisciplinary innovation across technology, healthcare, clean energy, social impact, and advanced manufacturing.
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Link className="button button-primary" href="/about">
                  Learn About CIEL <ArrowRight size={16} />
                </Link>
                <Link className="button button-secondary" href="/governance">
                  Governance Board
                </Link>
              </div>
            </FadeIn>

            <FadeIn>
              <div className="ecosystem-pillars-card">
                <div className="pillar-item">
                  <div className="pillar-icon">
                    <Presentation size={20} />
                  </div>
                  <div>
                    <h3 className="pillar-title">Business Upscaling Seminars</h3>
                    <p className="pillar-desc">Seminars on starting an idea from scratch, founder workshops, and business scaling.</p>
                  </div>
                </div>

                <div className="pillar-item">
                  <div className="pillar-icon">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h3 className="pillar-title">Tech Lab</h3>
                    <p className="pillar-desc">Dedicated technology laboratory and compute workspace for digital and software solutions.</p>
                  </div>
                </div>

                <div className="pillar-item">
                  <div className="pillar-icon">
                    <Tv size={20} />
                  </div>
                  <div>
                    <h3 className="pillar-title">Conference Room with Projector</h3>
                    <p className="pillar-desc">Professional discussion room equipped with projector for brainstorming and pitch sessions.</p>
                  </div>
                </div>

                <div className="pillar-item">
                  <div className="pillar-icon">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="pillar-title">Wide Mentor Support &amp; Network</h3>
                    <p className="pillar-desc">Direct access to seasoned industry leaders, alumni entrepreneurs, and founder guidance.</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 4. THREE CORE WINGS SECTION WITH INTERACTIVE SELECTOR */}
      <section className="shell page-section">
        <FadeIn>
          <div className="section-heading">
            <span className="eyebrow">
              <Layers size={14} className="text-gold" />
              Ecosystem Architecture
            </span>
            <h2>Three Core Innovation Wings</h2>
            <p>Specialized verticals supporting founders from early campus concept to venture scale.</p>
          </div>
        </FadeIn>

        {/* Tab Controls */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
          <button
            className={`button ${activeWing === "incubation" ? "button-primary" : "button-secondary"}`}
            onClick={() => setActiveWing("incubation")}
          >
            <Lightbulb size={16} /> Incubation Cell
          </button>
          <button
            className={`button ${activeWing === "accelerator" ? "button-primary" : "button-secondary"}`}
            onClick={() => setActiveWing("accelerator")}
          >
            <Rocket size={16} /> Startup Accelerator
          </button>
          <button
            className={`button ${activeWing === "impact" ? "button-primary" : "button-secondary"}`}
            onClick={() => setActiveWing("impact")}
          >
            <Heart size={16} /> Social Impact &amp; Rural
          </button>
        </div>

        {/* Tab Panels */}
        <ScaleIn key={activeWing}>
          {activeWing === "incubation" && (
            <article className="luxury-card" style={{ padding: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div className="card-icon-wrap" style={{ margin: 0 }}>
                  <Lightbulb size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: 26, margin: 0 }}>CIEL Incubation Cell</h3>
                  <span style={{ fontSize: 13.5, color: "var(--ciel-gold-bright)" }}>Idea to Prototype Validation</span>
                </div>
              </div>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 24 }}>
                Supports student founders and research teams with business upscaling seminars, tech lab facilities, projector-equipped conference rooms for pitch discussions, and an active mentor network.
              </p>
              <div className="grid-3" style={{ marginBottom: 24 }}>
                <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 8, border: "1px solid var(--line)" }}>
                  <strong style={{ color: "var(--text-white)", display: "block", marginBottom: 4 }}>Ideation &amp; Growth Seminars</strong>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Starting ideas from scratch &amp; scaling</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 8, border: "1px solid var(--line)" }}>
                  <strong style={{ color: "var(--text-white)", display: "block", marginBottom: 4 }}>Tech Lab &amp; Conference Room</strong>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Tech workspace &amp; projector pitch room</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 8, border: "1px solid var(--line)" }}>
                  <strong style={{ color: "var(--text-white)", display: "block", marginBottom: 4 }}>Wide Mentor Support</strong>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>1-on-1 industry network &amp; guidance</span>
                </div>
              </div>
              <Link className="button button-primary" href="/incubation">
                Explore Incubation Program <ArrowRight size={16} />
              </Link>
            </article>
          )}

          {activeWing === "accelerator" && (
            <article className="luxury-card" style={{ padding: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div className="card-icon-wrap" style={{ margin: 0 }}>
                  <Rocket size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: 26, margin: 0 }}>CIEL Startup Accelerator</h3>
                  <span style={{ fontSize: 13.5, color: "var(--ciel-gold-bright)" }}>MVP to Enterprise Scale</span>
                </div>
              </div>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 24 }}>
                Accelerates growth-stage ventures like 24 Organic Mantra, DryGrab, GD, Summit Roof Cleaning, Byte Elephants, and Lets Balance Kitchen with business scaling diagnostics, tech lab access, and industry mentor networks.
              </p>
              <div className="grid-3" style={{ marginBottom: 24 }}>
                <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 8, border: "1px solid var(--line)" }}>
                  <strong style={{ color: "var(--text-white)", display: "block", marginBottom: 4 }}>Business Diagnostics</strong>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Unit economics &amp; scaling models</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 8, border: "1px solid var(--line)" }}>
                  <strong style={{ color: "var(--text-white)", display: "block", marginBottom: 4 }}>Tech Lab &amp; Pitches</strong>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Projector rooms for strategy</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 8, border: "1px solid var(--line)" }}>
                  <strong style={{ color: "var(--text-white)", display: "block", marginBottom: 4 }}>Enterprise Network</strong>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>1-on-1 industry mentorship</span>
                </div>
              </div>
              <Link className="button button-primary" href="/accelerator">
                Explore Accelerator Cohort <ArrowRight size={16} />
              </Link>
            </article>
          )}

          {activeWing === "impact" && (
            <article className="luxury-card" style={{ padding: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div className="card-icon-wrap" style={{ margin: 0 }}>
                  <Heart size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: 26, margin: 0 }}>Social Entrepreneurship &amp; Women Empowerment</h3>
                  <span style={{ fontSize: 13.5, color: "var(--ciel-gold-bright)" }}>Empowering Women Founders &amp; Artisans</span>
                </div>
              </div>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 24 }}>
                Empowering women through our flagship Yearly Women Entrepreneur Summit, hands-on jewellery making training to start independent businesses, festive Diwali Mela marketplace, and sustainable packaging workshops.
              </p>
              <div className="grid-3" style={{ marginBottom: 24 }}>
                <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 8, border: "1px solid var(--line)" }}>
                  <strong style={{ color: "var(--text-white)", display: "block", marginBottom: 4 }}>Women Entrepreneur Summit</strong>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Yearly flagship conference &amp; leadership</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 8, border: "1px solid var(--line)" }}>
                  <strong style={{ color: "var(--text-white)", display: "block", marginBottom: 4 }}>Jewellery Making &amp; Diwali Mela</strong>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Craft training &amp; festive sales stalls</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 8, border: "1px solid var(--line)" }}>
                  <strong style={{ color: "var(--text-white)", display: "block", marginBottom: 4 }}>Sustainable Packaging</strong>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Eco-friendly packaging &amp; skill workshops</span>
                </div>
              </div>
              <Link className="button button-primary" href="/social-impact">
                Explore Social Entrepreneurship <ArrowRight size={16} />
              </Link>
            </article>
          )}
        </ScaleIn>
      </section>

      {/* 5. INNOVATION JOURNEY ROADMAP */}
      <section className="page-section pathway-section">
        <div className="shell" style={{ position: "relative", zIndex: 2 }}>
          <FadeIn>
            <div className="section-heading">
              <span className="eyebrow">
                <LineChart size={14} className="text-gold" />
                Venture Development Pathway
              </span>
              <h2>The CIEL Innovation Journey</h2>
              <p>A systematic stage-gated roadmap guiding student innovators and founders from idea to commercial scale.</p>
            </div>
          </FadeIn>

          <div className="timeline-wrap">
            <div className="timeline-line" />
            <div className="timeline-steps">
              <div className="timeline-step">
                <div className="timeline-step-icon">
                  <Lightbulb size={22} />
                </div>
                <div className="step-num">Step 01</div>
                <div className="step-title">Ideation from Scratch</div>
                <div className="step-desc">Seminars on starting ideas &amp; problem validation</div>
              </div>

              <div className="timeline-step">
                <div className="timeline-step-icon">
                  <Cpu size={22} />
                </div>
                <div className="step-num">Step 02</div>
                <div className="step-title">Tech Lab Build</div>
                <div className="step-desc">Tech Lab workstations &amp; development computing</div>
              </div>

              <div className="timeline-step">
                <div className="timeline-step-icon">
                  <Tv size={22} />
                </div>
                <div className="step-num">Step 03</div>
                <div className="step-title">Projector Pitches</div>
                <div className="step-desc">Conference room reviews with projectors</div>
              </div>

              <div className="timeline-step">
                <div className="timeline-step-icon">
                  <TrendingUp size={22} />
                </div>
                <div className="step-num">Step 04</div>
                <div className="step-title">Business Upscaling</div>
                <div className="step-desc">Constant seminars on scaling and unit economics</div>
              </div>

              <div className="timeline-step">
                <div className="timeline-step-icon">
                  <Users size={22} />
                </div>
                <div className="step-num">Step 05</div>
                <div className="step-title">Incubation Cell</div>
                <div className="step-desc">1-on-1 mentor guidance &amp; ~200 council support</div>
              </div>

              <div className="timeline-step">
                <div className="timeline-step-icon">
                  <Rocket size={22} />
                </div>
                <div className="step-num">Step 06</div>
                <div className="step-title">Startup Accelerator</div>
                <div className="step-desc">Accelerated cohort pilots &amp; market expansion</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURED STARTUPS & PORTFOLIO */}
      <section className="shell page-section">
        <FadeIn>
          <div className="section-heading">
            <span className="eyebrow">
              <Trophy size={14} className="text-gold" />
              Portfolio Excellence
            </span>
            <h2>Featured Incubated Ventures</h2>
            <p>Highlighting breakthrough technology enterprises developed at CIEL.</p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid-2" style={{ marginBottom: 36, gap: 20 }}>
          {FEATURED_STARTUPS.slice(0, 4).map((st) => (
            <StaggerItem key={st.id} className="luxury-card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span className="badge badge-brand">{st.sector}</span>
                <span className="badge badge-neutral" style={{ textTransform: "capitalize" }}>Stage: {st.stage}</span>
              </div>
              <h3 style={{ fontSize: 22, marginBottom: 6 }}>{st.name}</h3>
              <p style={{ fontSize: 13.5, color: "var(--text-secondary)", marginBottom: 16 }}>
                {st.description}
              </p>
              <div style={{ fontSize: 13, color: "var(--ciel-gold-bright)", fontWeight: 600 }}>
                Status: {st.fundingRaised}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div style={{ textAlign: "center" }}>
          <Link className="button button-secondary" href="/showcase">
            View Complete Startup Portfolio <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 7. TESTIMONIALS CAROUSEL SECTION */}
      <section className="shell page-section">
        <FadeIn>
          <div className="section-heading">
            <span className="eyebrow">
              <Quote size={14} className="text-gold" />
              Founder Voices
            </span>
            <h2>What Our Innovators Say</h2>
            <p>Endorsements from student founders, faculty researchers, and council leads.</p>
          </div>
        </FadeIn>

        <ScaleIn key={testimonialIdx} style={{ maxWidth: 840, margin: "0 auto 36px" }}>
          <article className="luxury-card" style={{ padding: 48, textAlign: "center", position: "relative" }}>
            <Quote size={40} style={{ color: "var(--ciel-gold)", opacity: 0.3, margin: "0 auto 16px" }} />
            <p style={{ fontSize: 17, color: "var(--text-white)", lineHeight: 1.7, fontStyle: "italic", marginBottom: 24 }}>
              &ldquo;{TESTIMONIALS[testimonialIdx].quote}&rdquo;
            </p>
            <strong style={{ display: "block", fontSize: 18, color: "var(--ciel-gold-bright)" }}>
              {TESTIMONIALS[testimonialIdx].author}
            </strong>
            <span style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
              {TESTIMONIALS[testimonialIdx].role}
            </span>
          </article>
        </ScaleIn>

        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          {TESTIMONIALS.map((t, idx) => (
            <button
              key={t.author}
              onClick={() => setTestimonialIdx(idx)}
              style={{
                width: idx === testimonialIdx ? 32 : 12,
                height: 12,
                borderRadius: 6,
                background: idx === testimonialIdx ? "var(--ciel-gold)" : "var(--line)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              aria-label={`Testimonial slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 8. CALL TO ACTION SECTION */}
      <section className="shell page-section">
        <FadeIn>
          <div className="status-card" style={{ maxWidth: "100%", padding: "64px 40px", textAlign: "center" }}>
            <h2>Begin Your Venture Journey at CIEL</h2>
            <p style={{ maxWidth: 640, margin: "16px auto 32px", fontSize: 16 }}>
              Join the Centre for Innovation &amp; Entrepreneurship Learning. Submit your application for seed grants, prototyping lab access, legal support, and mentor advisory.
            </p>
            <div className="inline-actions" style={{ justifyContent: "center" }}>
              <Link className="ref-btn-primary" href="/register">
                Apply for Incubation
                <ArrowRight size={18} />
              </Link>
              <Link className="ref-btn-secondary" href="/downloads">
                Download Policy Handbook
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
