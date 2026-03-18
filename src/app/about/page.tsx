// src/app/about/page.tsx
// About Us — Server Component.
// Mobile-first: every section is designed for 320px first, then scales up.
// Centering strategy:
//   • Hero text: centered on mobile, left-aligned at lg+
//   • Stats: 2-col centered grid on mobile, 4-col at md+
//   • Mission: single col centered on mobile, 2-col at lg+
//   • Section headers (Values, CTA): centered on all sizes
//   • Values grid: 1→2→4 cols; cards left-aligned content
//   • CTA band: centered stack on mobile, row at sm+

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Jocax Solutions",
  description:
    "Jocax Solutions is East Africa's trusted B2B partner for commercial kitchen equipment — supplying restaurants, hotels, and food service operations since 2010.",
};

const STATS = [
  { value: "14+",    label: "Years in Business" },
  { value: "2,400+", label: "Products Stocked"  },
  { value: "180+",   label: "Brand Partners"    },
  { value: "3,800+", label: "Clients Served"    },
];

const VALUES = [
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Quality Assurance",
    body:  "Every product in our catalog meets international food-service standards. We source only from certified manufacturers with proven track records.",
  },
  {
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    title: "Expert Guidance",
    body:  "Our specialists help you spec the right equipment for your operation — from a single fryer to a full commissary build-out.",
  },
  {
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Fast Fulfilment",
    body:  "In-stock orders dispatched within 48 hours. Our Nairobi warehouse holds over 1,200 SKUs ready for same-week delivery across East Africa.",
  },
  {
    icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
    title: "After-Sales Support",
    body:  "Equipment failures cost revenue. We offer installation support, spare parts, and a dedicated technical helpline 6 days a week.",
  },
];

const PROOF_POINTS = [
  {
    stat:   "48 hrs",
    label:  "Dispatch time",
    detail: "In-stock orders leave our Nairobi warehouse within two business days — guaranteed.",
    icon:   "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    stat:   "6 countries",
    label:  "East Africa coverage",
    detail: "Active delivery routes across Kenya, Uganda, Tanzania, Rwanda, Ethiopia, and Zambia.",
    icon:   "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    stat:   "Certified",
    label:  "Installation engineers",
    detail: "Every installation is performed by factory-trained technicians — not subcontractors.",
    icon:   "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  },
];

export default function AboutPage() {
  return (
    <>
      <style>{`

        /* ════════════════════════════════════════════════════════════
           ANIMATIONS
        ════════════════════════════════════════════════════════════ */
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes expand-x {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes draw-line {
          from { stroke-dashoffset: 1000; }
          to   { stroke-dashoffset: 0; }
        }
        .afu    { animation: fade-up 0.65s ease both; }
        .afu-d1 { animation: fade-up 0.65s 0.10s ease both; }
        .afu-d2 { animation: fade-up 0.65s 0.20s ease both; }
        .afu-d3 { animation: fade-up 0.65s 0.30s ease both; }

        .amber-rule {
          display: block; height: 3px; width: 40px;
          background: var(--color-amber); border-radius: 2px;
          transform-origin: left;
          animation: expand-x 0.45s 0.2s ease both;
        }
        /* On mobile the rule is centered */
        .amber-rule--center {
          margin-inline: auto;
          transform-origin: center;
        }

        /* ════════════════════════════════════════════════════════════
           SECTION LABEL (eyebrow)
        ════════════════════════════════════════════════════════════ */
        .section-label {
          font-family: var(--font-display);
          font-size: var(--text-xs); font-weight: 700;
          letter-spacing: var(--tracking-widest); text-transform: uppercase;
          color: var(--color-amber);
          max-width: none; margin: 0; line-height: 1;
        }

        /* ════════════════════════════════════════════════════════════
           HERO — mobile-first, centered on small screens
        ════════════════════════════════════════════════════════════ */
        .hero-wrap {
          background: var(--color-steel);
          position: relative; overflow: hidden;
          padding-top: var(--nav-height);
        }
        .hero-body {
          padding-block: clamp(2.5rem, 8vw, 5rem);
          /* Mobile: center everything */
          text-align: center;
          display: flex; flex-direction: column; align-items: center;
        }
        .hero-body .about-body-lead {
          /* centered paragraph on mobile */
          max-width: min(520px, 100%);
          margin-inline: auto;
        }
        /* lg+: left-align the hero text */
        @media (min-width: 1024px) {
          .hero-body { text-align: left; align-items: flex-start; }
          .hero-body .about-body-lead { margin-inline: 0; }
          /* Breadcrumb left-aligned on desktop — overrides inline justifyContent */
          .hero-body nav ol { justify-content: flex-start !important; }
        }

        /* ── Diagonal clip — always visible on ALL screen sizes ── */
        .hero-diag {
          position: absolute; top: 0; right: -10%;
          width: 45%; height: 100%; pointer-events: none;
          background: linear-gradient(135deg, transparent 45%, rgba(232,160,32,0.15) 45%);
        }
        /* REMOVED: @media (max-width: 639px) { .hero-diag { display: none; } } */

        /* ════════════════════════════════════════════════════════════
           STATS — 2 col on mobile, 4 col at md+; values centered
        ════════════════════════════════════════════════════════════ */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(0.75rem, 2vw, 1.25rem);
        }
        @media (min-width: 768px) {
          .stats-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .stat-card {
          padding: clamp(1rem, 3vw, 2rem);
          border: 1px solid rgba(255,255,255,0.06);
          border-top: 3px solid var(--color-amber);
          background: var(--color-steel-mid);
          border-radius: var(--radius-lg);
          text-align: center;
          transition: transform 220ms ease;
        }
        .stat-card:hover { transform: translateY(-4px); }
        .stat-value {
          font-family: var(--font-display); font-weight: 800;
          font-size: clamp(var(--text-3xl), 5vw, var(--text-5xl));
          color: var(--color-white);
          letter-spacing: -0.03em; line-height: 1;
          margin: 0; max-width: none;
        }
        .stat-label {
          font-size: var(--text-xs); color: rgba(255,255,255,0.45);
          font-weight: 500; margin-top: 0.5rem; text-transform: uppercase;
          letter-spacing: var(--tracking-wider); max-width: none; line-height: 1;
        }

        /* ════════════════════════════════════════════════════════════
           MISSION GRID — stacked on mobile, 50/50 at lg+
        ════════════════════════════════════════════════════════════ */
        .mission-grid {
          display: grid; grid-template-columns: 1fr;
          gap: clamp(2rem, 6vw, 4rem);
          align-items: center;
        }
        @media (min-width: 1024px) {
          .mission-grid { grid-template-columns: 1fr 1fr; }
        }

        /* Mission copy: centered on mobile, left at lg+ */
        .mission-copy {
          text-align: center;
          display: flex; flex-direction: column; align-items: center;
        }
        .mission-copy p,
        .mission-copy h2 { text-align: center; }
        @media (min-width: 1024px) {
          .mission-copy { text-align: left; align-items: flex-start; }
          .mission-copy p,
          .mission-copy h2 { text-align: left; }
        }
        .mission-actions {
          display: flex; gap: 0.875rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 1.75rem;
          width: 100%;
          max-width: 26rem;
          margin-inline: auto;
        }
        .mission-actions > * {
          flex: 1 1 100%;
          justify-content: center !important;
          text-align: center;
          box-sizing: border-box;
          max-width: 100%;
        }
        @media (min-width: 480px) {
          .mission-actions > * {
            flex: 1 1 0;
            max-width: 13rem;
          }
        }
        @media (min-width: 1024px) {
          .mission-actions {
            justify-content: flex-start;
            margin-inline: 0;
          }
        }

        /* ════════════════════════════════════════════════════════════
           PROOF PANEL (right col of mission)
        ════════════════════════════════════════════════════════════ */
        .proof-panel {
          position: relative;
          background: var(--color-steel-mid);
          border: 1px solid rgba(255,255,255,0.06);
          border-left: 3px solid var(--color-amber);
          border-radius: var(--radius-xl);
          overflow: hidden;
          padding: clamp(1.25rem, 3vw, 2.25rem);
          display: flex; flex-direction: column; gap: 0;
          min-width: 0; box-sizing: border-box; width: 100%;
        }
        .proof-panel::before {
          content: "";
          position: absolute; top: -60px; right: -60px;
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(232,160,32,0.08) 0%, transparent 65%);
          pointer-events: none;
        }

        /* SVG illustration */
        .proof-kitchen-wrap {
          margin-bottom: clamp(1rem, 3vw, 1.75rem);
          padding-bottom: clamp(1rem, 3vw, 1.75rem);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          overflow: hidden; width: 100%; box-sizing: border-box;
        }
        .kitchen-svg {
          display: block; width: 100%; max-width: 100%;
          height: auto; max-height: 42vh;
        }
        .kitchen-svg .as {
          stroke-dasharray: 1000; stroke-dashoffset: 1000;
          animation: draw-line 2.4s cubic-bezier(0.4,0,0.2,1) 0.5s forwards;
        }
        .kitchen-svg .as-slow {
          stroke-dasharray: 1000; stroke-dashoffset: 1000;
          animation: draw-line 3s cubic-bezier(0.4,0,0.2,1) 0.8s forwards;
        }

        /* Proof point rows */
        .proof-point {
          display: flex; gap: 0.875rem; align-items: flex-start;
          padding: clamp(0.75rem, 2vw, 1rem) 0.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          border-radius: var(--radius-sm);
          transition: background 180ms ease;
        }
        .proof-point:last-child { border-bottom: none; padding-bottom: 0; }
        .proof-point:hover { background: rgba(255,255,255,0.03); }
        .proof-icon {
          width: 2rem; height: 2rem; flex-shrink: 0;
          border-radius: var(--radius-md);
          background: rgba(232,160,32,0.08);
          border: 1px solid rgba(232,160,32,0.18);
          display: flex; align-items: center; justify-content: center;
          margin-top: 0.1rem;
        }
        .proof-stat {
          font-family: var(--font-display); font-weight: 800;
          font-size: clamp(var(--text-base), 2vw, var(--text-xl));
          color: var(--color-amber); letter-spacing: -0.01em;
          line-height: 1; margin: 0; max-width: none;
        }
        .proof-lbl {
          font-family: var(--font-display); font-weight: 600;
          font-size: var(--text-xs); letter-spacing: var(--tracking-wider);
          text-transform: uppercase; color: rgba(255,255,255,0.5);
          margin: 0.2rem 0 0.35rem; max-width: none; line-height: 1;
        }
        .proof-detail {
          font-size: var(--text-xs); color: rgba(255,255,255,0.35);
          line-height: var(--leading-relaxed); margin: 0;
          max-width: none; font-weight: 300;
        }

        /* ════════════════════════════════════════════════════════════
           VALUES — section header centered; cards left-aligned content
        ════════════════════════════════════════════════════════════ */
        .values-header {
          text-align: center;
          margin-bottom: clamp(1.5rem, 4vw, 3rem);
        }
        .values-header h2 { color: var(--color-white); }

        .values-grid {
          display: grid; grid-template-columns: 1fr;
          gap: clamp(0.875rem, 2vw, 1.25rem);
        }
        @media (min-width: 560px)  { .values-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .values-grid { grid-template-columns: repeat(4, 1fr); } }

        .value-card {
          padding: clamp(1.125rem, 3vw, 1.75rem);
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: var(--radius-xl);
          transition: background 200ms ease, border-color 200ms ease;
          display: flex; flex-direction: column; gap: 0.875rem;
        }
        .value-card:hover { background: rgba(255,255,255,0.05); border-color: rgba(232,160,32,0.2); }
        .value-icon {
          width: 2.5rem; height: 2.5rem; flex-shrink: 0;
          background: rgba(232,160,32,0.1); border: 1px solid rgba(232,160,32,0.2);
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
        }

        /* ════════════════════════════════════════════════════════════
           CTA BAND — centered stack on mobile, row at sm+
        ════════════════════════════════════════════════════════════ */
        .cta-band {
          background: var(--color-amber);
          border-radius: var(--radius-xl);
          padding: clamp(1.75rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 3.5rem);
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          gap: 1.5rem;
        }
        @media (min-width: 640px) {
          .cta-band {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            text-align: left;
          }
        }
        .cta-band h2 { color: var(--color-ink); margin: 0; }
        .cta-text { min-width: 0; }
        .cta-actions {
          display: flex; gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
          flex-shrink: 0;
          width: 100%;
          max-width: 26rem;
          margin-inline: auto;
        }
        .cta-actions > * {
          flex: 1 1 100%;
          justify-content: center !important;
          text-align: center;
          box-sizing: border-box;
          max-width: 100%;
        }
        @media (min-width: 480px) {
          .cta-actions > * {
            flex: 1 1 0;
            max-width: 13rem;
          }
        }
        @media (min-width: 640px) {
          .cta-actions {
            justify-content: flex-end;
            width: auto;
            max-width: none;
            margin-inline: 0;
          }
        }
        .btn-dark {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: var(--color-ink); color: var(--color-white);
          font-family: var(--font-display); font-weight: 700;
          font-size: var(--text-sm); letter-spacing: var(--tracking-wide);
          text-transform: uppercase; text-decoration: none;
          padding: 0.8rem 1.5rem; border-radius: var(--radius-md);
          transition: background 180ms ease; white-space: nowrap;
          min-height: 2.75rem;
        }
        .btn-dark:hover { background: var(--color-steel); }
        .btn-outline-dark {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: transparent; color: rgba(13,13,13,0.7);
          font-family: var(--font-display); font-weight: 700;
          font-size: var(--text-sm); letter-spacing: var(--tracking-wide);
          text-transform: uppercase; text-decoration: none;
          padding: 0.8rem 1.5rem;
          border: 2px solid rgba(13,13,13,0.3); border-radius: var(--radius-md);
          transition: border-color 180ms ease, color 180ms ease;
          white-space: nowrap; min-height: 2.75rem;
        }
        .btn-outline-dark:hover { border-color: rgba(13,13,13,0.6); color: var(--color-ink); }

        /* ════════════════════════════════════════════════════════════
           BODY COPY UTILITIES
        ════════════════════════════════════════════════════════════ */
        .about-body-lead {
          font-size: clamp(var(--text-base), 2vw, var(--text-lg));
          color: rgba(255,255,255,0.6);
          line-height: var(--leading-relaxed); font-weight: 300;
        }
        .about-body    { color: rgba(255,255,255,0.55); font-weight: 300; max-width: none; }
        .about-body-sm { font-size: var(--text-sm); color: rgba(255,255,255,0.5); font-weight: 300; }

        /* ════════════════════════════════════════════════════════════
           SECTION SPACING
        ════════════════════════════════════════════════════════════ */
        .section-block { padding-block: clamp(2.5rem, 6vw, 5rem); }
        .section-pb    { padding-bottom: clamp(2.5rem, 6vw, 5rem); }
        .section-pt    { padding-top: clamp(2.5rem, 6vw, 5rem); }

        /* ════════════════════════════════════════════════════════════
           TOUCH / A11Y / PRINT
        ════════════════════════════════════════════════════════════ */
        @media (hover: none) {
          .stat-card:hover  { transform: none; }
          .value-card:hover { background: rgba(255,255,255,0.025); border-color: rgba(255,255,255,0.06); }
          .proof-point:hover { background: transparent; }
        }
        @media (prefers-reduced-motion: reduce) {
          .afu, .afu-d1, .afu-d2, .afu-d3 { animation: none; opacity: 1; transform: none; }
          .kitchen-svg .as, .kitchen-svg .as-slow { animation: none; stroke-dashoffset: 0; }
          .amber-rule { animation: none; transform: scaleX(1); }
        }
        @supports (padding: max(0px)) {
          .safe-x {
            padding-left:  max(var(--page-padding-x), env(safe-area-inset-left));
            padding-right: max(var(--page-padding-x), env(safe-area-inset-right));
          }
        }
      `}</style>

      <div style={{ background: "var(--color-ink)", minHeight: "100vh", overflowX: "hidden" }}>

        {/* ══════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════ */}
        <div className="hero-wrap">
          {/* Diagonal clip — always visible, no hide rule */}
          <div className="hero-diag" aria-hidden="true" />

          <div className="container hero-body">
            {/* Breadcrumb — centered on mobile */}
            <nav aria-label="Breadcrumb" style={{ marginBottom: "clamp(1.25rem, 4vw, 2.5rem)", alignSelf: "stretch" }}>
              <ol style={{
                display: "flex", gap: "0.375rem", alignItems: "center",
                listStyle: "none", margin: 0, padding: 0,
                flexWrap: "wrap", justifyContent: "center",
              }}>
                <li>
                  <Link href="/" style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-body)", textDecoration: "none" }}>
                    Home
                  </Link>
                </li>
                <li style={{ color: "rgba(255,255,255,0.2)", fontSize: "var(--text-xs)" }}>›</li>
                <li><span style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body)" }}>About Us</span></li>
              </ol>
            </nav>

            {/* Hero text block */}
            <p className="section-label afu" style={{ marginBottom: "1rem" }}>Our Story</p>

            <h1
              className="hero-heading afu-d1"
              style={{ color: "var(--color-white)", marginBottom: 0 }}
            >
              Built For{" "}
              <span style={{ color: "var(--color-amber)", display: "block" }}>The Kitchen.</span>
            </h1>

            <span
              className="amber-rule amber-rule--center afu-d2"
              style={{ margin: "1.5rem 0" }}
            />

            <p className="about-body-lead afu-d3">
              Jocax Solutions started with a simple frustration — professional kitchens
              deserved better than grey-market imports and three-month lead times.
              Since 2010 we have been East Africa&apos;s specialist distributor for
              commercial kitchen equipment, trusted by over 3,800 operations.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            STATS
        ══════════════════════════════════════════════════════════ */}
        <div className="container section-block">
          <div className="stats-grid">
            {STATS.map((s) => (
              <div key={s.label} className="stat-card">
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            MISSION + PROOF PANEL
        ══════════════════════════════════════════════════════════ */}
        <div className="container section-pb">
          <div className="mission-grid">

            {/* LEFT: copy */}
            <div className="mission-copy">
              <p className="section-label" style={{ marginBottom: "0.875rem" }}>Our Mission</p>
              <h2 style={{ color: "var(--color-white)", marginBottom: 0, maxWidth: "none" }}>
                Equipping the Professionals<br />Who Feed East Africa
              </h2>
              <p className="about-body" style={{ marginTop: "1.25rem" }}>
                Every hotel breakfast, every hospital meal, every stadium concession —
                behind each of those experiences is a commercial kitchen running the
                right equipment. Our mission is to make that equipment accessible,
                reliable, and properly supported for every serious operation on the continent.
              </p>
              <p className="about-body" style={{ marginTop: "0.875rem" }}>
                We are not a marketplace. We are a specialist distributor — pre-sales
                consulting, proper stock, certified installation, and a team that picks
                up the phone when something goes wrong.
              </p>
              <div className="mission-actions">
                <Link href="/products" className="btn btn-primary">Browse Catalog →</Link>
                <Link href="/contact" className="btn btn-outline-light" style={{ minHeight: "2.75rem" }}>
                  Get a Quote
                </Link>
              </div>
            </div>

            {/* RIGHT: proof panel */}
            <div className="proof-panel" role="complementary" aria-label="Why Jocax">

              {/* Kitchen line-art SVG */}
              <div className="proof-kitchen-wrap" aria-hidden="true">
                <svg
                  className="kitchen-svg"
                  viewBox="0 0 480 210"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {/* Exhaust hood */}
                  <polyline className="as" points="75,22 55,72 425,72 405,22"
                    stroke="rgba(232,160,32,0.75)" strokeWidth="1.8" strokeLinejoin="round"/>
                  <line className="as" x1="75" y1="22" x2="405" y2="22"
                    stroke="rgba(232,160,32,0.75)" strokeWidth="1.8"/>
                  <line className="as-slow" x1="98" y1="33" x2="382" y2="33" stroke="rgba(232,160,32,0.3)" strokeWidth="1"/>
                  <line className="as-slow" x1="92" y1="46" x2="388" y2="46" stroke="rgba(232,160,32,0.2)" strokeWidth="1"/>
                  <line className="as-slow" x1="86" y1="59" x2="394" y2="59" stroke="rgba(232,160,32,0.12)" strokeWidth="1"/>
                  <line className="as-slow" x1="157" y1="22" x2="146" y2="72" stroke="rgba(232,160,32,0.16)" strokeWidth="1"/>
                  <line className="as-slow" x1="240" y1="22" x2="240" y2="72" stroke="rgba(232,160,32,0.16)" strokeWidth="1"/>
                  <line className="as-slow" x1="323" y1="22" x2="334" y2="72" stroke="rgba(232,160,32,0.16)" strokeWidth="1"/>
                  <line className="as" x1="105" y1="16" x2="105" y2="2" stroke="rgba(232,160,32,0.5)" strokeWidth="1.5"/>
                  <line className="as" x1="375" y1="16" x2="375" y2="2" stroke="rgba(232,160,32,0.5)" strokeWidth="1.5"/>
                  <line className="as" x1="92"  y1="2"  x2="118" y2="2" stroke="rgba(232,160,32,0.5)" strokeWidth="1.5"/>
                  <line className="as" x1="362" y1="2"  x2="388" y2="2" stroke="rgba(232,160,32,0.5)" strokeWidth="1.5"/>
                  {/* Range body */}
                  <rect className="as" x="55" y="72" width="370" height="92" rx="2"
                    stroke="rgba(232,160,32,0.65)" strokeWidth="1.8"/>
                  <line className="as-slow" x1="55" y1="130" x2="425" y2="130" stroke="rgba(232,160,32,0.26)" strokeWidth="1"/>
                  <rect className="as" x="232" y="133" width="130" height="23" rx="1"
                    stroke="rgba(232,160,32,0.42)" strokeWidth="1.2"/>
                  <line className="as" x1="252" y1="144" x2="344" y2="144"
                    stroke="rgba(232,160,32,0.55)" strokeWidth="2" strokeLinecap="round"/>
                  <rect className="as-slow" x="262" y="136" width="42" height="13" rx="1"
                    stroke="rgba(232,160,32,0.2)" strokeWidth="1"/>
                  <rect className="as" x="370" y="133" width="46" height="23" rx="1"
                    stroke="rgba(232,160,32,0.42)" strokeWidth="1.2"/>
                  <line className="as" x1="378" y1="144" x2="408" y2="144"
                    stroke="rgba(232,160,32,0.45)" strokeWidth="1.5" strokeLinecap="round"/>
                  {/* Burners */}
                  {([115, 195, 275] as number[]).map((cx) => (
                    <g key={cx}>
                      <circle className="as" cx={cx} cy="96" r="20" stroke="rgba(232,160,32,0.55)" strokeWidth="1.5"/>
                      <circle className="as-slow" cx={cx} cy="96" r="11" stroke="rgba(232,160,32,0.30)" strokeWidth="1"/>
                      <circle className="as" cx={cx} cy="96" r="4" stroke="rgba(232,160,32,0.65)" strokeWidth="1.8"/>
                      <line className="as-slow" x1={cx-22} y1="96" x2={cx+22} y2="96" stroke="rgba(232,160,32,0.2)" strokeWidth="1"/>
                      <line className="as-slow" x1={cx} y1="74" x2={cx} y2="118" stroke="rgba(232,160,32,0.2)" strokeWidth="1"/>
                    </g>
                  ))}
                  {([350, 382, 412] as number[]).map((cx) => (
                    <g key={cx}>
                      <circle className="as" cx={cx} cy="94" r="11" stroke="rgba(232,160,32,0.48)" strokeWidth="1.5"/>
                      <circle className="as-slow" cx={cx} cy="94" r="4" stroke="rgba(232,160,32,0.55)" strokeWidth="1"/>
                    </g>
                  ))}
                  {/* Knobs */}
                  {([82, 111, 140, 169, 198, 227] as number[]).map((cx) => (
                    <g key={cx}>
                      <circle className="as" cx={cx} cy="144" r="5.5" stroke="rgba(232,160,32,0.45)" strokeWidth="1.2"/>
                      <circle cx={cx} cy="144" r="2" fill="rgba(232,160,32,0.38)"/>
                    </g>
                  ))}
                  {/* Sink */}
                  <rect className="as" x="4" y="90" width="51" height="74" rx="2" stroke="rgba(232,160,32,0.42)" strokeWidth="1.5"/>
                  <rect className="as" x="10" y="96" width="39" height="30" rx="2" stroke="rgba(232,160,32,0.26)" strokeWidth="1"/>
                  <circle className="as-slow" cx="29" cy="128" r="3" stroke="rgba(232,160,32,0.35)" strokeWidth="1"/>
                  <line className="as" x1="29" y1="125" x2="29" y2="110" stroke="rgba(232,160,32,0.48)" strokeWidth="1.5" strokeLinecap="round"/>
                  <line className="as" x1="22" y1="110" x2="36" y2="110" stroke="rgba(232,160,32,0.48)" strokeWidth="1.5" strokeLinecap="round"/>
                  {/* Prep counter */}
                  <rect className="as" x="425" y="90" width="51" height="74" rx="2" stroke="rgba(232,160,32,0.42)" strokeWidth="1.5"/>
                  <rect className="as" x="430" y="95" width="41" height="28" rx="1" stroke="rgba(232,160,32,0.26)" strokeWidth="1"/>
                  {([438, 446, 454, 462] as number[]).map((x) => (
                    <line key={x} className="as-slow" x1={x} y1="95" x2={x} y2="123" stroke="rgba(232,160,32,0.1)" strokeWidth="0.8"/>
                  ))}
                  {/* Pot rack */}
                  <line className="as" x1="4" y1="22" x2="52" y2="22" stroke="rgba(232,160,32,0.45)" strokeWidth="1.5"/>
                  {([12, 28, 44] as number[]).map((x, i) => (
                    <g key={x}>
                      <line className="as" x1={x} y1="22" x2={x} y2={34+i*3} stroke="rgba(232,160,32,0.36)" strokeWidth="1"/>
                      <path className="as" d={`M${x-7} ${34+i*3} Q${x} ${46+i*3} ${x+7} ${34+i*3}`} stroke="rgba(232,160,32,0.50)" strokeWidth="1.2"/>
                      <line className="as-slow" x1={x-7} y1={34+i*3} x2={x+7} y2={34+i*3} stroke="rgba(232,160,32,0.36)" strokeWidth="1"/>
                    </g>
                  ))}
                  {/* Steam */}
                  {([115, 195, 275] as number[]).map((cx, i) => (
                    <path key={cx} className="as-slow"
                      d={`M${cx} 73 Q${cx+5} 65 ${cx} 57 Q${cx-5} 49 ${cx} 41`}
                      stroke="rgba(232,160,32,0.16)" strokeWidth="1" strokeLinecap="round"
                      style={{ animationDelay: `${0.6+i*0.2}s` }}
                    />
                  ))}
                  {/* Floor */}
                  <line className="as-slow" x1="0" y1="164" x2="480" y2="164"
                    stroke="rgba(232,160,32,0.10)" strokeWidth="1" strokeDasharray="5 7"/>
                  {/* Caption */}
                  <text x="240" y="190" textAnchor="middle"
                    fontSize="7.5" fontFamily="monospace" letterSpacing="3.5"
                    fill="rgba(232,160,32,0.18)">
                    COMMERCIAL KITCHEN — JOCAX SOLUTIONS
                  </text>
                </svg>
              </div>

              {/* Proof points */}
              {PROOF_POINTS.map((pt) => (
                <div key={pt.stat} className="proof-point">
                  <div className="proof-icon">
                    <svg style={{ width: "0.9rem", height: "0.9rem", color: "var(--color-amber)" }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={pt.icon}/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="proof-stat">{pt.stat}</p>
                    <p className="proof-lbl">{pt.label}</p>
                    <p className="proof-detail">{pt.detail}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            VALUES
        ══════════════════════════════════════════════════════════ */}
        <div style={{ background: "var(--color-steel)" }} className="section-block">
          <div className="container">
            <div className="values-header">
              <p className="section-label" style={{ marginBottom: "0.875rem" }}>What We Stand For</p>
              <h2>Our Values</h2>
            </div>
            <div className="values-grid">
              {VALUES.map((v) => (
                <div key={v.title} className="value-card">
                  <div className="value-icon">
                    <svg style={{ width: "1.1rem", height: "1.1rem", color: "var(--color-amber)" }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={v.icon}/>
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ color: "var(--color-white)", textTransform: "uppercase" }}>{v.title}</h4>
                    <p className="about-body-sm" style={{ marginTop: "0.4rem" }}>{v.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            CTA BAND
        ══════════════════════════════════════════════════════════ */}
        <div className="container section-block">
          <div className="cta-band">
            <div className="cta-text">
              <h2>Ready to equip your kitchen?</h2>
              <p style={{
                color: "rgba(13,13,13,0.65)", marginTop: "0.5rem",
                fontSize: "var(--text-sm)", maxWidth: "none",
              }}>
                Browse 2,400+ products or talk to a specialist today.
              </p>
            </div>
            <div className="cta-actions">
              <Link href="/products" className="btn-dark">Browse Catalog →</Link>
              <Link href="/search" className="btn-outline-dark">Search Equipment</Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}