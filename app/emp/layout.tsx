"use client";

import { useState, useEffect, createContext, useContext } from "react";
import "./emp.css";
import { Sun, Moon } from "lucide-react";

interface EmpThemeContextType {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const EmpThemeContext = createContext<EmpThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export const useEmpTheme = () => useContext(EmpThemeContext);

export function EmpThemeToggle() {
  const { theme, toggleTheme } = useEmpTheme();
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

export default function EmpLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("ciel_emp_theme") as "dark" | "light";
    if (saved) {
      setTheme(saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("ciel_emp_theme", next);
  };

  return (
    <EmpThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="emp-portal" data-theme={theme}>
        {children}
      </div>
    </EmpThemeContext.Provider>
  );
}
