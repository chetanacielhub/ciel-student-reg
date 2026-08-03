import Link from "next/link";
import {
  ChevronDown,
  Compass,
  FileText,
  Flame,
  Globe,
  Heart,
  Home,
  Images,
  LayoutDashboard,
  Lightbulb,
  Microscope,
  Rocket,
  Shield,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        {/* Institutional Logo */}
        <Logo />

        {/* Primary Navigation */}
        <nav className="header-nav" aria-label="Primary navigation">
          {/* Explicit Home Link */}
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

        {/* Action Controls */}
        <div className="header-actions">
          <ThemeToggle />
          <Link className="nav-cta" href="/apply">
            Apply for Incubation
          </Link>
          {signedIn ? (
            <>
              <Link className="button button-secondary button-small" href="/dashboard">
                <LayoutDashboard size={14} aria-hidden="true" />
                Dashboard
              </Link>
              <form action="/auth/sign-out" method="post">
                <button className="button button-ghost button-small" type="submit">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link className="button button-ghost button-small" href="/auth/sign-in">
                Sign in
              </Link>
              <Link className="button button-primary button-small" href="/auth/sign-up">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
