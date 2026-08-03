import type { Metadata } from "next";
import Link from "next/link";
import { CalendarX2 } from "lucide-react";
import { redirect } from "next/navigation";
import {
  RegistrationForm,
  RegistrationHelp,
} from "@/components/registration/registration-form";
import { requireUser } from "@/lib/auth";
import { EVENT_SLUG } from "@/lib/config";
import type { ClassOption, EventRecord, Institution } from "@/lib/types";

export const metadata: Metadata = {
  title: "Incubation & Venture Application | CIEL",
  description: "Apply for CIEL incubation, seed funding up to ₹5 Lakhs, prototyping labs, patent filing support, and venture mentorship.",
};

export default async function ApplyPage() {
  const { supabase, user } = await requireUser("/apply");

  const [eventResult, institutionsResult, classesResult] = await Promise.all([
    supabase
      .from("events")
      .select("id,slug,title,description,venue,starts_at,registration_open")
      .eq("slug", EVENT_SLUG)
      .maybeSingle(),
    supabase
      .from("institutions")
      .select("id,code,name")
      .eq("active", true)
      .order("name"),
    supabase
      .from("classes")
      .select("id,institution_id,name,sort_order")
      .eq("active", true)
      .order("sort_order")
      .order("name"),
  ]);

  const event = eventResult.data as EventRecord | null;

  if (!event) {
    return (
      <div className="shell center-page">
        <section className="status-card">
          <div className="status-icon">
            <CalendarX2 size={30} aria-hidden="true" />
          </div>
          <h1>Event not configured</h1>
          <p>
            Run the Supabase seed file or update NEXT_PUBLIC_EVENT_SLUG so it
            matches an event in the database.
          </p>
          <div className="inline-actions">
            <Link className="button button-secondary" href="/">
              Back to home
            </Link>
          </div>
        </section>
      </div>
    );
  }

  if (!event.registration_open) {
    return (
      <div className="shell center-page">
        <section className="status-card">
          <div className="status-icon">
            <CalendarX2 size={30} aria-hidden="true" />
          </div>
          <h1>Applications Closed</h1>
          <p>The administrator has closed new incubation applications for {event.title}.</p>
          <div className="inline-actions">
            <Link className="button button-secondary" href="/dashboard">
              Open User Portal
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const { data: existing } = await supabase
    .from("event_registrations")
    .select("id")
    .eq("event_id", event.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) redirect("/dashboard");

  return (
    <div className="shell page-section">
      <div className="form-layout" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 36, alignItems: "start" }}>
        <RegistrationForm
          eventSlug={event.slug}
          eventTitle={event.title}
          institutions={(institutionsResult.data ?? []) as Institution[]}
          classes={(classesResult.data ?? []) as ClassOption[]}
        />
        <RegistrationHelp />
      </div>
    </div>
  );
}
