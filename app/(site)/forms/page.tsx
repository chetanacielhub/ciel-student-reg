"use client";

import { useEffect, useState } from "react";
import type { GoogleFormItem } from "@/lib/types";
import {
  FileSpreadsheet,
  ExternalLink,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  RefreshCw,
  Search,
  CheckCircle2,
  X,
  FileText,
} from "lucide-react";

export default function GoogleFormsPage() {
  const [forms, setForms] = useState<GoogleFormItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  // Initial load
  useEffect(() => {
    async function loadForms() {
      try {
        const res = await fetch("/api/google-forms");
        const data = await res.json();
        if (data.forms && Array.isArray(data.forms)) {
          setForms(data.forms);
          if (data.forms.length > 0) {
            setSelectedFormId(data.forms[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load forms:", err);
      } finally {
        setLoading(false);
      }
    }
    loadForms();
  }, []);

  const categories = ["All", ...Array.from(new Set(forms.map((f) => f.category || "General").filter(Boolean)))];

  const filteredForms = forms.filter((f) => {
    const matchesCategory = selectedCategory === "All" || (f.category || "General") === selectedCategory;
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const selectedForm = forms.find((f) => f.id === selectedFormId) || filteredForms[0] || null;

  const handleCopyLink = () => {
    if (!selectedForm) return;
    navigator.clipboard.writeText(selectedForm.formUrl || selectedForm.embedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="forms-minimal-page shell">
      {/* ─── MINIMAL HEADER ─────────────────────────────────────────────────── */}
      <div className="forms-minimal-header">
        <div>
          <h1 className="forms-title">Forms &amp; Surveys Hub</h1>
          <p className="forms-sub">Official CIEL Google Forms, application surveys, and questionnaires.</p>
        </div>
      </div>

      {/* ─── MAIN CONTENT ────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="loading-state">
          <RefreshCw size={24} className="animate-spin" />
          <p>Loading forms...</p>
        </div>
      ) : forms.length === 0 ? (
        <div className="empty-state card">
          <FileSpreadsheet size={40} style={{ opacity: 0.4 }} />
          <h3>No Active Forms</h3>
          <p>There are no Google Forms published right now.</p>
        </div>
      ) : (
        <div className="forms-grid">
          {/* Sidebar */}
          <aside className="forms-aside card">
            <div className="aside-search">
              <Search size={14} className="aside-search-icon" />
              <input
                type="text"
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="aside-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="clear-btn" aria-label="Clear search">
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Category Filter */}
            {categories.length > 2 && (
              <div className="aside-categories">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`cat-pill ${selectedCategory === cat ? "cat-pill-active" : ""}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Form list */}
            <div className="aside-list">
              {filteredForms.map((form) => {
                const isSelected = selectedForm?.id === form.id;
                return (
                  <button
                    key={form.id}
                    onClick={() => {
                      setSelectedFormId(form.id);
                      setIframeLoading(true);
                    }}
                    className={`form-item ${isSelected ? "form-item-active" : ""}`}
                  >
                    <div className="form-item-top">
                      <FileText size={15} className="form-item-icon" />
                      <span className="form-item-title">{form.title}</span>
                      {isSelected && <CheckCircle2 size={14} className="form-item-check" />}
                    </div>
                    <span className="form-item-cat">{form.category || "General"}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Form Viewer */}
          <main className={`forms-main card ${isFullscreen ? "fullscreen-mode" : ""}`}>
            {selectedForm ? (
              <>
                {/* Viewer Toolbar */}
                <div className="viewer-bar">
                  <div>
                    <h2 className="viewer-title">{selectedForm.title}</h2>
                    <span className="viewer-badge">{selectedForm.category || "General"}</span>
                  </div>

                  <div className="viewer-actions">
                    <button
                      onClick={handleCopyLink}
                      className="btn-action"
                      title="Copy link"
                    >
                      {copied ? <Check size={14} style={{ color: "#22c55e" }} /> : <Copy size={14} />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>

                    <a
                      href={selectedForm.formUrl || selectedForm.embedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-action"
                      title="Open in new tab"
                    >
                      <ExternalLink size={14} />
                      <span>Open Tab</span>
                    </a>

                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="btn-action"
                      title={isFullscreen ? "Exit fullscreen" : "Fullscreen view"}
                    >
                      {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                  </div>
                </div>

                {/* Direct Google Form Iframe Display */}
                <div className="iframe-container">
                  {iframeLoading && (
                    <div className="iframe-loading">
                      <RefreshCw size={24} className="animate-spin" />
                      <span>Loading Form...</span>
                    </div>
                  )}
                  <iframe
                    src={selectedForm.embedUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    className="form-iframe"
                    onLoad={() => setIframeLoading(false)}
                    title={selectedForm.title}
                  />
                </div>
              </>
            ) : (
              <div className="empty-selection">Select a form from the sidebar</div>
            )}
          </main>
        </div>
      )}

      {/* ─── STYLES ─────────────────────────────────────────────────────────── */}
      <style jsx>{`
        .forms-minimal-page {
          padding-top: 20px;
          padding-bottom: 40px;
        }

        .forms-minimal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.08));
        }

        .forms-title {
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 0 4px 0;
          color: var(--text-primary, #ffffff);
        }

        .forms-sub {
          font-size: 0.85rem;
          color: var(--text-muted, #94a3b8);
          margin: 0;
        }

        .forms-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 16px;
          align-items: start;
        }

        .forms-aside {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-radius: 12px;
        }

        .aside-search {
          position: relative;
          display: flex;
          align-items: center;
        }

        .aside-search-icon {
          position: absolute;
          left: 10px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .aside-input {
          width: 100%;
          padding: 7px 28px 7px 30px;
          font-size: 0.82rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
          color: var(--text-primary);
          outline: none;
        }

        .clear-btn {
          position: absolute;
          right: 8px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .aside-categories {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        .cat-pill {
          font-size: 0.72rem;
          padding: 2px 8px;
          border-radius: 999px;
          background: transparent;
          border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
          color: var(--text-muted);
          cursor: pointer;
        }

        .cat-pill-active {
          background: var(--ciel-gold, #d4af37);
          color: #000;
          border-color: var(--ciel-gold);
          font-weight: 700;
        }

        .aside-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 520px;
          overflow-y: auto;
        }

        .form-item {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid var(--border, rgba(255, 255, 255, 0.06));
          background: rgba(255, 255, 255, 0.02);
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all 0.15s ease;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .form-item-active {
          border-color: var(--ciel-gold, #d4af37) !important;
          background: rgba(212, 175, 55, 0.08) !important;
        }

        .form-item-top {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-item-icon {
          color: var(--ciel-gold);
          flex-shrink: 0;
        }

        .form-item-title {
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--text-primary);
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .form-item-check {
          color: var(--ciel-gold);
          flex-shrink: 0;
        }

        .form-item-cat {
          font-size: 0.68rem;
          color: var(--text-muted);
          padding-left: 23px;
        }

        /* Viewer */
        .forms-main {
          padding: 14px 18px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .viewer-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.08));
        }

        .viewer-title {
          font-size: 1rem;
          font-weight: 700;
          margin: 0 0 2px 0;
          color: var(--text-primary);
        }

        .viewer-badge {
          font-size: 0.68rem;
          padding: 1px 6px;
          border-radius: 4px;
          background: rgba(212, 175, 55, 0.15);
          color: var(--ciel-gold);
        }

        .viewer-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-action {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 9px;
          font-size: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
          border-radius: 6px;
          color: var(--text-primary);
          cursor: pointer;
        }

        .btn-action:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .iframe-container {
          position: relative;
          width: 100%;
          min-height: 650px;
          border-radius: 8px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
        }

        .iframe-loading {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(15, 23, 42, 0.95);
          color: #ffffff;
          font-size: 0.85rem;
        }

        .form-iframe {
          border: none;
          width: 100%;
          height: 100%;
          min-height: 650px;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
        }

        .empty-selection {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-muted);
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .fullscreen-mode {
          position: fixed;
          inset: 0;
          z-index: 9999;
          margin: 0;
          border-radius: 0;
          max-width: 100%;
          height: 100vh;
          background: var(--bg-surface, #0B0E17);
        }

        @media (max-width: 860px) {
          .forms-grid {
            grid-template-columns: 1fr;
          }
          .forms-minimal-header {
            align-items: flex-start;
          }
          .iframe-container,
          .form-iframe {
            min-height: 500px;
          }
        }
      `}</style>
    </div>
  );
}
