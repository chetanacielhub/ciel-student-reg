"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, MessageSquare, X } from "lucide-react";
import { ChatWindow } from "./chat-window";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show gentle prompt tooltip after 2.5 seconds if not opened
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasOpenedBefore && !isOpen) {
        setShowTooltip(true);
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [hasOpenedBefore, isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const toggleChat = () => {
    setShowTooltip(false);
    setIsOpen((prev) => {
      if (!prev) setHasOpenedBefore(true);
      return !prev;
    });
  };

  return (
    <aside className="ciel-chat-widget-root" aria-label="Ciela — CIEL AI Chat Widget">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window-modal"
            className="ciel-chat-window-container"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.94 }}
            transition={{ type: "spring", damping: 26, stiffness: 360 }}
          >
            <ChatWindow onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Prompt Tooltip on First Visit */}
      <AnimatePresence>
        {!isOpen && showTooltip && (
          <motion.div
            className="ciel-widget-tooltip"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="tooltip-inner" onClick={toggleChat}>
              <span className="tooltip-sparkle">✦</span>
              <span>Need help with CIEL or incubation? Talk to <strong>Ciela</strong></span>
            </div>
            <button
              type="button"
              className="tooltip-close"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              aria-label="Dismiss tooltip"
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        type="button"
        className={`ciel-chat-trigger-btn ${isOpen ? "is-active" : ""}`}
        onClick={toggleChat}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        aria-expanded={isOpen}
        aria-label="Open Ciela — CIEL AI Assistant"
      >
        <span className="trigger-sparkle-halo" />
        <span className="trigger-icon-wrap">
          <Sparkles size={16} className="trigger-sparkle-icon" />
        </span>
        <span className="trigger-label">Ciela · CIEL AI</span>

        {!isOpen && !hasOpenedBefore && (
          <span className="trigger-notification-dot" title="Talk to Ciela" />
        )}
      </motion.button>
    </aside>
  );
}
