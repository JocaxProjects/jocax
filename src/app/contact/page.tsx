// src/app/contact/page.tsx
// Contact Us — Server Component shell, form interactivity in ContactForm.tsx.
//
// Layout: asymmetric split — form (left, 3/5) + info panel (right, 2/5).
// Design language: industrial-editorial, matches the Jocax system exactly.
// Fully responsive: mobile, tablet, laptop, desktop, all browsers.

import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Jocax Solutions",
  description:
    "Get in touch with the Jocax Solutions team for product inquiries, quotes, installation services, and technical support. Based in Nairobi, serving East Africa.",
};

// ─── Static data ──────────────────────────────────────────────────────────────

const CONTACT_CHANNELS = [
  {
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    label: "Email",
    primary: "sales@jocaxsolutions.co.ke",
    secondary: "support@jocaxsolutions.co.ke",
    href: "mailto:sales@jocaxsolutions.co.ke",
    color: "#3b82f6",
  },
  {
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    label: "Phone",
    primary: "+254 725 002 619",
    secondary: "+254 720 654 321",
    href: "tel:+254725002619",
    color: "#e8a020",
  },
  {
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
    label: "Nairobi Office",
    primary: "Industrial Area, Enterprise Road",
    secondary: "Nairobi, Kenya — P.O. Box 12345",
    href: "https://maps.google.com/?q=Industrial+Area+Nairobi",
    color: "#10b981",
  },
  {
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    label: "Business Hours",
    primary: "Mon – Fri: 08:00 – 17:30",
    secondary: "Saturday: 09:00 – 13:00",
    href: null,
    color: "#f43f5e",
  },
];

const QUICK_LINKS = [
  { label: "Request a Quote",     href: "/products"         },
  { label: "Browse Full Catalog", href: "/products"         },
  { label: "Search Equipment",    href: "/search"           },
  { label: "Product Categories",  href: "/categories"       },
  { label: "About Jocax",         href: "/about"            },
];

const OFFICES = [
  {
    city: "Nairobi",
    address: "Industrial Area, Enterprise Road",
    phone: "+254 725 002 619",
    isPrimary: true,
  },
  {
    city: "Mombasa",
    address: "Kilindini Road, Old Town",
    phone: "+254 720 654 321",
    isPrimary: false,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes expand-x {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .au           { animation: fade-up 0.6s ease both; }
        .au-d1        { animation: fade-up 0.6s 0.08s ease both; }
        .au-d2        { animation: fade-up 0.6s 0.16s ease both; }
        .au-d3        { animation: fade-up 0.6s 0.24s ease both; }

        /* ── Amber rule — mirrors about page exactly ──
           Mobile: centered (transform-origin center, margin auto)
           Desktop (≥1024px): left-aligned (transform-origin left, margin 0)
        ── */
        .amber-rule {
          display: block; height: 3px; width: 44px;
          background: var(--color-amber); border-radius: 2px;
          animation: expand-x 0.5s 0.15s ease both;
          transform-origin: center;
          margin-left: auto;
          margin-right: auto;
        }
        @media (min-width: 1024px) {
          .amber-rule {
            transform-origin: left;
            margin-left: 0;
            margin-right: 0;
          }
        }

        /* ── Section label ── */
        .s-label {
          font-family: var(--font-display); font-size: var(--text-xs);
          font-weight: 700; letter-spacing: var(--tracking-widest);
          text-transform: uppercase; color: var(--color-amber);
          max-width: none; margin: 0; line-height: 1;
        }

        /* ── Heading colour overrides for dark backgrounds ── */
        .contact-hero-wrap h1,
        .contact-layout h2 { color: var(--color-white); }

        /* ── Channel card text — truncation helpers ── */
        .contact-ch-primary {
          font-size: var(--text-sm); color: rgba(255,255,255,0.8);
          font-weight: 500; margin: 0.25rem 0 0; max-width: none;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .contact-ch-secondary {
          font-size: var(--text-xs); color: rgba(255,255,255,0.35);
          margin-top: 0.125rem; max-width: none;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        /* ── Body copy on dark backgrounds ── */
        .contact-lead {
          font-size: var(--text-lg); color: rgba(255,255,255,0.5);
          line-height: var(--leading-relaxed); font-weight: 300;
          max-width: min(520px, 100%);
          margin-left: auto;
          margin-right: auto;
        }
        @media (min-width: 1024px) {
          .contact-lead { margin-left: 0; margin-right: 0; }
        }
        .contact-body-sm {
          font-size: var(--text-xs); color: rgba(255,255,255,0.4);
          line-height: var(--leading-snug); max-width: none;
        }

        /* ── Hero ──────────────────────────────────────────────────
           Mirrors about page hero exactly:
           • padding-top: nav-height, no fixed height — content-driven
           • padding-block: clamp(2.5rem, 8vw, 5rem) on the body
           • Mobile (<640px):  centered, diagonal hidden
           • Tablet (640–1023px): still centered, diagonal visible
           • Desktop (≥1024px): left-aligned, stat floats right
        ── */
        .contact-hero-wrap {
          background: var(--color-steel);
          position: relative; overflow: hidden;
          padding-top: var(--nav-height);
        }

        .contact-hero-body {
          padding-block: clamp(2.5rem, 8vw, 5rem);
          /* Mobile: center everything */
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Mobile: breadcrumb centered */
        .contact-breadcrumb {
          margin-bottom: clamp(1.5rem, 4vw, 2.5rem);
          align-self: stretch;
        }
        .contact-breadcrumb ol {
          justify-content: center;
        }

        /* Mobile: inner row stacks vertically, items centered except stat */
        .contact-hero-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(1.5rem, 4vw, 2rem);
          width: 100%;
        }

        /* Stat block — always right-aligned, constrained inside the amber clip */
        .contact-hero-inner > div:last-child {
          text-align: right;
          flex-shrink: 0;
          align-self: flex-end;
          /* Cap width so it always sits inside the diagonal amber region (~35vw) */
          max-width: min(35%, 220px);
          /* Clip any overflow so text never bleeds past the gradient */
          overflow: hidden;
        }

        /* Mobile: text block constrained and centered */
        .contact-hero-inner > div:first-child {
          width: 100%;
          max-width: min(600px, 100%);
        }

        /* Stat value — fluid size so it never overflows the clip on any screen */
        .contact-hero-inner > div:last-child p:first-child {
          font-size: clamp(var(--text-xl), 5vw, var(--text-4xl)) !important;
          white-space: nowrap;
        }
        .contact-hero-inner > div:last-child p:last-child {
          white-space: nowrap;
          font-size: clamp(0.55rem, 1.5vw, var(--text-xs)) !important;
          /* Mobile: sentence case — easier to read at small sizes */
          text-transform: none !important;
          letter-spacing: 0.03em !important;
        }
        @media (min-width: 1024px) {
          .contact-hero-inner > div:last-child p:last-child {
            /* Desktop: restore original uppercase tracking */
            text-transform: uppercase !important;
            letter-spacing: var(--tracking-widest) !important;
          }
        }

        /* Diagonal accent — always visible on all screen sizes */
        .hero-diagonal { display: block; }

        /* Desktop (≥1024px): left-aligned row — mirrors about page lg+ */
        @media (min-width: 1024px) {
          .contact-hero-body {
            text-align: left;
            align-items: flex-start;
          }
          .contact-breadcrumb ol {
            justify-content: flex-start;
          }
          .contact-hero-inner {
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
          }
          .contact-hero-inner > div:first-child {
            max-width: min(600px, 60%);
          }
          /* Stat block — pushed to right, text right-aligned */
          .contact-hero-inner > div:last-child {
            text-align: right;
            flex-shrink: 0;
          }
        }

        /* ── Contact channel card ── */
        .ch-card {
          display: flex; gap: 1rem; align-items: flex-start;
          padding: 1.125rem 1.25rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: var(--radius-lg);
          text-decoration: none;
          transition: background var(--transition-fast), border-color var(--transition-fast);
          -webkit-tap-highlight-color: transparent;
        }
        @media (hover: hover) {
          .ch-card:hover {
            background: rgba(255,255,255,0.06);
            border-color: rgba(255,255,255,0.12);
          }
        }
        .ch-card:active {
          background: rgba(255,255,255,0.06);
        }
        .ch-icon {
          width: 2.25rem; height: 2.25rem; flex-shrink: 0;
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
        }
        .ch-card-text { min-width: 0; }
        .ch-primary {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ── Form card ── */
        .form-card {
          background: var(--color-steel-mid);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: var(--radius-2xl);
          padding: clamp(1.25rem, 4vw, 2.5rem);
        }

        /* ── Info panel ── */
        .info-panel {
          display: flex; flex-direction: column; gap: clamp(1.5rem, 3vw, 2rem);
        }

        /* ── Map placeholder ── */
        .map-placeholder {
          position: relative; overflow: hidden;
          border-radius: var(--radius-xl);
          border: 1px solid rgba(255,255,255,0.06);
          background: var(--color-steel-mid);
          aspect-ratio: 16 / 9;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 0.75rem;
          min-height: 160px;
        }

        /* ── WhatsApp CTA ── */
        .wa-cta {
          display: flex; align-items: center; gap: 1rem;
          padding: 1.125rem 1.25rem;
          background: rgba(37,211,102,0.07);
          border: 1.5px solid rgba(37,211,102,0.2);
          border-radius: var(--radius-lg);
          text-decoration: none;
          transition: background var(--transition-fast), border-color var(--transition-fast);
          -webkit-tap-highlight-color: transparent;
        }
        @media (hover: hover) {
          .wa-cta:hover {
            background: rgba(37,211,102,0.11);
            border-color: rgba(37,211,102,0.35);
          }
        }
        .wa-cta:active {
          background: rgba(37,211,102,0.11);
        }

        /* ── Quick links ── */
        .quick-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.625rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          text-decoration: none;
          font-family: var(--font-body); font-size: var(--text-sm);
          color: rgba(255,255,255,0.5);
          transition: color var(--transition-fast);
          -webkit-tap-highlight-color: transparent;
          /* Touch-friendly */
          min-height: 2.75rem;
        }
        @media (hover: hover) {
          .quick-link:hover { color: var(--color-amber); }
        }
        .quick-link:active { color: var(--color-amber); }
        .quick-link:last-child { border-bottom: none; }

        /* ── Page layout ── */
        .contact-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(2rem, 5vw, 4rem);
          align-items: start;
        }
        @media (min-width: 1024px) {
          .contact-layout { grid-template-columns: 3fr 2fr; }
        }

        /* ── Channels grid ── */
        .channels-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.625rem;
        }
        @media (min-width: 480px) {
          .channels-grid { grid-template-columns: 1fr 1fr; }
        }

        /* ── Office grid ── */
        .office-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.625rem;
          margin-bottom: 1rem;
        }
        .office-item {
          padding: 0.875rem 1rem;
          border-radius: var(--radius-md);
        }

        /* ── Section spacing utilities ── */
        .contact-section {
          padding-block: clamp(2rem, 5vw, 3.5rem);
        }
        .contact-section-bottom {
          padding-bottom: clamp(2rem, 5vw, 3.5rem);
        }

        /* ── Safe area insets for notched phones ── */
        @supports (padding: max(0px)) {
          .contact-safe {
            padding-left: max(1rem, env(safe-area-inset-left));
            padding-right: max(1rem, env(safe-area-inset-right));
          }
        }

        /* ── Prevent text overflow in channel cards ── */
        .ch-card-text p {
          max-width: 100%;
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .au, .au-d1, .au-d2, .au-d3 { animation: none; opacity: 1; transform: none; }
          .amber-rule { animation: none; transform: scaleX(1); }
        }
      `}</style>

      <div style={{ background: "var(--color-ink)", minHeight: "100vh" }}>

        {/* ════════════════════════════════════════════════════════════════
            HERO BAND
        ════════════════════════════════════════════════════════════════ */}
        <div className="contact-hero-wrap">
          {/* Diagonal accent — desktop only via .hero-diagonal class */}
          <div
            className="hero-diagonal"
            aria-hidden="true"
            style={{
              position: "absolute", top: 0, right: "-10%",
              width: "45%", height: "100%",
              background: "linear-gradient(135deg, transparent 45%, rgba(232,160,32,0.18) 45%)",
              pointerEvents: "none",
            }}
          />

          <div className="container contact-hero-body">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="contact-breadcrumb">
              <ol style={{ display: "flex", gap: "0.375rem", alignItems: "center", listStyle: "none", margin: 0, padding: 0, flexWrap: "wrap" }}>
                <li><Link href="/" style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-body)", textDecoration: "none" }}>Home</Link></li>
                <li style={{ color: "rgba(255,255,255,0.2)", fontSize: "var(--text-xs)" }}>›</li>
                <li><span style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-body)" }}>Contact</span></li>
              </ol>
            </nav>

            <div className="contact-hero-inner">
              <div style={{ maxWidth: "min(600px, 100%)" }}>
                <p className="s-label au" style={{ marginBottom: "1rem" }}>Get In Touch</p>
                <h1 className="hero-heading au-d1">
                  Let&apos;s Talk{" "}
                  <span style={{ color: "var(--color-amber)" }}>Equipment.</span>
                </h1>
                <span className="amber-rule" style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }} />
                <p className="contact-lead au-d2">
                  Whether you need a quote, have a technical question, or are planning
                  a full kitchen fit-out — our specialists are ready to help. We respond
                  within one business day.
                </p>
              </div>

              {/* Response time — bare text over the diagonal clip */}
              <div className="au-d3" style={{ flexShrink: 0 }}>
                <p style={{
                  fontFamily: "var(--font-display)", fontWeight: 800,
                  fontSize: "var(--text-4xl)", color: "var(--color-amber)",
                  letterSpacing: "var(--tracking-tight)", lineHeight: "var(--leading-none)",
                  margin: 0, maxWidth: "none",
                }}>
                  &lt; 1 Day
                </p>
                <p style={{
                  fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.55)",
                  fontWeight: 500, textTransform: "uppercase",
                  letterSpacing: "var(--tracking-widest)", whiteSpace: "nowrap",
                  maxWidth: "none", lineHeight: 1, marginTop: "0.875rem",
                }}>
                  Average Response Time
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            CHANNEL CARDS — full width strip
        ════════════════════════════════════════════════════════════════ */}
        <div className="container" style={{ paddingTop: "clamp(2rem, 5vw, 3.5rem)" }}>
          <div className="channels-grid">
            {CONTACT_CHANNELS.map((ch) => {
              const inner = (
                <>
                  <div className="ch-icon" style={{ background: `${ch.color}18`, border: `1px solid ${ch.color}30` }}>
                    <svg style={{ width: "1rem", height: "1rem", color: ch.color }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={ch.icon} />
                    </svg>
                  </div>
                  <div className="ch-card-text">
                    <h6 style={{ color: ch.color, letterSpacing: "var(--tracking-widest)" }}>{ch.label}</h6>
                    <p className="contact-ch-primary">{ch.primary}</p>
                    <p className="contact-ch-secondary">{ch.secondary}</p>
                  </div>
                </>
              );

              return ch.href ? (
                <a key={ch.label} href={ch.href} className="ch-card"
                  target={ch.href.startsWith("http") ? "_blank" : undefined}
                  rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                  {inner}
                </a>
              ) : (
                <div key={ch.label} className="ch-card">{inner}</div>
              );
            })}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            MAIN: FORM  +  INFO PANEL
        ════════════════════════════════════════════════════════════════ */}
        <div className="container contact-section">
          <div className="contact-layout">

            {/* ── LEFT: Form ───────────────────────────────────────────── */}
            <div>
              <div style={{ marginBottom: "1.75rem" }}>
                <p className="s-label" style={{ marginBottom: "0.75rem" }}>Send a Message</p>
                <h2 style={{ color: "var(--color-white)" }}>How Can We Help?</h2>
              </div>
              <div className="form-card">
                <ContactForm />
              </div>
            </div>

            {/* ── RIGHT: Info panel ────────────────────────────────────── */}
            <div className="info-panel">

              {/* Offices + Map */}
              <div>
                <p className="s-label" style={{ marginBottom: "0.875rem" }}>Our Offices</p>

                {/* Office selector */}
                <div className="office-grid">
                  {OFFICES.map((o) => (
                    <div key={o.city} className="office-item" style={{
                      border: `1.5px solid ${o.isPrimary ? "var(--color-amber)" : "rgba(255,255,255,0.08)"}`,
                      background: o.isPrimary ? "rgba(232,160,32,0.06)" : "transparent",
                    }}>
                      <h5 style={{
                        color: o.isPrimary ? "var(--color-amber)" : "rgba(255,255,255,0.55)",
                        display: "flex", alignItems: "center", gap: "0.375rem", flexWrap: "wrap",
                        textTransform: "uppercase",
                      }}>
                        {o.city}
                        {o.isPrimary && (
                          <span style={{
                            fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em",
                            background: "var(--color-amber)", color: "var(--color-ink)",
                            padding: "0.1rem 0.4rem", borderRadius: "2px",
                          }}>HQ</span>
                        )}
                      </h5>
                      <p className="contact-body-sm" style={{ marginTop: "0.25rem" }}>{o.address}</p>
                      <p className="contact-body-sm" style={{ color: "rgba(255,255,255,0.35)" }}>{o.phone}</p>
                    </div>
                  ))}
                </div>

                {/* Map placeholder */}
                <div className="map-placeholder">
                  <div aria-hidden="true" style={{
                    position: "absolute", inset: 0,
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)," +
                      "linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }} />
                  {/* Centre pin */}
                  <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{
                      width: "2.75rem", height: "2.75rem",
                      borderRadius: "var(--radius-full)",
                      background: "var(--color-amber)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 0 0 8px rgba(232,160,32,0.15), 0 0 0 16px rgba(232,160,32,0.06)",
                    }}>
                      <svg style={{ width: "1.25rem", height: "1.25rem", color: "var(--color-ink)" }}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="s-label" style={{ color: "rgba(255,255,255,0.5)" }}>Industrial Area, Nairobi</p>
                  </div>
                  {/* Open in maps link */}
                  <a
                    href="https://maps.google.com/?q=Industrial+Area+Nairobi"
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      position: "absolute", bottom: "0.875rem", right: "0.875rem",
                      display: "inline-flex", alignItems: "center", gap: "0.35rem",
                      fontFamily: "var(--font-display)", fontSize: "var(--text-xs)",
                      fontWeight: 700, letterSpacing: "var(--tracking-widest)",
                      textTransform: "uppercase",
                      color: "var(--color-amber)", textDecoration: "none",
                      background: "rgba(232,160,32,0.1)", border: "1px solid rgba(232,160,32,0.2)",
                      padding: "0.35rem 0.65rem", borderRadius: "var(--radius-full)",
                      transition: "background var(--transition-fast)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <svg style={{ width: "0.625rem", height: "0.625rem", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open in Maps
                  </a>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/254725002619"
                target="_blank" rel="noopener noreferrer"
                className="wa-cta"
              >
                <div style={{
                  width: "2.5rem", height: "2.5rem", flexShrink: 0,
                  borderRadius: "var(--radius-full)",
                  background: "rgba(37,211,102,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg style={{ width: "1.25rem", height: "1.25rem", color: "rgb(37,211,102)" }} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div style={{ minWidth: 0 }}>
                  <h5 style={{ color: "rgb(37,211,102)", textTransform: "uppercase", letterSpacing: "var(--tracking-wide)" }}>
                    Chat on WhatsApp
                  </h5>
                  <p className="contact-body-sm" style={{ marginTop: "0.2rem" }}>
                    Fastest response — usually under an hour
                  </p>
                </div>
                <svg style={{ width: "1rem", height: "1rem", color: "rgba(37,211,102,0.5)", marginLeft: "auto", flexShrink: 0 }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>

              {/* Quick links */}
              <div>
                <p className="s-label" style={{ marginBottom: "0.75rem" }}>Quick Links</p>
                <nav aria-label="Quick links">
                  {QUICK_LINKS.map((l) => (
                    <Link key={l.label} href={l.href} className="quick-link">
                      <span>{l.label}</span>
                      <svg style={{ width: "0.75rem", height: "0.75rem", flexShrink: 0 }}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </nav>
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
}