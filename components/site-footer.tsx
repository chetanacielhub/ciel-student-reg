import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <p>
              Centre for Innovation &amp; Entrepreneurship Learning (CIEL) is an institutional innovation ecosystem committed to transforming ideas into impactful ventures through experiential learning, strategic incubation, venture acceleration, and social innovation.
            </p>
          </div>

          <div className="footer-col">
            <h4>Ecosystem Verticals</h4>
            <ul>
              <li><Link href="/incubation">Incubation Cell</Link></li>
              <li><Link href="/accelerator">Startup Accelerator</Link></li>
              <li><Link href="/social-impact">Social Impact &amp; Rural Hub</Link></li>
              <li><Link href="/research-ipr">Research &amp; IPR Cell</Link></li>
              <li><Link href="/showcase">Startup Showcase</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Governance &amp; Leadership</h4>
            <ul>
              <li><Link href="/about">Vision &amp; Mission</Link></li>
              <li><Link href="/governance">Governance Structure</Link></li>
              <li><Link href="/student-council">Student Innovation Council</Link></li>
              <li><Link href="/mentors">Mentors Directory</Link></li>
              <li><Link href="/partners">Partners &amp; MoUs</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Portal &amp; Resources</h4>
            <ul>
              <li><Link href="/register">Apply for Incubation</Link></li>
              <li><Link href="/dashboard">Participant Portal</Link></li>
              <li><Link href="/downloads">Policy Manuals &amp; Downloads</Link></li>
              <li><Link href="/gallery">Photo Gallery</Link></li>
              <li><Link href="/faq">Incubation FAQ</Link></li>
              <li><Link href="/contact">Inquiries &amp; Campus Location</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} CIEL — Centre for Innovation &amp; Entrepreneurship Learning. All rights reserved.</span>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link href="/downloads">Governance Policy</Link>
            <Link href="/downloads">Code of Conduct</Link>
            <Link href="/downloads">IPR Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
