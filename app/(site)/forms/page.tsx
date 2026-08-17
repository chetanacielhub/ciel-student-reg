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
    <div className="forms-page shell" style={{ padding: "40px 0 80px 0" }}>
      {/* Hero Header */}
      <div className="section-header text-center" style={{ marginBottom: "40px" }}>
        <div className="badge badge-accent" style={{ display: "inline-flex", gap: "6px", alignItems: "center", marginBottom: "12px" }}>
          <Sparkles size={14} /> Official Portal Forms
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
          CIEL Forms &amp; Surveys Hub
        </h1>
        <p className="subtext" style={{ maxWidth: "680px", margin: "12px auto 0 auto", opacity: 0.9 }}>
          Access, view, and fill official incubation application forms, event registrations, surveys, and feedback questionnaires directly on our platform.
        </p>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "300px 1fr" }}>
          <div className="card" style={{ height: "400px", opacity: 0.6 }} />
          <div className="card" style={{ height: "650px", opacity: 0.6 }} />
        </div>
      ) : forms.length === 0 ? (
        <div className="card text-center" style={{ padding: "60px 20px" }}>
          <FileSpreadsheet size={48} style={{ opacity: 0.4, margin: "0 auto 16px auto" }} />
          <h3>No Active Forms Found</h3>
          <p className="subtext" style={{ maxWidth: "450px", margin: "8px auto 0 auto" }}>
            There are currently no active Google Forms published. Please check back later or contact the CIEL administration team.
          </p>
        </div>
      ) : (
        <div className="forms-hub-layout">
          {/* Form Selector Sidebar / Header Controls */}
          <div className="forms-sidebar card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <Layers size={18} className="text-primary" /> Active Forms
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
                style={{ fontSize: "0.875rem", padding: "8px 12px 8px 36px" }}
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
                    style={{ fontSize: "0.75rem", padding: "4px 10px", borderRadius: "20px" }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Forms List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "550px", overflowY: "auto" }}>
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
                      padding: "14px",
                      borderRadius: "12px",
                      border: isSelected ? "2px solid var(--primary, #3b82f6)" : "1px solid var(--border, rgba(255,255,255,0.1))",
                      background: isSelected ? "var(--surface-hover, rgba(59,130,246,0.08))" : "var(--surface, rgba(255,255,255,0.02))",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.95rem", color: isSelected ? "var(--primary, #3b82f6)" : "inherit" }}>
                        {form.title}
                      </span>
                      {isSelected && <CheckCircle2 size={16} style={{ color: "var(--primary, #3b82f6)", flexShrink: 0 }} />}
                    </div>
                    {form.description && (
                      <p style={{ fontSize: "0.8rem", opacity: 0.7, margin: "6px 0 0 0", lineClamp: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {form.description}
                      </p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
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
                    padding: "20px",
                    background: "var(--background, #090d16)",
                    display: "flex",
                    flexDirection: "column",
                  }
                : {
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }
            }
          >
            {selectedForm ? (
              <>
                {/* Header Toolbar */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", borderBottom: "1px solid var(--border, rgba(255,255,255,0.1))", paddingBottom: "16px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                        {selectedForm.title}
                      </h2>
                      <span className="badge badge-primary">{selectedForm.category || "General"}</span>
                    </div>
                    {selectedForm.description && (
                      <p style={{ fontSize: "0.85rem", opacity: 0.8, margin: "4px 0 0 0" }}>
                        {selectedForm.description}
                      </p>
                    )}
                  </div>

                  {/* Actions Toolbar */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      onClick={handleCopyLink}
                      className="button button-secondary button-small"
                      title="Copy link to form"
                    >
                      {copied ? <Check size={14} style={{ color: "#22c55e" }} /> : <Copy size={14} />}
                      {copied ? "Copied Link!" : "Copy Link"}
                    </button>

                    <a
                      href={selectedForm.formUrl || selectedForm.embedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button button-ghost button-small"
                      title="Open form in external tab"
                    >
                      <ExternalLink size={14} /> Open in New Tab
                    </a>

                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="button button-ghost button-small"
                      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
                    >
                      {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                      {isFullscreen ? "Exit" : "Expand"}
                    </button>
                  </div>
                </div>

                {/* Iframe Loading Banner / Container */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    flex: 1,
                    minHeight: isFullscreen ? "calc(100vh - 120px)" : "720px",
                    borderRadius: "12px",
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
                      <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>Loading Google Form iframe...</span>
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
                      minHeight: isFullscreen ? "calc(100vh - 120px)" : "720px",
                    }}
                    onLoad={() => setIframeLoading(false)}
                    title={selectedForm.title}
                    allow="geolocation; camera; microphone"
                  >
                    Loading form...
                  </iframe>
                </div>

                {/* Footer Note */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", opacity: 0.7 }}>
                  <Info size={14} />
                  <span>
                    Having trouble viewing the embedded form? You can{" "}
                    <a
                      href={selectedForm.formUrl || selectedForm.embedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "underline", color: "var(--primary, #3b82f6)" }}
                    >
                      open the direct Google Form link
                    </a>{" "}
                    in a new browser tab.
                  </span>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <p>Select a form from the sidebar to display it here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid Layout Styling */}
      <style jsx>{`
        .forms-hub-layout {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 992px) {
          .forms-hub-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
