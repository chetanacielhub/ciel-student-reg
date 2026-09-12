"use client";

import { useState, useEffect, useRef } from "react";
import { Smartphone, Share, Plus, X, Download, ChevronUp } from "lucide-react";

const INSTALLED_KEY = "ciel_emp_pwa_installed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Platform = "android" | "ios" | "desktop" | null;

/**
 * useEmpInstall — hook that wires up the PWA install logic.
 * Returns a button ref, platform, readiness, and trigger function.
 */
export function useEmpInstall() {
  const [platform, setPlatform] = useState<Platform>(null);
  const [installed, setInstalled] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (localStorage.getItem(INSTALLED_KEY) === "1") {
      setInstalled(true);
      return;
    }
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
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
      setPlatform("ios");
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setPlatform(isAndroid ? "android" : "desktop");
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      localStorage.setItem(INSTALLED_KEY, "1");
    });
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const triggerInstall = async (): Promise<"native" | "ios" | "already" | "unavailable"> => {
    if (installed) return "already";
    if (platform === "ios") return "ios";
    if (!deferredPrompt.current) return "unavailable";

    await deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    deferredPrompt.current = null;
    if (outcome === "accepted") {
      setInstalled(true);
      localStorage.setItem(INSTALLED_KEY, "1");
    }
    return "native";
  };

  return { platform, installed, triggerInstall };
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Topbar Install Button + iOS Guide Modal                                      */
/* ─────────────────────────────────────────────────────────────────────────── */

export function EmpInstallButton() {
  const { platform, installed, triggerInstall } = useEmpInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installing, setInstalling] = useState(false);

  // Don't render once already installed or if platform is undetected yet
  if (installed || platform === null) return null;

  const handleClick = async () => {
    setInstalling(true);
    const result = await triggerInstall();
    setInstalling(false);
    if (result === "ios") setShowIOSGuide(true);
  };

  return (
    <>
      {/* ── Topbar Button ─────────────────────────────────────────────────── */}
      <button
        id="emp-install-btn"
        className="emp-install-topbar-btn"
        onClick={handleClick}
        disabled={installing}
        title="Add CIEL EMP to Home Screen"
        aria-label="Add to Home Screen"
      >
        {installing ? (
          <span className="emp-pwa-spinner" />
        ) : (
          <Smartphone size={15} />
        )}
        <span className="emp-install-btn-label">
          {platform === "ios" ? "Add to Home Screen" : "Install App"}
        </span>
      </button>

      {/* ── iOS Step-by-Step Guide Modal ──────────────────────────────────── */}
      {showIOSGuide && (
        <div
          className="emp-pwa-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="iOS install guide"
          onClick={(e) => { if (e.target === e.currentTarget) setShowIOSGuide(false); }}
        >
          <div className="emp-pwa-modal">
            <button
              className="emp-pwa-modal-close"
              onClick={() => setShowIOSGuide(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="emp-pwa-modal-icon">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ciel-favicon.png" alt="CIEL" width={52} height={52} />
            </div>
            <h2 className="emp-pwa-modal-title">Add to Home Screen</h2>
            <p className="emp-pwa-modal-subtitle">
              Install the CIEL EMP portal as an app on your iPhone
            </p>

            <ol className="emp-pwa-steps">
              <li className="emp-pwa-step">
                <span className="emp-pwa-step-num">1</span>
                <div className="emp-pwa-step-body">
                  <Share size={18} className="emp-pwa-step-icon" />
                  <div>
                    <p className="emp-pwa-step-title">Tap the Share button</p>
                    <p className="emp-pwa-step-desc">
                      Found at the bottom of Safari&apos;s toolbar
                    </p>
                  </div>
                </div>
              </li>
              <li className="emp-pwa-step">
                <span className="emp-pwa-step-num">2</span>
                <div className="emp-pwa-step-body">
                  <Plus size={18} className="emp-pwa-step-icon" />
                  <div>
                    <p className="emp-pwa-step-title">
                      Tap &ldquo;Add to Home Screen&rdquo;
                    </p>
                    <p className="emp-pwa-step-desc">
                      Scroll down in the share sheet to find it
                    </p>
                  </div>
                </div>
              </li>
              <li className="emp-pwa-step">
                <span className="emp-pwa-step-num">3</span>
                <div className="emp-pwa-step-body">
                  <Download size={18} className="emp-pwa-step-icon" />
                  <div>
                    <p className="emp-pwa-step-title">Tap &ldquo;Add&rdquo; to confirm</p>
                    <p className="emp-pwa-step-desc">
                      The CIEL EMP icon will appear on your Home Screen
                    </p>
                  </div>
                </div>
              </li>
            </ol>

            <div className="emp-pwa-arrow-hint">
              <ChevronUp size={20} />
              <span>Tap the share icon in the toolbar below</span>
            </div>

            <button
              className="emp-pwa-modal-done"
              onClick={() => setShowIOSGuide(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/** @deprecated Use EmpInstallButton placed in topbar instead */
export function EmpInstallPrompt() {
  return null;
}
