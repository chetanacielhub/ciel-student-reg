import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Compass,
  ArrowRight,
  Home,
  Rocket,
  Lightbulb,
  Users,
  Search,
  HelpCircle,
  FileText,
} from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Page Not Found | CIEL Innovation Hub",
  description:
    "The requested institutional page or venture resource could not be found within the CIEL ecosystem.",
};

const QUICK_NAV = [
  {
    title: "Incubation Programs",
    desc: "Stage-gated seed grants, prototyping labs & venture scaling.",
    href: "/incubation",
    icon: Rocket,
  },
  {
    title: "Innovator Registration",
    desc: "Submit your student or faculty venture for institutional review.",
    href: "/register",
    icon: FileText,
  },
  {
    title: "Mentors & Advisory",
    desc: "Connect with industry leaders, patent attorneys & sector experts.",
    href: "/mentors",
    icon: Users,
  },
  {
    title: "Venture Showcase",
    desc: "Explore featured startups, prototypes and intellectual property.",
    href: "/showcase",
    icon: Lightbulb,
  },
];

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="site-main">
        <div className="shell page-section" style={{ minHeight: "75vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "80px 24px" }}>
          
          {/* Main Error Box */}
          <div
            className="luxury-card"
            style={{
              maxWidth: 780,
              width: "100%",
              textAlign: "center",
              padding: "56px 36px",
              marginBottom: 48,
              position: "relative",
            }}
          >
            {/* Top Glow & Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 999, background: "rgba(212, 175, 55, 0.12)", border: "1px solid var(--ciel-gold-border)", marginBottom: 20 }}>
              <Compass size={15} className="text-gold" />
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "1px", color: "var(--ciel-gold-bright)", textTransform: "uppercase" }}>
                Error 404 · Navigation Signal
              </span>
            </div>

            {/* Giant 404 Display */}
            <div
              style={{
                fontSize: "clamp(72px, 12vw, 120px)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                background: "linear-gradient(135deg, #FFFFFF 0%, #F5D77F 45%, #D4AF37 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: 16,
                userSelect: "none",
              }}
            >
              404
            </div>

            <h1 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800, color: "var(--text-white)", marginBottom: 16, lineHeight: 1.25 }}>
              Venture Off Course — Page Not Found
            </h1>

            <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 32px" }}>
              The institutional resource, page, or portal segment you requested does not exist or has been relocated within the CIEL innovation ecosystem.
            </p>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 12 }}>
              <Link className="button button-primary" href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Home size={16} /> Return to Homepage
              </Link>
              <Link className="button button-secondary" href="/incubation" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Rocket size={16} /> Explore Programs
              </Link>
              <Link className="button button-secondary" href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <HelpCircle size={16} /> Contact Support
              </Link>
            </div>
          </div>

          {/* Quick Navigation Directory */}
          <div style={{ maxWidth: 880, width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-white)", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Search size={18} className="text-gold" />
                Popular Ecosystem Destinations
              </h2>
              <p style={{ fontSize: 13.5, color: "var(--text-secondary)", margin: 0 }}>
                Explore active programs, incubator registration, or advisory networks
              </p>
            </div>

            <div className="grid-2" style={{ gap: 18 }}>
              {QUICK_NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="luxury-card"
                    style={{
                      padding: 22,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 16,
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <div
                      className="card-icon-wrap"
                      style={{
                        width: 44,
                        height: 44,
                        marginBottom: 0,
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px", color: "var(--text-white)", display: "flex", alignItems: "center", gap: 6 }}>
                        {item.title}
                        <ArrowRight size={14} className="text-gold" />
                      </h3>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </main>
      <SiteFooter />
    </>
  );
}
