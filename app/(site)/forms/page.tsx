"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { GoogleFormItem } from "@/lib/types";
import { checkChetanaGeofence } from "@/lib/geo-utils";
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
  Lock,
  Compass,
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

  const alertTriggeredRef = useRef(false);

  // ─── GEOFENCE STATE ──────────────────────────────────────────────────────
  const [geoStatus, setGeoStatus] = useState<{
    loading: boolean;
    isWithinGeofence: boolean | null;
    distanceMeters: number | null;
    error: string | null;
  }>({
    loading: true,
    isWithinGeofence: null,
    distanceMeters: null,
    error: null,
  });

  // ─── SYSTEM DEFAULT ALERTBOX ─────────────────────────────────────────────
  const promptSystemAlert = useCallback(() => {
    if (typeof window === "undefined") return;

    const enableGps = window.confirm(
      "📍 Chetana Campus Geofence Required (500m)\n\n" +
      "Location is required to access and submit CIEL forms.\n\n" +
      "Click 'OK' to enable location and allow GPS access."
    );

    if (enableGps && navigator.geolocation) {
      setGeoStatus((prev) => ({ ...prev, loading: true, error: null }));
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const res = checkChetanaGeofence(pos.coords.latitude, pos.coords.longitude);
          setGeoStatus({
            loading: false,
            isWithinGeofence: res.isWithinGeofence,
            distanceMeters: res.distanceMeters,
            error: null,
          });

          if (res.isWithinGeofence) {
            window.alert(`✅ Location Verified (${res.distanceMeters}m from Chetana Campus). Forms unlocked!`);
          } else {
            window.alert(`⚠️ Outside Campus: You are ${res.distanceMeters}m away. Forms require being within 500m of campus.`);
          }
        },
        (err) => {
          let msg = "Location access was denied or device GPS is off.";
          if (err.code === 1) {
            msg = "Location permission is blocked. Please click the lock 🔒 icon in your browser address bar and set Location to 'Allow'.";
          }
          setGeoStatus({
            loading: false,
            isWithinGeofence: false,
            distanceMeters: null,
            error: msg,
          });
          window.alert(`⚠️ Location Disabled\n\n${msg}`);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // ─── LOCATION VERIFICATION ───────────────────────────────────────────────
  const verifyLocation = useCallback((triggerAlertOnFail: boolean = false) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGeoStatus({
        loading: false,
        isWithinGeofence: false,
        distanceMeters: null,
        error: "Geolocation unsupported",
      });
      return;
    }

    setGeoStatus((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const res = checkChetanaGeofence(pos.coords.latitude, pos.coords.longitude);
        setGeoStatus({
          loading: false,
          isWithinGeofence: res.isWithinGeofence,
          distanceMeters: res.distanceMeters,
          error: null,
        });
      },
      (err) => {
        const errMsg = err.code === 1 ? "Permission denied" : "Location off";
        setGeoStatus({
          loading: false,
          isWithinGeofence: false,
          distanceMeters: null,
          error: errMsg,
        });

        if (triggerAlertOnFail || !alertTriggeredRef.current) {
          alertTriggeredRef.current = true;
          promptSystemAlert();
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [promptSystemAlert]);

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
    verifyLocation(true);
  }, [verifyLocation]);

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
    if (!selectedForm || !geoStatus.isWithinGeofence) return;
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
          <p className="forms-sub">Official CIEL portals restricted to 500m Chetana Campus radius.</p>
        </div>

        {/* Minimal Geofence Status Pill */}
        <div className="status-pill-wrap">
          {geoStatus.loading ? (
            <div className="pill pill-checking">
              <RefreshCw size={13} className="animate-spin" />
              <span>Detecting GPS...</span>
            </div>
          ) : geoStatus.isWithinGeofence === true ? (
            <div className="pill pill-verified" title="Location verified within 500m of campus">
              <span className="dot dot-green" />
              <span>Campus Verified ({geoStatus.distanceMeters}m)</span>
            </div>
          ) : (
            <button className="pill pill-action" onClick={promptSystemAlert} title="Click to enable location via system alert">
              <span className="dot dot-red" />
              <span>Location Disabled (Enable GPS)</span>
            </button>
          )}
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
                placeholder=""
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="aside-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="clear-btn">
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
                      disabled={geoStatus.isWithinGeofence !== true}
                      className="btn-action"
                      title="Copy link"
                    >
                      {copied ? <Check size={14} style={{ color: "#22c55e" }} /> : <Copy size={14} />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>

                    <a
                      href={geoStatus.isWithinGeofence === true ? (selectedForm.formUrl || selectedForm.embedUrl) : undefined}
                      target={geoStatus.isWithinGeofence === true ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className={`btn-action ${geoStatus.isWithinGeofence !== true ? "btn-disabled" : ""}`}
                    >
                      <ExternalLink size={14} />
                      <span>Open Tab</span>
                    </a>

                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      disabled={geoStatus.isWithinGeofence !== true}
                      className="btn-action"
                    >
                      {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                  </div>
                </div>

                {/* Unlocked Form vs Minimal Geofence Lock */}
                {geoStatus.isWithinGeofence === true ? (
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
                ) : (
                  <div className="minimal-lock-card">
                    <div className="lock-icon-wrap">
                      <Lock size={26} />
                    </div>
                    <h3 className="lock-heading">Campus Location Required</h3>
                    <p className="lock-text">
                      You must be within 500m of Chetana Campus to fill and submit this form.
                    </p>

                    {geoStatus.distanceMeters !== null && (
                      <div className="lock-dist-tag">
                        Detected: <strong>{geoStatus.distanceMeters}m away</strong> (Limit: 500m)
                      </div>
                    )}

                    <div className="lock-btn-group">
                      <button onClick={promptSystemAlert} className="button button-primary button-small">
                        <Compass size={14} /> Enable Location
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-selection">Select a form from the sidebar</div>
            )}
          </main>
        </div>
      )}

      {/* ─── MINIMAL STYLES ──────────────────────────────────────────────────── */}
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

        .status-pill-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 600;
          border: 1px solid transparent;
        }

        .pill-verified {
          background: rgba(34, 197, 94, 0.12);
          border-color: rgba(34, 197, 94, 0.3);
          color: #4ade80;
        }

        .pill-action {
          background: rgba(239, 68, 68, 0.12);
          border-color: rgba(239, 68, 68, 0.3);
          color: #f87171;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pill-action:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .pill-checking {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-muted);
        }

        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .dot-green {
          background: #22c55e;
          box-shadow: 0 0 6px #22c55e;
        }

        .dot-red {
          background: #ef4444;
          box-shadow: 0 0 6px #ef4444;
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

        .btn-disabled {
          opacity: 0.4;
          pointer-events: none;
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

        .minimal-lock-card {
          min-height: 380px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 36px 20px;
        }

        .lock-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .lock-heading {
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0 0 6px 0;
          color: var(--text-primary);
        }

        .lock-text {
          font-size: 0.85rem;
          color: var(--text-muted);
          max-width: 420px;
          margin: 0 0 14px 0;
          line-height: 1.5;
        }

        .lock-dist-tag {
          font-size: 0.78rem;
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
          padding: 4px 10px;
          border-radius: 6px;
          margin-bottom: 18px;
        }

        .lock-btn-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
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
