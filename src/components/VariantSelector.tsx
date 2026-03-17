"use client";
// components/VariantSelector.tsx
//
// FIX: Was using a local `Variant` interface that conflicted with the one
// in ProductPurchasePanel. Now imports `ProductVariant` from `@/types` —
// the single canonical definition used everywhere in the codebase.
//
// Usage:
//   import VariantSelector from "@/components/VariantSelector";
//   <VariantSelector variants={product.variants} />

import { useState } from "react";
import type { ProductVariant } from "@/types";

interface VariantSelectorProps {
  variants: ProductVariant[];
}

export default function VariantSelector({ variants }: VariantSelectorProps) {
  const [selected, setSelected] = useState<string | null>(
    variants.find((v) => v.stock > 0)?.id ?? null
  );

  if (variants.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <p style={{
        fontFamily:    "var(--font-display)",
        fontSize:      "0.625rem",
        fontWeight:    600,
        letterSpacing: "var(--tracking-widest)",
        textTransform: "uppercase",
        color:         "rgba(255,255,255,0.45)",
        margin:        0,
      }}>
        Select Variant
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {variants.map((v) => {
          const isSelected  = selected === v.id;
          const isAvailable = v.stock > 0;

          return (
            <button
              key={v.id}
              onClick={() => setSelected(v.id)}
              disabled={!isAvailable}
              aria-label={`Select ${v.name}${!isAvailable ? " (out of stock)" : ""}`}
              aria-pressed={isSelected}
              style={{
                display:       "inline-flex",
                alignItems:    "center",
                gap:           "0.375rem",
                padding:       "0.5rem 0.875rem",
                borderRadius:  "var(--radius-md)",
                border:        `1.5px solid ${
                  isSelected
                    ? "var(--color-amber)"
                    : "rgba(255,255,255,0.12)"
                }`,
                background: isSelected
                  ? "var(--color-amber-muted)"
                  : "rgba(255,255,255,0.04)",
                color: isSelected
                  ? "var(--color-amber)"
                  : isAvailable
                    ? "rgba(255,255,255,0.75)"
                    : "rgba(255,255,255,0.25)",
                fontFamily:    "var(--font-body)",
                fontSize:      "var(--text-sm)",
                fontWeight:    isSelected ? 600 : 400,
                cursor:        isAvailable ? "pointer" : "not-allowed",
                opacity:       isAvailable ? 1 : 0.45,
                transition:    "border-color var(--transition-fast), background var(--transition-fast), color var(--transition-fast)",
                whiteSpace:    "nowrap",
                minHeight:     "36px",
              }}
            >
              {v.name}

              {/* Price delta — shown when variant adds to base price */}
              {v.price !== null && v.price !== 0 && (
                <span style={{
                  fontSize:   "var(--text-xs)",
                  color:      isSelected ? "var(--color-amber)" : "rgba(255,255,255,0.35)",
                  fontWeight: 400,
                }}>
                  {v.price > 0 ? "+" : ""}
                  {new Intl.NumberFormat("en-US", {
                    style:                 "currency",
                    currency:              "USD",
                    maximumFractionDigits: 0,
                  }).format(v.price)}
                </span>
              )}

              {/* Out-of-stock tag */}
              {!isAvailable && (
                <span style={{
                  fontSize:      "0.5625rem",
                  fontWeight:    600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color:         "rgba(255,255,255,0.25)",
                }}>
                  Out of stock
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}