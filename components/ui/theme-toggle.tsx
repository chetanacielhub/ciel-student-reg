"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("ciel-theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      document.body.classList.remove("dark-theme", "light-theme");
      document.body.classList.add(`${saved}-theme`);
    } else {
      document.body.classList.add("dark-theme");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("ciel-theme", nextTheme);
    document.body.classList.remove("dark-theme", "light-theme");
    document.body.classList.add(`${nextTheme}-theme`);
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
