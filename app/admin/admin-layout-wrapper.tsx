"use client";

import { useState, useEffect } from "react";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("ciel_admin_theme") as "dark" | "light";
    if (saved) {
      setTheme(saved);
    }
  }, []);

  return (
    <div className="admin-portal" data-theme={theme}>
      {children}
    </div>
  );
}
