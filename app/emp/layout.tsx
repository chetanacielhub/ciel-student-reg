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

  return (
    <div className="emp-portal" data-theme={theme}>
      {children}
    </div>
  );
}
