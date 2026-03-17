// src/app/about/page.tsx
// About Us — Server Component, no client interactivity needed.
// Design: industrial-editorial — dark steel canvas, amber rule lines,
// big condensed type, generous whitespace, diagonal accent shapes.
// Fully responsive: mobile, tablet, laptop, desktop, all browsers.

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Jocax Solutions",
  description:
    "Jocax Solutions is East Africa's trusted B2B partner for commercial kitchen equipment — supplying restaurants, hotels, and food service operations since 2010.",
};

// ─── Static data ──────────────────────────────────────────────────────────────

const STATS = [
  { value: "14+",    label: "Years in Business"     },
  { value: "2,400+", label: "Products Stocked"      },
  { value: "180+",   label: "Brand Partners"        },
  { value: "3,800+", label: "Clients Served"        },
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
    body:  "Our team of certified kitchen equipment specialists helps you spec the right equipment for your operation — from a single fryer to a full commissary build-out.",
  },
  {
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Fast Fulfilment",
    body:  "In-stock orders dispatched within 48 hours. Our Nairobi warehouse holds over 1,200 SKUs on the shelf, ready for same-week delivery across East Africa.",
  },
  {
    icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
    title: "After-Sales Support",
    body:  "Equipment failures cost you revenue. We offer installation support, spare parts stocking, and a dedicated technical helpline — 6 days a week.",
  },
];

const TEAM = [
  {
    name:  "James Kariuki",
    role:  "Founder & CEO",
    bio:   "Former head chef turned entrepreneur. James spent 12 years in professional kitchens before founding Jocax to solve the equipment supply problem he lived daily.",
    initial: "JK",
    color: "#e8a020",
  },
  {
    name:  "Amina Odhiambo",
    role:  "Head of Procurement",
    bio:   "20 years sourcing commercial equipment across Europe and Asia. Amina manages our manufacturer relationships and ensures every product we stock is worth stocking.",
    initial: "AO",
    color: "#3b82f6",
  },
  {
    name:  "David Muthoni",
    role:  "Technical Director",
    bio:   "Certified refrigeration and cooking equipment engineer. David leads our installation team and writes the technical specs for every product in our catalog.",
    initial: "DM",
    color: "#10b981",
  },
  {
    name:  "Priya Sharma",
    role:  "Sales & Partnerships",
    bio:   "10 years building B2B relationships in the hospitality sector. Priya works directly with hotel chains, hospital kitchens, and large catering operations.",
    initial: "PS",
    color: "#f43f5e",
  },
];

const MILESTONES = [
  { year: "2010", event: "Founded in Nairobi with 40 SKUs and a single van." },
  { year: "2013", event: "Opened first warehouse facility. Crossed 200 active clients." },
  { year: "2016", event: "Became authorised distributor for Vulcan, Hobart, and Pitco." },
  { year: "2019", event: "Launched online B2B catalog. Expanded to Uganda and Tanzania." },
  { year: "2022", event: "Hit 2,000+ SKU milestone. Opened second warehouse in Mombasa." },
  { year: "2024", event: "Launched this platform — real-time inventory, instant quotes, full specs." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      <style>{`
        /* ── Page-scoped animations ── */
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes expand-x {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .animate-fade-up          { animation: fade-up 0.7s ease both; }
        .animate-fade-up-d1       { animation: fade-up 0.7s 0.1s ease both; }
        .animate-fade-up-d2       { animation: fade-up 0.7s 0.2s ease both; }
        .animate-fade-up-d3       { animation: fade-up 0.7s 0.3s ease both; }
        .animate-fade-up-d4       { animation: fade-up 0.7s 0.4s ease both; }
        .amber-rule {
          display: block; height: 3px; width: 48px;
          background: var(--color-amber);
          border-radius: 2px;
          transform-origin: left;
          animation: expand-x 0.5s 0.2s ease both;
        }

        /* ── Stat card ── */
        .stat-card {
          padding: clamp(1.25rem, 3vw, 2.25rem);
          border: 1px solid rgba(255,255,255,0.06);
          border-top: 3px solid var(--color-amber);
          background: var(--color-steel-mid);
          border-radius: var(--radius-lg);
          transition: transform 220ms ease, border-color 220ms ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          border-top-color: var(--color-amber-light);
        }

        /* ── Value card ── */
        .value-card {
          padding: clamp(1.25rem, 3vw, 2rem);
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: var(--radius-xl);
          transition: background 200ms ease, border-color 200ms ease;
          display: flex; flex-direction: column; gap: 1rem;
        }
        .value-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(232,160,32,0.2);
        }

        /* ── Team card ── */
        .team-card {
          background: var(--color-steel-mid);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: var(--radius-xl);
          overflow: hidden;
          transition: transform 220ms ease, box-shadow 220ms ease;
        }
        .team-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.5);
        }

        /* ── Timeline ── */
        .timeline-item {
          display: grid;
          grid-template-columns: 4.5rem 1px 1fr;
          gap: 0 1.25rem;
          align-items: start;
        }
        .timeline-dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--color-amber);
          margin-top: 0.35rem;
          box-shadow: 0 0 0 4px rgba(232,160,32,0.18);
          justify-self: center;
          flex-shrink: 0;
        }
        .timeline-line {
          width: 1px; background: rgba(255,255,255,0.07);
          height: 100%; justify-self: center;
        }

        /* ── Section label — eyebrow style ── */
        .section-label {
          font-family: var(--font-display);
          font-size: var(--text-xs); font-weight: 700;
          letter-spacing: var(--tracking-widest); text-transform: uppercase;
          color: var(--color-amber);
          /* reset global p defaults */
          max-width: none; margin: 0; line-height: 1;
          color: var(--color-amber);
        }

        /* ── Colour / weight overrides for headings on dark bg ── */
        .about-hero-text h1,
        .about-two-col h2,
        .section-header h2,
        .team-header h2,
        .cta-band h2 {
          color: var(--color-white);
        }
        .cta-band h2 { color: var(--color-ink); }

        /* ── Stat display numbers (not semantic headings) ── */
        .about-stat-value {
          font-family: var(--font-display); font-weight: 800;
          font-size: var(--text-5xl); color: var(--color-white);
          letter-spacing: -0.03em; line-height: var(--leading-none);
          margin: 0; max-width: none;
        }
        .about-stat-label {
          font-size: var(--text-xs); color: rgba(255,255,255,0.45);
          font-weight: 500; margin-top: 0.5rem; text-transform: uppercase;
          letter-spacing: var(--tracking-wider); max-width: none;
          line-height: 1;
        }

        /* ── Timeline year label ── */
        .about-timeline-year {
          font-family: var(--font-display); font-weight: 700;
          font-size: var(--text-sm); color: var(--color-amber);
          letter-spacing: var(--tracking-wide); margin: 0;
          padding-top: 0.2rem; text-align: right; max-width: none; line-height: 1;
        }

        /* ── Body copy on dark backgrounds (colour override only) ── */
        .about-body-lead {
          font-size: var(--text-lg); color: rgba(255,255,255,0.6);
          line-height: var(--leading-relaxed); font-weight: 300;
          max-width: min(580px, 100%);
        }
        .about-body { color: rgba(255,255,255,0.55); font-weight: 300; }
        .about-body-sm { font-size: var(--text-sm); color: rgba(255,255,255,0.5); font-weight: 300; }

        /* ── CTA band ── */
        .cta-band {
          background: var(--color-amber);
          border-radius: var(--radius-xl);
          padding: clamp(2rem, 5vw, 4rem) clamp(1.25rem, 4vw, 4rem);
          display: flex; align-items: center; justify-content: space-between;
          gap: 1.5rem; flex-wrap: wrap;
        }
        .btn-dark {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: var(--color-ink); color: var(--color-white);
          font-family: var(--font-display); font-weight: 700;
          font-size: var(--text-sm); letter-spacing: var(--tracking-wide);
          text-transform: uppercase; text-decoration: none;
          padding: 0.875rem 1.75rem; border-radius: var(--radius-md);
          transition: background 180ms ease;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .btn-dark:hover { background: var(--color-steel); }

        /* ── Hero — capped at 100vh, 10vw padding on desktop ── */
        .about-hero-inner {
          padding-top: var(--nav-height);
          max-height: 100vh;
          overflow: hidden;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .about-hero-body {
          padding-block: clamp(3rem, 6vw, 5rem);
        }
        @media (min-width: 1024px) {
          .about-hero-body {
            padding-block: 10vw;
          }
        }

        /* ── Responsive grids ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4, 1rem);
        }
        @media (min-width: 480px) {
          .stats-grid { gap: clamp(0.75rem, 2vw, 1.5rem); }
        }
        @media (min-width: 768px) { .stats-grid { grid-template-columns: repeat(4, 1fr); } }

        .values-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4, 1rem);
        }
        @media (min-width: 560px)  { .values-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .values-grid { grid-template-columns: repeat(4, 1fr); } }

        .team-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-5, 1.25rem);
        }
        @media (min-width: 560px)  { .team-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .team-grid { grid-template-columns: repeat(4, 1fr); } }

        /* ── Mission + Timeline two-col ── */
        .about-two-col {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(2.5rem, 6vw, 5rem);
        }
        @media (min-width: 1024px) {
          .about-two-col { grid-template-columns: 1fr 1fr; }
        }

        /* ── CTA buttons flex wrap on small screens ── */
        .cta-actions {
          display: flex;
          gap: 0.875rem;
          flex-wrap: wrap;
          align-items: center;
        }

        /* ── Mission action links ── */
        .mission-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          flex-wrap: wrap;
          align-items: center;
        }

        /* ── Breadcrumb spacing ── */
        .about-breadcrumb {
          margin-bottom: clamp(1.5rem, 4vw, 3rem);
        }

        /* ── Hero text max-width ── */
        .about-hero-text {
          max-width: min(760px, 100%);
        }

        /* ── Section padding utilities ── */
        .section-block {
          padding-block: clamp(2.5rem, 6vw, 5rem);
        }
        .section-block-sm {
          padding-block: clamp(2rem, 5vw, 4rem);
        }
        .section-pb {
          padding-bottom: clamp(2.5rem, 6vw, 5rem);
        }
        .section-pb-sm {
          padding-bottom: clamp(2rem, 5vw, 4rem);
        }

        /* ── Section header spacing ── */
        .section-header {
          margin-bottom: clamp(1.5rem, 4vw, 3.5rem);
        }

        /* ── Touch-friendly hover fallback ── */
        @media (hover: none) {
          .stat-card:hover { transform: none; }
          .team-card:hover { transform: none; box-shadow: none; }
          .value-card:hover { background: rgba(255,255,255,0.025); border-color: rgba(255,255,255,0.06); }
        }

        /* ── Safe area insets for notched phones ── */
        @supports (padding: max(0px)) {
          .about-container-safe {
            padding-left: max(1rem, env(safe-area-inset-left));
            padding-right: max(1rem, env(safe-area-inset-right));
          }
        }
      `}</style>

      <div style={{ background: "var(--color-ink)", minHeight: "100vh" }}>

        {/* ══════════════════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════════════════ */}
        <div
          className="about-hero-inner"
          style={{
            background: "var(--color-steel)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Diagonal accent */}
          <div aria-hidden="true" style={{
            position: "absolute", top: 0, right: "-10%",
            width: "45%", height: "100%",
            background: "linear-gradient(135deg, transparent 45%, rgba(232,160,32,0.18) 45%)",
            pointerEvents: "none",
          }} />

          <div className="container about-hero-body">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="about-breadcrumb">
              <ol style={{ display: "flex", gap: "0.375rem", alignItems: "center", listStyle: "none", margin: 0, padding: 0, flexWrap: "wrap" }}>
                <li><Link href="/" style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-body)", textDecoration: "none" }}>Home</Link></li>
                <li style={{ color: "rgba(255,255,255,0.2)", fontSize: "var(--text-xs)" }}>›</li>
                <li><span style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body)" }}>About Us</span></li>
              </ol>
            </nav>

            <div className="about-hero-text">
              <p className="section-label animate-fade-up" style={{ marginBottom: "1.25rem" }}>
                Our Story
              </p>
              <h1 className="hero-heading animate-fade-up-d1">
                Built For{" "}
                <span style={{ color: "var(--color-amber)", display: "block" }}>
                  The Kitchen.
                </span>
              </h1>
              <span className="amber-rule animate-fade-up-d2" style={{ margin: "1.75rem 0" }} />
              <p className="about-body-lead animate-fade-up-d3">
                Jocax Solutions started with a simple frustration — professional kitchens
                deserved better than grey-market imports and three-month lead times.
                Since 2010 we have been East Africa&apos;s specialist distributor for
                commercial kitchen equipment, trusted by over 3,800 operations.
              </p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            STATS
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="container section-block">
          <div className="stats-grid">
            {STATS.map((s, i) => (
              <div key={s.label} className="stat-card" style={{ animationDelay: `${i * 80}ms` }}>
                <p className="about-stat-value">{s.value}</p>
                <p className="about-stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            MISSION  +  TIMELINE (2-col)
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="container section-pb">
          <div className="about-two-col">
            {/* Mission */}
            <div>
              <p className="section-label" style={{ marginBottom: "1rem" }}>Our Mission</p>
              <h2 style={{ color: "var(--color-white)", marginBottom: 0 }}>
                Equipping the Professionals Who Feed East Africa
              </h2>
              <p className="about-body" style={{ marginTop: "1.5rem" }}>
                Every hotel breakfast, every hospital meal, every stadium concession —
                behind each of those experiences is a commercial kitchen running the
                right equipment. Our mission is to make that equipment accessible,
                reliable, and properly supported for every serious operation on the
                continent.
              </p>
              <p className="about-body" style={{ marginTop: "1rem" }}>
                We are not a marketplace. We are a specialist distributor — which means
                pre-sales consulting, proper stock, certified installation, and a team
                that picks up the phone when something goes wrong.
              </p>
              <div className="mission-actions">
                <Link href="/products" className="btn btn-primary">
                  Browse Catalog →
                </Link>
                <Link href="/search" style={{
                  display: "inline-flex", alignItems: "center",
                  gap: "0.5rem",
                  fontFamily: "var(--font-display)", fontSize: "var(--text-sm)",
                  fontWeight: 700, letterSpacing: "var(--tracking-wide)",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.5)",
                  textDecoration: "none", padding: "0.875rem 0",
                  borderBottom: "1px solid rgba(255,255,255,0.12)",
                  transition: "color 180ms ease, border-color 180ms ease",
                  whiteSpace: "nowrap",
                }}>
                  Search Equipment
                </Link>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <p className="section-label" style={{ marginBottom: "1.5rem" }}>Our Journey</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {MILESTONES.map((m, i) => (
                  <div key={m.year} className="timeline-item" style={{ paddingBottom: i < MILESTONES.length - 1 ? "2rem" : 0 }}>
                    {/* Year */}
                    <p className="about-timeline-year">{m.year}</p>

                    {/* Spine */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div className="timeline-dot" />
                      {i < MILESTONES.length - 1 && (
                        <div className="timeline-line" style={{ flex: 1, marginTop: "0.5rem" }} />
                      )}
                    </div>

                    <p className="about-body-sm" style={{ margin: 0 }}>{m.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            VALUES
        ══════════════════════════════════════════════════════════════════════ */}
        <div style={{ background: "var(--color-steel)" }} className="section-block">
          <div className="container">
            <div className="section-header">
              <p className="section-label" style={{ marginBottom: "1rem" }}>What We Stand For</p>
              <h2 style={{ color: "var(--color-white)" }}>Our Values</h2>
            </div>

            <div className="values-grid">
              {VALUES.map((v) => (
                <div key={v.title} className="value-card">
                  <div style={{
                    width: "2.75rem", height: "2.75rem",
                    background: "rgba(232,160,32,0.1)",
                    border: "1px solid rgba(232,160,32,0.2)",
                    borderRadius: "var(--radius-md)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <svg
                      style={{ width: "1.25rem", height: "1.25rem", color: "var(--color-amber)" }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={v.icon} />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ color: "var(--color-white)", textTransform: "uppercase" }}>{v.title}</h4>
                    <p className="about-body-sm" style={{ marginTop: "0.5rem" }}>{v.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            TEAM
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="container section-block">
          <div className="section-header team-header">
            <p className="section-label" style={{ marginBottom: "1rem" }}>The People</p>
            <h2 style={{ color: "var(--color-white)" }}>Who We Are</h2>
          </div>

          <div className="team-grid">
            {TEAM.map((member) => (
              <div key={member.name} className="team-card">
                {/* Avatar band */}
                <div style={{
                  padding: "1.5rem",
                  background: `linear-gradient(135deg, ${member.color}18, ${member.color}08)`,
                  borderBottom: `3px solid ${member.color}`,
                  display: "flex", alignItems: "center", gap: "1rem",
                }}>
                  <div style={{
                    width: "3.25rem", height: "3.25rem",
                    borderRadius: "var(--radius-full)",
                    background: member.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <span style={{
                      fontFamily: "var(--font-display)", fontWeight: 800,
                      fontSize: "var(--text-base)", color: "var(--color-ink)",
                      letterSpacing: "var(--tracking-wide)",
                    }}>{member.initial}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{
                      color: "var(--color-white)", overflow: "hidden",
                      textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>{member.name}</h4>
                    <h5 style={{
                      color: member.color, letterSpacing: "var(--tracking-wider)",
                      marginTop: "0.2rem",
                    }}>{member.role}</h5>
                  </div>
                </div>

                {/* Bio */}
                <div style={{ padding: "1.25rem 1.5rem" }}>
                  <p className="about-body-sm" style={{ margin: 0 }}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            CTA BAND
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="container section-pb">
          <div className="cta-band">
            <div style={{ minWidth: 0 }}>
              <h2 style={{ color: "var(--color-ink)" }}>Ready to equip your kitchen?</h2>
              <p style={{ color: "rgba(13,13,13,0.65)", marginTop: "0.625rem", fontSize: "var(--text-sm)", maxWidth: "none" }}>
                Browse 2,400+ products or talk to a specialist today.
              </p>
            </div>
            <div className="cta-actions">
              <Link href="/products" className="btn-dark">
                Browse Catalog →
              </Link>
              <Link
                href="/search"
                style={{
                  display: "inline-flex", alignItems: "center",
                  gap: "0.5rem",
                  fontFamily: "var(--font-display)", fontSize: "var(--text-sm)",
                  fontWeight: 700, letterSpacing: "var(--tracking-wide)",
                  textTransform: "uppercase", color: "rgba(13,13,13,0.6)",
                  textDecoration: "none", padding: "0.875rem 1.25rem",
                  border: "2px solid rgba(13,13,13,0.25)",
                  borderRadius: "var(--radius-md)",
                  transition: "border-color 180ms ease, color 180ms ease",
                  whiteSpace: "nowrap",
                }}
              >
                Search Equipment
              </Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}