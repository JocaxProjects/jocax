// src/app/categories/page.tsx
// Full categories listing page.
// Mobile-first centering strategy:
//   • Page header (eyebrow, h1, lead): centered on mobile, left at lg+
//   • Category grid: 1→2→3→4 cols responsive
//   • Bottom CTA: centered on all sizes (it's a call-to-action block)
//   • Diagonal amber clip: always visible
// Main card click → /products?category=[slug]
// Subcategory chips below each card → /products?category=[slug]

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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

        /* ════════════════════════════════════════════════════════════
           PAGE HEADER — centered on mobile, left at lg+
        ════════════════════════════════════════════════════════════ */
        .cat-page-header {
          background:   var(--color-steel);
          border-bottom:1px solid var(--color-border-dark);
          padding-block: clamp(var(--space-10), 6vw, var(--space-16));
          position: relative; overflow: hidden;
        }
        .cat-header-body {
          position: relative;
          /* Mobile: center everything */
          text-align: center;
          display: flex; flex-direction: column; align-items: center;
        }
        .cat-header-body p:last-child {
          /* Lead paragraph: centered and capped on mobile */
          margin-inline: auto;
        }
        /* lg+: left-align */
        @media (min-width: 1024px) {
          .cat-header-body {
            text-align: left;
            align-items: flex-start;
          }
          .cat-header-body p:last-child {
            margin-inline: 0;
          }
        }

        /* Diagonal amber clip — always visible */
        .cat-header-diag {
          position: absolute; top: 0; right: -10%;
          width: 45%; height: 100%; pointer-events: none;
          background: linear-gradient(135deg, transparent 45%, rgba(232,160,32,0.12) 45%);
        }

        /* ════════════════════════════════════════════════════════════
           CATEGORY GRID
        ════════════════════════════════════════════════════════════ */
        .cat-index-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }
        @media (min-width: 480px)  { .cat-index-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 768px)  { .cat-index-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1280px) { .cat-index-grid { grid-template-columns: repeat(4, 1fr); } }

        /* ════════════════════════════════════════════════════════════
           CATEGORY CARD
        ════════════════════════════════════════════════════════════ */
        .cat-index-card {
          position: relative;
          border-radius: var(--radius-xl);
          overflow: hidden;
          text-decoration: none;
          display: flex; flex-direction: column;
          /* Fluid min-height — not too tall on mobile */
          min-height: clamp(180px, 30vw, 240px);
          transition: transform 220ms ease, box-shadow 220ms ease;
        }
        .cat-index-card:hover {
          transform:  translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .cat-index-card:hover .cat-card-overlay { opacity: 0.55; }
        .cat-index-card:hover .cat-card-arrow   { transform: translateX(4px); }

        /* Touch devices — no hover lift */
        @media (hover: none) and (pointer: coarse) {
          .cat-index-card:hover { transform: none; box-shadow: none; }
          .cat-index-card:active { transform: scale(0.99); }
        }

        .cat-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, rgba(13,13,13,0.3) 0%, rgba(13,13,13,0.85) 100%);
          transition: opacity 220ms ease;
          opacity: 0.7;
        }
        .cat-card-arrow {
          transition: transform 200ms ease;
          display: inline-block;
        }

        /* ════════════════════════════════════════════════════════════
           SUBCATEGORY CHIPS
        ════════════════════════════════════════════════════════════ */
        .subcat-chip {
          display: inline-flex; align-items: center;
          padding: 0.25rem 0.7rem;
          border-radius: var(--radius-full);
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 0.68rem; font-weight: 600;
          color: rgba(255,255,255,0.6); letter-spacing: 0.06em;
          white-space: nowrap;
          transition: background 150ms ease, color 150ms ease;
          /* 44px touch target */
          min-height: 2rem;
        }
        .subcat-chip:hover {
          background: rgba(232,160,32,0.15);
          color: var(--color-amber);
          border-color: rgba(232,160,32,0.3);
        }

        /* ════════════════════════════════════════════════════════════
           BOTTOM CTA — centered on all sizes
        ════════════════════════════════════════════════════════════ */
        .cat-bottom-cta {
          margin-top: var(--space-16);
          padding-top: var(--space-10);
          border-top: 1px solid var(--color-border-dark);
          text-align: center;
        }
        .cat-cta-actions {
          display: flex;
          gap: var(--space-3);
          justify-content: center;
          flex-wrap: wrap;
          /* Mobile: each button full width, capped */
          width: 100%;
          max-width: 26rem;
          margin-inline: auto;
        }
        .cat-cta-actions > * {
          flex: 1 1 100%;
          justify-content: center !important;
          text-align: center;
          box-sizing: border-box;
        }
        /* SM+: side by side, equal width */
        @media (min-width: 480px) {
          .cat-cta-actions > * {
            flex: 1 1 0;
            max-width: 13rem;
          }
        }
        /* md+: row, auto width, no cap */
        @media (min-width: 768px) {
          .cat-cta-actions {
            width: auto;
            max-width: none;
            margin-inline: auto;
          }
          .cat-cta-actions > * {
            flex: 0 0 auto;
            max-width: none;
          }
        }

        /* ════════════════════════════════════════════════════════════
           REDUCED MOTION
        ════════════════════════════════════════════════════════════ */
        @media (prefers-reduced-motion: reduce) {
          .cat-index-card { transition: none; }
          .cat-card-arrow { transition: none; }
          .subcat-chip    { transition: none; }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "var(--color-ink)",
        paddingTop: "var(--nav-height)",
        overflowX: "hidden",
      }}>

        {/* ════════════════════════════════════════════════════════════════
            PAGE HEADER
        ════════════════════════════════════════════════════════════════ */}
        <div className="cat-page-header">
          {/* Ambient glow */}
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(232,160,32,0.05) 0%, transparent 70%)",
          }}/>
          {/* Diagonal clip — always visible */}
          <div className="cat-header-diag" aria-hidden="true"/>

          <div className="container cat-header-body">
            {/* Breadcrumb — centered on mobile, left at lg+ */}
            <nav aria-label="Breadcrumb" style={{ marginBottom: "clamp(1rem, 3vw, 1.75rem)", alignSelf: "stretch" }}>
              <ol style={{
                display: "flex", gap: "0.375rem", alignItems: "center",
                listStyle: "none", margin: 0, padding: 0,
                flexWrap: "wrap",
                /* Mobile: centered; desktop: left via parent align-items */
                justifyContent: "center",
              }}>
                <li>
                  <Link href="/" style={{
                    fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.35)",
                    fontFamily: "var(--font-body)", textDecoration: "none",
                  }}>Home</Link>
                </li>
                <li style={{ color: "rgba(255,255,255,0.2)", fontSize: "var(--text-xs)" }}>›</li>
                <li>
                  <span style={{
                    fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.6)",
                    fontFamily: "var(--font-body)",
                  }}>Categories</span>
                </li>
              </ol>
            </nav>

            <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>
              Browse by Type
            </p>

            <h1 style={{
              color: "var(--color-white)",
              marginBottom: "var(--space-4)",
            }}>
              Equipment Categories
            </h1>

            <p style={{
              color: "var(--color-text-faint)",
              maxWidth: "540px",
              lineHeight: "var(--leading-relaxed)",
              fontWeight: 300,
              fontSize: "clamp(var(--text-base), 1.5vw, var(--text-lg))",
            }}>
              {CATEGORIES.length} categories covering everything a professional commercial
              kitchen needs — from cooking equipment to refrigeration, warewashing,
              and ventilation.
            </p>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            CATEGORY GRID
        ════════════════════════════════════════════════════════════════ */}
        <div className="container" style={{ paddingBlock: "var(--space-12)" }}>
          <div className="cat-index-grid">
            {CATEGORIES.map((cat) => (
              <div key={cat.slug} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>

                {/* Main card */}
                <Link href={`/products?category=${cat.slug}`} className="cat-index-card">
                  {/* Hero image */}
                  <Image
                    src={cat.heroImage}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    style={{ objectFit: "cover" }}
                    priority={false}
                  />
                  {/* Gradient overlay */}
                  <div className="cat-card-overlay"/>

                  {/* Color accent top bar */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                    background: `linear-gradient(90deg, ${cat.color}, transparent)`,
                  }}/>

                  {/* Card content */}
                  <div style={{
                    position: "relative", zIndex: 1,
                    padding: "var(--space-6)",
                    flex: 1,
                    display: "flex", flexDirection: "column",
                    justifyContent: "flex-end",
                  }}>
                    <div style={{ marginBottom: "auto" }}>
                      <span style={{ fontSize: "2rem" }} aria-hidden="true">{cat.icon}</span>
                    </div>
                    <div>
                      <p style={{
                        fontFamily: "var(--font-display)", fontWeight: 800,
                        fontSize: "clamp(var(--text-base), 2.5vw, var(--text-xl))",
                        color: "var(--color-white)",
                        letterSpacing: "var(--tracking-wide)",
                        textTransform: "uppercase",
                        maxWidth: "none",
                        marginBottom: "var(--space-1)",
                      }}>
                        {cat.name}
                      </p>
                      <div style={{
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between",
                      }}>
                        <p style={{
                          fontSize: "var(--text-xs)",
                          color: "rgba(255,255,255,0.5)",
                          fontWeight: 500,
                        }}>
                          {cat.count} products
                        </p>
                        <span
                          className="cat-card-arrow"
                          style={{
                            fontFamily: "var(--font-display)", fontWeight: 800,
                            fontSize: "var(--text-sm)", color: cat.color,
                          }}
                        >→</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Subcategory chips */}
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

          {/* ════════════════════════════════════════════════════════════
              BOTTOM CTA — centered on all sizes
          ════════════════════════════════════════════════════════════ */}
          <div className="cat-bottom-cta">
            <p style={{
              color: "var(--color-text-muted)",
              marginBottom: "var(--space-5)",
              fontSize: "var(--text-sm)",
            }}>
              Can&apos;t find what you&apos;re looking for?
            </p>
            <div className="cat-cta-actions">
              <Link href="/products" className="btn btn-primary">
                Browse All Equipment →
              </Link>
              <Link href="/search" className="btn btn-outline-light">
                Search by Keyword
              </Link>
              <Link href="/contact" className="btn btn-outline-light">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}