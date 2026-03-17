// src/components/home/HeroSection.tsx

import Link           from "next/link";
import { prisma }     from "@/lib/prisma";
import type { ProductListItem } from "@/types";
import HeroClient     from "./HeroClient";

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getHeroProducts(): Promise<{
  hero: ProductListItem | null;
  mini: ProductListItem[];
}> {
  try {
    const rows = await prisma.product.findMany({
      where:   { isActive: true, isFeatured: true },
      take:    3,
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

    const products = rows as ProductListItem[];
    return {
      hero: products[0] ?? null,
      mini: products.slice(1, 3),
    };
  } catch (err) {
    console.error("[HeroSection] Prisma error:", err);
    return { hero: null, mini: [] };
  }
}

// ─── Server Component ─────────────────────────────────────────────────────────

export default async function HeroSection() {
  const { hero, mini } = await getHeroProducts();

  if (!hero) {
    return (
      <section
        aria-label="Hero"
        style={{
          background:     "var(--color-steel)",
          minHeight:      "60vh",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          paddingTop:     "var(--nav-height)",
        }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <h1 style={{ color: "var(--color-white)" }}>
            Professional Kitchen<br />
            <span style={{ color: "var(--color-amber)" }}>Equipment</span>
          </h1>
          <div style={{ marginTop: "var(--space-8)", display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/products" className="btn btn-primary btn-lg">Browse Catalog →</Link>
            <Link href="/search"   className="btn btn-outline-light btn-lg">Search Equipment</Link>
          </div>
        </div>
      </section>
    );
  }

  return <HeroClient hero={hero} mini={mini} />;
}