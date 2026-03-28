import Link        from "next/link";
import ProductCard from "./index";
import type { ProductListItem } from "@/types";

interface RelatedProductsProps {
  products:    ProductListItem[];
  title?:      string;
  eyebrow?:    string;
  limit?:      number;
  seeAllHref?: string;
  scroll?:     boolean;
}

export default function RelatedProducts({
  products,
  title      = "Related Products",
  eyebrow    = "You Might Also Like",
  limit      = 4,
  seeAllHref,
  scroll     = true,
}: RelatedProductsProps) {
  const visible = products.slice(0, limit);
  if (!visible.length) return null;

  return (
    <section aria-labelledby="related-products-heading">
      <style>{`
        /* ── Header ───────────────────────────────────────────────────── */
        .rp-header {
          display:         flex;
          align-items:     flex-end;
          justify-content: space-between;
          margin-bottom:   var(--space-8);
          gap:             var(--space-4);
          flex-wrap:       wrap;
        }

        /* ── Eyebrow — amber dash pattern ─────────────────────────────── */
        .rp-eyebrow {
          display:        flex;
          align-items:    center;
          gap:            var(--space-2);
          font-family:    var(--font-display);
          font-size:      var(--text-xs);
          font-weight:    700;
          letter-spacing: var(--tracking-widest);
          text-transform: uppercase;
          color:          var(--color-amber);
          margin-bottom:  var(--space-2);
        }
        .rp-eyebrow-dash {
          display:       inline-block;
          width:         20px;
          height:        2px;
          background:    var(--color-amber);
          border-radius: 2px;
          flex-shrink:   0;
        }

        /* ── "See all" ghost button — matches All Categories / Full Catalog */
        .rp-see-all {
          display:         inline-flex;
          align-items:     center;
          gap:             var(--space-2);
          font-size:       var(--text-xs);
          font-weight:     700;
          letter-spacing:  var(--tracking-wider);
          text-transform:  uppercase;
          color:           rgba(255,255,255,0.55);
          text-decoration: none;
          padding:         var(--space-2) var(--space-3);
          border:          1px solid rgba(255,255,255,0.12);
          border-radius:   var(--radius-md);
          white-space:     nowrap;
          flex-shrink:     0;
          transition:      color          var(--transition-fast),
                           border-color   var(--transition-fast),
                           background     var(--transition-fast);
        }
        .rp-see-all:hover {
          color:        var(--color-amber);
          border-color: rgba(232,160,32,0.35);
          background:   rgba(232,160,32,0.05);
        }
        .rp-see-all:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 3px;
          border-radius:  var(--radius-md);
        }
        .rp-see-all svg {
          transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .rp-see-all:hover svg { transform: translateX(3px); }

        /* ── Scroll container ─────────────────────────────────────────── */
        .rp-scroll {
          display:                    flex;
          gap:                        var(--space-3);
          overflow-x:                 auto;
          padding-bottom:             var(--space-3);
          scroll-snap-type:           x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width:            none;
          margin-inline:              calc(-1 * var(--page-padding-x));
          padding-inline:             var(--page-padding-x);
        }
        .rp-scroll::-webkit-scrollbar { display: none; }
        .rp-scroll-item {
          flex-shrink:       0;
          width:             clamp(200px, 72vw, 260px);
          scroll-snap-align: start;
        }

        /* ── Grid layout ──────────────────────────────────────────────── */
        .rp-grid {
          display:               grid;
          grid-template-columns: repeat(1, 1fr);
          gap:                   var(--space-4);
        }

        @media (min-width: 480px) {
          .rp-scroll-item { width: clamp(220px, 48vw, 280px); }
          .rp-grid        { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 768px) {
          .rp-scroll-item { width: clamp(220px, 30vw, 280px); }
          .rp-scroll      { margin-inline: 0; padding-inline: 0; }
          .rp-grid        { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1024px) {
          .rp-scroll-item { width: clamp(220px, 22vw, 280px); }
          .rp-grid        { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>

      {/* ── Section header ── */}
      <div className="rp-header">
        <div>
          <p className="rp-eyebrow">
            <span className="rp-eyebrow-dash" aria-hidden="true" />
            {eyebrow}
          </p>
          <h2
            id="related-products-heading"
            style={{ fontSize: "clamp(var(--text-2xl), 3vw, var(--text-3xl))", marginBottom: 0 }}
          >
            {title}
          </h2>
        </div>

        {seeAllHref && (
          <Link href={seeAllHref} className="rp-see-all">
            See all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        )}
      </div>

      {/* ── Products ── */}
      {scroll ? (
        <div className="rp-scroll" aria-label={title}>
          {visible.map((product, index) => (
            <div key={product.id} className="rp-scroll-item">
              <ProductCard product={product} variant="grid" priority={index === 0} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rp-grid">
          {visible.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="grid"
              priority={index === 0}
            />
          ))}
        </div>
      )}
    </section>
  );
}