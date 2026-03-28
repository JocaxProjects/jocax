"use client";
// src/components/home/HeroClient.tsx

import { useState, useEffect } from "react";
import Link        from "next/link";
import Image       from "next/image";
import ProductCard from "@/components/ProductCard";
import type { ProductListItem } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroClientProps {
  hero: ProductListItem;
  mini: ProductListItem[];
}

// ─── Breakpoint hook ──────────────────────────────────────────────────────────

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

// ─── Stats data ───────────────────────────────────────────────────────────────

const STATS = [
  { value: "1,000+", label: "Products" },
  { value: "50+",    label: "Brands"   },
  { value: "1,000+", label: "Operations served" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeroClient({ hero, mini }: HeroClientProps) {
  const bp = useBreakpoint();

  const isMobile  = bp === "mobile";
  const isTablet  = bp === "tablet";
  const isDesktop = bp === "desktop";

  return (
    <section
      aria-label="Hero"
      style={{
        background:          "var(--color-steel)",
        minHeight:           isMobile ? "auto" : "100vh",
        display:             "grid",
        gridTemplateColumns: isDesktop ? "3fr 2fr" : "1fr",
        position:            "relative",
        overflow:            "hidden",
        paddingTop:          "var(--nav-height)",
      }}
    >



      {/* ══════════════════════════════════════════════════════════════════
          LEFT / TOP — Copy block
      ══════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          padding: isMobile
            ? `var(--space-10) var(--page-padding-x) var(--space-6)`
            : isTablet
            ? `var(--space-12) var(--page-padding-x) var(--space-10)`
            : `clamp(var(--space-12), 8vw, var(--space-24)) var(--page-padding-x)`,
          display:        "flex",
          flexDirection:  "column",
          justifyContent: "center",
          alignItems:     isMobile || isTablet ? "center" : "flex-start",
          textAlign:      isMobile || isTablet ? "center" : "left",
          position:       "relative",
          zIndex:         1,
        }}
      >
        {/* Eyebrow label */}
        <p
          style={{
            fontFamily:    "var(--font-display)",
            fontSize:      "var(--text-xs)",
            fontWeight:    700,
            letterSpacing: "var(--tracking-widest)",
            textTransform: "uppercase",
            color:         "var(--color-amber)",
            marginBottom:  "var(--space-4)",
            display:       "flex",
            alignItems:    "center",
            gap:           "var(--space-2)",
          }}
        >
          <span
            style={{
              display:      "inline-block",
              width:        "24px",
              height:       "2px",
              background:   "var(--color-amber)",
              borderRadius: "2px",
              flexShrink:   0,
            }}
            aria-hidden="true"
          />
          East Africa&apos;s Kitchen Specialists
        </p>

        {/* H1 */}
        <h1
          style={{
            color:      "var(--color-white)",
            fontSize:   isMobile
              ? "clamp(2.5rem, 10vw, 3rem)"
              : isTablet
              ? "clamp(3rem, 6vw, 4rem)"
              : "clamp(var(--text-4xl), 6vw, var(--text-6xl))",
            marginBottom: 0,
          }}
        >
          Professional<br />
          Kitchen<br />
          <span style={{ color: "var(--color-amber)" }}>Equipment</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize:     isMobile ? "var(--text-base)" : "clamp(var(--text-base), 1.5vw, var(--text-lg))",
            color:        "rgba(255,255,255,0.60)",
            lineHeight:   "var(--leading-relaxed)",
            maxWidth:     isDesktop ? "420px" : "min(480px, 100%)",
            marginTop:    "var(--space-5)",
            marginBottom: "var(--space-6)",
            marginInline: isMobile || isTablet ? "auto" : undefined,
            fontWeight:   300,
          }}
        >
          The definitive source for commercial kitchen equipment,
          built for restaurants, hotels, and food service operations
          across East Africa.
        </p>

        {/* ── Stat strip — value props front and center ── */}
        <div
          aria-label="Key statistics"
          style={{
            display:       "flex",
            flexDirection: "row",
            gap:           isMobile ? "var(--space-5)" : "var(--space-8)",
            marginBottom:  "var(--space-8)",
            flexWrap:      "wrap",
            justifyContent: isMobile || isTablet ? "center" : "flex-start",
          }}
        >
          {STATS.map(({ value, label }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span
                style={{
                  fontFamily:    "var(--font-display)",
                  fontWeight:    800,
                  fontSize:      isMobile ? "var(--text-xl)" : "var(--text-2xl)",
                  color:         "var(--color-white)",
                  letterSpacing: "var(--tracking-tight)",
                  lineHeight:    1,
                }}
              >
                {value}
              </span>
              <span
                style={{
                  fontSize:  "var(--text-xs)",
                  fontWeight: 500,
                  color:     "rgba(255,255,255,0.40)",
                  textTransform: "uppercase",
                  letterSpacing: "var(--tracking-wider)",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ── CTA buttons — clear primary / secondary hierarchy ── */}
        <div
          style={{
            display:        "flex",
            flexDirection:  isMobile ? "column" : "row",
            gap:            "var(--space-3)",
            flexWrap:       "wrap",
            width:          isMobile || isTablet ? "100%" : undefined,
            maxWidth:       isMobile || isTablet ? "26rem" : undefined,
            alignSelf:      isMobile || isTablet ? "center" : undefined,
          }}
        >
          {/* Primary — filled amber, dominant */}
          <Link
            href="/products"
            className="btn btn-primary btn-lg"
            style={{ textAlign: "center" }}
          >
            Browse Catalog →
          </Link>
          {/* Secondary — ghost, clearly subordinate */}
          <Link
            href="/search"
            className="btn btn-outline-light btn-lg"
            style={{
              textAlign: "center",
              opacity:   0.75,
            }}
          >
            Search Equipment
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          RIGHT / BOTTOM — Product showcase
      ══════════════════════════════════════════════════════════════════ */}
      <div
        aria-hidden={isDesktop ? true : undefined}
        style={{
          padding: isMobile
            ? `0 var(--page-padding-x) var(--space-10)`
            : isTablet
            ? `0 var(--page-padding-x) var(--space-12)`
            : `calc(var(--nav-height) + var(--space-8)) var(--page-padding-x) var(--space-16) 0`,
          display:    "flex",
          alignItems: isDesktop ? "center" : "flex-start",
          position:   "relative",
          zIndex:     1,
        }}
      >
        <div style={{ width: "100%" }}>

          {/* Hero main card */}
          <Link
            href={`/products/${hero.slug}`}
            aria-label={`View ${hero.name} — request a quote`}
            className="surface-dark animate-fade-up"
            style={{
              display:        isMobile ? "flex" : "block",
              flexDirection:  "row",
              textDecoration: "none",
              overflow:       "hidden",
              borderRadius:   "var(--radius-lg)",
              border:         "1px solid rgba(232,160,32,0.12)",
            }}
          >
            {/* Image */}
            <div
              style={{
                position:   "relative",
                flexShrink: 0,
                width:      isMobile ? "120px" : "100%",
                height:     isMobile ? "120px" : isTablet ? "260px" : "300px",
              }}
            >
              <span
                className="badge badge-amber"
                style={{
                  position: "absolute",
                  top:      "var(--space-3)",
                  left:     "var(--space-3)",
                  zIndex:   1,
                  display:  isMobile ? "none" : "inline-flex",
                }}
              >
                Best Seller
              </span>
              {hero.images[0] ? (
                <Image
                  src={hero.images[0].imageUrl}
                  alt={hero.images[0].altText ?? hero.name}
                  fill
                  priority
                  sizes="(max-width: 639px) 120px, (max-width: 1023px) 100vw, 50vw"
                  style={{ objectFit: "cover", filter: "brightness(0.85)" }}
                />
              ) : (
                <div style={{
                  width: "100%", height: "100%",
                  background: "var(--color-surface-alt)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "3rem",
                }}>
                  📦
                </div>
              )}
            </div>

            {/* Card body */}
            <div
              style={{
                padding:       isMobile ? "var(--space-4)" : "var(--space-5)",
                flex:          1,
                display:       "flex",
                flexDirection: "column",
                gap:           "var(--space-2)",
              }}
            >
              <p
                className={isDesktop ? "eyebrow" : "eyebrow-light"}
                style={{ marginBottom: 0 }}
              >
                {hero.category?.name}
              </p>

              <p style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize:   isMobile ? "var(--text-base)" : isTablet ? "var(--text-lg)" : "var(--text-xl)",
                color:      "var(--color-white)",
                lineHeight: "var(--leading-snug)",
                maxWidth:   "none",
              }}>
                {hero.name}
              </p>

              {/* Stock status — moved up, near the name */}
              <p style={{
                fontSize:   "var(--text-xs)",
                fontWeight: 600,
                color:      "rgba(120,220,140,0.90)",
                display:    "flex",
                alignItems: "center",
                gap:        "5px",
                marginTop:  "var(--space-1)",
              }}>
                <span
                  style={{
                    display:      "inline-block",
                    width:        "6px",
                    height:       "6px",
                    borderRadius: "50%",
                    background:   "rgba(120,220,140,0.90)",
                    flexShrink:   0,
                  }}
                  aria-hidden="true"
                />
                In stock
              </p>

              {/* Request a Quote — <button> avoids nested <a> hydration error */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const msg = encodeURIComponent(`Hi, I'd like to request a quote for: ${hero.name}`);
                  window.open(`https://wa.me/254725692649?text=${msg}`, "_blank", "noopener,noreferrer");
                }}
                aria-label={`Request a quote for ${hero.name} via WhatsApp`}
                className="btn btn-primary"
                style={{
                  marginTop:      "auto",
                  display:        "inline-flex",
                  alignItems:     "center",
                  gap:            "var(--space-2)",
                  fontSize:       "var(--text-sm)",
                  justifyContent: "center",
                  cursor:         "pointer",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Request a Quote
              </button>

              {/* Quote nudge — B2B appropriate */}
              {!isMobile && (
                <p style={{
                  fontSize:      "var(--text-xs)",
                  color:         "rgba(232,160,32,0.70)",
                  fontWeight:    500,
                  letterSpacing: "var(--tracking-wide)",
                  marginTop:     "var(--space-1)",
                  display:       "flex",
                  alignItems:    "center",
                  gap:           "5px",
                }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Quote within 24 hours
                </p>
              )}
            </div>
          </Link>

          {/* Mini product cards — tablet + desktop only */}
          {!isMobile && mini.length > 0 && (
            <>
              <style>{`
                .hero-mini-cards .btn {
                  border-radius: var(--radius-sm) !important;
                  padding-top:    var(--space-2) !important;
                  padding-bottom: var(--space-2) !important;
                  font-size:      var(--text-xs) !important;
                }
              `}</style>
              <div
                className="hero-mini-cards"
                style={{
                  display:             "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap:                 "var(--space-3)",
                  marginTop:           "var(--space-3)",
                }}
              >
                {mini.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="compact"
                    showStock={false}
                  />
                ))}
              </div>
            </>
          )}

          {/* Mobile: "view all" nudge */}
          {isMobile && (
            <Link
              href="/products"
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                gap:            "var(--space-2)",
                marginTop:      "var(--space-4)",
                fontSize:       "var(--text-sm)", fontWeight: 700,
                fontFamily:     "var(--font-display)",
                letterSpacing:  "var(--tracking-wide)",
                textTransform:  "uppercase",
                color:          "rgba(255,255,255,0.50)",
                textDecoration: "none",
                padding:        "var(--space-3)",
                borderRadius:   "var(--radius-md)",
                border:         "1px solid rgba(255,255,255,0.08)",
                transition:     "color var(--transition-fast), border-color var(--transition-fast)",
              }}
            >
              View all 1,000+ products →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}