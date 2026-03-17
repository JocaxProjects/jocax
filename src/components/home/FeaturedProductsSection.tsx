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
      <div className="container">
        <div style={{
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          marginBottom: "var(--space-10)", gap: "var(--space-4)", flexWrap: "wrap",
        }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: "var(--space-2)" }}>
              Hand-Picked Selection
            </p>
            <h2 id="products-heading" style={{ color: "var(--color-white)" }}>
              Featured Equipment
            </h2>
          </div>
          <Link
            href="/products?sort=featured"
            style={{
              fontSize: "var(--text-xs)", fontWeight: 700,
              letterSpacing: "var(--tracking-wider)", textTransform: "uppercase",
              borderBottom: "2px solid var(--color-amber)", paddingBottom: "2px",
              whiteSpace: "nowrap", color: "var(--color-amber)",
            }}
          >
            Full catalog →
          </Link>
        </div>
      </div>

      <ProductCarousel products={products} />
    </section>
  );
}