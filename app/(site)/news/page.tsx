import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Newspaper, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Incubation News & Announcements | CIEL",
  description:
    "Latest news, patent grants, funding disbursements, and press announcements from CIEL Innovation Hub.",
};

const NEWS_ITEMS = [
  {
    id: "n-1",
    title: "CIEL Incubated Startup AgriTech Dynamics Secures ₹25 Lakhs Seed Grant",
    date: "February 01, 2026",
    category: "Funding Disbursement",
    summary: "The student-led IoT farming startup successfully completed Stage 2 evaluation and secured seed support for field deployment.",
  },
  {
    id: "n-2",
    title: "Chetana Institute Inks MoU with National Research Development Corporation",
    date: "January 18, 2026",
    category: "Strategic Partnership",
    summary: "New partnership facilitates joint technology transfer, patent commercialization, and prior art database access for student inventors.",
  },
  {
    id: "n-3",
    title: "CIEL Prototyping Cell Adds High-Precision 3D Printers & IoT Testbench",
    date: "December 14, 2025",
    category: "Infrastructure",
    summary: "Expanded makerspace capacity enables simultaneous hardware prototyping for over 30 incubated teams.",
  },
];

export default function NewsPage() {
  return (
    <div className="shell page-section">
      <div className="section-heading">
        <span className="eyebrow">
          <Newspaper size={14} className="text-gold" />
          Media &amp; Bulletins
        </span>
        <h1 style={{ marginTop: 16 }}>Incubation News &amp; Updates</h1>
        <p>
          Stay informed about patent grants, seed funding disbursements, corporate partnerships, and ecosystem milestones.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: 64 }}>
        {NEWS_ITEMS.map((item) => (
          <article className="luxury-card" key={item.id}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span className="badge badge-brand">{item.category}</span>
              <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{item.date}</span>
            </div>
            <h3 style={{ fontSize: 20, marginBottom: 10 }}>{item.title}</h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
              {item.summary}
            </p>
            <Link className="button button-ghost" href="/contact">
              Read Announcement <ArrowRight size={14} />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
