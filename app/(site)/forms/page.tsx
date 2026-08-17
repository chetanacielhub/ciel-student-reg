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
  Sparkles,
  Layers,
  Search,
  CheckCircle2,
  Info,
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
    const linkToCopy = selectedForm.formUrl || selectedForm.embedUrl;
    navigator.clipboard.writeText(linkToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="forms-page shell" style={{ padding: "16px 0 40px 0" }}>
      {/* Hero Header (Compact) */}
      <div className="section-header text-center" style={{ marginBottom: "16px" }}>
        <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>
          CIEL Forms &amp; Surveys Hub
        </h1>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "300px 1fr" }}>
          <div className="card" style={{ height: "400px", opacity: 0.6 }} />
          <div className="card" style={{ height: "650px", opacity: 0.6 }} />
        </div>
      ) : forms.length === 0 ? (
        <div className="card text-center" style={{ padding: "40px 20px" }}>
          <FileSpreadsheet size={48} style={{ opacity: 0.4, margin: "0 auto 16px auto" }} />
          <h3>No Active Forms Found</h3>
          <p className="subtext" style={{ maxWidth: "450px", margin: "8px auto 0 auto" }}>
            There are currently no active Google Forms published. Please check back later or contact the CIEL administration team.
          </p>
        </div>
      ) : (
        <div className="forms-hub-layout">
          {/* Form Selector Sidebar */}
          <div className="forms-sidebar card" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <Layers size={16} className="text-primary" /> Active Forms
              </h3>
              <span className="badge badge-subtle">{filteredForms.length} Available</span>
            </div>

            {/* Search Input */}
            <div className="input-wrap">
              <Search className="input-icon" size={16} />
              <input
                type="text"
                className="input input-with-icon"
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: "0.85rem", padding: "6px 12px 6px 36px" }}
              />
            </div>

            {/* Category Filter Pills */}
            {categories.length > 2 && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`button ${selectedCategory === cat ? "button-primary" : "button-ghost"}`}
                    style={{ fontSize: "0.75rem", padding: "3px 9px", borderRadius: "20px" }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Forms List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "550px", overflowY: "auto" }}>
              {filteredForms.map((form) => {
                const isSelected = selectedForm?.id === form.id;
                return (
                  <div
                    key={form.id}
                    onClick={() => {
                      setSelectedFormId(form.id);
                      setIframeLoading(true);
                    }}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      border: isSelected ? "2px solid var(--primary, #3b82f6)" : "1px solid var(--border, rgba(255,255,255,0.1))",
                      background: isSelected ? "var(--surface-hover, rgba(59,130,246,0.08))" : "var(--surface, rgba(255,255,255,0.02))",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.9rem", color: isSelected ? "var(--primary, #3b82f6)" : "inherit" }}>
                        {form.title}
                      </span>
                      {isSelected && <CheckCircle2 size={16} style={{ color: "var(--primary, #3b82f6)", flexShrink: 0 }} />}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                      <span className="badge badge-accent" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                        {form.category || "General"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Embedded Form View Container */}
          <div
            className={`form-viewer-card card ${isFullscreen ? "fullscreen-form-modal" : ""}`}
            style={
              isFullscreen
                ? {
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                    borderRadius: 0,
                    padding: "16px",
                    background: "var(--background, #090d16)",
                    display: "flex",
                    flexDirection: "column",
                  }
                : {
                    padding: "14px 18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }
            }
          >
            {selectedForm ? (
              <>
                {/* Compact Header Toolbar directly above iframe */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "8px", borderBottom: "1px solid var(--border, rgba(255,255,255,0.1))", paddingBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>
                      {selectedForm.title}
                    </h2>
                    <span className="badge badge-primary" style={{ fontSize: "0.7rem", padding: "2px 6px" }}>{selectedForm.category || "General"}</span>
                  </div>

                  {/* Actions Toolbar */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <button
                      onClick={handleCopyLink}
                      className="button button-secondary button-small"
                      title="Copy link to form"
                      style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                    >
                      {copied ? <Check size={14} style={{ color: "#22c55e" }} /> : <Copy size={14} />}
                      <span className="action-btn-text">{copied ? "Copied!" : "Copy"}</span>
                    </button>

                    <a
                      href={selectedForm.formUrl || selectedForm.embedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button button-ghost button-small"
                      title="Open form in external tab"
                      style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                    >
                      <ExternalLink size={14} />
                      <span className="action-btn-text">Open Tab</span>
                    </a>

                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="button button-ghost button-small"
                      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
                      style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                    >
                      {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                      <span className="action-btn-text">{isFullscreen ? "Exit" : "Expand"}</span>
                    </button>
                  </div>
                </div>

                {/* Iframe Loading Banner / Container */}
                <div
                  className="iframe-wrap-container"
                  style={{
                    position: "relative",
                    width: "100%",
                    flex: 1,
                    minHeight: isFullscreen ? "calc(100vh - 120px)" : "680px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "1px solid var(--border, rgba(255,255,255,0.12))",
                    background: "#ffffff",
                  }}
                >
                  {iframeLoading && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        background: "rgba(15, 23, 42, 0.95)",
                        color: "#ffffff",
                        zIndex: 10,
                      }}
                    >
                      <RefreshCw size={28} className="animate-spin text-primary" />
                      <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>Loading Google Form...</span>
                    </div>
                  )}

                  <iframe
                    src={selectedForm.embedUrl}
                    width="100%"
                    height="1081"
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                    style={{
                      border: "none",
                      width: "100%",
                      height: "100%",
                      minHeight: isFullscreen ? "calc(100vh - 120px)" : "680px",
                    }}
                    onLoad={() => setIframeLoading(false)}
                    title={selectedForm.title}
                    allow="geolocation; camera; microphone"
                  >
                    Loading form...
                  </iframe>
                </div>

                {/* Footer Note */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", opacity: 0.75, flexWrap: "wrap" }}>
                  <Info size={13} style={{ flexShrink: 0 }} />
                  <span>
                    Having trouble viewing the embedded form? You can{" "}
                    <a
                      href={selectedForm.formUrl || selectedForm.embedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "underline", color: "var(--primary, #3b82f6)" }}
                    >
                      open direct form link
                    </a>.
                  </span>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 16px" }}>
                <p>Select a form from the active forms list to display it here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid & Responsive Mobile Styling */}
      <style jsx>{`
        .forms-hub-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 20px;
          align-items: start;
        }

        @media (max-width: 992px) {
          .forms-hub-layout {
            grid-template-columns: 1fr;
            gap: 14px;
          }
        }

        @media (max-width: 640px) {
          .forms-page {
            padding: 8px 0 24px 0 !important;
          }
          .action-btn-text {
            display: none !important;
          }
          .iframe-wrap-container {
            min-height: 520px !important;
          }
          .iframe-wrap-container iframe {
            min-height: 520px !important;
          }
        }
      `}</style>
    </div>
  );
}
