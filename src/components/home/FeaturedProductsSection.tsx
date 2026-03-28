// src/components/home/FeaturedProductsSection.tsx
//
// Async Server Component — fetches featured products from Prisma, then
// passes them to <ProductCarousel> (Client Component) for the infinite
// marquee animation.

import Link       from "next/link";
import { prisma } from "@/lib/prisma";
import type { ProductListItem } from "@/types";
import ProductCarousel from "./ProductCarousel";

async function getFeaturedProducts(): Promise<ProductListItem[]> {
  try {
    const rows = await prisma.product.findMany({
      where:   { isActive: true, isFeatured: true },
      take:    8,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, name: true, slug: true, shortDescription: true,
        price: true, currency: true, isFeatured: true, stockQuantity: true,
        brand:    { select: { id: true, name: true, slug: true, logoUrl: true } },
        category: { select: { id: true, name: true, slug: true, parentId: true } },
        images: {
          select:  { imageUrl: true, altText: true },
          orderBy: { position: "asc" },
          take:    1,
        },
      },
    });
    return rows as ProductListItem[];
  } catch (err) {
    console.error("[FeaturedProductsSection] Prisma error:", err);
    return [];
  }
}

export default async function FeaturedProductsSection() {
  const products = await getFeaturedProducts();

  return (
    <section
      className="section"
      aria-labelledby="products-heading"
      style={{ background: "var(--color-steel)", overflow: "hidden" }}
    >
      <style>{`
        /* ── Eyebrow — matches hero / categories / why pattern ─────────── */
        .featured-eyebrow {
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
        .featured-eyebrow-dash {
          display:       inline-block;
          width:         20px;
          height:        2px;
          background:    var(--color-amber);
          border-radius: 2px;
          flex-shrink:   0;
        }

        /* ── "Full catalog" ghost button — matches "All categories" ────── */
        .featured-catalog-link {
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
          transition:      color          var(--transition-fast),
                           border-color   var(--transition-fast),
                           background     var(--transition-fast);
        }
        .featured-catalog-link:hover {
          color:        var(--color-amber);
          border-color: rgba(232,160,32,0.35);
          background:   rgba(232,160,32,0.05);
        }
        .featured-catalog-link:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 3px;
          border-radius:  var(--radius-md);
        }
        .featured-catalog-link svg {
          transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .featured-catalog-link:hover svg {
          transform: translateX(3px);
        }
      `}</style>

      <div className="container">
        <div style={{
          display:         "flex",
          alignItems:      "flex-end",
          justifyContent:  "space-between",
          marginBottom:    "var(--space-10)",
          gap:             "var(--space-4)",
          flexWrap:        "wrap",
        }}>
          <div>
            <p className="featured-eyebrow">
              <span className="featured-eyebrow-dash" aria-hidden="true" />
              Hand-Picked Selection
            </p>
            <h2
              id="products-heading"
              style={{ color: "var(--color-white)", marginBottom: 0 }}
            >
              Featured Equipment
            </h2>
          </div>

          <Link href="/products?sort=featured" className="featured-catalog-link">
            Full catalog
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>

      <ProductCarousel products={products} />
    </section>
  );
}