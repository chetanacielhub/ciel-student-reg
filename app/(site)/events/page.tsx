import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, CalendarPlus, Clock, MapPin } from "lucide-react";
import { getCielEvents } from "@/lib/dynamic-store";

export const metadata: Metadata = {
  title: "Incubation Events & Hackathons | CIEL",
  description:
    "Upcoming hackathons, ideation workshops, mentor office hours, and Demo Days at CIEL Innovation Hub.",
};

export const dynamic = "force-dynamic";

function formatEventDate(dateStr: string): string {
  if (!dateStr) return "Upcoming";
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
    }
  } catch {
    // fallback
  }
  return dateStr;
}

function formatEventTime(timeStr: string): string {
  if (!timeStr) return "";
  try {
    return timeStr.replace(/(\b\d{1,2}:\d{2}\b)/g, (match) => {
      const [h, m] = match.split(":").map(Number);
      if (isNaN(h) || isNaN(m)) return match;
      const period = h >= 12 ? "PM" : "AM";
      const hour12 = h % 12 || 12;
      const padHour = String(hour12).padStart(2, "0");
      const padMin = String(m).padStart(2, "0");
      return `${padHour}:${padMin} ${period}`;
    });
  } catch {
    return timeStr;
  }
}

function getGoogleCalendarUrl(ev: {
  title: string;
  category?: string;
  date: string;
  time?: string;
  venue?: string;
  desc?: string;
}): string {
  const baseUrl = "https://calendar.google.com/calendar/render";
  const params = new URLSearchParams();
  params.set("action", "TEMPLATE");
  params.set("text", ev.title || "CIEL Event");

  const details = [
    ev.category ? `Category: ${ev.category}` : "",
    ev.desc ? ev.desc : "",
    "Organized by CIEL - Center for Innovation & Entrepreneurship Learning, Chetana Campus.",
  ]
    .filter(Boolean)
    .join("\n\n");
  params.set("details", details);

  if (ev.venue) {
    params.set("location", ev.venue);
  } else {
    params.set("location", "CIEL Innovation Hub, Chetana Campus");
  }

  // Parse Date into YYYYMMDD
  let dateFormatted = "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(ev.date)) {
    dateFormatted = ev.date.replace(/-/g, "");
  } else {
    try {
      const parsed = new Date(ev.date);
      if (!isNaN(parsed.getTime())) {
        dateFormatted = parsed.toISOString().slice(0, 10).replace(/-/g, "");
      }
    } catch {
      dateFormatted = "";
    }
  }

  if (dateFormatted) {
    // Extract times if available
    const timeMatches = (ev.time || "").match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/gi);
    if (timeMatches && timeMatches.length > 0) {
      const parseTimeTo24h = (tStr: string) => {
        const m = tStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (!m) return "090000";
        let hours = parseInt(m[1], 10);
        const mins = String(parseInt(m[2], 10)).padStart(2, "0");
        const meridiem = (m[3] || "").toUpperCase();
        if (meridiem === "PM" && hours < 12) hours += 12;
        if (meridiem === "AM" && hours === 12) hours = 0;
        return `${String(hours).padStart(2, "0")}${mins}00`;
      };

      const startTimeStr = parseTimeTo24h(timeMatches[0]);
      let endTimeStr = timeMatches.length > 1 ? parseTimeTo24h(timeMatches[1]) : "";
      if (!endTimeStr) {
        const startH = parseInt(startTimeStr.slice(0, 2), 10);
        const endH = Math.min(23, startH + 1);
        endTimeStr = `${String(endH).padStart(2, "0")}${startTimeStr.slice(2)}`;
      }

      params.set("dates", `${dateFormatted}T${startTimeStr}/${dateFormatted}T${endTimeStr}`);
      params.set("ctz", "Asia/Kolkata");
    } else {
      // All-day event
      const year = parseInt(dateFormatted.slice(0, 4), 10);
      const month = parseInt(dateFormatted.slice(4, 6), 10) - 1;
      const day = parseInt(dateFormatted.slice(6, 8), 10);
      const nextDay = new Date(year, month, day + 1);
      const nextDayStr = `${nextDay.getFullYear()}${String(nextDay.getMonth() + 1).padStart(2, "0")}${String(nextDay.getDate()).padStart(2, "0")}`;
      params.set("dates", `${dateFormatted}/${nextDayStr}`);
    }
  }

  return `${baseUrl}?${params.toString()}`;
}

export default async function EventsPage() {
  const events = await getCielEvents();

  return (
    <div className="shell page-section">
      <div className="section-heading">
        <div className="section-heading-row">
          <span className="eyebrow">
            <Calendar size={14} className="text-gold" />
            Campus Calendar
          </span>
          <h1>Events &amp; Hackathons</h1>
        </div>
        <p>
          Participate in business ideathons, hardware prototyping bootcamps, IP masterclasses, and investor Demo Days.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 64 }}>
        {events.length === 0 ? (
          <div className="luxury-card" style={{ textAlign: "center", padding: "48px 24px" }}>
            <Calendar size={36} className="text-gold" style={{ margin: "0 auto 16px", opacity: 0.8 }} />
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>No Upcoming Events Scheduled Yet</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              Check back soon for new hackathons, startup bootcamps, and investor demo days.
            </p>
          </div>
        ) : (
          events.map((ev) => (
            <article className="event-card" key={ev.id}>
              {ev.posterUrl ? (
                <div style={{ marginBottom: 20, borderRadius: 12, overflow: "hidden", maxHeight: 340, backgroundColor: "var(--paper-muted)" }}>
                  <img
                    src={ev.posterUrl}
                    alt={ev.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
              ) : null}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <span className="badge badge-brand" style={{ marginBottom: 8, textTransform: "uppercase", fontSize: 11 }}>
                    {ev.category}
                  </span>
                  <h2 style={{ fontSize: 24, margin: "4px 0 8px", fontWeight: 700 }}>
                    {ev.title}
                  </h2>
                </div>
                <span className="badge badge-neutral" style={{ fontSize: 13, padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Calendar size={14} className="text-gold" /> {formatEventDate(ev.date)}
                </span>
              </div>

              {ev.desc ? (
                <p className="event-card-description">{ev.desc}</p>
              ) : null}

              <div className="event-meta" style={{ marginTop: 16 }}>
                {ev.time ? (
                  <div className="event-meta-row">
                    <Clock size={16} className="text-gold" /> <span>{formatEventTime(ev.time)}</span>
                  </div>
                ) : null}
                {ev.venue ? (
                  <div className="event-meta-row">
                    <MapPin size={16} className="text-gold" /> <span>{ev.venue}</span>
                  </div>
                ) : null}
              </div>

              <div style={{ marginTop: 24 }}>
                <a
                  className="button button-primary"
                  href={getGoogleCalendarUrl(ev)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
                >
                  <CalendarPlus size={18} />
                  <span>Add Event to Google Calendar</span>
                </a>
              </div>
            </article>
          ))
        )}
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
