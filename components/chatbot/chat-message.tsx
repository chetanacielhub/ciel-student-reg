"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Sparkles, User, Volume2, VolumeX } from "lucide-react";
import { SourceCitation } from "./source-citation";
import type { Citation } from "@/lib/rag";

export interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Citation[];
  isOutOfDomain?: boolean;
  timestamp?: string;
}

interface ChatMessageProps {
  message: MessageItem;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isUser = message.role === "user";

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  const handleToggleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean text for natural speech
    const cleanSpeechText = message.content
      .replace(/[*_#`~[\]]/g, " ")
      .replace(/\(http[^)]+\)/g, " ")
      .replace(/http\S+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.name.includes("Natural") ||
        v.name.includes("Samantha") ||
        v.name.includes("Google UK English Female") ||
        v.name.includes("Zira") ||
        (v.name.toLowerCase().includes("female") && v.lang.startsWith("en"))
    ) || voices.find((v) => v.lang.startsWith("en"));

    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`ciel-chat-msg-row ${isUser ? "user-row" : "bot-row"}`}>
      {!isUser && (
        <div className="ciel-chat-avatar bot-avatar" title="Ciela — CIEL AI Guide">
          <Sparkles size={15} className="sparkle-icon" />
          <span className="avatar-online-halo" />
        </div>
      )}

      <div className={`ciel-chat-bubble ${isUser ? "user-bubble" : "bot-bubble"}`}>
        <div className="ciel-bubble-header">
          <div className="ciel-bubble-sender-group">
            <span className="ciel-bubble-sender">{isUser ? "You" : "Ciela"}</span>
            {!isUser && <span className="ciel-ai-tag">CIEL AI</span>}
          </div>

          <div className="ciel-bubble-actions">
            {message.timestamp && (
              <span className="ciel-bubble-time">{message.timestamp}</span>
            )}
            {!isUser && (
              <>
                <button
                  type="button"
                  className={`ciel-bubble-action-btn ${isSpeaking ? "speaking" : ""}`}
                  onClick={handleToggleSpeak}
                  title={isSpeaking ? "Stop speaking" : "Listen to Ciela's voice"}
                  aria-label={isSpeaking ? "Stop speaking" : "Listen to Ciela"}
                >
                  {isSpeaking ? (
                    <div className="soundwave-anim">
                      <span className="sound-bar bar-1" />
                      <span className="sound-bar bar-2" />
                      <span className="sound-bar bar-3" />
                      <VolumeX size={13} className="ml-1 text-amber-400" />
                    </div>
                  ) : (
                    <Volume2 size={13} />
                  )}
                </button>
                <button
                  type="button"
                  className="ciel-bubble-action-btn"
                  onClick={handleCopy}
                  title="Copy message text"
                  aria-label="Copy message text"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="ciel-bubble-body">
          {renderMarkdownContent(message.content)}
        </div>

        {!isUser && message.sources && message.sources.length > 0 && (
          <SourceCitation sources={message.sources} />
        )}
      </div>

      {isUser && (
        <div className="ciel-chat-avatar user-avatar" title="You">
          <User size={15} />
        </div>
      )}
    </div>
  );
}

/**
 * Lightweight, safe markdown formatter.
 */
function renderMarkdownContent(text: string) {
  const paragraphs = text.split(/\n{2,}/);

  return (
    <div className="ciel-rendered-markdown">
      {paragraphs.map((p, pIdx) => {
        const lines = p.split("\n");
        const isBulletList = lines.every((line) => line.trim().startsWith("- ") || line.trim().startsWith("• ") || line.trim().startsWith("* "));
        const isNumberedList = lines.every((line) => /^\d+\.\s/.test(line.trim()));

        if (isBulletList) {
          return (
            <ul key={pIdx} className="ciel-md-list">
              {lines.map((line, lIdx) => (
                <li key={lIdx}>{formatInline(line.trim().replace(/^[-•*]\s*/, ""))}</li>
              ))}
            </ul>
          );
        }

        if (isNumberedList) {
          return (
            <ol key={pIdx} className="ciel-md-numbered-list">
              {lines.map((line, lIdx) => (
                <li key={lIdx}>{formatInline(line.trim().replace(/^\d+\.\s*/, ""))}</li>
              ))}
            </ol>
          );
        }

        return (
          <p key={pIdx} className="ciel-md-p">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {formatInline(line)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function formatInline(line: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-semibold text-amber-200">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code key={match.index} className="ciel-inline-code">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[") && token.includes("](")) {
      const label = token.substring(1, token.indexOf("]"));
      const href = token.substring(token.indexOf("](") + 2, token.length - 1);
      parts.push(
        <a
          key={match.index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="ciel-chat-link"
        >
          {label}
        </a>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    parts.push(line.substring(lastIndex));
  }

  return parts;
}
