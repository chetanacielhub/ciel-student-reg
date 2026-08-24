"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, Send, Clock, CheckCircle2, Building2, Globe } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="shell page-section">
      <div className="section-heading">
        <div className="section-heading-row">
          <span className="eyebrow">
            <Mail size={14} className="text-gold" />
            Institutional Reach
          </span>
          <h1>Contact &amp; Campus Location</h1>
        </div>
        <p>
          Connect with CIEL incubation officers, schedule a makerspace lab tour, or submit partnership proposals.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: 48, alignItems: "stretch" }}>
        {/* Contact Info Card */}
        <article className="luxury-card" style={{ padding: "28px 32px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, margin: 0 }}>CIEL Innovation Hub Office</h2>
              <span className="badge badge-brand" style={{ fontSize: 11, textTransform: "uppercase" }}>Main Hub</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div className="card-icon-wrap" style={{ width: 40, height: 40, margin: 0, flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <strong style={{ color: "var(--text-white)", display: "block", fontSize: 14.5, marginBottom: 2 }}>Campus Location</strong>
                  <span style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    Centre for Innovation &amp; Entrepreneurship Learning (CIEL),<br />
                    409, Chetana Campus, Survey No. 34, Bandra East, Mumbai, Maharashtra 400051.
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div className="card-icon-wrap" style={{ width: 40, height: 40, margin: 0, flexShrink: 0 }}>
                  <Mail size={20} />
                </div>
                <div>
                  <strong style={{ color: "var(--text-white)", display: "block", fontSize: 14.5, marginBottom: 2 }}>Email Inquiries</strong>
                  <span style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
                    info@cielhub.org
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div className="card-icon-wrap" style={{ width: 40, height: 40, margin: 0, flexShrink: 0 }}>
                  <Phone size={20} />
                </div>
                <div>
                  <strong style={{ color: "var(--text-white)", display: "block", fontSize: 14.5, marginBottom: 2 }}>Desk Phone</strong>
                  <span style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
                    +91 (022) 2651-3400 / Ext 108
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Clock size={16} className="text-gold" />
              <strong style={{ fontSize: 13.5, color: "var(--text-white)" }}>Makerspace &amp; Visitor Hours</strong>
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>
              Monday – Friday: 9:00 AM – 6:00 PM &nbsp;|&nbsp; Saturday: 10:00 AM – 2:00 PM
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="badge badge-neutral" style={{ fontSize: 11, gap: 4 }}>
                <CheckCircle2 size={12} className="text-gold" /> Guided Lab Tours
              </span>
              <span className="badge badge-neutral" style={{ fontSize: 11, gap: 4 }}>
                <CheckCircle2 size={12} className="text-gold" /> Walk-in Mentorship
              </span>
            </div>
          </div>
        </article>

        {/* Inquiry Form */}
        <article className="luxury-card" style={{ padding: "28px 32px" }}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 22, margin: "0 0 4px" }}>Send an Inquiry</h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
              Submit your inquiry and our incubation officers will get back to you within 24 business hours.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you. Your inquiry has been sent to CIEL Office.");
            }}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <div>
              <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 5, fontWeight: 500 }}>Full Name *</label>
              <input type="text" className="input" placeholder="e.g. Dr. Rajesh Kulkarni" required style={{ padding: "10px 14px", height: 42, fontSize: 13.5 }} />
            </div>

            <div>
              <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 5, fontWeight: 500 }}>Email Address *</label>
              <input type="email" className="input" placeholder="name@institution.edu" required style={{ padding: "10px 14px", height: 42, fontSize: 13.5 }} />
            </div>

            <div>
              <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 5, fontWeight: 500 }}>Inquiry Category</label>
              <select className="select" style={{ width: "100%", padding: "10px 14px", height: 42, fontSize: 13.5 }}>
                <option value="incubation">Startup Incubation Inquiry</option>
                <option value="ipr">IPR &amp; Patent Filing</option>
                <option value="mou">Industry MoU &amp; Sponsorship</option>
                <option value="mentor">Mentorship Application</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 5, fontWeight: 500 }}>Message *</label>
              <textarea className="input" rows={3} placeholder="Detail your proposal or questions..." required style={{ padding: "10px 14px", minHeight: 80, fontSize: 13.5, resize: "vertical" }} />
            </div>

            <button className="button button-primary button-wide" type="submit" style={{ marginTop: 6, height: 44, fontSize: 14 }}>
              <Send size={16} /> Send Message
            </button>
          </form>
        </article>
      </div>
    </div>
  );
}
