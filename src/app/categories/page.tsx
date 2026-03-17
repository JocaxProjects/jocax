// src/app/categories/page.tsx
// Full categories listing page.
// Main card click → /products?category=[slug]  (straight to filtered products)
// Subcategory chips below each card → /products?category=[slug]

import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories.data";

export const metadata: Metadata = {
  title: "Equipment Categories | Jocax Solutions",
  description:
    "Browse all commercial kitchen equipment categories — ovens, refrigeration, fryers, prep tables, warewashing, ventilation, and more.",
};

export default function CategoriesPage() {
  return (
    <>
      <style>{`
        .cat-index-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }
        @media (min-width: 480px)  { .cat-index-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 768px)  { .cat-index-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1280px) { .cat-index-grid { grid-template-columns: repeat(4, 1fr); } }

        .cat-index-card {
          position:       relative;
          border-radius:  var(--radius-xl);
          overflow:       hidden;
          text-decoration:none;
          display:        flex;
          flex-direction: column;
          min-height:     240px;
          transition:     transform 220ms ease, box-shadow 220ms ease;
        }
        .cat-index-card:hover {
          transform:  translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .cat-index-card:hover .cat-card-overlay { opacity: 0.55; }
        .cat-index-card:hover .cat-card-arrow   { transform: translateX(4px); }

        .cat-card-overlay {
          position:   absolute;
          inset:      0;
          background: linear-gradient(160deg, rgba(13,13,13,0.3) 0%, rgba(13,13,13,0.85) 100%);
          transition: opacity 220ms ease;
          opacity:    0.7;
        }
        .cat-card-arrow {
          transition: transform 200ms ease;
          display:    inline-block;
        }

        .subcat-chip {
          display:       inline-flex;
          align-items:   center;
          padding:       0.25rem 0.7rem;
          border-radius: var(--radius-full);
          background:    rgba(255,255,255,0.08);
          border:        1px solid rgba(255,255,255,0.1);
          font-size:     0.68rem;
          font-weight:   600;
          color:         rgba(255,255,255,0.6);
          letter-spacing:0.06em;
          white-space:   nowrap;
          transition:    background 150ms ease, color 150ms ease;
        }
        .subcat-chip:hover {
          background: rgba(232,160,32,0.15);
          color:      var(--color-amber);
          border-color: rgba(232,160,32,0.3);
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "var(--color-ink)", paddingTop: "var(--nav-height)" }}>

        {/* ── Page header ── */}
        <div style={{
          background:   "var(--color-steel)",
          borderBottom: "1px solid var(--color-border-dark)",
          paddingBlock: "clamp(var(--space-10), 6vw, var(--space-16))",
          position:     "relative", overflow: "hidden",
        }}>
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(232,160,32,0.05) 0%, transparent 70%)",
          }} />
          <div className="container" style={{ position: "relative" }}>
            <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>Browse by Type</p>
            <h1 style={{ color: "var(--color-white)", marginBottom: "var(--space-4)" }}>
              Equipment Categories
            </h1>
            <p style={{
              color: "var(--color-text-faint)", maxWidth: "540px",
              lineHeight: "var(--leading-relaxed)", fontWeight: 300,
              fontSize: "clamp(var(--text-base), 1.5vw, var(--text-lg))",
            }}>
              {CATEGORIES.length} categories covering everything a professional commercial kitchen needs —
              from cooking equipment to refrigeration, warewashing, and ventilation.
            </p>
          </div>
        </div>

        {/* ── Category grid ── */}
        <div className="container" style={{ paddingBlock: "var(--space-12)" }}>
          <div className="cat-index-grid">
            {CATEGORIES.map((cat) => (
              <div key={cat.slug} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>

                {/* Main card → category landing page */}
                <Link href={`/products?category=${cat.slug}`} className="cat-index-card">
                  {/* Hero image */}
                  <img
                    src={cat.heroImage}
                    alt={cat.name}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {/* Gradient overlay */}
                  <div className="cat-card-overlay" />

                  {/* Color accent top bar */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                    background: `linear-gradient(90deg, ${cat.color}, transparent)`,
                  }} />

                  {/* Content */}
                  <div style={{
                    position:      "relative", zIndex: 1,
                    padding:       "var(--space-6)",
                    flex:          1,
                    display:       "flex",
                    flexDirection: "column",
                    justifyContent:"flex-end",
                  }}>
                    <div style={{ marginBottom: "auto" }}>
                      <span style={{ fontSize: "2rem" }} aria-hidden="true">{cat.icon}</span>
                    </div>
                    <div>
                      <p style={{
                        fontFamily:    "var(--font-display)",
                        fontWeight:    800,
                        fontSize:      "clamp(var(--text-lg), 2.5vw, var(--text-xl))",
                        color:         "var(--color-white)",
                        letterSpacing: "var(--tracking-wide)",
                        textTransform: "uppercase",
                        maxWidth:      "none",
                        marginBottom:  "var(--space-1)",
                      }}>
                        {cat.name}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <p style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
                          {cat.count} products
                        </p>
                        <span
                          className="cat-card-arrow"
                          style={{
                            fontFamily: "var(--font-display)", fontWeight: 800,
                            fontSize: "var(--text-sm)", color: cat.color,
                          }}
                        >
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Subcategory chips → products page filtered */}
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)" }}>
                    {cat.subcategories.slice(0, 4).map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/products?category=${cat.slug}`}
                        className="subcat-chip"
                        title={`${sub.count} products`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{
            marginTop: "var(--space-16)", paddingTop: "var(--space-10)",
            borderTop: "1px solid var(--color-border-dark)",
            textAlign: "center",
          }}>
            <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-5)" }}>
              Can&apos;t find what you&apos;re looking for?
            </p>
            <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/products" className="btn btn-primary">Browse All Equipment →</Link>
              <Link href="/search"   className="btn btn-outline-light">Search by Keyword</Link>
              <Link href="/contact"  className="btn btn-outline-light">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}