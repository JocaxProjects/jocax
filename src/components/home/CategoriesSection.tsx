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
            min-height:      140px;
            border:          1px solid var(--color-border-dark);
            background:      rgba(255,255,255,0.03);
            transition:      border-color 350ms ease, box-shadow 350ms ease;
          }
          @media (min-width: 640px)  { .home-cat-card { min-height: 170px; } }
          @media (min-width: 768px)  { .home-cat-card { min-height: 190px; } }
          @media (min-width: 1024px) { .home-cat-card { min-height: 200px; } }

          /* Hover: glow ring using the category's accent colour */
          .home-cat-card:hover {
            border-color: var(--cat-color, var(--color-amber));
            box-shadow:   0 0 0 1px var(--cat-color, var(--color-amber)),
                          0 16px 48px rgba(0,0,0,0.45);
          }
          .home-cat-card:focus-visible {
            outline:        3px solid var(--color-amber);
            outline-offset: 3px;
          }

          /* ── Background image wrapper ──────────────────────────────────── */
          /* Scale the image in-place; the card's overflow:hidden clips it */
          .home-cat-img {
            transition: transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
                        filter   350ms ease !important;
          }
          .home-cat-card:hover .home-cat-img {
            transform: scale(1.06) !important;
            filter:    brightness(0.32) !important;
          }

          /* ── Gradient overlay ──────────────────────────────────────────── */
          .home-cat-overlay {
            position:   absolute;
            inset:      0;
            background: linear-gradient(160deg, transparent 20%, rgba(13,13,13,0.75) 100%);
            transition: opacity 350ms ease;
            z-index:    1;
          }
          .home-cat-card:hover .home-cat-overlay {
            opacity: 1.0;
          }

          /* ── Color accent line at top ──────────────────────────────────── */
          .home-cat-card::before {
            content:    "";
            position:   absolute;
            top: 0; left: 0; right: 0;
            height:     3px;
            background: var(--cat-color, var(--color-amber));
            transform:  scaleX(0);
            transform-origin: left;
            transition: transform 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
            z-index:    2;
          }
          .home-cat-card:hover::before { transform: scaleX(1); }

          /* ── Category name ─────────────────────────────────────────────── */
          .home-cat-name {
            font-family:    var(--font-display);
            font-weight:    700;
            font-size:      var(--text-md);
            color:          var(--color-white);
            text-transform: none;
            letter-spacing: var(--tracking-normal);
            display:        block;
            line-height:    var(--leading-snug);
            transition:     color 250ms ease;
          }
          .home-cat-card:hover .home-cat-name {
            color: var(--cat-color, var(--color-white));
          }
          @media (max-width: 639px) { .home-cat-name { font-size: var(--text-base); } }

          /* ── Arrow ─────────────────────────────────────────────────────── */
          .home-cat-arrow {
            display:    inline-block;
            font-size:  var(--text-xs);
            font-weight: 800;
            color:      var(--cat-color, var(--color-amber));
            letter-spacing: 0.06em;
            transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .home-cat-card:hover .home-cat-arrow {
            transform: translateX(5px);
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
            font-size:     var(--text-xs);
            font-weight:   600;
            padding:       0.25rem 0.6rem;
            border-radius: var(--radius-full);
            background:    rgba(255,255,255,0.07);
            border:        1px solid rgba(255,255,255,0.12);
            color:         rgba(255,255,255,0.60);
            white-space:   nowrap;
            pointer-events:none;
          }

          /* ── "All categories" link ─────────────────────────────────────── */
          .all-categories-link {
            font-size:       var(--text-xs);
            font-weight:     700;
            letter-spacing:  var(--tracking-wider);
            text-transform:  uppercase;
            color:           var(--color-text-primary);
            border-bottom:   2px solid var(--color-amber);
            padding-bottom:  2px;
            white-space:     nowrap;
            text-decoration: none;
            transition:      opacity var(--transition-fast), color var(--transition-fast);
          }
          .all-categories-link:hover { color: var(--color-amber-dark); }
          .all-categories-link:focus-visible {
            outline:        3px solid var(--color-amber);
            outline-offset: 4px;
            border-radius:  2px;
          }
        `}</style>

        {/* ── Section header ──────────────────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          marginBottom: "var(--space-10)", gap: "var(--space-4)", flexWrap: "wrap",
        }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: "var(--space-2)" }}>Browse by Type</p>
            <h2 id="categories-heading">Equipment Categories</h2>
          </div>
          <Link href="/categories" className="all-categories-link">
            All categories →
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
              <Image
                src={cat.heroImage}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
                className="home-cat-img"
                style={{
                  objectFit: "cover",
                  filter:    "brightness(0.22)",
                }}
              />

              <div className="home-cat-overlay" />

              {/* Card content */}
              <div style={{
                position: "relative", zIndex: 1,
                flex: 1, display: "flex", flexDirection: "column",
                justifyContent: "flex-end",
                padding: "var(--space-4)",
              }}>
                {/* Icon */}
                <div style={{ marginBottom: "auto", paddingTop: "var(--space-2)" }}>
                  <span style={{ fontSize: "1.75rem" }} aria-hidden="true">{cat.icon}</span>
                </div>

                {/* Name + count */}
                <div style={{ marginTop: "var(--space-4)" }}>
                  <span className="home-cat-name">{cat.name}</span>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginTop: "var(--space-1)",
                  }}>
                    <span style={{
                      fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.50)",
                      fontWeight: 500, letterSpacing: "var(--tracking-wide)",
                    }}>
                      {cat.count} products
                    </span>
                    <span aria-hidden="true" className="home-cat-arrow">→</span>
                  </div>
                </div>
              </div>

              {/* Subcategory chips — decorative, revealed on hover */}
              {cat.subcategories && cat.subcategories.length > 0 && (
                <div className="home-cat-chips" aria-hidden="true" style={{ position: "relative", zIndex: 1 }}>
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