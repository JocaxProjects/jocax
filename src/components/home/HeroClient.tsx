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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency, maximumFractionDigits: 0,
  }).format(price);
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
        gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
        position:            "relative",
        overflow:            "hidden",
        paddingTop:          "var(--nav-height)",
      }}
    >
      {/* Ambient radial glow */}
      <div
        aria-hidden="true"
        style={{
          position:     "absolute", inset: 0,
          background:
            "radial-gradient(ellipse 60% 80% at 70% 50%,rgba(232,160,32,.08) 0%,transparent 70%)," +
            "radial-gradient(ellipse 40% 60% at 20% 80%,rgba(232,160,32,.05) 0%,transparent 60%)",
          pointerEvents:"none",
        }}
      />

      {/* Subtle grid texture */}
      <div
        aria-hidden="true"
        style={{
          position:        "absolute", inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)",
          backgroundSize:  "60px 60px",
          pointerEvents:   "none",
        }}
      />

      {/* ══════════════════════════════════════════════════════════════════
          LEFT / TOP — Copy block
          Mobile:  centered — h1, subtitle, buttons all centered
          Tablet+: left-aligned
      ══════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          padding: isMobile
            ? `var(--space-10) var(--page-padding-x) var(--space-8)`
            : isTablet
            ? `var(--space-12) var(--page-padding-x) var(--space-10)`
            : `clamp(var(--space-12),8vw,var(--space-24)) var(--page-padding-x)`,
          display:        "flex",
          flexDirection:  "column",
          justifyContent: "center",
          /* Mobile: center all children */
          alignItems:     isMobile ? "center" : "flex-start",
          textAlign:      isMobile ? "center" : "left",
          position:       "relative",
          zIndex:         "var(--z-raised)",
        }}
      >
        {/* H1 */}
        <h1
          style={{
            color:    "var(--color-white)",
            fontSize: isMobile
              ? "clamp(2.5rem, 10vw, 3rem)"
              : isTablet
              ? "clamp(3rem, 6vw, 4rem)"
              : "clamp(var(--text-4xl), 6vw, var(--text-6xl))",
          }}
        >
          Professional<br />
          Kitchen<br />
          <span style={{ color: "var(--color-amber)" }}>Equipment</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize:     isMobile ? "var(--text-base)" : "clamp(var(--text-base),1.5vw,var(--text-lg))",
            color:        "rgba(255,255,255,0.65)",
            lineHeight:   "var(--leading-relaxed)",
            /* Mobile: centered block with auto margins */
            maxWidth:     isDesktop ? "480px" : "min(520px, 100%)",
            marginTop:    "var(--space-4)",
            marginBottom: isMobile ? "var(--space-8)" : "var(--space-10)",
            marginInline: isMobile ? "auto" : undefined,
            fontWeight:   300,
          }}
        >
          The definitive source for commercial kitchen infrastructure.
          Over 2,400 products from 180+ industry-leading brands,
          built for restaurants, hotels, and food service operations.
        </p>

        {/* CTA buttons
            Mobile:  full-width stacked, capped at 26rem, centered
            Tablet+: row, auto width
        */}
        <div
          style={{
            display:       "flex",
            flexDirection: isMobile ? "column" : "row",
            gap:           "var(--space-3)",
            flexWrap:      "wrap",
            /* Mobile: cap and center the button group */
            width:         isMobile ? "100%" : undefined,
            maxWidth:      isMobile ? "26rem" : undefined,
            alignSelf:     isMobile ? "center" : undefined,
          }}
        >
          <Link
            href="/products"
            className="btn btn-primary btn-lg"
            style={{ textAlign: "center" }}
          >
            Browse Catalog →
          </Link>
          <Link
            href="/search"
            className="btn btn-outline-light btn-lg"
            style={{ textAlign: "center" }}
          >
            Search Equipment
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          RIGHT / BOTTOM — Product showcase (DB-driven)
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
          zIndex:     "var(--z-raised)",
        }}
      >
        <div style={{ width: "100%" }}>

          {/* Hero main card */}
          <Link
            href={`/products/${hero.slug}`}
            aria-label={`View ${hero.name}${hero.price !== null ? ` — starting at ${formatPrice(hero.price, hero.currency)}` : ""}`}
            className="surface-dark animate-fade-up"
            style={{
              display:        isMobile ? "flex" : "block",
              flexDirection:  "row",
              textDecoration: "none",
              overflow:       "hidden",
              borderRadius:   "var(--radius-lg)",
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

              <p style={{
                fontFamily:    "var(--font-display)", fontWeight: 800,
                fontSize:      isMobile ? "var(--text-lg)" : "var(--text-2xl)",
                color:         "var(--color-white)",
                marginTop:     "auto",
                letterSpacing: "var(--tracking-tight)",
                maxWidth:      "none",
                display:       "flex", alignItems: "baseline",
                gap:           "var(--space-2)", flexWrap: "wrap",
              }}>
                {hero.price !== null && formatPrice(hero.price, hero.currency)}
                <span style={{ fontSize: "var(--text-sm)", fontWeight: 400, color: "rgba(255,255,255,0.45)" }}>
                  Starting price
                </span>
              </p>
            </div>
          </Link>

          {/* Mini product cards — tablet + desktop only */}
          {!isMobile && mini.length > 0 && (
            <div style={{
              display:             "grid",
              gridTemplateColumns: "1fr 1fr",
              gap:                 "var(--space-3)",
              marginTop:           "var(--space-3)",
            }}>
              {mini.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="compact"
                  showStock={false}
                />
              ))}
            </div>
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
              View all 2,400+ products →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}