"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  RotateCcw,
  SendHorizontal,
  Info,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Rocket,
  Coins,
  Users,
  Lightbulb,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { ChatMessage, type MessageItem } from "./chat-message";

interface ChatWindowProps {
  onClose: () => void;
}

interface PromptCategory {
  icon: React.ElementType;
  label: string;
  query: string;
}

const FEATURED_PROMPTS: PromptCategory[] = [
  {
    icon: Building2,
    label: "Incubation Facilities",
    query: "What incubation facilities does CIEL provide?",
  },
  {
    icon: Coins,
    label: "Seed Grants & Funding",
    query: "How can I apply for seed support & funding?",
  },
  {
    icon: Users,
    label: "Mentors & Advisors",
    query: "Who are the mentors & advisors at CIEL?",
  },
  {
    icon: Rocket,
    label: "Incubated Startups",
    query: "What notable student startups are incubated at CIEL?",
  },
  {
    icon: ShieldCheck,
    label: "IPR & Patent Support",
    query: "What is CIEL's IPR and patent filing policy?",
  },
  {
    icon: Lightbulb,
    label: "Student Council (SiC)",
    query: "Tell me about the Student Innovation Council (SiC)",
  },
];

export function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((r: any) => r[0].transcript)
            .join("");
          setInput(transcript);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onerror = (e: any) => {
          console.warn("Speech recognition error:", e.error);
          setIsListening(false);
          setSpeechError("Microphone unavailable or permission denied.");
          setTimeout(() => setSpeechError(null), 3500);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setSpeechError("Voice input is not supported in this browser.");
      setTimeout(() => setSpeechError(null), 3000);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setSpeechError(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Could not start recognition:", err);
      }
    }
  };

  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const clean = text
      .replace(/[*_#`~[\]]/g, " ")
      .replace(/\(http[^)]+\)/g, " ")
      .replace(/http\S+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(clean);
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
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (userText?: string) => {
    const textToSend = (userText || input).trim();
    if (!textToSend || loading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMessage: MessageItem = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();

      if (response.ok && data.message) {
        const botMessage: MessageItem = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: data.message.content,
          sources: data.sources || [],
          isOutOfDomain: data.isOutOfDomain,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMessage]);

        if (autoSpeak) {
          speakText(data.message.content);
        }
      } else {
        const errorMessage: MessageItem = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content:
            data.message?.content ||
            "I encountered a momentary issue accessing the knowledge base. Please try again or reach out to info@cielhub.org.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch {
      const networkErrorMessage: MessageItem = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content:
          "Unable to connect to CIEL knowledge services. Please check your network connection and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, networkErrorMessage]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setMessages([]);
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <div className="ciel-chat-window" role="dialog" aria-label="Ciela — CIEL AI Assistant">
      {/* Header */}
      <div className="ciel-chat-header">
        <div className="ciel-chat-header-info">
          <div className="ciel-chat-avatar-brand">
            <Sparkles size={18} className="sparkle-gold" />
            <span className="ciel-avatar-pulse-ring" />
          </div>
          <div>
            <div className="ciel-chat-title-row">
              <h3 className="ciel-chat-title">Ciela</h3>
              <span className="ciel-status-pill">
                <span className="ciel-status-dot" /> Online
              </span>
            </div>
            <p className="ciel-chat-subtitle">CIEL&apos;s AI Assistant & Innovation Guide</p>
          </div>
        </div>

        <div className="ciel-chat-header-actions">
          {/* Auto-voice readout toggle */}
          <button
            type="button"
            className={`ciel-header-icon-btn ${autoSpeak ? "active-voice" : ""}`}
            onClick={() => {
              const next = !autoSpeak;
              setAutoSpeak(next);
              if (!next && typeof window !== "undefined" && window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
            }}
            title={autoSpeak ? "Auto-voice active (click to mute)" : "Enable Ciela's auto-voice readout"}
            aria-label="Toggle Auto Voice Readout"
          >
            {autoSpeak ? <Volume2 size={15} className="text-amber-400 animate-pulse" /> : <VolumeX size={15} />}
          </button>

          {messages.length > 0 && (
            <button
              type="button"
              className="ciel-header-icon-btn"
              onClick={handleReset}
              title="Clear conversation"
              aria-label="Clear conversation"
            >
              <RotateCcw size={15} />
            </button>
          )}

          <button
            type="button"
            className="ciel-header-icon-btn close-btn"
            onClick={() => {
              if (typeof window !== "undefined" && window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
              onClose();
            }}
            title="Close chat window (Esc)"
            aria-label="Close chat window"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="ciel-chat-body">
        {messages.length === 0 ? (
          <div className="ciel-chat-welcome">
            <div className="ciel-welcome-badge">
              <Sparkles size={26} className="text-amber-400" />
            </div>
            <h4 className="ciel-welcome-title">Hi! I&apos;m Ciela, CIEL&apos;s AI Guide.</h4>
            <p className="ciel-welcome-desc">
              Ask me about incubation facilities, startup seed funding, mentorship clinics,
              or Student Innovation Council (SiC) initiatives—or speak with me using the microphone!
            </p>

            <div className="ciel-prompt-chips-section">
              <span className="chips-heading">Explore CIEL Programs</span>
              <div className="ciel-prompt-bento-grid">
                {FEATURED_PROMPTS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={i}
                      type="button"
                      className="ciel-bento-chip"
                      onClick={() => handleSend(item.query)}
                    >
                      <div className="bento-chip-icon-wrap">
                        <Icon size={14} className="bento-icon" />
                      </div>
                      <div className="bento-chip-content">
                        <span className="bento-chip-title">{item.label}</span>
                        <span className="bento-chip-sub">{item.query}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="ciel-messages-list">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {loading && (
              <div className="ciel-chat-msg-row bot-row">
                <div className="ciel-chat-avatar bot-avatar">
                  <Sparkles size={15} className="sparkle-icon animate-pulse" />
                </div>
                <div className="ciel-chat-bubble bot-bubble loading-bubble">
                  <div className="ciel-typing-indicator">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                  <span className="loading-text">Ciela is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Speech Notification / Error */}
      {speechError && (
        <div className="ciel-chat-error-bar">
          <span>{speechError}</span>
        </div>
      )}

      {/* Footer / Input Bar with Voice Input */}
      <div className="ciel-chat-footer">
        <form
          className={`ciel-chat-input-form ${isListening ? "is-recording" : ""}`}
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            ref={inputRef}
            type="text"
            className="ciel-chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening... speak now" : "Ask Ciela about incubation, grants..."}
            disabled={loading}
          />

          {/* Microphone Voice Input Button */}
          <button
            type="button"
            className={`ciel-chat-mic-btn ${isListening ? "listening" : ""}`}
            onClick={toggleListening}
            title={isListening ? "Stop listening" : "Speak your question to Ciela"}
            aria-label={isListening ? "Stop listening" : "Speak to Ciela"}
          >
            {isListening ? (
              <div className="mic-rec-active">
                <span className="rec-wave-bar" />
                <span className="rec-wave-bar" />
                <span className="rec-wave-bar" />
                <MicOff size={15} className="ml-1" />
              </div>
            ) : (
              <Mic size={16} />
            )}
          </button>

          <button
            type="submit"
            className="ciel-chat-send-btn"
            disabled={!input.trim() || loading}
            title="Send question (Enter)"
            aria-label="Send question"
          >
            <SendHorizontal size={16} />
          </button>
        </form>
        <div className="ciel-chat-disclaimer">
          <Info size={11} className="inline-icon" />
          <span>Grounded in CIEL official documentation · Powered by Gemini</span>
        </div>
      </div>
    </div>
  );
}
