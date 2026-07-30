import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  UserRound,
  UsersRound,
  Zap,
} from "lucide-react";
import { EVENT_SLUG } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { EventRecord } from "@/lib/types";

function formatEventDate(value: string | null) {
  if (!value) return "Date will be announced";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("id,slug,title,description,venue,starts_at,registration_open")
    .eq("slug", EVENT_SLUG)
    .maybeSingle();

  const event = data as EventRecord | null;

  return (
    <>
      <section className="shell hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Zap size={14} aria-hidden="true" />
            One account. One clear registration flow.
          </span>
          <h1>
            Build your team. <span>Register without confusion.</span>
          </h1>
          <p>
            Create a secure account, select your institution and class, then
            register as a team leader, team member, or solo participant. Your
            shared team dashboard is created automatically.
          </p>

          <div className="hero-actions">
            <Link className="button button-primary" href="/auth/sign-up">
              Start registration
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button button-secondary" href="/auth/sign-in">
              I already have an account
            </Link>
          </div>

          <div className="hero-proof" aria-label="Platform benefits">
            <span className="proof-item">
              <span className="proof-dot" />
              Secure Supabase authentication
            </span>
            <span className="proof-item">
              <span className="proof-dot" />
              Exact team-name validation
            </span>
            <span className="proof-item">
              <span className="proof-dot" />
              Shared team profile
            </span>
          </div>
        </div>

        <aside className="event-card" aria-label="Current event">
          <div className="event-card-inner">
            <div className="event-card-top">
              <span className="live-pill">
                <span className="live-dot" />
                {event?.registration_open === false
                  ? "Registration closed"
                  : "Registration open"}
              </span>
              <ShieldCheck size={22} aria-hidden="true" />
            </div>

            <h2>{event?.title ?? "Innovation Challenge 2026"}</h2>
            <p className="event-card-description">
              {event?.description ??
                "Team and solo registrations for the upcoming innovation event."}
            </p>

            <div className="event-meta">
              <div className="event-meta-row">
                <CalendarDays size={18} aria-hidden="true" />
                <span>{formatEventDate(event?.starts_at ?? null)}</span>
              </div>
              <div className="event-meta-row">
                <MapPin size={18} aria-hidden="true" />
                <span>{event?.venue ?? "Venue will be announced"}</span>
              </div>
              <div className="event-meta-row">
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>
                  Leaders register first. Members then join using the exact team
                  name.
                </span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="shell role-strip" id="how-it-works">
        <article className="role-feature">
          <div className="role-feature-icon">
            <UsersRound size={21} aria-hidden="true" />
          </div>
          <h3>Register as team leader</h3>
          <p>
            Create the official team name and submit the problem your team will
            work on. Team members can join after this step.
          </p>
        </article>

        <article className="role-feature">
          <div className="role-feature-icon">
            <UserRound size={21} aria-hidden="true" />
          </div>
          <h3>Join as team member</h3>
          <p>
            Enter the team name exactly as your leader registered it. The form
            stops there and adds you to the shared team profile.
          </p>
        </article>

        <article className="role-feature">
          <div className="role-feature-icon">
            <Zap size={21} aria-hidden="true" />
          </div>
          <h3>Continue as solo</h3>
          <p>
            Register your project and problem independently. Your dashboard is
            created as a one-person team and can still be managed by admins.
          </p>
        </article>
      </section>
    </>
  );
}
