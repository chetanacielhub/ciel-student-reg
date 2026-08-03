import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Flame, ShieldCheck, Trophy, Zap } from "lucide-react";
import { EVENT_SLUG } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { EventRecord } from "@/lib/types";

export const metadata: Metadata = {
  title: "Innovation Challenges & Hackathons",
  description: "Hackathons, business plan competitions, and innovation bounties hosted by CIEL.",
};

export default async function ChallengesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("id,slug,title,description,venue,starts_at,registration_open")
    .eq("slug", EVENT_SLUG)
    .maybeSingle();

  const event = data as EventRecord | null;

  return (
    <section className="shell page-section">
      <div className="section-heading" style={{ textAlign: "left", maxWidth: "800px", margin: "0 0 60px" }}>
        <span className="eyebrow">
          <Flame size={14} className="text-gold" />
          Competitions & Sprints
        </span>
        <h1>Innovation Challenges & Hackathons</h1>
        <p style={{ fontSize: "18px" }}>
          Participate in national hackathons, multidisciplinary problem-solving challenges, and business plan competitions to win incubation slots and seed funding.
        </p>
      </div>

      {/* Featured Challenge (Integrated with Backend Active Event) */}
      <div className="luxury-card" style={{ marginBottom: "48px", padding: "40px", border: "1px solid var(--ciel-gold-hairline)" }}>
        <div className="live-pill" style={{ width: "fit-content", marginBottom: "16px" }}>
          Active Flagship Event
        </div>
        <h2 style={{ fontSize: "32px", marginBottom: "12px" }}>{event?.title ?? "CIEL Flagship Hackathon 2026"}</h2>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "24px", maxWidth: "700px" }}>
          {event?.description ?? "The premier student business plan and prototype competition. Form teams, solve industrial problems, and pitch to angel investors."}
        </p>
        <div style={{ display: "flex", gap: "24px", marginBottom: "32px", flexWrap: "wrap" }}>
          <div style={{ fontSize: "14px", color: "var(--text-primary)" }}>
            <span style={{ color: "var(--text-muted)", display: "block" }}>Venue</span>
            <strong>{event?.venue ?? "CIEL Auditorium"}</strong>
          </div>
          <div style={{ fontSize: "14px", color: "var(--text-primary)" }}>
            <span style={{ color: "var(--text-muted)", display: "block" }}>Status</span>
            <strong style={{ color: "var(--ciel-gold)" }}>{event?.registration_open === false ? "Closed" : "Registration Open"}</strong>
          </div>
        </div>
        <Link className="button button-primary button-large" href="/register">
          Apply for Incubation & Challenge
          <ArrowRight size={18} />
        </Link>
      </div>

      <h2 style={{ fontSize: "26px", marginBottom: "24px" }}>Upcoming & Past Challenges</h2>
      <div className="grid-3">
        <div className="luxury-card">
          <Trophy size={24} className="text-gold" style={{ marginBottom: 12 }} />
          <h3>AgriTech Grassroots Challenge</h3>
          <p>Innovate for smallholder farmers. Cash prizes worth ₹2 Lakhs + Incubation slot.</p>
        </div>

        <div className="luxury-card">
          <Zap size={24} className="text-gold" style={{ marginBottom: 12 }} />
          <h3>CleanEnergy Sprint 2026</h3>
          <p>Develop battery technology, solar optimization, or waste recycling prototypes.</p>
        </div>

        <div className="luxury-card">
          <Flame size={24} className="text-gold" style={{ marginBottom: 12 }} />
          <h3>AI for Healthcare Hackathon</h3>
          <p>Build diagnostic tools, telemedicine apps, and biomedical device software.</p>
        </div>
      </div>
    </section>
  );
}
