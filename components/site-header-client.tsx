"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Compass,
  FileText,
  Globe,
  Heart,
  Home,
  Images,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
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
              <Link className="dropdown-link" href="/governance">
                <Shield size={15} /> Governance
              </Link>
              <Link className="dropdown-link" href="/student-council">
                <Users size={15} /> Student Innovation Council
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
              <Link className="dropdown-link" href="/research-ipr">
                <Microscope size={15} /> Research &amp; IPR Cell
              </Link>
              <Link className="dropdown-link" href="/showcase">
                <Trophy size={15} /> Incubated Portfolio
              </Link>
              <Link className="dropdown-link" href="/mentors">
                <UserCheck size={15} /> Mentors Network
              </Link>
            </div>
          </div>

          <Link className="nav-link" href="/partners">
            <Globe size={14} /> Partners
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

          <Link className="nav-cta desktop-only-cta" href="/apply">
            Apply for Incubation
          </Link>

          <div className="desktop-only-auth">
            {signedIn ? (
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Link className="button button-secondary button-small" href="/dashboard">
                  <LayoutDashboard size={14} aria-hidden="true" />
                  Dashboard
                </Link>
                <form action="/auth/sign-out" method="post">
                  <button className="button button-ghost button-small" type="submit">
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

          {/* Mobile Hamburger Toggle Button (Phones <= 768px) */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open mobile menu"}
            type="button"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Phones <= 768px) */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <span className="eyebrow" style={{ fontSize: 11 }}>CIEL Navigation</span>
              <button
                className="mobile-drawer-close"
                onClick={() => setMobileMenuOpen(false)}
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="mobile-drawer-nav">
              <Link className="mobile-nav-link" href="/" onClick={() => setMobileMenuOpen(false)}>
                <Home size={18} /> Home
              </Link>
              <Link className="mobile-nav-link" href="/about" onClick={() => setMobileMenuOpen(false)}>
                <Compass size={18} /> Vision &amp; Mission
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
              <Link className="mobile-nav-link" href="/research-ipr" onClick={() => setMobileMenuOpen(false)}>
                <Microscope size={18} /> Research &amp; IPR Cell
              </Link>
              <Link className="mobile-nav-link" href="/showcase" onClick={() => setMobileMenuOpen(false)}>
                <Trophy size={18} /> Incubated Portfolio
              </Link>
              <Link className="mobile-nav-link" href="/student-council" onClick={() => setMobileMenuOpen(false)}>
                <Users size={18} /> Student Council
              </Link>
              <Link className="mobile-nav-link" href="/partners" onClick={() => setMobileMenuOpen(false)}>
                <Globe size={18} /> Partners
              </Link>
              <Link className="mobile-nav-link" href="/gallery" onClick={() => setMobileMenuOpen(false)}>
                <Images size={18} /> Gallery
              </Link>
              <Link className="mobile-nav-link" href="/contact" onClick={() => setMobileMenuOpen(false)}>
                Contact Office
              </Link>
            </nav>

            <div className="mobile-drawer-actions">
              <Link className="button button-primary button-wide" href="/apply" onClick={() => setMobileMenuOpen(false)}>
                Apply for Incubation
              </Link>
              {signedIn ? (
                <Link className="button button-secondary button-wide" href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <LayoutDashboard size={16} /> Open Dashboard
                </Link>
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
      )}
    </header>
  );
}
