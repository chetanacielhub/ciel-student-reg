"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="shell page-section">
      <div className="section-heading">
        <span className="eyebrow">
          <Mail size={14} className="text-gold" />
          Institutional Reach
        </span>
        <h1 style={{ marginTop: 16 }}>Contact &amp; Campus Location</h1>
        <p>
          Connect with CIEL incubation officers, schedule a makerspace lab tour, or submit partnership proposals.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: 64 }}>
        {/* Contact Info Card */}
        <article className="luxury-card">
          <h2 style={{ fontSize: 24, marginBottom: 20 }}>CIEL Innovation Hub Office</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div className="card-icon-wrap" style={{ width: 40, height: 40, margin: 0 }}>
                <MapPin size={20} />
              </div>
              <div>
                <strong style={{ color: "var(--text-white)", display: "block" }}>Campus Location</strong>
                <span style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
                  Centre for Innovation &amp; Entrepreneurship Learning (CIEL),<br />
                  409,Chetana Campus, Survey No. 34, Bandra East, Mumbai, Maharashtra 400051.
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div className="card-icon-wrap" style={{ width: 40, height: 40, margin: 0 }}>
                <Mail size={20} />
              </div>
              <div>
                <strong style={{ color: "var(--text-white)", display: "block" }}>Email Inquiries</strong>
                <span style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
                  info@cielhub.org
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div className="card-icon-wrap" style={{ width: 40, height: 40, margin: 0 }}>
                <Phone size={20} />
              </div>
              <div>
                <strong style={{ color: "var(--text-white)", display: "block" }}>Desk Phone</strong>
                <span style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
                  +91 (022) 2651-3400 / Ext 108
                </span>
              </div>
            </div>
          </div>
        </article>

        {/* Inquiry Form */}
        <article className="luxury-card">
          <h2 style={{ fontSize: 24, marginBottom: 16 }}>Send an Inquiry</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you. Your inquiry has been sent to CIEL Office.");
            }}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div>
              <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Full Name</label>
              <input type="text" className="input" placeholder="e.g. Dr. Rajesh Kulkarni" required />
            </div>

            <div>
              <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Email Address</label>
              <input type="email" className="input" placeholder="name@institution.edu" required />
            </div>

            <div>
              <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Inquiry Category</label>
              <select className="select" style={{ width: "100%" }}>
                <option value="incubation">Startup Incubation Inquiry</option>
                <option value="ipr">IPR &amp; Patent Filing</option>
                <option value="mou">Industry MoU &amp; Sponsorship</option>
                <option value="mentor">Mentorship Application</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Message</label>
              <textarea className="input" rows={4} placeholder="Detail your inquiry..." required style={{ resize: "vertical" }} />
            </div>

            <button className="button button-primary" type="submit" style={{ marginTop: 8 }}>
              <Send size={16} /> Send Message
            </button>
          </form>
        </article>
      </div>
    </div>
  );
}
