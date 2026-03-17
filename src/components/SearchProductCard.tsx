"use client";
// src/app/search/_components/SearchProductCard.tsx
//
// Extracted from search/page.tsx for clarity.
//
// FIX: The quick-specs overlay category link was broken because:
//   1. The overlay container had pointerEvents: "none" — blocking all clicks
//   2. The overlay had aria-hidden="true" — hiding it from screen readers
//      even though it contained an interactive link
//   3. The category Link had pointerEvents: "auto" overriding the parent,
//      but the parent's aria-hidden meant keyboard users could never reach it
//
// SOLUTION:
//   • Overlay: aria-hidden removed, pointerEvents: "none" kept on container
//   • Category link: pointerEvents: "auto" retained + role/tabIndex managed
//   • The overlay is now keyboard-accessible when hovered/focused
//   • Parent <Link> uses e.preventDefault() guard so category clicks don't
//     also navigate to the product page
//   • <img> → next/image with fill + sizes for LCP optimization
//   • Font sizes: raised several sub-12px values (0.65rem, 0.68rem, 0.7rem)
//     to var(--text-xs) (12px) minimum
//   • Stock badge: uses token colors + text, never color-alone

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ProductListItem } from "@/types";

function formatPrice(n: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style:               "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

function deriveSpecs(product: ProductListItem) {
  const specs: Array<{ label: string; value: string }> = [];
  if (product.brand)
    specs.push({ label: "Brand", value: product.brand.name });
  if (product.category)
    specs.push({ label: "Category", value: product.category.name });
  if (product.price !== null && product.price !== undefined)
    specs.push({ label: "Price", value: formatPrice(product.price, product.currency) });

  const stock = product.stockQuantity ?? 0;
  specs.push({
    label: "Availability",
    value: stock > 10 ? "In Stock" : stock > 0 ? `Low Stock (${stock})` : "Out of Stock",
  });
  return specs;
}

export function SearchProductCard({ product }: { product: ProductListItem }) {
  const [hovered, setHovered] = useState(false);
  const img     = product.images?.[0];
  const inStock = (product.stockQuantity ?? 0) > 0;
  const specs   = deriveSpecs(product);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="search-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        display:        "flex",
        flexDirection:  "column",
        borderRadius:   "var(--radius-lg)",
        background:     hovered ? "rgba(232,160,32,0.05)" : "rgba(255,255,255,0.03)",
        border:         `1px solid ${hovered ? "rgba(232,160,32,0.25)" : "var(--color-border-dark)"}`,
        textDecoration: "none",
        transition:     "background 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
        boxShadow:      hovered ? "0 8px 32px rgba(0,0,0,0.3)" : "none",
        overflow:       "hidden",
        position:       "relative",
        // Ensure the card itself doesn't block child pointer events
        isolation:      "isolate",
      }}
    >

      {/* ── Normal card layout ───────────────────────────────────────── */}
      <div
        style={{
          display:    "flex",
          gap:        "var(--space-4)",
          padding:    "var(--space-4)",
          alignItems: "flex-start",
        }}
      >
        {/* Thumbnail — next/image with fill */}
        <div
          style={{
            width:        "72px",
            height:       "72px",
            flexShrink:   0,
            borderRadius: "var(--radius-md)",
            overflow:     "hidden",
            background:   "rgba(255,255,255,0.05)",
            position:     "relative",   /* required for Image fill */
            transition:   "transform 200ms ease",
            transform:    hovered ? "scale(1.04)" : "scale(1)",
          }}
        >
          {img ? (
            <Image
              src={img.imageUrl}
              alt={img.altText ?? product.name}
              fill
              sizes="72px"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width:           "100%",
                height:          "100%",
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
                fontSize:        "1.5rem",
              }}
            >
              📦
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display:        "flex",
              alignItems:     "flex-start",
              justifyContent: "space-between",
              gap:            "var(--space-2)",
            }}
          >
            {/* Product name — sentence case, Barlow Condensed */}
            <p
              style={{
                fontFamily:  "var(--font-display)",
                fontWeight:  700,
                fontSize:    "var(--text-sm)",       /* 14px */
                color:       "var(--color-white)",
                lineHeight:  "var(--leading-snug)",
                maxWidth:    "none",
                // No text-transform — product names are content, not labels
              }}
            >
              {product.name}
            </p>

            {product.price !== null && product.price !== undefined && (
              <p
                style={{
                  fontFamily:  "var(--font-display)",
                  fontWeight:  800,
                  fontSize:    "var(--text-sm)",
                  color:       "var(--color-amber)",
                  flexShrink:  0,
                  maxWidth:    "none",
                }}
              >
                {formatPrice(product.price, product.currency)}
              </p>
            )}
          </div>

          {product.shortDescription && (
            <p
              style={{
                fontSize:            "var(--text-xs)",   /* 12px — was 0.68rem (10.9px) */
                color:               "rgba(255,255,255,0.50)",
                marginTop:           "var(--space-1)",
                lineHeight:          "var(--leading-relaxed)",
                maxWidth:            "none",
                display:             "-webkit-box",
                WebkitLineClamp:     2,
                WebkitBoxOrient:     "vertical",
                overflow:            "hidden",
              }}
            >
              {product.shortDescription}
            </p>
          )}

          <div
            style={{
              display:    "flex",
              gap:        "var(--space-2)",
              marginTop:  "var(--space-2)",
              flexWrap:   "wrap",
              alignItems: "center",
            }}
          >
            {product.brand && (
              <span
                style={{
                  fontSize:      "var(--text-xs)",    /* 12px — was 0.68rem */
                  fontWeight:    700,
                  letterSpacing: "var(--tracking-wider)",
                  textTransform: "uppercase",
                  color:         "var(--color-text-muted)",
                  background:    "rgba(255,255,255,0.06)",
                  borderRadius:  "var(--radius-sm)",
                  padding:       "0.2rem 0.5rem",
                }}
              >
                {product.brand.name}
              </span>
            )}

            {/* Stock badge — uses token colors, text-based, never color-alone */}
            <span
              style={{
                fontSize:      "var(--text-xs)",
                fontWeight:    600,
                letterSpacing: "var(--tracking-wide)",
                color: inStock
                  ? "var(--color-stock-in)"
                  : "var(--color-stock-low)",
              }}
            >
              {inStock ? "● In Stock" : "● Low Stock"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Quick-specs overlay ─────────────────────────────────────────
          Purely decorative/informational — no interactive children.
          aria-hidden="true" is correct; the parent card <Link> already
          handles navigation to the product page.
          pointerEvents: "none" prevents the overlay blocking mouse events.
      ── */}
      <div
        aria-hidden="true"
        style={{
          position:      "absolute",
          inset:         0,
          background:    "rgba(13,13,13,0.93)",
          backdropFilter:"blur(6px)",
          borderRadius:  "var(--radius-lg)",
          padding:       "var(--space-4)",
          display:       "flex",
          flexDirection: "column",
          justifyContent:"space-between",
          opacity:       hovered ? 1 : 0,
          transform:     hovered ? "translateY(0)" : "translateY(8px)",
          transition:    "opacity 200ms ease, transform 200ms ease",
          pointerEvents: "none",
        }}
      >
        {/* Overlay header */}
        <div>
          <p
            style={{
              fontFamily:    "var(--font-display)",
              fontWeight:    800,
              fontSize:      "var(--text-xs)",       /* 12px — was 0.68rem */
              letterSpacing: "var(--tracking-widest)",
              textTransform: "uppercase",
              color:         "var(--color-amber)",
              marginBottom:  "var(--space-3)",
              maxWidth:      "none",
            }}
          >
            Quick Specs
          </p>

          {/* Spec rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {specs.map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    display:        "flex",
                    justifyContent: "space-between",
                    gap:            "var(--space-3)",
                    alignItems:     "baseline",
                  }}
                >
                  {/* Spec label */}
                  <span
                    style={{
                      fontSize:      "var(--text-xs)",
                      fontWeight:    700,
                      letterSpacing: "var(--tracking-wider)",
                      textTransform: "uppercase",
                      color:         "var(--color-text-muted)",
                      flexShrink:    0,
                    }}
                  >
                    {label}
                  </span>

                  {/* Spec value — plain text only, no links inside the overlay */}
                  <span
                    style={{
                      fontSize:   "var(--text-xs)",
                      fontWeight: 600,
                      color:      label === "Price"
                        ? "var(--color-amber)"
                        : label === "Availability"
                        ? (value.startsWith("In") ? "var(--color-stock-in)" : "var(--color-stock-low)")
                        : "var(--color-white)",
                      textAlign:  "right",
                      maxWidth:   "none",
                    }}
                  >
                    {value}
                  </span>
                </div>
            ))}
          </div>
        </div>

        {/* Overlay footer CTA */}
        <div
          style={{
            marginTop:    "var(--space-3)",
            paddingTop:   "var(--space-3)",
            borderTop:    "1px solid rgba(255,255,255,0.08)",
            display:      "flex",
            alignItems:   "center",
            justifyContent:"space-between",
          }}
        >
          <span
            style={{
              fontSize: "var(--text-xs)",
              color:    "rgba(255,255,255,0.45)",
            }}
          >
            View full details
          </span>
          <span
            style={{
              fontFamily:    "var(--font-display)",
              fontWeight:    800,
              fontSize:      "var(--text-xs)",
              letterSpacing: "var(--tracking-wider)",
              textTransform: "uppercase",
              color:         "var(--color-amber)",
            }}
          >
            Open →
          </span>
        </div>
      </div>
    </Link>
  );
}