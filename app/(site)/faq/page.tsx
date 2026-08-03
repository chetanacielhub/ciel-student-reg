import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HelpCircle, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | CIEL",
  description:
    "Common questions regarding CIEL startup incubation, seed grant eligibility, patent filing, and team registration.",
};

const FAQS = [
  {
    q: "Who is eligible to apply for CIEL Incubation?",
    a: "Undergraduate and postgraduate students, alumni, faculty researchers, early-stage startup founders, and MSMEs affiliated with or supported by CIEL are eligible to apply.",
  },
  {
    q: "What amount of seed funding is offered to selected startups?",
    a: "Selected incubated ventures can receive up to ₹5 Lakhs in seed grant support based on milestone progression, prototype viability, and committee review.",
  },
  {
    q: "How does team registration work for hackathons and incubation?",
    a: "The Team Leader registers the official project first and defines the team name. Team members then register by selecting their campus/department and entering the exact same team name.",
  },
  {
    q: "Who owns the Intellectual Property (IP) created during incubation?",
    a: "Student founders retain primary IP ownership as per the institutional IPR policy handbook. CIEL provides legal patent drafting assistance and technology transfer support.",
  },
  {
    q: "Are solo founders allowed to register?",
    a: "Yes. Innovators can register as a Solo Participant and receive prototyping support, mentorship, and team-matching opportunities.",
  },
];

export default function FAQPage() {
  return (
    <div className="shell page-section">
      <div className="section-heading">
        <span className="eyebrow">
          <HelpCircle size={14} className="text-gold" />
          Knowledge Base
        </span>
        <h1 style={{ marginTop: 16 }}>Frequently Asked Questions</h1>
        <p>
          Find answers to common queries regarding incubation eligibility, seed funding, team formation, and patent support.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 64, maxWidth: 900, margin: "0 auto 64px" }}>
        {FAQS.map((faq) => (
          <article className="luxury-card" key={faq.q} style={{ padding: 28 }}>
            <h3 style={{ fontSize: 19, color: "var(--text-white)", marginBottom: 10 }}>{faq.q}</h3>
            <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
          </article>
        ))}
      </div>

      <div className="status-card" style={{ maxWidth: "100%", textAlign: "center" }}>
        <h2>Still Have Questions?</h2>
        <p style={{ maxWidth: 540, margin: "12px auto 24px" }}>
          Our incubation managers and Student Innovation Council leads are ready to assist you.
        </p>
        <div className="inline-actions" style={{ justifyContent: "center" }}>
          <Link className="button button-primary" href="/contact">
            Contact CIEL Office
          </Link>
          <Link className="button button-secondary" href="/register">
            Submit Incubation Form <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
