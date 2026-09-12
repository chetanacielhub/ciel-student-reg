"use client";

import { useState, useEffect, useRef } from "react";
import { Download, Share, X, Smartphone, Plus, ChevronUp } from "lucide-react";

const DISMISSED_KEY = "ciel_emp_pwa_dismissed";
const INSTALLED_KEY = "ciel_emp_pwa_installed";

type InstallMode = "android" | "ios" | "desktop" | null;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function EmpInstallPrompt() {
  const [mode, setMode] = useState<InstallMode>(null);
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Don't show if already dismissed or installed
    if (
      localStorage.getItem(DISMISSED_KEY) === "1" ||
      localStorage.getItem(INSTALLED_KEY) === "1"
    ) {
      return;
    }

    // Don't show if already running as a standalone PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      localStorage.setItem(INSTALLED_KEY, "1");
      return;
    }

    const ua = navigator.userAgent;
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(ua);
    const isSafariIOS = isIOS && /Safari/.test(ua) && !/CriOS|FxiOS/.test(ua);

    if (isSafariIOS) {
      // iOS Safari — no beforeinstallprompt, show manual guide
      setMode("ios");
      setTimeout(() => setVisible(true), 2000);
      return;
    }

    // Chrome / Edge / Samsung / Firefox (supports beforeinstallprompt)
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setMode(isAndroid ? "android" : "desktop");
      setTimeout(() => setVisible(true), 1500);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Track if the app was installed
    window.addEventListener("appinstalled", () => {
      localStorage.setItem(INSTALLED_KEY, "1");
      setVisible(false);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (mode === "ios") {
      setShowIOSGuide(true);
      return;
    }
    if (!deferredPrompt.current) return;

    setInstalling(true);
    await deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;

    if (outcome === "accepted") {
      localStorage.setItem(INSTALLED_KEY, "1");
    }

    deferredPrompt.current = null;
    setInstalling(false);
    setVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
    setShowIOSGuide(false);
  };

  if (!visible && !showIOSGuide) return null;

  return (
    <>
      {/* ── Main Banner ────────────────────────────────────────────────────── */}
      {visible && (
        <div className="emp-pwa-banner" role="banner" aria-label="Install app prompt">
          <div className="emp-pwa-banner-inner">
            {/* Icon */}
            <div className="emp-pwa-icon">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ciel-favicon.png" alt="CIEL" width={40} height={40} />
            </div>

            {/* Text */}
            <div className="emp-pwa-text">
              <p className="emp-pwa-title">Add to Home Screen</p>
              <p className="emp-pwa-subtitle">
                {mode === "ios"
                  ? "Install the CIEL EMP portal for quick access"
                  : "Install the CIEL EMP portal as an app"}
              </p>
            </div>

            {/* Actions */}
            <div className="emp-pwa-actions">
              <button
                className="emp-pwa-install-btn"
                onClick={handleInstall}
                disabled={installing}
                aria-label="Install app"
              >
                {mode === "ios" ? (
                  <><Share size={14} /> How?</>
                ) : installing ? (
                  <span className="emp-pwa-spinner" />
                ) : (
                  <><Download size={14} /> Install</>
                )}
              </button>

              <button
                className="emp-pwa-dismiss-btn"
                onClick={handleDismiss}
                aria-label="Dismiss install prompt"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── iOS Manual Guide Modal ─────────────────────────────────────────── */}
      {showIOSGuide && (
        <div className="emp-pwa-overlay" role="dialog" aria-modal="true" aria-label="iOS install guide">
          <div className="emp-pwa-modal">
            {/* Close */}
            <button className="emp-pwa-modal-close" onClick={() => { setShowIOSGuide(false); handleDismiss(); }} aria-label="Close guide">
              <X size={18} />
            </button>

            {/* Header */}
            <div className="emp-pwa-modal-icon">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ciel-favicon.png" alt="CIEL" width={52} height={52} />
            </div>
            <h2 className="emp-pwa-modal-title">Install CIEL EMP Portal</h2>
            <p className="emp-pwa-modal-subtitle">Follow these steps to add it to your Home Screen</p>

            {/* Steps */}
            <ol className="emp-pwa-steps">
              <li className="emp-pwa-step">
                <span className="emp-pwa-step-num">1</span>
                <div className="emp-pwa-step-body">
                  <Share size={18} className="emp-pwa-step-icon" />
                  <div>
                    <p className="emp-pwa-step-title">Tap the Share button</p>
                    <p className="emp-pwa-step-desc">Found at the bottom of your Safari browser</p>
                  </div>
                </div>
              </li>

              <li className="emp-pwa-step">
                <span className="emp-pwa-step-num">2</span>
                <div className="emp-pwa-step-body">
                  <Plus size={18} className="emp-pwa-step-icon" />
                  <div>
                    <p className="emp-pwa-step-title">Tap &ldquo;Add to Home Screen&rdquo;</p>
                    <p className="emp-pwa-step-desc">Scroll down in the share sheet to find this option</p>
                  </div>
                </div>
              </li>

              <li className="emp-pwa-step">
                <span className="emp-pwa-step-num">3</span>
                <div className="emp-pwa-step-body">
                  <Smartphone size={18} className="emp-pwa-step-icon" />
                  <div>
                    <p className="emp-pwa-step-title">Tap &ldquo;Add&rdquo; to confirm</p>
                    <p className="emp-pwa-step-desc">The CIEL EMP icon will appear on your Home Screen</p>
                  </div>
                </div>
              </li>
            </ol>

            {/* Arrow indicator for share button */}
            <div className="emp-pwa-arrow-hint">
              <ChevronUp size={20} />
              <span>Tap the share icon in the toolbar below</span>
            </div>

            <button className="emp-pwa-modal-done" onClick={() => { setShowIOSGuide(false); handleDismiss(); }}>
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
