"use client";

import { useState, useEffect } from "react";
import "./emp.css";

export default function EmpLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("ciel_emp_theme") as "dark" | "light";
    if (saved) {
      setTheme(saved);
    }
  }, []);

  // Register the emp service worker for PWA / offline support
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/emp-sw.js", { scope: "/emp/" })
        .catch((err) => console.warn("[CIEL EMP] SW registration failed:", err));
    }
  }, []);

  return (
    <>
      {/* PWA manifest — scoped to /emp */}
      <link rel="manifest" href="/emp-manifest.json" />

      <div className="emp-portal" data-theme={theme}>
        {children}
      </div>
    </>
  );
}
