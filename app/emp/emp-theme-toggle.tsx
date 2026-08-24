"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function EmpThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const applyTheme = (t: "dark" | "light") => {
    setTheme(t);
    localStorage.setItem("ciel_emp_theme", t);
    document.documentElement.setAttribute("data-emp-theme", t);
    const targets = document.querySelectorAll(".emp-portal");
    targets.forEach((el) => el.setAttribute("data-theme", t));
  };

  useEffect(() => {
    const saved = (localStorage.getItem("ciel_emp_theme") as "dark" | "light") || "dark";
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
      className="emp-btn emp-btn-secondary emp-btn-sm"
      style={{ width: "auto", cursor: "pointer" }}
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
    >
      {theme === "dark" ? (
        <Sun size={15} style={{ color: "#fbbf24" }} />
      ) : (
        <Moon size={15} style={{ color: "#3b82f6" }} />
      )}
      <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
}
