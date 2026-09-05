"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Calendar,
  ChevronDown,
  Compass,
  FileSpreadsheet,
  FileText,
  Globe,
  Heart,
  Home,
  Images,
  Layers,
  LayoutDashboard,
  Lightbulb,
  Menu,
  Microscope,
  Rocket,
  Shield,
  Trophy,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";

export function SiteHeaderClient({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // All hooks must be called before any early returns (Rules of Hooks)
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const mobileDrawer = mobileMenuOpen && mounted ? (
    <div
      className="mobile-drawer-overlay"
      onClick={() => setMobileMenuOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-drawer-header">
          <span className="eyebrow" style={{ fontSize: 11 }}>CIEL Navigation</span>
          <button
            className="mobile-drawer-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            type="button"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="mobile-drawer-nav">
          <Link className="mobile-nav-link" href="/" onClick={() => setMobileMenuOpen(false)}>
            <Home size={18} /> Home
          </Link>
          <Link className="mobile-nav-link" href="/about" onClick={() => setMobileMenuOpen(false)}>
            <Compass size={18} /> Vision &amp; Mission
          </Link>
          <Link className="mobile-nav-link" href="/governance#governing-committee" onClick={() => setMobileMenuOpen(false)}>
            <Shield size={18} /> Governing Committee
          </Link>
          <Link className="mobile-nav-link" href="/governance#joint-steering-committee" onClick={() => setMobileMenuOpen(false)}>
            <Layers size={18} /> Joint-Steering Committee
          </Link>
          <Link className="mobile-nav-link" href="/governance#functional-committee" onClick={() => setMobileMenuOpen(false)}>
            <Award size={18} /> Functional Committee
          </Link>
          <Link className="mobile-nav-link" href="/incubation" onClick={() => setMobileMenuOpen(false)}>
            <Lightbulb size={18} /> Incubation Cell
          </Link>
          <Link className="mobile-nav-link" href="/accelerator" onClick={() => setMobileMenuOpen(false)}>
            <Rocket size={18} /> Startup Accelerator
          </Link>
          <Link className="mobile-nav-link" href="/social-impact" onClick={() => setMobileMenuOpen(false)}>
            <Heart size={18} /> Social Impact Hub
          </Link>
          <Link className="mobile-nav-link" href="/showcase" onClick={() => setMobileMenuOpen(false)}>
            <Trophy size={18} /> Incubated Portfolio
          </Link>
          <Link className="mobile-nav-link" href="/student-council" onClick={() => setMobileMenuOpen(false)}>
            <Users size={18} /> Student Council
          </Link>
          <Link className="mobile-nav-link" href="/downloads" onClick={() => setMobileMenuOpen(false)}>
            <FileText size={18} /> Policy Manuals
          </Link>
          <Link className="mobile-nav-link" href="/events" onClick={() => setMobileMenuOpen(false)}>
            <Calendar size={18} /> Events &amp; Workshops
          </Link>
          <Link className="mobile-nav-link" href="/gallery" onClick={() => setMobileMenuOpen(false)}>
            <Images size={18} /> Gallery
          </Link>
          <Link className="mobile-nav-link" href="/forms" onClick={() => setMobileMenuOpen(false)}>
            <FileSpreadsheet size={18} /> Google Forms Hub
          </Link>
          <Link className="mobile-nav-link" href="/contact" onClick={() => setMobileMenuOpen(false)}>
            <Globe size={18} /> Contact Office
          </Link>
        </nav>

        <div className="mobile-drawer-actions">
          {signedIn ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link className="button button-secondary button-wide" href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <LayoutDashboard size={16} /> Open Dashboard
              </Link>
              <form action="/auth/sign-out" method="post">
                <button className="button button-ghost button-wide" type="submit" style={{ width: "100%" }}>
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Link className="button button-secondary" href="/auth/sign-in" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Link className="button button-primary" href="/auth/sign-up" onClick={() => setMobileMenuOpen(false)}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <header className="site-header">
        <div className="shell header-inner">
          {/* Institutional Logo */}
          <Logo />

          {/* Primary Desktop Navigation */}
          <nav className="header-nav desktop-only-nav" aria-label="Primary navigation">
            <Link className="nav-link" href="/">
              <Home size={14} /> Home
            </Link>

            {/* About dropdown */}
            <div className="nav-item">
              <button className="nav-link nav-link-btn">
                About
                <ChevronDown size={13} aria-hidden="true" />
              </button>
              <div className="nav-dropdown">
                <Link className="dropdown-link" href="/about">
                  <Compass size={15} /> Vision &amp; Mission
                </Link>
                <Link className="dropdown-link" href="/governance#governing-committee">
                  <Shield size={15} /> Governing Committee
                </Link>
                <Link className="dropdown-link" href="/governance#joint-steering-committee">
                  <Layers size={15} /> Joint-Steering Committee
                </Link>
                <Link className="dropdown-link" href="/student-council">
                  <Users size={15} /> Student Innovation Council
                </Link>
                <Link className="dropdown-link" href="/governance#functional-committee">
                  <Award size={15} /> Functional Committee
                </Link>
                <Link className="dropdown-link" href="/downloads">
                  <FileText size={15} /> Policy Manuals
                </Link>
              </div>
            </div>

            {/* Verticals dropdown */}
            <div className="nav-item">
              <button className="nav-link nav-link-btn">
                Verticals &amp; Ecosystem
                <ChevronDown size={13} aria-hidden="true" />
              </button>
              <div className="nav-dropdown">
                <Link className="dropdown-link" href="/incubation">
                  <Lightbulb size={15} /> Incubation Cell
                </Link>
                <Link className="dropdown-link" href="/accelerator">
                  <Rocket size={15} /> Startup Accelerator
                </Link>
                <Link className="dropdown-link" href="/social-impact">
                  <Heart size={15} /> Social Impact Hub
                </Link>
                <Link className="dropdown-link" href="/showcase">
                  <Trophy size={15} /> Incubated Portfolio
                </Link>
                <Link className="dropdown-link" href="/mentors">
                  <UserCheck size={15} /> Mentors Network
                </Link>
              </div>
            </div>

            <Link className="nav-link" href="/forms">
              <FileSpreadsheet size={14} /> Forms
            </Link>

            <Link className="nav-link" href="/events">
              <Calendar size={14} /> Events
            </Link>

            <Link className="nav-link" href="/gallery">
              <Images size={14} /> Gallery
            </Link>

            <Link className="nav-link" href="/contact">
              Contact
            </Link>
          </nav>

          {/* Action Controls & Mobile Hamburger Button */}
          <div className="header-actions">
            <ThemeToggle />

            <div className="desktop-only-auth">
              {signedIn ? (
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Link className="button button-secondary button-small" href="/dashboard">
                    <LayoutDashboard size={14} aria-hidden="true" />
                    Dashboard
                  </Link>
                  <form action="/auth/sign-out" method="post">
                    <button className="btn-signout-red" type="submit">
                      Sign out
                    </button>
                  </form>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Link className="button button-ghost button-small" href="/auth/sign-in">
                    Sign in
                  </Link>
                  <Link className="button button-primary button-small" href="/auth/sign-up">
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open mobile navigation menu"}
              aria-expanded={mobileMenuOpen}
              type="button"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Render Mobile Drawer via Portal at document body root */}
      {mounted && typeof document !== "undefined" && mobileDrawer ? createPortal(mobileDrawer, document.body) : null}
    </>
  );
}

