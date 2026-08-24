"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function AdminThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const applyTheme = (t: "dark" | "light") => {
    setTheme(t);
    localStorage.setItem("ciel_admin_theme", t);
    document.documentElement.setAttribute("data-theme", t);
    document.body.setAttribute("data-theme", t);
    if (t === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }

    const targets = document.querySelectorAll(".admin-portal, .admin-login-page, .adm-shell");
    targets.forEach((el) => el.setAttribute("data-theme", t));
  };

  useEffect(() => {
    const saved = (localStorage.getItem("ciel_admin_theme") as "dark" | "light") || "dark";
    applyTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="button button-outline button-sm"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        cursor: "pointer",
        padding: "6px 12px",
        fontSize: "12px",
        borderRadius: "8px",
        border: "1px solid var(--ciel-gold-border)",
        background: theme === "dark" ? "rgba(212, 175, 55, 0.1)" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#0f172a",
      }}
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
    >
      {theme === "dark" ? (
        <Sun size={14} style={{ color: "#fbbf24" }} />
      ) : (
        <Moon size={14} style={{ color: "#2563eb" }} />
      )}
      <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
}

