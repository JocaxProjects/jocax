"use client";
// src/components/ProductDetail/ProductPurchasePanel.tsx
// All interactive UI for the product detail right column.
//
// CHANGE: "Request a Quote" and "Contact Sales" buttons are now WhatsApp
// <a> links with pre-filled messages. The price display is retained here
// for reference (shown as "Starting from" when available) since the detail
// page has more context than a catalog card — but the primary CTA is WA.

import Link from "next/link";
import VariantSelector from "@/components/VariantSelector";
import type { ProductVariant } from "@/types";

// ─── Config ───────────────────────────────────────────────────────────────────

const WA_NUMBER = "254725692649"; // keep in sync with ProductCard/index.tsx

function waQuoteHref(productName: string, modelNumber?: string | null) {
  const id  = modelNumber ? ` (Model: ${modelNumber})` : "";
  const msg = encodeURIComponent(
    `Hi, I'd like to request a quote for: ${productName}${id}`
  );
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

function waSalesHref(productName: string) {
  const msg = encodeURIComponent(
    `Hi, I'd like to speak with your sales team about: ${productName}`
  );
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

function waNotifyHref(productName: string) {
  const msg = encodeURIComponent(
    `Hi, I'd like to be notified when this product is back in stock: ${productName}`
  );
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductPurchasePanelProps {
  formattedPrice:    string | null;
  inStock:           boolean;
  stockQuantity:     number;
  variants:          ProductVariant[];
  brandName?:        string;
  brandSlug?:        string;
  brandLogoUrl?:     string | null;
  productName:       string;
  modelNumber?:      string | null;
  sku?:              string | null;
  shortDescription?: string | null;
  categoryName?:     string;
  categorySlug?:     string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductPurchasePanel({
  formattedPrice,
  inStock,
  stockQuantity,
  variants,
  brandName,
  brandSlug,
  brandLogoUrl,
  productName,
  modelNumber,
  sku,
  shortDescription,
  categoryName,
  categorySlug,
}: ProductPurchasePanelProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>

      {/* ── Brand pill ── */}
      {brandName && brandSlug && (
        <Link
          href={`/products?brand=${brandSlug}`}
          className="ppp-brand-pill"
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            marginBottom: "0.875rem", alignSelf: "flex-start",
            padding: "0.25rem 0.75rem 0.25rem 0.625rem",
            borderRadius: "var(--radius-full)",
            background: "var(--color-amber-muted)",
            border: "1px solid var(--color-amber-muted-strong)",
            textDecoration: "none",
            transition: "background var(--transition-fast)",
          }}
        >
          {brandLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brandLogoUrl} alt={brandName}
              style={{ height: "1.125rem", width: "auto", objectFit: "contain" }} />
          ) : (
            <span style={{
              fontSize: "var(--text-xs)", fontWeight: 700,
              letterSpacing: "var(--tracking-widest)", textTransform: "uppercase",
              color: "var(--color-amber-dark)", fontFamily: "var(--font-display)",
            }}>
              {brandName}
            </span>
          )}
        </Link>
      )}

      {/* ── Product name ── */}
      <h1 style={{
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
        color: "var(--color-text-primary)",
        letterSpacing: "var(--tracking-tight)", textTransform: "uppercase",
        lineHeight: "var(--leading-tight)", margin: 0,
      }}>
        {productName}
      </h1>

      {/* ── Model / SKU ── */}
      {(modelNumber || sku) && (
        <div style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          marginTop: "0.625rem", flexWrap: "wrap",
        }}>
          {modelNumber && <MetaTag label="Model" value={modelNumber} />}
          {sku         && <MetaTag label="SKU"   value={sku} />}
        </div>
      )}

      {/* ── Short description ── */}
      {shortDescription && (
        <p style={{
          marginTop: "1rem",
          fontSize: "var(--text-base)", lineHeight: "var(--leading-relaxed)",
          color: "var(--color-text-secondary)", fontFamily: "var(--font-body)",
        }}>
          {shortDescription}
        </p>
      )}

      {/* ── Purchase card ── */}
      <div style={{
        marginTop: "1.75rem",
        background: "var(--color-surface)",
        border: "1.5px solid var(--color-border)",
        borderRadius: "var(--radius-xl)",
        padding: "clamp(1.25rem, 3vw, 1.75rem)",
        display: "flex", flexDirection: "column", gap: "1.25rem",
      }}>

        {/* ── Stock row (price removed — quote-only model) ── */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem",
        }}>
          {/* Starting-price hint — shown when available, de-emphasised */}
          {formattedPrice ? (
            <div>
              <span style={{
                fontSize: "var(--text-xs)", fontFamily: "var(--font-body)",
                color: "var(--color-text-muted)", fontWeight: 500,
                textTransform: "uppercase", letterSpacing: "var(--tracking-wider)",
                display: "block", marginBottom: "0.2rem",
              }}>
                Starting from
              </span>
              <span style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                color: "var(--color-text-primary)",
                letterSpacing: "var(--tracking-tight)", lineHeight: 1,
              }}>
                {formattedPrice}
              </span>
            </div>
          ) : (
            <span style={{
              fontFamily: "var(--font-body)", fontSize: "var(--text-base)",
              color: "var(--color-text-muted)", fontStyle: "italic",
            }}>
              Request a quote for pricing
            </span>
          )}

          {/* Stock badge */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            fontSize: "var(--text-xs)", fontWeight: 600,
            fontFamily: "var(--font-body)", letterSpacing: "0.03em",
            padding: "0.375rem 0.75rem", borderRadius: "var(--radius-full)",
            background: inStock ? "rgba(21,128,61,0.08)"  : "rgba(185,28,28,0.08)",
            border: `1px solid ${inStock ? "rgba(21,128,61,0.2)" : "rgba(185,28,28,0.2)"}`,
            color:  inStock ? "rgb(21,128,61)" : "rgb(185,28,28)",
          }}>
            <span style={{
              width: "0.5rem", height: "0.5rem",
              borderRadius: "var(--radius-full)",
              background: inStock ? "rgb(22,163,74)" : "rgb(220,38,38)",
              boxShadow: inStock
                ? "0 0 0 3px rgba(22,163,74,0.15)"
                : "0 0 0 3px rgba(220,38,38,0.15)",
              flexShrink: 0,
            }} />
            {inStock ? `In Stock · ${stockQuantity} units` : "Out of Stock"}
          </span>
        </div>

        <div style={{ borderTop: "1px solid var(--color-border)" }} />

        {/* Variant selector */}
        <VariantSelector variants={variants} />

        {/* ── CTA buttons — all WhatsApp links ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>

          {/* Primary: Request a Quote → WhatsApp with product + model pre-filled */}
          <a
            href={waQuoteHref(productName, modelNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="ppp-btn-wa-primary"
          >
            {/* WhatsApp icon */}
            <svg style={{ width: "1.125rem", height: "1.125rem", flexShrink: 0 }}
              fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Request a Quote on WhatsApp
          </a>

          {/* Out-of-stock variant: notify when available */}
          {!inStock && (
            <a
              href={waNotifyHref(productName)}
              target="_blank"
              rel="noopener noreferrer"
              className="ppp-btn-notify"
            >
              <svg style={{ width: "1rem", height: "1rem" }} fill="none"
                viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Notify When Available
            </a>
          )}

          {/* Secondary: Contact Sales → different WA pre-fill */}
          <a
            href={waSalesHref(productName)}
            target="_blank"
            rel="noopener noreferrer"
            className="ppp-btn-secondary"
          >
            <svg style={{ width: "1rem", height: "1rem" }} fill="none"
              viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Sales
          </a>
        </div>

        {/* Trust signals */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "0.5rem", paddingTop: "0.25rem",
        }}>
          {TRUST_SIGNALS.map(({ icon, label }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: "0.375rem",
              padding: "0.5rem 0.625rem",
              background: "var(--color-catalog-bg)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
            }}>
              <svg style={{ width: "0.875rem", height: "0.875rem",
                color: "var(--color-amber)", flexShrink: 0 }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={1.5} d={icon} />
              </svg>
              <span style={{
                fontSize: "0.6875rem", fontFamily: "var(--font-body)",
                color: "var(--color-text-muted)", fontWeight: 500, lineHeight: 1.2,
              }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Category tag ── */}
      {categoryName && categorySlug && (
        <div style={{ marginTop: "1rem" }}>
          <Link href={`/products?category=${categorySlug}`} className="ppp-category-tag">
            <svg style={{ width: "0.75rem", height: "0.75rem" }} fill="none"
              viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {categoryName}
          </Link>
        </div>
      )}

      {/* ── Scoped styles ── */}
      <style>{`
        .ppp-brand-pill:hover { background: var(--color-amber-muted-strong) !important; }

        /* Primary WhatsApp CTA — green fill */
        .ppp-btn-wa-primary {
          width: 100%;
          background: rgb(37,211,102); color: var(--color-ink);
          font-family: var(--font-display); font-weight: 700;
          font-size: var(--text-sm); letter-spacing: var(--tracking-wide);
          text-transform: uppercase; text-decoration: none;
          padding: 0.9375rem 1.5rem; border-radius: var(--radius-md);
          border: none; cursor: pointer;
          transition: background var(--transition-fast), transform var(--transition-fast);
          display: flex; align-items: center; justify-content: center; gap: 0.625rem;
          min-height: 52px;
        }
        .ppp-btn-wa-primary:hover {
          background: rgb(22,163,74);
          transform: translateY(-1px);
        }
        .ppp-btn-wa-primary:active { transform: translateY(0); }

        /* Notify button — amber for urgency */
        .ppp-btn-notify {
          width: 100%;
          background: var(--color-amber); color: var(--color-ink);
          font-family: var(--font-display); font-weight: 700;
          font-size: var(--text-sm); letter-spacing: var(--tracking-wide);
          text-transform: uppercase; text-decoration: none;
          padding: 0.9375rem 1.5rem; border-radius: var(--radius-md);
          border: none; cursor: pointer;
          transition: background var(--transition-fast);
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          min-height: 44px;
        }
        .ppp-btn-notify:hover { background: var(--color-amber-light); }

        /* Secondary — outline */
        .ppp-btn-secondary {
          width: 100%;
          background: transparent; color: var(--color-text-secondary);
          font-family: var(--font-display); font-weight: 600;
          font-size: var(--text-sm); letter-spacing: var(--tracking-wide);
          text-transform: uppercase; text-decoration: none;
          padding: 0.875rem 1.5rem; border-radius: var(--radius-md);
          border: 1.5px solid var(--color-border); cursor: pointer;
          transition: all var(--transition-fast);
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          min-height: 44px;
        }
        .ppp-btn-secondary:hover {
          border-color: var(--color-ink);
          color: var(--color-text-primary);
          background: var(--color-surface-alt);
        }

        /* Category tag */
        .ppp-category-tag {
          display: inline-flex; align-items: center; gap: 0.375rem;
          background: var(--color-surface); border: 1px solid var(--color-border);
          color: var(--color-text-muted);
          font-size: var(--text-xs); font-weight: 600;
          font-family: var(--font-display); letter-spacing: var(--tracking-wide);
          text-transform: uppercase;
          padding: 0.375rem 0.75rem; border-radius: var(--radius-full);
          text-decoration: none; transition: all var(--transition-fast);
        }
        .ppp-category-tag:hover {
          border-color: var(--color-ink);
          color: var(--color-text-primary);
          background: var(--color-surface-alt);
        }
      `}</style>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetaTag({ label, value }: { label: string; value: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.25rem",
      fontSize: "var(--text-xs)", fontFamily: "var(--font-body)",
    }}>
      <span style={{ color: "var(--color-text-muted)", fontWeight: 500 }}>{label}:</span>
      <span style={{
        fontFamily: "monospace", fontWeight: 600,
        color: "var(--color-text-secondary)",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        padding: "0.1rem 0.375rem",
        borderRadius: "var(--radius-sm)",
        fontSize: "0.6875rem",
      }}>
        {value}
      </span>
    </span>
  );
}

const TRUST_SIGNALS = [
  { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Warranty Included" },
  { icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",                                                                                                                                               label: "Fast Dispatch"    },
  { icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",                                             label: "Expert Support"   },
  { icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z",                                                                                                              label: "Trade Pricing"    },
];