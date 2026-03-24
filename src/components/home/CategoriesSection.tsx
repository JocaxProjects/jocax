// src/components/home/CategoriesSection.tsx

import Link  from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/lib/categories.data";

export default function CategoriesSection() {
  return (
    <section className="section" aria-labelledby="categories-heading">
      <div className="container">

        <style>{`
          /* ── Grid ─────────────────────────────────────────────────────── */
          .cat-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-3);
          }
          @media (min-width: 640px)  { .cat-grid { grid-template-columns: repeat(3, 1fr); gap: var(--space-4); } }
          @media (min-width: 1024px) { .cat-grid { grid-template-columns: repeat(4, 1fr); } }

          /* ── Card base ─────────────────────────────────────────────────── */
          .home-cat-card {
            position:        relative;
            border-radius:   var(--radius-lg);
            overflow:        hidden;
            text-decoration: none;
            display:         flex;
            flex-direction:  column;
            min-height:      160px;
            border:          1px solid rgba(255,255,255,0.07);
            background:      rgba(255,255,255,0.03);
            transition:      border-color 300ms ease, box-shadow 300ms ease, transform 300ms ease;
          }
          @media (min-width: 640px)  { .home-cat-card { min-height: 185px; } }
          @media (min-width: 768px)  { .home-cat-card { min-height: 205px; } }
          @media (min-width: 1024px) { .home-cat-card { min-height: 220px; } }

          .home-cat-card:hover {
            border-color: var(--cat-color, var(--color-amber));
            box-shadow:   0 0 0 1px var(--cat-color, var(--color-amber)),
                          0 20px 52px rgba(0,0,0,0.50);
            transform:    translateY(-2px);
          }
          .home-cat-card:focus-visible {
            outline:        3px solid var(--color-amber);
            outline-offset: 3px;
          }

          /* ── Background image ──────────────────────────────────────────── */
          .home-cat-img {
            transition: transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
                        filter   350ms ease !important;
          }
          /* Resting brightness lifted from 0.22 → 0.30 so cards aren't muddy */
          .home-cat-card:hover .home-cat-img {
            transform: scale(1.06) !important;
            filter:    brightness(0.28) !important;
          }

          /* ── Gradient overlay ──────────────────────────────────────────── */
          .home-cat-overlay {
            position:   absolute;
            inset:      0;
            /* Stronger bottom gradient so text always reads clearly */
            background: linear-gradient(
              to bottom,
              rgba(13,13,13,0.10) 0%,
              rgba(13,13,13,0.55) 55%,
              rgba(13,13,13,0.85) 100%
            );
            transition: opacity 300ms ease;
            z-index:    1;
          }
          .home-cat-card:hover .home-cat-overlay { opacity: 1; }

          /* ── Color accent line at top ──────────────────────────────────── */
          .home-cat-card::before {
            content:          "";
            position:         absolute;
            top: 0; left: 0; right: 0;
            height:           3px;
            background:       var(--cat-color, var(--color-amber));
            transform:        scaleX(0);
            transform-origin: left;
            transition:       transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
            z-index:          3;
          }
          .home-cat-card:hover::before { transform: scaleX(1); }

          /* ── Icon ──────────────────────────────────────────────────────── */
          .home-cat-icon-wrap {
            width:           40px;
            height:          40px;
            border-radius:   var(--radius-md);
            background:      rgba(255,255,255,0.08);
            border:          1px solid rgba(255,255,255,0.10);
            display:         flex;
            align-items:     center;
            justify-content: center;
            font-size:       1.25rem;
            transition:      background 300ms ease, border-color 300ms ease;
            flex-shrink:     0;
          }
          .home-cat-card:hover .home-cat-icon-wrap {
            background:   rgba(255,255,255,0.04);
            border-color: var(--cat-color, var(--color-amber));
          }

          /* ── Category name ─────────────────────────────────────────────── */
          .home-cat-name {
            font-family:    var(--font-display);
            font-weight:    700;
            font-size:      var(--text-md);
            color:          var(--color-white);
            letter-spacing: var(--tracking-normal);
            display:        block;
            line-height:    var(--leading-snug);
            transition:     color 250ms ease;
          }
          .home-cat-card:hover .home-cat-name {
            color: var(--cat-color, var(--color-white));
          }
          @media (max-width: 639px) { .home-cat-name { font-size: var(--text-base); } }

          /* ── Count + arrow row ─────────────────────────────────────────── */
          .home-cat-meta {
            display:         flex;
            align-items:     center;
            justify-content: space-between;
            margin-top:      var(--space-1);
          }
          .home-cat-count {
            font-size:      var(--text-xs);
            color:          rgba(255,255,255,0.45);
            font-weight:    500;
            letter-spacing: var(--tracking-wide);
          }
          /* Arrow replaced with a proper SVG chevron — no more dash ambiguity */
          .home-cat-arrow {
            display:         flex;
            align-items:     center;
            justify-content: center;
            width:           24px;
            height:          24px;
            border-radius:   var(--radius-sm);
            background:      rgba(255,255,255,0.06);
            color:           var(--cat-color, var(--color-amber));
            transition:      transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1),
                             background 300ms ease;
            flex-shrink:     0;
          }
          .home-cat-card:hover .home-cat-arrow {
            transform:  translateX(3px);
            background: rgba(255,255,255,0.10);
          }

          /* ── Subcategory chips ─────────────────────────────────────────── */
          .home-cat-chips {
            display:    flex;
            flex-wrap:  wrap;
            gap:        0.3rem;
            padding:    0 var(--space-4) var(--space-3);
            max-height: 0;
            overflow:   hidden;
            transition: max-height 300ms ease, padding-bottom 300ms ease;
          }
          .home-cat-card:hover .home-cat-chips { max-height: 80px; }

          .home-cat-chip {
            font-size:      var(--text-xs);
            font-weight:    600;
            padding:        0.25rem 0.6rem;
            border-radius:  var(--radius-sm);
            background:     rgba(255,255,255,0.06);
            border:         1px solid rgba(255,255,255,0.10);
            color:          rgba(255,255,255,0.55);
            white-space:    nowrap;
            pointer-events: none;
          }

          /* ── Section header ────────────────────────────────────────────── */
          .cat-section-header {
            display:         flex;
            align-items:     flex-end;
            justify-content: space-between;
            margin-bottom:   var(--space-10);
            gap:             var(--space-4);
            flex-wrap:       wrap;
          }
          .cat-eyebrow {
            display:        flex;
            align-items:    center;
            gap:            var(--space-2);
            font-family:    var(--font-display);
            font-size:      var(--text-xs);
            font-weight:    700;
            letter-spacing: var(--tracking-widest);
            text-transform: uppercase;
            color:          var(--color-amber);
            margin-bottom:  var(--space-2);
          }
          .cat-eyebrow-dash {
            display:       inline-block;
            width:         20px;
            height:        2px;
            background:    var(--color-amber);
            border-radius: 2px;
            flex-shrink:   0;
          }

          /* ── "All categories" link ─────────────────────────────────────── */
          .all-categories-link {
            display:         inline-flex;
            align-items:     center;
            gap:             var(--space-2);
            font-size:       var(--text-xs);
            font-weight:     700;
            letter-spacing:  var(--tracking-wider);
            text-transform:  uppercase;
            color:           rgba(255,255,255,0.55);
            text-decoration: none;
            padding:         var(--space-2) var(--space-3);
            border:          1px solid rgba(255,255,255,0.12);
            border-radius:   var(--radius-md);
            white-space:     nowrap;
            transition:      color var(--transition-fast),
                             border-color var(--transition-fast),
                             background var(--transition-fast);
          }
          .all-categories-link:hover {
            color:        var(--color-amber);
            border-color: rgba(232,160,32,0.35);
            background:   rgba(232,160,32,0.05);
          }
          .all-categories-link:focus-visible {
            outline:        3px solid var(--color-amber);
            outline-offset: 3px;
            border-radius:  var(--radius-md);
          }
          .all-categories-link svg {
            transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .all-categories-link:hover svg {
            transform: translateX(3px);
          }
        `}</style>

        {/* ── Section header ──────────────────────────────────────────────── */}
        <div className="cat-section-header">
          <div>
            <p className="cat-eyebrow">
              <span className="cat-eyebrow-dash" aria-hidden="true" />
              Browse by Type
            </p>
            <h2 id="categories-heading" style={{ marginBottom: 0 }}>
              Equipment Categories
            </h2>
          </div>
          <Link href="/categories" className="all-categories-link">
            All categories
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* ── Category grid ────────────────────────────────────────────────── */}
        <div role="list" className="cat-grid stagger">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              role="listitem"
              aria-label={`${cat.name} — ${cat.count} products`}
              className="home-cat-card animate-fade-up"
              style={{ "--cat-color": cat.color } as React.CSSProperties}
            >
              {/* Background image */}
              <Image
                src={cat.heroImage}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
                className="home-cat-img"
                style={{
                  objectFit: "cover",
                  filter:    "brightness(0.30)",
                }}
              />

              <div className="home-cat-overlay" />

              {/* Card content */}
              <div style={{
                position:       "relative",
                zIndex:         2,
                flex:           1,
                display:        "flex",
                flexDirection:  "column",
                justifyContent: "space-between",
                padding:        "var(--space-4)",
              }}>
                {/* Icon — top left */}
                <div className="home-cat-icon-wrap" aria-hidden="true">
                  {cat.icon}
                </div>

                {/* Name + meta — bottom */}
                <div style={{ marginTop: "var(--space-4)" }}>
                  <span className="home-cat-name">{cat.name}</span>
                  <div className="home-cat-meta">
                    <span className="home-cat-count">{cat.count} products</span>
                    <span className="home-cat-arrow" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              {/* Subcategory chips — revealed on hover */}
              {cat.subcategories && cat.subcategories.length > 0 && (
                <div
                  className="home-cat-chips"
                  aria-hidden="true"
                  style={{ position: "relative", zIndex: 2 }}
                >
                  {cat.subcategories.slice(0, 3).map((sub) => (
                    <span key={sub.slug} className="home-cat-chip">{sub.name}</span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}