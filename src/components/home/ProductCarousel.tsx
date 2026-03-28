"use client";
// src/components/home/ProductCarousel.tsx
//
// Infinite CSS marquee carousel — silky smooth, zero JS for animation control.
//
// NOTE: WhatsApp CTA is a <button> — NOT <a> — to avoid invalid nested
// <a><a> HTML which causes React hydration errors.

import Link from "next/link";
import type { ProductListItem } from "@/types";

// ─── Config ───────────────────────────────────────────────────────────────────

const WA_NUMBER = "254725692649";

function openWhatsApp(e: React.MouseEvent, productName: string) {
  e.preventDefault();
  e.stopPropagation();
  const msg = encodeURIComponent(`Hi, I'd like to request a quote for: ${productName}`);
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank", "noopener,noreferrer");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stockColor(qty: number) {
  if (qty === 0) return "rgb(248,113,113)";
  if (qty <= 3)  return "rgb(251,191,36)";
  return "rgb(74,222,128)";
}
function stockLabel(qty: number) {
  if (qty === 0) return "Out of stock";
  if (qty <= 3)  return `${qty} left`;
  return "In stock";
}

// ─── WhatsApp icon ────────────────────────────────────────────────────────────

function WaIcon() {
  return (
    <svg
      style={{ width: "0.875rem", height: "0.875rem", flexShrink: 0 }}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function CarouselCard({
  product,
  tabIndex,
}: {
  product:  ProductListItem;
  tabIndex: number;
}) {
  const img = product.images?.[0];
  const qty = product.stockQuantity ?? 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      tabIndex={tabIndex}
      className="carousel-card"
      draggable={false}
    >
      {/* ── Image ── */}
      <div className="carousel-card-img-wrap">
        {img ? (
          <img
            src={img.imageUrl}
            alt={img.altText ?? product.name}
            draggable={false}
            className="carousel-card-img"
          />
        ) : (
          <div className="carousel-card-img-placeholder">📦</div>
        )}

        {product.isFeatured && (
          <span className="carousel-card-badge">Featured</span>
        )}

        <div className="carousel-card-img-gradient" aria-hidden="true" />
      </div>

      {/* ── Body ── */}
      <div className="carousel-card-body">

        {/* Brand · Category */}
        <div className="carousel-card-meta">
          {product.brand && (
            <span className="carousel-card-brand">{product.brand.name}</span>
          )}
          {product.brand && product.category && (
            <span className="carousel-card-dot" aria-hidden="true">·</span>
          )}
          {product.category && (
            <span className="carousel-card-category">{product.category.name}</span>
          )}
        </div>

        {/* Name */}
        <p className="carousel-card-name">{product.name}</p>

        {/* Description */}
        {product.shortDescription && (
          <p className="carousel-card-desc">{product.shortDescription}</p>
        )}

        {/* ── Footer: stock badge + WhatsApp CTA ── */}
        <div className="carousel-card-footer">
          <span
            className="carousel-card-stock"
            style={{ color: stockColor(qty) }}
          >
            <span
              style={{
                display:      "inline-block",
                width:        "6px",
                height:       "6px",
                borderRadius: "50%",
                background:   stockColor(qty),
                marginRight:  "5px",
                verticalAlign:"middle",
                flexShrink:   0,
              }}
              aria-hidden="true"
            />
            {stockLabel(qty)}
          </span>

          <button
            type="button"
            onClick={(e) => openWhatsApp(e, product.name)}
            aria-label={`Request quote for ${product.name} via WhatsApp`}
            className="carousel-card-wa-btn"
          >
            <WaIcon />
            Request a Quote
          </button>
        </div>
      </div>
    </Link>
  );
}

// ─── Carousel ─────────────────────────────────────────────────────────────────

interface ProductCarouselProps {
  products: ProductListItem[];
}

const CARD_WIDTH = 300;
const CARD_GAP   = 24;
const SPEED_PX_S = 50;

export default function ProductCarousel({ products }: ProductCarouselProps) {
  if (products.length === 0) {
    return (
      <p style={{
        textAlign: "center",
        padding:   "var(--space-12)",
        color:     "var(--color-text-muted)",
      }}>
        No featured products at the moment.
      </p>
    );
  }

  const doubled  = [...products, ...products];
  const totalPx  = products.length * (CARD_WIDTH + CARD_GAP);
  const duration = Math.round(totalPx / SPEED_PX_S);

  return (
    <>
      <style>{`
        /* ── Marquee keyframe ─────────────────────────────────────────── */
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* ── Wrapper ──────────────────────────────────────────────────── */
        .carousel-wrap {
          position:      relative;
          overflow:      hidden;
          padding-block: var(--space-3) var(--space-6);
          cursor:        default;
        }
        .carousel-wrap::before,
        .carousel-wrap::after {
          content:        "";
          position:       absolute;
          top: 0; bottom: 0;
          width:          clamp(48px, 10vw, 140px);
          z-index:        3;
          pointer-events: none;
        }
        .carousel-wrap::before {
          left:       0;
          background: linear-gradient(to right, var(--color-steel) 0%, transparent 100%);
        }
        .carousel-wrap::after {
          right:      0;
          background: linear-gradient(to left, var(--color-steel) 0%, transparent 100%);
        }

        /* ── Track ────────────────────────────────────────────────────── */
        .carousel-track {
          display:        flex;
          gap:            ${CARD_GAP}px;
          width:          max-content;
          padding-inline: ${CARD_GAP}px;
          will-change:    transform;
          animation:      marquee ${duration}s linear infinite;
          animation-play-state: running;
        }
        .carousel-wrap:hover .carousel-track,
        .carousel-wrap:has(.carousel-card:hover) .carousel-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .carousel-track { animation: none !important; }
        }

        /* ── Card ─────────────────────────────────────────────────────── */
        .carousel-card {
          flex:            0 0 ${CARD_WIDTH}px;
          width:           ${CARD_WIDTH}px;
          display:         flex;
          flex-direction:  column;
          border-radius:   var(--radius-lg);
          border:          1px solid rgba(255,255,255,0.08);
          background:      rgba(255,255,255,0.03);
          overflow:        hidden;
          text-decoration: none;
          user-select:     none;
          transition:
            border-color 240ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
            background   240ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
            transform    240ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
            box-shadow   240ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .carousel-card:hover {
          border-color: rgba(232,160,32,0.40);
          background:   rgba(232,160,32,0.04);
          transform:    translateY(-5px) scale(1.015);
          box-shadow:   0 20px 56px rgba(0,0,0,0.55),
                        0  0   0 1px rgba(232,160,32,0.12);
        }
        .carousel-card:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 3px;
        }

        /* ── Image ────────────────────────────────────────────────────── */
        .carousel-card-img-wrap {
          position:     relative;
          overflow:     hidden;
          aspect-ratio: 16/10;
          background:   rgba(255,255,255,0.04);
          flex-shrink:  0;
        }
        .carousel-card-img {
          width: 100%; height: 100%;
          object-fit: cover;
          display:    block;
          transition: transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .carousel-card:hover .carousel-card-img { transform: scale(1.07); }

        .carousel-card-img-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-size: 2.5rem;
        }

        /* Badge — rectangular to match chip style, not pill */
        .carousel-card-badge {
          position:       absolute;
          top:            var(--space-3);
          left:           var(--space-3);
          background:     var(--color-amber);
          color:          var(--color-ink);
          font-size:      0.6rem;
          font-weight:    800;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          padding:        0.25rem 0.55rem;
          border-radius:  var(--radius-sm);
          z-index:        1;
        }
        .carousel-card-img-gradient {
          position:   absolute;
          bottom: 0; left: 0; right: 0;
          height:     45%;
          background: linear-gradient(to top, rgba(13,13,13,0.75), transparent);
          opacity:    0;
          transition: opacity 240ms ease;
        }
        .carousel-card:hover .carousel-card-img-gradient { opacity: 1; }

        /* ── Body ─────────────────────────────────────────────────────── */
        .carousel-card-body {
          padding:        var(--space-4);
          flex:           1;
          display:        flex;
          flex-direction: column;
          gap:            var(--space-2);
        }
        .carousel-card-meta {
          display: flex; align-items: center; gap: var(--space-2);
        }
        .carousel-card-brand {
          font-size:      0.65rem;
          font-weight:    700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color:          var(--color-amber);
        }
        .carousel-card-dot {
          color: rgba(255,255,255,0.15); font-size: 0.65rem;
        }
        .carousel-card-category {
          font-size:      0.65rem;
          font-weight:    500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color:          rgba(255,255,255,0.35);
        }
        .carousel-card-name {
          font-family:        var(--font-display);
          font-weight:        700;
          font-size:          var(--text-base);
          color:              var(--color-white);
          line-height:        var(--leading-snug);
          max-width:          none;
          display:            -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow:           hidden;
          margin:             0;
          transition:         color 200ms ease;
        }
        .carousel-card:hover .carousel-card-name { color: rgba(255,255,255,0.95); }

        .carousel-card-desc {
          font-size:          var(--text-xs);
          color:              var(--color-text-muted);
          line-height:        var(--leading-relaxed);
          max-width:          none;
          display:            -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow:           hidden;
          margin:             0;
        }

        /* ── Footer ───────────────────────────────────────────────────── */
        .carousel-card-footer {
          display:         flex;
          align-items:     center;
          justify-content: space-between;
          gap:             var(--space-3);
          margin-top:      auto;
          padding-top:     var(--space-3);
          border-top:      1px solid rgba(255,255,255,0.07);
          flex-wrap:       wrap;
        }
        .carousel-card-stock {
          display:        flex;
          align-items:    center;
          font-size:      0.65rem;
          font-weight:    600;
          letter-spacing: 0.06em;
          white-space:    nowrap;
          flex-shrink:    0;
        }

        /* WhatsApp button — rectangular, not oval */
        .carousel-card-wa-btn {
          display:         inline-flex;
          align-items:     center;
          justify-content: center;
          gap:             0.35rem;
          padding:         0.3rem 0.65rem;
          background:      rgba(37,211,102,0.08);
          border:          1px solid rgba(37,211,102,0.22);
          border-radius:   var(--radius-sm);
          color:           rgb(74,222,128);
          font-family:     var(--font-display);
          font-weight:     700;
          font-size:       0.625rem;
          letter-spacing:  0.08em;
          text-transform:  uppercase;
          white-space:     nowrap;
          flex-shrink:     0;
          cursor:          pointer;
          transition:
            background   var(--transition-fast),
            border-color var(--transition-fast),
            color        var(--transition-fast);
        }
        .carousel-card-wa-btn:hover {
          background:   rgba(37,211,102,0.18);
          border-color: rgba(37,211,102,0.50);
          color:        rgb(134,239,172);
        }
        .carousel-card-wa-btn:focus-visible {
          outline:        3px solid rgb(74,222,128);
          outline-offset: 2px;
        }
      `}</style>

      <div
        className="carousel-wrap"
        role="region"
        aria-label="Featured products — hover to pause scrolling"
      >
        <div className="carousel-track">
          {doubled.map((product, i) => (
            <CarouselCard
              key={`${product.id}-${i}`}
              product={product}
              tabIndex={i >= products.length ? -1 : 0}
            />
          ))}
        </div>
      </div>
    </>
  );
}