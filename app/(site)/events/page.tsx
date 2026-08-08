import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, MapPin, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Incubation Events & Hackathons | CIEL",
  description:
    "Upcoming hackathons, ideation workshops, mentor office hours, and Demo Days at CIEL Innovation Hub.",
};

import { getCielEvents } from "@/lib/dynamic-store";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getCielEvents();

  return (
    <div className="shell page-section">
      <div className="section-heading">
        <span className="eyebrow">
          <Calendar size={14} className="text-gold" />
          Campus Calendar
        </span>
        <h1 style={{ marginTop: 16 }}>Events &amp; Hackathons</h1>
        <p>
          Participate in business ideathons, hardware prototyping bootcamps, IP masterclasses, and investor Demo Days.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 64 }}>
        {events.map((ev) => (
          <article className="event-card" key={ev.id}>
            {ev.posterUrl ? (
              <div style={{ marginBottom: 16, borderRadius: 12, overflow: "hidden", maxHeight: 320, backgroundColor: "#0F172A" }}>
                <img
                  src={ev.posterUrl}
                  alt={ev.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            ) : null}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
              <div>
                <span className="badge badge-brand" style={{ marginBottom: 6 }}>{ev.category}</span>
                <h2 style={{ fontSize: 22, margin: "4px 0" }}>{ev.title}</h2>
              </div>
              <span className="badge badge-neutral" style={{ fontSize: 13 }}>
                <Calendar size={14} style={{ marginRight: 4 }} /> {ev.date}
              </span>
            </div>

            <p className="event-card-description">{ev.desc}</p>

            <div className="event-meta" style={{ marginTop: 16 }}>
              <div className="event-meta-row">
                <Clock size={16} /> <span>{ev.time}</span>
              </div>
              <div className="event-meta-row">
                <MapPin size={16} /> <span>{ev.venue}</span>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <Link className="button button-primary" href="/register">
                Register for Event <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="status-card" style={{ maxWidth: "100%", textAlign: "center" }}>
        <h2>Host an Event at CIEL Innovation Hub</h2>
        <p style={{ maxWidth: 540, margin: "12px auto 24px" }}>
          Are you an industry partner or student council lead interested in hosting a technical bootcamp or challenge?
        </p>
        <Link className="button button-secondary" href="/contact">
          Inquire About Hosting
        </Link>
      </div>
    </div>
  );
}
