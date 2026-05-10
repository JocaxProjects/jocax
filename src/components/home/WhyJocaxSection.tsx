// src/components/home/WhyJocaxSection.tsx
// Two-column layout: left brand copy, right 2×2 feature card grid.
//
// RESPONSIVE strategy:
//   < 640px  (mobile)  — single column; feature cards stacked
//   640–1023px (tablet) — single column; feature cards 2-col grid; copy centered
//   ≥ 1024px (desktop) — two-column 3fr 2fr (copy wider than cards)

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { WHY_FEATURES } from "./home.data";

function useBreakpoint() {
  const [bp, setBp] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setBp("mobile");
      else if (w < 1024) setBp("tablet");
      else setBp("desktop");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return bp;
}

export default function WhyJocaxSection() {
  const bp = useBreakpoint();
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";
  const isDesktop = bp === "desktop";

  return (
    <section
      className="section"
      aria-labelledby="why-heading"
      style={{ background: "var(--color-ink)" }}
    >
      <style>{`
        /* ── Feature card ──────────────────────────────────────────────── */
        .why-card {
          border-radius:  var(--radius-lg);
          border:         1px solid rgba(255,255,255,0.07);
          background:     rgba(255,255,255,0.03);
          transition:     border-color 300ms ease,
                          box-shadow   300ms ease,
                          transform    300ms ease;
        }
        .why-card:hover {
          border-color: rgba(232,160,32,0.30);
          box-shadow:   0 0 0 1px rgba(232,160,32,0.15),
                        0 16px 40px rgba(0,0,0,0.40);
          transform:    translateY(-2px);
        }

        /* ── Icon box ──────────────────────────────────────────────────── */
        .why-icon-box {
          width:           40px;
          height:          40px;
          border-radius:   var(--radius-md);
          background:      rgba(232,160,32,0.10);
          border:          1px solid rgba(232,160,32,0.15);
          display:         flex;
          align-items:     center;
          justify-content: center;
          font-size:       1.2rem;
          flex-shrink:     0;
          transition:      background 300ms ease, border-color 300ms ease;
        }
        .why-card:hover .why-icon-box {
          background:   rgba(232,160,32,0.16);
          border-color: rgba(232,160,32,0.30);
        }

        /* ── Eyebrow ───────────────────────────────────────────────────── */
        .why-eyebrow {
          display:        flex;
          align-items:    center;
          gap:            var(--space-2);
          font-family:    var(--font-display);
          font-size:      var(--text-xs);
          font-weight:    700;
          letter-spacing: var(--tracking-widest);
          text-transform: uppercase;
          color:          var(--color-amber);
          margin-bottom:  var(--space-3);
        }
        .why-eyebrow-dash {
          display:       inline-block;
          width:         20px;
          height:        2px;
          background:    var(--color-amber);
          border-radius: 2px;
          flex-shrink:   0;
        }

        /* ── Divider between stats ─────────────────────────────────────── */
        .why-stat-divider {
          width:        1px;
          height:       32px;
          background:   rgba(255,255,255,0.10);
          flex-shrink:  0;
        }
      `}</style>

      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isDesktop ? "3fr 2fr" : "1fr",
            gap: isDesktop
              ? "var(--space-20)"
              : isTablet
                ? "var(--space-14)"
                : "var(--space-10)",
            alignItems: "center",
          }}
        >

          {/* ══════════════════════════════════════════════════════════════
              LEFT / TOP — brand copy
          ══════════════════════════════════════════════════════════════ */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isDesktop ? "flex-start" : "center",
              textAlign: isDesktop ? "left" : "center",
            }}
          >
            {/* Eyebrow — consistent amber dash pattern */}
            <p className="why-eyebrow">
              <span className="why-eyebrow-dash" aria-hidden="true" />
              Why Jocax Solutions Limited
            </p>

            {/* H2 */}
            <h2
              id="why-heading"
              style={{
                color: "var(--color-white)",
                fontSize: isMobile
                  ? "clamp(2rem, 9vw, 2.75rem)"
                  : "clamp(var(--text-3xl), 4vw, var(--text-5xl))",
                marginBottom: 0,
              }}
            >
              Built for<br />
              Food Service<br />
              <span style={{ color: "var(--color-amber)" }}>Professionals</span>
            </h2>

            {/* Body copy */}
            <p
              style={{
                color: "rgba(255,255,255,0.60)",
                marginTop: "var(--space-5)",
                marginBottom: "var(--space-8)",
                fontWeight: 300,
                fontSize: "var(--text-base)",
                maxWidth: isDesktop ? "420px" : "min(520px, 100%)",
                marginInline: isDesktop ? undefined : "auto",
                lineHeight: "var(--leading-relaxed)",
              }}
            >
              We supply restaurants, hotels, caterers, and institutional kitchens
              with commercial-grade equipment from the world&apos;s most trusted
              manufacturers. Every product is vetted, spec-verified, and backed
              by our procurement team.
            </p>

            {/* CTA */}
            <Link
              href="/products"
              className="btn btn-primary btn-lg"
              style={{ alignSelf: isDesktop ? "flex-start" : "center" }}
            >
              Start Browsing →
            </Link>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              RIGHT / BOTTOM — feature cards
          ══════════════════════════════════════════════════════════════ */}
          <div
            role="list"
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: isMobile ? "var(--space-4)" : "var(--space-4)",
            }}
          >
            {WHY_FEATURES.map((f) => (
              <div
                key={f.title}
                role="listitem"
                className="why-card"
                style={{
                  padding: isMobile ? "var(--space-5)" : "var(--space-5)",
                  display: "flex",
                  flexDirection: isMobile ? "row" : "column",
                  gap: isMobile ? "var(--space-4)" : "var(--space-3)",
                  alignItems: isMobile ? "flex-start" : "flex-start",
                }}
              >
                {/* Icon box — consistent on all breakpoints */}
                <div className="why-icon-box" aria-hidden="true">
                  {f.icon}
                </div>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "var(--text-base)",
                      color: "var(--color-white)",
                      letterSpacing: "var(--tracking-normal)",
                      textTransform: "none",
                      marginBottom: "var(--space-2)",
                      maxWidth: "none",
                    }}
                  >
                    {f.title}
                  </p>
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "rgba(255,255,255,0.48)",
                      lineHeight: "var(--leading-relaxed)",
                      maxWidth: "none",
                    }}
                  >
                    {f.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}