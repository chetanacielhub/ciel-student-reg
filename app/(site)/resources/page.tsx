import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileText, ShieldCheck } from "lucide-react";
import { CIEL_DOWNLOADS } from "@/lib/ciel-data";

export const metadata: Metadata = {
  title: "Resources & IP Policies | CIEL",
  description:
    "Institutional resource repository, legal templates, and patent policy documentation.",
};

export default function ResourcesPage() {
  return (
    <div className="shell page-section">
      <div className="section-heading">
        <span className="eyebrow">
          <FileText size={14} className="text-gold" />
          Institutional Policies
        </span>
        <h1 style={{ marginTop: 16 }}>Policy &amp; Resource Repository</h1>
        <p>
          Official guidelines regarding equity allocation, seed grant disbursal, patent ownership, and student founder agreements.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 64 }}>
        {CIEL_DOWNLOADS.map((doc) => (
          <article className="luxury-card" key={doc.id} style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <span className="badge badge-brand" style={{ marginBottom: 6 }}>{doc.category}</span>
                <h3 style={{ fontSize: 18, margin: "4px 0" }}>{doc.title}</h3>
                <p style={{ fontSize: 13.5, color: "var(--text-secondary)", margin: 0 }}>{doc.description}</p>
              </div>
              <Link className="button button-primary button-small" href="/downloads">
                <Download size={14} /> Download {doc.format}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
