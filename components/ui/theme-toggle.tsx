"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const applyTheme = (t: "dark" | "light") => {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    document.documentElement.style.colorScheme = t;
    document.body.classList.remove("dark-theme", "light-theme");
    document.body.classList.add(`${t}-theme`);
  };

  useEffect(() => {
    const saved = localStorage.getItem("ciel-theme") as "dark" | "light" | null;
    if (saved) {
      applyTheme(saved);
    } else {
      applyTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("ciel-theme", nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      className="theme-toggle-btn"
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "dark" ? (
        <Sun size={17} className="text-gold" />
      ) : (
        <Moon size={17} className="text-gold" />
      )}
    </button>
  );
}
