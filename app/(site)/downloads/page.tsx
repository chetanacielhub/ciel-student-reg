"use client";

import Link from "next/link";
import { Download, FileText, FolderDown } from "lucide-react";
import { CIEL_DOWNLOADS } from "@/lib/ciel-data";

export default function DownloadsPage() {
  return (
    <div className="shell page-section">
      <div className="section-heading">
        <span className="eyebrow">
          <FolderDown size={14} className="text-gold" />
          Institutional Repository
        </span>
        <h1 style={{ marginTop: 16 }}>Downloads &amp; Policy Manuals</h1>
        <p>
          Access verified policy handbooks, IP disclosure guidelines, incubation agreements, and pitch deck templates.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 64 }}>
        {CIEL_DOWNLOADS.map((doc) => (
          <article
            key={doc.id}
            className="luxury-card"
            style={{
              padding: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 18, flex: 1, minWidth: 280 }}>
              <div className="card-icon-wrap" style={{ width: 48, height: 48, marginBottom: 0 }}>
                <FileText size={24} />
              </div>
              <div>
                <span className="badge badge-brand" style={{ marginBottom: 6, textTransform: "uppercase", fontSize: 11 }}>
                  {doc.category}
                </span>
                <h3 style={{ fontSize: 18, margin: "2px 0 6px" }}>{doc.title}</h3>
                <p style={{ fontSize: 13.5, color: "var(--text-secondary)", margin: 0 }}>
                  {doc.description}
                </p>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
                  Format: {doc.format} · Size: {doc.fileSize} · Updated: {doc.updatedAt}
                </div>
              </div>
            </div>

            <button
              className="button button-primary button-small"
              type="button"
              onClick={() => {
                alert(`Downloading ${doc.title} (${doc.format})`);
              }}
            >
              <Download size={15} /> Download {doc.format}
            </button>
          </article>
        ))}
      </div>

      <div className="status-card" style={{ maxWidth: "100%", textAlign: "center" }}>
        <h2>Need Customized IP or Incubation Guidance?</h2>
        <p style={{ maxWidth: 540, margin: "12px auto 24px" }}>
          Contact our legal and IPR team for assistance with prior art searches and university startup agreements.
        </p>
        <Link className="button button-secondary" href="/contact">
          Contact IPR &amp; Compliance Cell
        </Link>
      </div>
    </div>
  );
}
