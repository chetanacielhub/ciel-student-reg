import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, MapPin, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Incubation Events & Hackathons | CIEL",
  description:
    "Upcoming hackathons, ideation workshops, mentor office hours, and Demo Days at CIEL Innovation Hub.",
};

const UPCOMING_EVENTS = [
  {
    id: "ev-1",
    title: "CIEL Annual Innovation Hackathon 2026",
    category: "Hackathon",
    date: "March 15-16, 2026",
    time: "36-Hour Hackathon",
    venue: "CIEL Prototyping Labs & Makerspace",
    desc: "Join 500+ student coders, hardware builders, and designers competing for ₹2.5 Lakhs in seed grants and incubation slots.",
  },
  {
    id: "ev-2",
    title: "IPR & Patent Disclosure Workshop",
    category: "Workshop",
    date: "April 02, 2026",
    time: "02:00 PM - 05:00 PM",
    venue: "Auditorium & Virtual Stream",
    desc: "Master prior art searching, provisional patent drafting, and university IP ownership terms led by senior patent attorneys.",
  },
  {
    id: "ev-3",
    title: "Investor Demo Day & Venture Syndicate",
    category: "Demo Day",
    date: "April 28, 2026",
    time: "10:00 AM - 04:00 PM",
    venue: "Grand Executive Hall",
    desc: "Graduating cohort startups present before 25+ angel investors, VC partners, and corporate pilot evaluators.",
  },
];

export default function EventsPage() {
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
        {UPCOMING_EVENTS.map((ev) => (
          <article className="event-card" key={ev.id}>
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
