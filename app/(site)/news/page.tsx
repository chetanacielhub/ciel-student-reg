import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Newspaper, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Incubation News & Announcements | CIEL",
  description:
    "Latest news, patent grants, funding disbursements, and press announcements from CIEL Innovation Hub.",
};

import { getNewsItems } from "@/lib/dynamic-store";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const newsItems = await getNewsItems();

  return (
    <div className="shell page-section">
      <div className="section-heading">
        <div className="section-heading-row">
          <span className="eyebrow">
            <Newspaper size={14} className="text-gold" />
            Media &amp; Bulletins
          </span>
          <h1>Incubation News &amp; Updates</h1>
        </div>
        <p>
          Stay informed about patent grants, seed funding disbursements, corporate partnerships, and ecosystem milestones.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: 64 }}>
        {newsItems.map((item) => (
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
