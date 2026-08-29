import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, Flame, Gift, Heart, Package, Sparkles, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Social Entrepreneurship & Women Empowerment | CIEL",
  description:
    "Empowering women entrepreneurs through Yearly Women Entrepreneur Summits, Jewellery Making Training, Diwali Mela, and Sustainable Packaging Workshops at CIEL.",
};

export default function SocialImpactPage() {
  return (
    <section className="shell page-section">
      <div className="section-heading" style={{ margin: "0 auto 36px" }}>
        <div className="section-heading-row">
          <span className="eyebrow">
            <Heart size={14} className="text-gold" />
            Social Entrepreneurship &amp; Empowerment
          </span>
          <h1>Social Entrepreneurship &amp; Women Empowerment</h1>
        </div>
        <p style={{ fontSize: "18px" }}>
          Dedicated to driving women-led entrepreneurship, vocational skill mastery, festive marketplaces, and sustainable business training to empower women to start and scale their own ventures.
        </p>
      </div>

      {/* Core Social Entrepreneurship Initiatives */}
      <div className="grid-2" style={{ gap: "24px", marginBottom: "60px" }}>
        <div className="luxury-card">
          <div className="card-icon-wrap">
            <Award size={26} />
          </div>
          <h3>Yearly Women Entrepreneur Summit</h3>
          <p style={{ fontSize: "15px", lineHeight: "1.7", marginBottom: 16 }}>
            Our annual flagship gathering celebrating, inspiring, and connecting women founders, industry leaders, and aspiring student innovators with ecosystem resources and networks.
          </p>
          <ul className="card-list">
            <li><CheckCircle2 size={16} /> Keynote Sessions &amp; Panel Discussions</li>
            <li><CheckCircle2 size={16} /> Women Founder Showcases &amp; Networking</li>
            <li><CheckCircle2 size={16} /> Mentorship &amp; Business Guidance</li>
          </ul>
        </div>

        <div className="luxury-card">
          <div className="card-icon-wrap">
            <Sparkles size={26} />
          </div>
          <h3>Jewellery Making &amp; Craft Training</h3>
          <p style={{ fontSize: "15px", lineHeight: "1.7", marginBottom: 16 }}>
            Hands-on vocational jewellery designing and creation workshops providing practical craft skills and business training to help women launch their independent ventures.
          </p>
          <ul className="card-list">
            <li><CheckCircle2 size={16} /> Artisanal Jewellery Crafting Workshops</li>
            <li><CheckCircle2 size={16} /> Micro-Business Setup &amp; Pricing Guidance</li>
            <li><CheckCircle2 size={16} /> Direct Market Selling Strategy</li>
          </ul>
        </div>

        <div className="luxury-card">
          <div className="card-icon-wrap">
            <Flame size={26} />
          </div>
          <h3>Diwali Mela for Women Entrepreneurs</h3>
          <p style={{ fontSize: "15px", lineHeight: "1.7", marginBottom: 16 }}>
            A festive campus marketplace and exhibition platform encouraging women artisans and entrepreneurs to display, market, and sell their handmade products to thousands of buyers.
          </p>
          <ul className="card-list">
            <li><CheckCircle2 size={16} /> Exclusive Exhibition Stalls for Women Founders</li>
            <li><CheckCircle2 size={16} /> Live Consumer Sales &amp; Customer Feedback</li>
            <li><CheckCircle2 size={16} /> Promotional Support &amp; Community Outreach</li>
          </ul>
        </div>

        <div className="luxury-card">
          <div className="card-icon-wrap">
            <Package size={26} />
          </div>
          <h3>Sustainable Packaging &amp; Training Workshops</h3>
          <p style={{ fontSize: "15px", lineHeight: "1.7", marginBottom: 16 }}>
            Practical workshops focused on eco-friendly sustainable packaging solutions, product branding, supply chain basics, and business management essentials for women.
          </p>
          <ul className="card-list">
            <li><CheckCircle2 size={16} /> Eco-Friendly &amp; Biodegradable Packaging Skills</li>
            <li><CheckCircle2 size={16} /> Product Branding &amp; Presentation Masterclasses</li>
            <li><CheckCircle2 size={16} /> Business Upscaling &amp; Inventory Management</li>
          </ul>
        </div>
      </div>

      {/* Call to action */}
      <div className="luxury-card" style={{ padding: "40px", textAlign: "center" }}>
        <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>Join Our Women Empowerment Programs</h2>
        <p style={{ fontSize: "15px", color: "var(--text-secondary)", maxWidth: "560px", margin: "0 auto 28px" }}>
          Participate in our upcoming workshops, showcase your products at Diwali Mela, or join our Women Entrepreneur Summit.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <Link className="button button-primary button-large" href="/register">
            Register for Workshops
            <ArrowRight size={18} />
          </Link>
          <Link className="button button-secondary button-large" href="/contact">
            Partner with Us
          </Link>
        </div>
      </div>
    </section>
  );
}
