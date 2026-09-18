"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Globe,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  Sparkles,
} from "lucide-react";
import type { Citation } from "@/lib/rag";

interface SourceCitationProps {
  sources: Citation[];
}

export function SourceCitation({ sources }: SourceCitationProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!sources || sources.length === 0) return null;

  const toggleExpand = (idx: number) => {
    setExpandedIndex((prev) => (prev === idx ? null : idx));
  };

  const getSourceBadgeInfo = (type: string) => {
    switch (type.toLowerCase()) {
      case "policy":
        return { label: "Policy", icon: BookOpen, color: "text-amber-400" };
      case "pdf":
        return { label: "Document", icon: FileText, color: "text-blue-400" };
      case "charter":
        return { label: "Charter", icon: FileText, color: "text-emerald-400" };
      default:
        return { label: "Official Web", icon: Globe, color: "text-amber-300" };
    }
  };

  return (
    <div className="ciel-chat-sources" role="region" aria-label="Referenced Sources">
      <div className="ciel-chat-sources-label">
        <Sparkles size={11} className="text-amber-400" />
        <span>Verified Citations ({sources.length})</span>
      </div>

      <div className="ciel-chat-sources-list">
        {sources.map((source, idx) => {
          const isExpanded = expandedIndex === idx;
          const badge = getSourceBadgeInfo(source.type);
          const IconComp = badge.icon;

          return (
            <div
              key={`${source.title}-${source.page || idx}`}
              className={`ciel-citation-chip-wrap ${isExpanded ? "is-expanded" : ""}`}
            >
              <button
                type="button"
                className="ciel-citation-chip"
                onClick={() => toggleExpand(idx)}
                aria-expanded={isExpanded}
                title="Click to view cited excerpt"
              >
                <span className="chip-icon-wrap">
                  <IconComp className={`chip-icon ${badge.color}`} size={12} />
                </span>
                <span className="chip-title">{source.title}</span>
                {source.page && <span className="chip-page">· p.{source.page}</span>}
                <span className="chip-chevron">
                  {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </span>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18, ease: "easeInOut" }}
                    className="ciel-citation-snippet-card"
                  >
                    <div className="snippet-header">
                      <span className="snippet-type-badge">{badge.label}</span>
                      {source.page && (
                        <span className="snippet-page-badge">Page {source.page}</span>
                      )}
                    </div>
                    {source.snippet && (
                      <p className="snippet-text">&ldquo;{source.snippet}&rdquo;</p>
                    )}
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="snippet-link"
                      >
                        View source page <ExternalLink size={11} />
                      </a>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
