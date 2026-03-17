"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ProductListItem } from "@/types";

const WA_NUMBER = "254700123456";

function waHref(productName: string) {
  const msg = encodeURIComponent(`Hi, I'd like to request a quote for: ${productName}`);
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

function openWhatsApp(e: React.MouseEvent, productName: string) {
  e.preventDefault();
  e.stopPropagation();
  window.open(waHref(productName), "_blank", "noopener,noreferrer");
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductCardProps {
  product:          ProductListItem;
  variant?:         "grid" | "list" | "compact";
  showStock?:       boolean;
  priority?:        boolean;
  // Added to fix TS2353 errors in ProductGrid, ProductsClient, and RelatedProducts
  showDescription?: boolean;
  showSpecs?:       boolean;
  className?:       string;
}

export type ProductCardVariant = "grid" | "list" | "compact";

// ─── Shared helpers ───────────────────────────────────────────────────────────

export function formatPrice(price: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency, maximumFractionDigits: 0,
  }).format(price);
}
export function primaryImage(p: ProductListItem) {
  return p.images?.[0]?.imageUrl ?? "/images/product-placeholder.png";
}
export function primaryAlt(p: ProductListItem) {
  return p.images?.[0]?.altText ?? p.name;
}
export function productBadge(p: ProductListItem) {
  if (p.isFeatured)          return "Featured";
  if (p.stockQuantity === 0) return "Out of Stock";
  if (p.stockQuantity <= 3)  return "Low Stock";
  return null;
}
export function stockStatus(qty: number) {
  if (qty === 0) return { label: "Out of stock",  color: "var(--color-error)"   };
  if (qty <= 3)  return { label: `${qty} left`,   color: "var(--color-warning)" };
  if (qty <= 10) return { label: "Limited stock", color: "var(--color-warning)" };
  return         { label: "In stock",             color: "var(--color-success)" };
}
export function badgeClass(label: string) {
  const map: Record<string, string> = {
    "Best Seller":  "badge badge-amber",
    "Featured":     "badge badge-dark",
    "New":          "badge badge-success",
    "Sale":         "badge badge-warning",
    "Low Stock":    "badge badge-error",
    "Out of Stock": "badge badge-error",
  };
  return map[label] ?? "badge badge-muted";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StockBadge({ qty, inline = false }: { qty: number; inline?: boolean }) {
  const inStock = qty > 0;
  const low     = inStock && qty <= 5;

  const color  = inStock ? (low ? "rgb(180,83,9)"            : "rgb(21,128,61)")            : "rgb(185,28,28)";
  const bg     = inStock ? (low ? "rgba(245,158,11,0.10)"    : "rgba(22,163,74,0.10)")      : "rgba(220,38,38,0.10)";
  const dot    = inStock ? (low ? "rgb(245,158,11)"          : "rgb(22,163,74)")             : "rgb(220,38,38)";
  const border = inStock ? (low ? "rgba(245,158,11,0.25)"    : "rgba(22,163,74,0.25)")       : "rgba(220,38,38,0.25)";
  const label  = inStock ? (low ? `Only ${qty} left`         : "In Stock")                   : "Out of Stock";

  return (
    <span style={{
      display: inline ? "inline-flex" : "flex",
      alignItems: "center", gap: "0.3rem",
      fontSize: "0.625rem", fontWeight: 700,
      fontFamily: "var(--font-body)", letterSpacing: "0.06em",
      textTransform: "uppercase",
      padding: "0.2rem 0.55rem",
      borderRadius: "var(--radius-full)",
      background: bg, color, border: `1px solid ${border}`,
      whiteSpace: "nowrap", flexShrink: 0,
    }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "var(--radius-full)", background: dot, flexShrink: 0 }} />
      {label}
    </span>
  );
}

function FeaturedBadge() {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.25rem",
      fontSize: "0.5625rem", fontWeight: 800,
      fontFamily: "var(--font-display)", letterSpacing: "0.1em",
      textTransform: "uppercase",
      padding: "0.2rem 0.55rem",
      borderRadius: "var(--radius-sm)",
      background: "var(--color-amber)", color: "var(--color-ink)",
      flexShrink: 0,
    }}>
      ★ Featured
    </span>
  );
}

function WaIcon({ size = "1rem" }: { size?: string }) {
  return (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Compact variant ──────────────────────────────────────────────────────────

export function CompactCard({ product, showStock = true, priority }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const image = product.images?.[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "stretch", gap: 0,
        textDecoration: "none", borderRadius: "var(--radius-lg)",
        overflow: "hidden", background: "var(--color-surface)",
        border: `1.5px solid ${hovered ? "rgba(232,160,32,0.4)" : "var(--color-border)"}`,
        transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
        boxShadow: hovered
          ? "0 4px 20px rgba(0,0,0,0.25), 0 0 0 1px rgba(232,160,32,0.1)"
          : "0 1px 4px rgba(0,0,0,0.15)",
      }}
    >
      <div style={{
        position: "relative", width: "5rem", flexShrink: 0,
        background: "var(--color-catalog-bg)", overflow: "hidden",
      }}>
        {image ? (
          <Image
            src={image.imageUrl} alt={image.altText ?? product.name}
            fill sizes="80px" priority={priority}
            style={{
              objectFit: "contain", padding: "0.5rem",
              transition: "transform var(--transition-base)",
              transform: hovered ? "scale(1.06)" : "scale(1)",
            }}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>📦</div>
        )}
      </div>

      <div style={{ flex: 1, padding: "0.625rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.2rem", minWidth: 0 }}>
        {product.brand && (
          <span style={{ fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-amber-dark)", fontFamily: "var(--font-display)" }}>
            {product.brand.name}
          </span>
        )}
        <p style={{
          fontFamily: "var(--font-display)", fontWeight: 600,
          fontSize: "var(--text-xs)", color: "var(--color-text-primary)",
          lineHeight: "var(--leading-snug)",
          overflow: "hidden", textOverflow: "ellipsis",
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical" as const, margin: 0,
        }}>
          {product.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "auto", flexWrap: "wrap" }}>
          {showStock && <StockBadge qty={product.stockQuantity} inline />}
          <button
            type="button"
            onClick={(e) => openWhatsApp(e, product.name)}
            aria-label={`Request quote for ${product.name} via WhatsApp`}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.25rem",
              fontSize: "0.5625rem", fontWeight: 700,
              fontFamily: "var(--font-display)", letterSpacing: "0.08em",
              textTransform: "uppercase", padding: "0.2rem 0.5rem",
              borderRadius: "var(--radius-full)",
              background: "rgba(37,211,102,0.10)", border: "1px solid rgba(37,211,102,0.25)",
              color: "rgb(21,128,61)", whiteSpace: "nowrap", flexShrink: 0,
              transition: "background var(--transition-fast)", cursor: "pointer",
            }}
          >
            <WaIcon size="0.6875rem" />
            Quote
          </button>
        </div>
      </div>
    </Link>
  );
}

// ─── List variant ─────────────────────────────────────────────────────────────

export function ListCard({ product, showStock = true, priority }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const image = product.images?.[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "stretch", textDecoration: "none",
        borderRadius: "var(--radius-xl)", overflow: "hidden",
        background: "var(--color-surface)",
        border: `1.5px solid ${hovered ? "rgba(232,160,32,0.45)" : "var(--color-border)"}`,
        transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
        boxShadow: hovered
          ? "0 6px 24px rgba(0,0,0,0.25), 0 0 0 1px rgba(232,160,32,0.08)"
          : "0 1px 4px rgba(0,0,0,0.12)",
      }}
    >
      <div style={{
        position: "relative", width: "clamp(7rem, 15vw, 11rem)", flexShrink: 0,
        background: "var(--color-catalog-bg)", overflow: "hidden",
      }}>
        {image ? (
          <Image
            src={image.imageUrl} alt={image.altText ?? product.name}
            fill sizes="(max-width: 768px) 112px, 176px" priority={priority}
            style={{
              objectFit: "contain", padding: "1rem",
              transition: "transform 0.4s ease",
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>📦</div>
        )}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(232,160,32,0.06) 0%, transparent 60%)",
          opacity: hovered ? 1 : 0, transition: "opacity var(--transition-fast)", pointerEvents: "none",
        }} />
      </div>

      <div style={{ flex: 1, padding: "clamp(0.875rem, 2vw, 1.25rem)", display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          {product.brand && (
            <span style={{ fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-amber-dark)", fontFamily: "var(--font-display)" }}>
              {product.brand.name}
            </span>
          )}
          {product.isFeatured && <FeaturedBadge />}
          {showStock && <StockBadge qty={product.stockQuantity} inline />}
        </div>

        <h3 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "clamp(var(--text-base), 1.5vw, var(--text-lg))",
          color: "var(--color-text-primary)", lineHeight: "var(--leading-snug)",
          letterSpacing: "-0.01em", margin: 0,
          overflow: "hidden", textOverflow: "ellipsis",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const,
        }}>
          {product.name}
        </h3>

        {product.shortDescription && (
          <p style={{
            fontSize: "var(--text-sm)", color: "var(--color-text-muted)",
            fontFamily: "var(--font-body)", lineHeight: "var(--leading-relaxed)", margin: 0,
            overflow: "hidden", textOverflow: "ellipsis",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const,
          }}>
            {product.shortDescription}
          </p>
        )}

        {product.category && (
          <span style={{ fontSize: "0.5625rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}>
            {product.category.name}
          </span>
        )}
      </div>

      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "clamp(0.875rem, 2vw, 1.25rem)", borderLeft: "1px solid var(--color-border)",
        gap: "0.75rem", flexShrink: 0, minWidth: "clamp(6rem, 13vw, 9rem)",
      }}>
        <button
          type="button"
          onClick={(e) => openWhatsApp(e, product.name)}
          aria-label={`Request quote for ${product.name} via WhatsApp`}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem",
            width: "100%", padding: "0.625rem 0.75rem",
            background: hovered ? "rgb(37,211,102)" : "rgba(37,211,102,0.10)",
            border: "1.5px solid rgba(37,211,102,0.3)",
            borderRadius: "var(--radius-md)",
            color: hovered ? "var(--color-ink)" : "rgb(21,128,61)",
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase",
            transition: "background var(--transition-fast), color var(--transition-fast)",
            whiteSpace: "nowrap", minHeight: "36px", cursor: "pointer",
          }}
        >
          <WaIcon size="0.875rem" />
          Quote
        </button>

        <div style={{
          width: "2.25rem", height: "2.25rem", borderRadius: "var(--radius-full)",
          background: hovered ? "var(--color-amber)" : "var(--color-catalog-bg)",
          border: `1.5px solid ${hovered ? "var(--color-amber)" : "var(--color-border)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background var(--transition-fast), border-color var(--transition-fast)", flexShrink: 0,
        }}>
          <svg style={{
            width: "0.875rem", height: "0.875rem",
            color: hovered ? "var(--color-ink)" : "var(--color-text-muted)",
            transition: "color var(--transition-fast), transform var(--transition-fast)",
            transform: hovered ? "translate(1px, -1px)" : "none",
          }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

// ─── Grid variant ─────────────────────────────────────────────────────────────

export function GridCard({ product, showStock = true, priority }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const image = product.images?.[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", flexDirection: "column", textDecoration: "none",
        borderRadius: "var(--radius-xl)", overflow: "hidden",
        background: "var(--color-surface)",
        border: `1.5px solid ${hovered ? "rgba(232,160,32,0.5)" : "var(--color-border)"}`,
        transition: "border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast)",
        boxShadow: hovered
          ? "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(232,160,32,0.08)"
          : "0 1px 4px rgba(0,0,0,0.12)",
        transform: hovered ? "translateY(-0.5px)" : "translateY(0)",
        height: "100%", position: "relative",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "4 / 3", background: "var(--color-catalog-bg)", overflow: "hidden", flexShrink: 0 }}>
        {image ? (
          <Image
            src={image.imageUrl} alt={image.altText ?? product.name}
            fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            style={{
              objectFit: "contain", padding: "1.25rem",
              transition: "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              transform: hovered ? "scale(1.07)" : "scale(1)",
            }}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "var(--color-text-muted)" }}>
            <svg style={{ width: "2.5rem", height: "2.5rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span style={{ fontSize: "0.6875rem", fontFamily: "var(--font-body)" }}>No image</span>
          </div>
        )}

        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(232,160,32,0.07) 0%, transparent 55%)",
          opacity: hovered ? 1 : 0, transition: "opacity 0.3s ease", pointerEvents: "none",
        }} />

        <div style={{ position: "absolute", top: "0.625rem", left: "0.625rem", display: "flex", flexDirection: "column", gap: "0.3rem", zIndex: 1 }}>
          {product.isFeatured && <FeaturedBadge />}
        </div>

        {showStock && (
          <div style={{ position: "absolute", top: "0.625rem", right: "0.625rem", zIndex: 1 }}>
            <StockBadge qty={product.stockQuantity} />
          </div>
        )}

        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, padding: "0.625rem",
          background: "linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 100%)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem",
          transform: hovered ? "translateY(0)" : "translateY(100%)",
          opacity: hovered ? 1 : 0, transition: "transform 0.25s ease, opacity 0.2s ease",
        }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.6875rem", color: "rgba(255,255,255,0.9)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            View Details
          </span>
          <svg style={{ width: "0.75rem", height: "0.75rem", color: "var(--color-amber)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "clamp(0.875rem, 2vw, 1.125rem)", gap: "0.4rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
          {product.brand ? (
            <span style={{ fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-amber-dark)", fontFamily: "var(--font-display)" }}>
              {product.brand.name}
            </span>
          ) : <span />}
          {product.category && (
            <span style={{ fontSize: "0.5625rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-muted)", fontFamily: "var(--font-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {product.category.name}
            </span>
          )}
        </div>

        <h3 style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--text-sm)",
          color: "var(--color-text-primary)", lineHeight: "var(--leading-snug)",
          letterSpacing: "-0.01em", margin: 0, overflow: "hidden", textOverflow: "ellipsis",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const,
          transition: "color var(--transition-fast)",
        }}>
          {product.name}
        </h3>

        {product.shortDescription && (
          <p style={{
            fontSize: "var(--text-xs)", color: "var(--color-text-muted)",
            fontFamily: "var(--font-body)", lineHeight: "var(--leading-relaxed)", margin: 0,
            overflow: "hidden", textOverflow: "ellipsis",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const,
          }}>
            {product.shortDescription}
          </p>
        )}

        <div style={{ borderTop: "1px solid var(--color-border)", margin: "0.25rem 0", marginTop: "auto" }} />

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={(e) => openWhatsApp(e, product.name)}
            aria-label={`Request quote for ${product.name} via WhatsApp`}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem",
              padding: "0.5625rem 0.75rem",
              background: "rgba(37,211,102,0.08)", border: "1.5px solid rgba(37,211,102,0.25)",
              borderRadius: "var(--radius-md)", color: "rgb(21,128,61)",
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase",
              transition: "background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast)",
              minHeight: "36px", cursor: "pointer",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background  = "rgb(37,211,102)";
              (e.currentTarget as HTMLElement).style.color       = "var(--color-ink)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgb(37,211,102)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background  = "rgba(37,211,102,0.08)";
              (e.currentTarget as HTMLElement).style.color       = "rgb(21,128,61)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,211,102,0.25)";
            }}
          >
            <WaIcon size="0.875rem" />
            Request Quote
          </button>

          <div style={{
            width: "2rem", height: "2rem", borderRadius: "var(--radius-full)",
            background: hovered ? "var(--color-amber)" : "var(--color-catalog-bg)",
            border: `1.5px solid ${hovered ? "var(--color-amber)" : "var(--color-border)"}`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            transition: "background var(--transition-fast), border-color var(--transition-fast)",
          }}>
            <svg style={{
              width: "0.75rem", height: "0.75rem",
              color: hovered ? "var(--color-ink)" : "var(--color-text-muted)",
              transition: "color var(--transition-fast), transform var(--transition-fast)",
              transform: hovered ? "translate(1px, -1px)" : "none",
            }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </div>
        </div>
      </div>

      <div style={{
        position: "absolute", left: 0, top: "15%", bottom: "15%",
        width: "3px", borderRadius: "0 var(--radius-full) var(--radius-full) 0",
        background: "var(--color-amber)",
        opacity: hovered ? 1 : 0, transition: "opacity var(--transition-fast)", pointerEvents: "none",
      }} />
    </Link>
  );
}

// ─── Entry point ──────────────────────────────────────────────────────────────

export default function ProductCard({
  product,
  variant   = "grid",
  showStock = true,
  priority  = false,
}: ProductCardProps) {
  const props = { product, variant, showStock, priority };
  if (variant === "compact") return <CompactCard {...props} />;
  if (variant === "list")    return <ListCard    {...props} />;
                             return <GridCard    {...props} />;
}