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
        .rp-header {
          display: flex; align-items: flex-start;
          justify-content: space-between;
          margin-bottom: var(--space-5); gap: var(--space-4); flex-wrap: wrap;
        }
        .rp-see-all {
          font-size: var(--text-xs); font-weight: 700;
          letter-spacing: var(--tracking-wider); text-transform: uppercase;
          border-bottom: 2px solid var(--color-amber); padding-bottom: 2px;
          white-space: nowrap; transition: opacity var(--transition-fast);
          align-self: flex-end; flex-shrink: 0;
        }
        .rp-see-all:hover { opacity: 0.7; }
        .rp-scroll {
          display: flex; gap: var(--space-3); overflow-x: auto;
          padding-bottom: var(--space-3); scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch; scrollbar-width: none;
          margin-inline: calc(-1 * var(--page-padding-x));
          padding-inline: var(--page-padding-x);
        }
        .rp-scroll::-webkit-scrollbar { display: none; }
        .rp-scroll-item {
          flex-shrink: 0; width: clamp(200px, 72vw, 260px);
          scroll-snap-align: start;
        }
        .rp-grid {
          display: grid; grid-template-columns: repeat(1, 1fr);
          gap: var(--space-4);
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

      <div className="rp-header">
        <div>
          <p className="eyebrow" style={{ marginBottom: "var(--space-2)" }}>{eyebrow}</p>
          <h2 id="related-products-heading" style={{ fontSize: "clamp(var(--text-2xl), 3vw, var(--text-3xl))" }}>
            {title}
          </h2>
        </div>
        {seeAllHref && (
          <a href={seeAllHref} className="rp-see-all">See all →</a>
        )}
      </div>

      {scroll ? (
        <div className="rp-scroll" aria-label={title}>
          {visible.map((product, index) => (
            <div key={product.id} className="rp-scroll-item">
              {/* showDescription/showSpecs removed — not valid ProductCardProps */}
              <ProductCard
                product={product}
                variant="grid"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rp-grid">
          {visible.map((product, index) => (
            /* showDescription/showSpecs removed — not valid ProductCardProps */
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