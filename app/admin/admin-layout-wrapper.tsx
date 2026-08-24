"use client";

import { useState, useEffect } from "react";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("ciel_admin_theme") as "dark" | "light";
    const currentTheme = saved || "dark";
    setTheme(currentTheme);
    document.documentElement.setAttribute("data-theme", currentTheme);
    document.body.setAttribute("data-theme", currentTheme);
    if (currentTheme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  }, []);

  return (
    <div className="admin-portal" data-theme={theme}>
      {children}
    </div>
  );
}

