"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Award,
  Building2,
  GraduationCap,
  Search,
  ChevronDown,
} from "lucide-react";
import { LinkedInIcon } from "@/components/ui/linkedin-icon";
import type { StudentCouncilLeadItem } from "@/lib/types";
import type { InstituteCouncilInfo } from "@/data/institutes-council-data";

interface InstituteWithLeads extends InstituteCouncilInfo {
  sicLeads: StudentCouncilLeadItem[];
  functionalLeads: StudentCouncilLeadItem[];
}

interface StudentCouncilClientViewProps {
  institutes: InstituteWithLeads[];
}

/* ── accent palette for each institute card ── */
const INST_ACCENTS = [
  { bg: "linear-gradient(135deg, #f0c27f 0%, #d4af37 100%)", text: "#7a5c00" },
  { bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", text: "#fff" },
  { bg: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", text: "#0a5c3a" },
  { bg: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", text: "#7a1f3b" },
];

/* ── logo mapping per institute ── */
const INST_LOGOS: Record<string, string> = {
  cimr: "/logo-cimr.png",
  crkimr: "/logo-cimr.png",
  sfc: "/logo-hs-arts.png",
  "hs-arts": "/logo-hs-arts.png",
};

export function StudentCouncilClientView({ institutes }: StudentCouncilClientViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [filterVertical, setFilterVertical] = useState<string>("all");

  // Handle URL hash on mount / change
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      if (institutes.some((i) => i.id === hash)) {
        setActiveTab("all");
        const el = document.getElementById(hash);
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
        }
      }
    }
  }, [institutes]);

  const scrollToInstitute = (id: string) => {
    setActiveTab("all");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  // Filter leads based on search query and selected filter vertical
  const filteredInstitutes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return institutes.map((inst) => {
      let sic = inst.sicLeads;
      let func = inst.functionalLeads;

      if (filterVertical === "council") {
        func = [];
      } else if (filterVertical === "functional") {
        sic = [];
      } else if (filterVertical.startsWith("track-")) {
        sic = [];
        const trackNum = filterVertical.replace("track-", "");
        func = func.filter((l) => l.role.includes(`Lead — ${trackNum}`) || l.role.includes(`Track ${trackNum}`));
      }

      if (q) {
        sic = sic.filter(
          (l) =>
            l.name.toLowerCase().includes(q) ||
            l.role.toLowerCase().includes(q) ||
            l.branch.toLowerCase().includes(q) ||
            (l.year && l.year.toLowerCase().includes(q))
        );

        func = func.filter(
          (l) =>
            l.name.toLowerCase().includes(q) ||
            l.role.toLowerCase().includes(q) ||
            l.branch.toLowerCase().includes(q) ||
            (l.year && l.year.toLowerCase().includes(q))
        );
      }

      return {
        ...inst,
        sicLeads: sic,
        functionalLeads: func,
      };
    });
  }, [institutes, searchQuery, filterVertical]);

  const totalMembersCount = useMemo(() => {
    return filteredInstitutes.reduce((acc, inst) => acc + inst.sicLeads.length + inst.functionalLeads.length, 0);
  }, [filteredInstitutes]);

  return (
    <div className="sic-glass-page">
      {/* Decorative background blobs */}
      <div className="sic-bg-blob sic-bg-blob--1" />
      <div className="sic-bg-blob sic-bg-blob--2" />
      <div className="sic-bg-blob sic-bg-blob--3" />

      <div className="shell" style={{ position: "relative", zIndex: 1, paddingTop: 40, paddingBottom: 80 }}>
        {/* ─── HERO SECTION ─── */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="sic-eyebrow">
            <GraduationCap size={15} />
            Decentralized Student Governance
          </span>
          <h1 className="sic-hero-title">
            Student Innovation Council &amp; Student Functional Committee
          </h1>
          <p className="sic-hero-subtitle">
            Under the aegis of CIEL, grassroots student leadership is structured across all four constituent institutions of
            Chetana. Each college operates an independent <strong>Student Innovation Council (SIC)</strong> driving campus ideation
            and hackathons, alongside a dedicated <strong>Student Functional Committee</strong> coordinating CIEL&apos;s six core
            operational verticals.
          </p>
        </div>

        {/* ─── QUICK INSTITUTE DIRECTORY CARDS ─── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 18,
            marginBottom: 48,
          }}
        >
          {institutes.map((inst, index) => {
            const accent = INST_ACCENTS[index % INST_ACCENTS.length];
            return (
              <div
                key={inst.id}
                onClick={() => scrollToInstitute(inst.id)}
                className="sic-directory-card"
              >
                <div className="sic-directory-card__badge">Institute 0{index + 1}</div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={INST_LOGOS[inst.id] || "/logo-cimr.png"}
                    alt={`${inst.shortName} logo`}
                    style={{
                      width: 44,
                      height: 44,
                      objectFit: "contain",
                      flexShrink: 0,
                    }}
                  />
                  <h3 className="sic-directory-card__name">{inst.shortName}</h3>
                </div>

                <p className="sic-directory-card__tagline">{inst.tagline}</p>

                <div className="sic-directory-card__footer">
                  <span>{inst.stats.activeMembers}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    Explore <ChevronDown size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── STICKY NAVIGATION & SEARCH TOOLBAR ─── */}
        <div className="sic-toolbar">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Institute Tabs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("all");
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
                className={`sic-tab ${activeTab === "all" ? "sic-tab--active" : ""}`}
              >
                All 4 Institutes
              </button>

              {institutes.map((inst) => (
                <button
                  key={inst.id}
                  type="button"
                  onClick={() => scrollToInstitute(inst.id)}
                  className="sic-tab"
                >
                  {inst.shortName}
                </button>
              ))}
            </div>

            {/* Search and Vertical Filter */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", flex: "1 1 320px", justifyContent: "flex-end" }}>
              <div style={{ position: "relative", minWidth: 180, flex: 1, maxWidth: 300 }}>
                <Search
                  size={15}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="search"
                  placeholder="Search leader, designation, branch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="sic-search-input"
                />
              </div>

              <select
                value={filterVertical}
                onChange={(e) => setFilterVertical(e.target.value)}
                className="sic-filter-select"
              >
                <option value="all">All Committees</option>
                <option value="council">Only SIC Leadership</option>
                <option value="functional">Only Functional Committee</option>
                <option value="track-1">Track 1: Innovation &amp; Research</option>
                <option value="track-2">Track 2: Incubation &amp; Start-up</option>
                <option value="track-3">Track 3: Skill Development</option>
                <option value="track-4">Track 4: Industry &amp; Investor</option>
                <option value="track-5">Track 5: Events &amp; Outreach</option>
                <option value="track-6">Track 6: Monitoring &amp; Evaluation</option>
              </select>
            </div>
          </div>

          {searchQuery && (
            <div style={{ marginTop: 10, fontSize: 12, color: "#b17d10", fontWeight: 600 }}>
              Found {totalMembersCount} matching student leaders across all institutes.
            </div>
          )}
        </div>

        {/* ─── 4 SEPARATE INSTITUTE SECTIONS ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 72 }}>
          {filteredInstitutes.map((inst, index) => {
            const hasSic = inst.sicLeads.length > 0;
            const hasFunctional = inst.functionalLeads.length > 0;
            const accent = INST_ACCENTS[index % INST_ACCENTS.length];

            // If filtering via search and no matches in this institute, skip
            if (searchQuery && !hasSic && !hasFunctional) {
              return null;
            }

            return (
              <section
                key={inst.id}
                id={inst.id}
                className="sic-institute-section"
              >
                {/* Decorative accent bar at top */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 32,
                    right: 32,
                    height: 3,
                    borderRadius: "0 0 3px 3px",
                    background: accent.bg,
                    opacity: 0.7,
                  }}
                />

                {/* Institute Section Banner */}
                <div className="sic-section-header">
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                    <div>
                      <div className="sic-section-badge">
                        <Building2 size={14} />
                        Institute Section 0{index + 1} &middot; {inst.badge}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={INST_LOGOS[inst.id] || "/logo-cimr.png"}
                          alt={`${inst.shortName} logo`}
                          className="sic-section-logo"
                        />
                        <h2 className="sic-section-title" style={{ margin: 0 }}>{inst.name}</h2>
                      </div>
                    </div>

                    {/* Stat Chips */}
                    {(inst.sicLeads.length > 0 || inst.functionalLeads.length > 0) && (
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {inst.sicLeads.length > 0 && (
                          <div className="sic-stat-chip">
                            <div className="sic-stat-chip__number">{inst.sicLeads.length}</div>
                            <div className="sic-stat-chip__label">SIC Officers</div>
                          </div>
                        )}
                        {inst.functionalLeads.length > 0 && (
                          <div className="sic-stat-chip">
                            <div className="sic-stat-chip__number">{inst.functionalLeads.length}</div>
                            <div className="sic-stat-chip__label">Track Leads</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="sic-section-meta">
                    <div>
                      <strong>Programs:</strong> {inst.stats.programs}
                    </div>
                    <div>&bull;</div>
                    <div>
                      <strong>Campus Community:</strong> {inst.stats.activeMembers}
                    </div>
                  </div>
                </div>

                {/* ─── SUB-SECTION A: STUDENT INNOVATION COUNCIL (SIC) ─── */}
                <div style={{ marginBottom: 40 }}>
                  <div className="sic-subsection-header" style={{ marginBottom: hasSic ? 24 : 0 }}>
                    <div>
                      <div className="sic-subsection-eyebrow">
                        <GraduationCap size={15} /> Council Executive Leadership
                      </div>
                      <h3 className="sic-subsection-title">
                        Student Innovation Council (SIC) &mdash; {inst.shortName}
                      </h3>
                    </div>
                    {hasSic && (
                      <span className="sic-count-badge">
                        {inst.sicLeads.length} Council Bearers
                      </span>
                    )}
                  </div>

                  {hasSic && (
                    <div className="team-portrait-grid">
                      {inst.sicLeads.map((lead) => {
                        const card = (
                          <article className="sic-member-card" key={lead.id || lead.name}>
                            {lead.avatar && (lead.avatar.startsWith("/") || lead.avatar.startsWith("http")) ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={lead.avatar} alt={lead.name} className="sic-member-card__photo" />
                            ) : (
                              <div className="sic-member-card__avatar-placeholder">
                                {lead.avatar || lead.name.split(" ").map((n) => n[0]).join("")}
                              </div>
                            )}
                            <h4 className="sic-member-card__name">
                              <span>{lead.name}</span>
                              {lead.linkedinUrl && <LinkedInIcon size={14} color="#2563eb" />}
                            </h4>
                            <p className="sic-member-card__role">{lead.role}</p>
                            <div className="sic-member-card__meta">
                              {lead.branch} {lead.year ? `· ${lead.year}` : ""}
                            </div>
                            {lead.linkedinUrl && (
                              <span className="sic-member-card__linkedin">
                                Connect on LinkedIn &rarr;
                              </span>
                            )}
                          </article>
                        );

                        return lead.linkedinUrl ? (
                          <a
                            href={lead.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={lead.id || lead.name}
                            style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
                          >
                            {card}
                          </a>
                        ) : (
                          card
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ─── SUB-SECTION B: STUDENT FUNCTIONAL COMMITTEE ─── */}
                <div>
                  <div className="sic-subsection-header" style={{ marginBottom: hasFunctional ? 24 : 0 }}>
                    <div>
                      <div className="sic-subsection-eyebrow">
                        <Award size={15} /> 6 Operational Innovation Tracks
                      </div>
                      <h3 className="sic-subsection-title">
                        Student Functional Committee &mdash; {inst.shortName}
                      </h3>
                    </div>
                    {hasFunctional && (
                      <span className="sic-count-badge">
                        {inst.functionalLeads.length} Track Leads
                      </span>
                    )}
                  </div>

                  {hasFunctional && (
                    <div className="team-portrait-grid">
                      {inst.functionalLeads.map((lead) => {
                        // Extract section number if present in role
                        const sectionMatch = lead.role.match(/(\d+)[:.]/) ;
                        const trackBadge = sectionMatch ? `Section ${sectionMatch[1]}` : "Track Lead";

                        const card = (
                          <article className="sic-member-card" key={lead.id || lead.name}>
                            <span className="sic-track-badge">{trackBadge}</span>

                            {lead.avatar && (lead.avatar.startsWith("/") || lead.avatar.startsWith("http")) ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={lead.avatar} alt={lead.name} className="sic-member-card__photo" />
                            ) : (
                              <div className="sic-member-card__avatar-placeholder">
                                {lead.avatar || lead.name.split(" ").map((n) => n[0]).join("")}
                              </div>
                            )}
                            <h4 className="sic-member-card__name">
                              <span>{lead.name}</span>
                              {lead.linkedinUrl && <LinkedInIcon size={14} color="#2563eb" />}
                            </h4>
                            <p className="sic-member-card__role">{lead.role}</p>
                            <div className="sic-member-card__meta">
                              {lead.branch} {lead.year ? `· ${lead.year}` : ""}
                            </div>
                            {lead.linkedinUrl && (
                              <span className="sic-member-card__linkedin">
                                Connect on LinkedIn &rarr;
                              </span>
                            )}
                          </article>
                        );

                        return lead.linkedinUrl ? (
                          <a
                            href={lead.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={lead.id || lead.name}
                            style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
                          >
                            {card}
                          </a>
                        ) : (
                          card
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
