import type { Metadata } from "next";
import { CheckCircle2, Heart, Leaf, Sprout, Users, Utensils } from "lucide-react";

export const metadata: Metadata = {
  title: "Social Impact Vertical",
  description: "Women entrepreneurship, skill development, community projects, and rural innovation at CIEL.",
};

export default function SocialImpactPage() {
  return (
    <section className="shell page-section">
      <div className="section-heading" style={{ margin: "0 auto 36px" }}>
        <div className="section-heading-row">
          <span className="eyebrow">
            <Heart size={14} className="text-gold" />
            Community &amp; Sustainability
          </span>
          <h1>Social Impact Vertical</h1>
        </div>
        <p style={{ fontSize: "18px" }}>
          Fostering inclusive entrepreneurship, women-led enterprises, sustainable grassroots technology, and rural livelihood generation aligned with global UN SDGs.
        </p>
      </div>

      <div className="verticals-grid" style={{ marginBottom: "60px" }}>
        <div className="luxury-card">
          <div className="card-icon-wrap">
            <Users size={26} />
          </div>
          <h3>Women Entrepreneurship Cell</h3>
          <p>Dedicated mentorship, specialized grants, and leadership training for women founders and student innovators.</p>
          <ul className="card-list">
            <li><CheckCircle2 size={16} /> Women Founder Grants</li>
            <li><CheckCircle2 size={16} /> Executive Coaching</li>
            <li><CheckCircle2 size={16} /> Women Leadership Seminars</li>
          </ul>
        </div>

        <div className="luxury-card">
          <div className="card-icon-wrap">
            <Sprout size={26} />
          </div>
          <h3>Rural & Agricultural Innovation</h3>
          <p>Supporting solutions for agrarian challenges, water conservation, renewable energy, and rural handicrafts.</p>
          <ul className="card-list">
            <li><CheckCircle2 size={16} /> Farm Tech Solutions</li>
            <li><CheckCircle2 size={16} /> Grassroots Artisan Digitization</li>
            <li><CheckCircle2 size={16} /> Renewable Clean Energy</li>
          </ul>
        </div>

        <div className="luxury-card">
          <div className="card-icon-wrap">
            <Leaf size={26} />
          </div>
          <h3>Skill Development & NGO Partnerships</h3>
          <p>Collaborating with local communities and non-profit organizations for vocational skill development and sustainable livelihoods.</p>
          <ul className="card-list">
            <li><CheckCircle2 size={16} /> Vocational Skill Workshops</li>
            <li><CheckCircle2 size={16} /> NGO Joint Projects</li>
            <li><CheckCircle2 size={16} /> Community Impact Assessments</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
