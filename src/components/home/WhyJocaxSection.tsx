// src/components/home/WhyJocaxSection.tsx
// Two-column layout: left brand copy, right 2×2 feature card grid.
//
// RESPONSIVE strategy:
//   < 640px  (mobile)  — single column; feature cards in 1-col stack
//   640–1023px (tablet) — single column; feature cards in 2-col grid
//   ≥ 1024px (desktop) — original two-column 1fr 1fr side by side

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { WHY_FEATURES } from "./home.data";

function useBreakpoint() {
  const [bp, setBp] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640)       setBp("mobile");
      else if (w < 1024) setBp("tablet");
      else               setBp("desktop");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return bp;
}

export default function WhyJocaxSection() {
  const bp        = useBreakpoint();
  const isMobile  = bp === "mobile";
  const isDesktop = bp === "desktop";

  return (
    <section
      className="section"
      aria-labelledby="why-heading"
      style={{ background: "var(--color-ink)" }}
    >
      <div className="container">
        <div
          style={{
            display:             "grid",
            // Mobile/tablet: stack copy above cards. Desktop: side by side.
            gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
            gap:                 isDesktop
              ? "var(--space-20)"
              : isMobile
              ? "var(--space-10)"
              : "var(--space-14)",
            alignItems: "center",
          }}
        >

          {/* ── Left / Top — brand copy ─────────────────────────────────── */}
          <div
            style={{
              display:       "flex",
              flexDirection: "column",
              // On mobile/tablet center-align the copy block for a cleaner
              // single-column read; desktop stays left-aligned.
              alignItems: isMobile ? "center" : "flex-start",
              textAlign:  isMobile ? "center" : "left",
            }}
          >
            {/* Eyebrow — use eyebrow-light since we're on a dark (ink) bg */}
            <p className="eyebrow-light" style={{ marginBottom: "var(--space-3)" }}>
              Why Jocax Solutions
            </p>

            {/* H2 — display heading, uppercase is correct at this size */}
            <h2
              id="why-heading"
              style={{
                color:    "var(--color-white)",
                fontSize: isMobile
                  ? "clamp(2rem, 9vw, 2.75rem)"   /* 32–44px */
                  : "clamp(var(--text-3xl), 4vw, var(--text-5xl))",
              }}
            >
              Built for<br />
              Food Service<br />
              <span style={{ color: "var(--color-amber)" }}>Professionals</span>
            </h2>

            {/* Body copy — raised from --color-text-faint to 0.65 white
                --color-text-faint (#9ca3af) on ink (#0d0d0d) passes contrast
                but feels washed out; rgba(255,255,255,0.65) is warmer. */}
            <p
              style={{
                color:      "rgba(255,255,255,0.65)",
                marginTop:  "var(--space-5)",
                fontWeight: 300,
                fontSize:   "var(--text-base)",   /* explicit 16px */
                maxWidth:   isMobile ? "none" : "420px",
                lineHeight: "var(--leading-relaxed)",
              }}
            >
              We supply restaurants, hotels, caterers, and institutional kitchens
              with commercial-grade equipment from the world&apos;s most trusted
              manufacturers. Every product is vetted, spec-verified, and backed
              by our procurement team.
            </p>

            <div style={{ marginTop: "var(--space-8)" }}>
              <Link href="/products" className="btn btn-primary btn-lg">
                Start Browsing →
              </Link>
            </div>
          </div>

          {/* ── Right / Bottom — feature cards ──────────────────────────── */}
          <div
            role="list"
            style={{
              display:             "grid",
              // Mobile: 1 column so cards have room to breathe.
              // Tablet + desktop: 2 columns.
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap:                 isMobile ? "var(--space-4)" : "var(--space-5)",
            }}
          >
            {WHY_FEATURES.map((f) => (
              <div
                key={f.title}
                role="listitem"
                className="surface-dark"
                style={{
                  borderRadius: "var(--radius-lg)",
                  padding:      isMobile ? "var(--space-5)" : "var(--space-6)",
                  // On mobile, lay the card out horizontally (icon left, text right)
                  // so a single-column stack doesn't feel monotonous.
                  display:       isMobile ? "flex"   : "block",
                  flexDirection: isMobile ? "row"    : undefined,
                  gap:           isMobile ? "var(--space-4)" : undefined,
                  alignItems:    isMobile ? "flex-start" : undefined,
                }}
              >
                {/* Icon */}
                <div
                  aria-hidden="true"
                  style={{
                    fontSize:    "1.5rem",
                    lineHeight:  1,
                    marginBottom: isMobile ? 0 : "var(--space-3)",
                    flexShrink:  0,
                    // On desktop/tablet give the icon a subtle amber tinted circle
                    background:  isMobile ? "none" : "var(--color-amber-muted)",
                    borderRadius: isMobile ? 0 : "var(--radius-md)",
                    width:       isMobile ? "auto" : "2.5rem",
                    height:      isMobile ? "auto" : "2.5rem",
                    display:     "flex",
                    alignItems:  "center",
                    justifyContent: "center",
                  }}
                >
                  {f.icon}
                </div>

                {/* Text block */}
                <div style={{ flex: 1 }}>
                  {/* Feature title
                      TYPOGRAPHY FIX: was uppercase at 16px (--text-base).
                      At this size with Barlow Condensed, sentence case reads
                      ~15% faster. Removed text-transform + tracking-wide.
                      Font weight bumped to 800 to compensate for lost emphasis. */}
                  <p
                    style={{
                      fontFamily:  "var(--font-display)",
                      fontWeight:  800,
                      fontSize:    "var(--text-base)",   /* 16px */
                      color:       "var(--color-white)",
                      // No text-transform, no tracking-wide — sentence case at 16px
                      letterSpacing: "var(--tracking-normal)",
                      textTransform: "none",
                      marginBottom: "var(--space-2)",
                      maxWidth:    "none",
                    }}
                  >
                    {f.title}
                  </p>

                  {/* Description — raised from --text-sm (14px) to --text-base (16px)
                      on mobile for comfortable single-column reading; 14px on desktop
                      where the card is compact and both columns are visible. */}
                  <p
                    style={{
                      fontSize:   isMobile ? "var(--text-base)" : "var(--text-sm)",
                      color:      "rgba(255,255,255,0.50)",
                      lineHeight: "var(--leading-relaxed)",
                      maxWidth:   "none",
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