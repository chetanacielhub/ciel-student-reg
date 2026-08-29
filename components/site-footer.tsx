import Link from "next/link";
import { Logo } from "@/components/ui/logo";

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

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
            <div className="footer-social-links">
              <a
                href="https://www.linkedin.com/company/ciel-center-for-innovation-and-entrepreneurship-learning"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
                aria-label="CIEL on LinkedIn"
              >
                <LinkedinIcon size={18} />
              </a>
              <a
                href="https://www.instagram.com/ciel_chetana?igsh=MWFpc285OWd0bTJqYg%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
                aria-label="CIEL on Instagram"
              >
                <InstagramIcon size={18} />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Ecosystem Verticals</h4>
            <ul>
              <li><Link href="/incubation">Incubation Cell</Link></li>
              <li><Link href="/accelerator">Startup Accelerator</Link></li>
              <li><Link href="/social-impact">Social Impact &amp; Rural Hub</Link></li>
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
              <li><Link href="/events">Events &amp; Workshops</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Portal &amp; Resources</h4>
            <ul>
              <li><Link href="/register">Apply for Incubation</Link></li>
              <li><Link href="/dashboard">Participant Portal</Link></li>
              <li><Link href="/forms">Google Forms Hub</Link></li>
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
