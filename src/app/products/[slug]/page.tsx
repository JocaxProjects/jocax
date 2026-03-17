// src/app/products/[slug]/page.tsx
// Server Component — data fetching only.
// All interactivity delegated to client components:
//   ProductGallery       → src/components/ProductDetail/ProductGallery.tsx
//   ProductPurchasePanel → src/components/ProductDetail/ProductPurchasePanel.tsx
//   ProductTabs          → src/components/ProductDetail/ProductTabs.tsx

import { cache }    from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductGallery       from "@/components/ProductDetail/ProductGallery";
import ProductPurchasePanel from "@/components/ProductDetail/ProductPurchasePanel";
import ProductTabs          from "@/components/ProductDetail/ProductTabs";
import RelatedProducts      from "@/components/ProductCard/RelatedProducts";
import type { ProductListItem } from "@/types";

// ─── CRITICAL: Force dynamic rendering ───────────────────────────────────────
// Prevents Next.js statically pre-rendering every slug at build time and
// serving stale/wrong product data when navigating between products.
export const dynamic = "force-dynamic";

// ─── Types ────────────────────────────────────────────────────────────────────
// Next.js 15: params is a Promise — must be awaited in both generateMetadata
// and the page component. Using the plain-object form will cause runtime errors
// under strict mode.

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── Data fetching ────────────────────────────────────────────────────────────
// Wrapped in React cache() so generateMetadata and the page component share a
// single Prisma call per request — without this they each fire independently.

const getProduct = cache(async (slug: string) => {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      brand:      { select: { name: true, slug: true, logoUrl: true } },
      category:   { select: { name: true, slug: true } },
      images:     { orderBy: { position: "asc" } },
      attributes: { include: { attribute: { select: { name: true, unit: true } } } },
      variants:   true,
      documents:  true,
    },
  });
});

async function getRelatedProducts(
  categoryId: string | null,
  currentId:  string
): Promise<ProductListItem[]> {
  if (!categoryId) return [];

  const products = await prisma.product.findMany({
    where: {
      isActive:   true,
      categoryId,
      id: { not: currentId },
    },
    take: 4,
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

  return products as ProductListItem[];
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
// cache() ensures this shares the same Prisma result as the page component.

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product  = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title:       `${product.name} | Jocax Solutions`,
    description: product.shortDescription ?? product.description?.slice(0, 160) ?? undefined,
    openGraph: {
      title:       product.name,
      description: product.shortDescription ?? undefined,
      images:      product.images[0]
        ? [{ url: product.images[0].imageUrl, alt: product.images[0].altText ?? product.name }]
        : [],
      type: "website",
    },
  };
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────────
// .replace(/</g, "\\u003c") prevents </script> in product copy from breaking
// out of the script tag — a real risk with commercial product descriptions.

function ProductJsonLd({
  product,
}: {
  product: NonNullable<Awaited<ReturnType<typeof getProduct>>>;
}) {
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@type":    "Product",
    name:        product.name,
    description: product.description ?? product.shortDescription ?? undefined,
    sku:         product.sku         ?? undefined,
    mpn:         product.modelNumber ?? undefined,
    brand:       product.brand
      ? { "@type": "Brand", name: product.brand.name }
      : undefined,
    image:  product.images.map((i) => i.imageUrl),
    offers: product.price
      ? {
          "@type":       "Offer",
          priceCurrency: product.currency,
          price:         product.price,
          availability:  product.stockQuantity > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        }
      : undefined,
  }).replace(/</g, "\\u003c"); // ← prevents </script> injection

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // cache() means this is the same Prisma result already fetched in generateMetadata
  const product = await getProduct(slug);
  if (!product) notFound();

  // Kick off related products fetch immediately — don't await yet so it runs
  // in parallel with the synchronous work below (price formatting, etc.)
  const relatedPromise = getRelatedProducts(product.categoryId, product.id);

  const formattedPrice =
    product.price != null
      ? new Intl.NumberFormat("en-US", {
          style:                 "currency",
          currency:              product.currency,
          maximumFractionDigits: 0,
        }).format(product.price)
      : null;

  const inStock = product.stockQuantity > 0;

  // Now await — it's been running in parallel the whole time
  const relatedProducts = await relatedPromise;

  return (
    <>
      {/* ── Scoped styles — placed at the top so they're parsed before the
          elements that depend on them, preventing an unstyled-content flash ── */}
      <style>{`
        .breadcrumb-link {
          font-size:       var(--text-xs);
          color:           rgba(255,255,255,0.4);
          font-family:     var(--font-body);
          text-decoration: none;
          flex-shrink:     0;
          transition:      color var(--transition-fast);
        }
        .breadcrumb-link:hover { color: rgba(255,255,255,0.85); }

        .product-detail-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(2rem, 5vw, 3.5rem);
        }
        @media (min-width: 1024px) {
          .product-detail-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <ProductJsonLd product={product} />

      <main className="min-h-screen" style={{ backgroundColor: "var(--color-catalog-bg)" }}>

        {/* ── Steel breadcrumb band ── */}
        <div style={{
          background:   "var(--color-steel)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div className="container" style={{ paddingBlock: "clamp(1rem, 3vw, 1.5rem)" }}>
            <nav
              aria-label="Breadcrumb"
              style={{
                display:         "flex",
                alignItems:      "center",
                gap:             "0.375rem",
                overflowX:       "auto",
                whiteSpace:      "nowrap",
                msOverflowStyle: "none",
                scrollbarWidth:  "none",
              }}
            >
              <Link href="/"         className="breadcrumb-link">Home</Link>
              <BreadcrumbSep />
              <Link href="/products" className="breadcrumb-link">Products</Link>

              {product.category && (
                <>
                  <BreadcrumbSep />
                  <Link
                    href={`/products?category=${product.category.slug}`}
                    className="breadcrumb-link"
                  >
                    {product.category.name}
                  </Link>
                </>
              )}

              <BreadcrumbSep />
              <span style={{
                fontSize:     "var(--text-xs)",
                color:        "rgba(255,255,255,0.75)",
                fontFamily:   "var(--font-body)",
                fontWeight:   500,
                overflow:     "hidden",
                textOverflow: "ellipsis",
                maxWidth:     "clamp(8rem, 25vw, 20rem)",
                flexShrink:   0,
              }}>
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        {/* ── Main body ── */}
        <div className="container" style={{ paddingBlock: "clamp(1.75rem, 5vw, 3rem)" }}>

          {/* 2-col layout */}
          <div className="product-detail-grid">

            {/* Left: image gallery */}
            <ProductGallery images={product.images} productName={product.name} />

            {/* Right: purchase panel */}
            <ProductPurchasePanel
              formattedPrice={formattedPrice}
              inStock={inStock}
              stockQuantity={product.stockQuantity}
              variants={product.variants}
              brandName={product.brand?.name}
              brandSlug={product.brand?.slug}
              brandLogoUrl={product.brand?.logoUrl}
              productName={product.name}
              modelNumber={product.modelNumber}
              sku={product.sku}
              shortDescription={product.shortDescription}
              categoryName={product.category?.name}
              categorySlug={product.category?.slug}
            />
          </div>

          {/* Tabbed description / specs / docs */}
          <ProductTabs
            description={product.description}
            attributes={product.attributes}
            documents={product.documents}
          />

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div style={{ marginTop: "clamp(3rem, 7vw, 5rem)" }}>
              <RelatedProducts
                products={relatedProducts}
                title="Related Equipment"
                eyebrow="You Might Also Like"
                seeAllHref={
                  product.category
                    ? `/products?category=${product.category.slug}`
                    : "/products"
                }
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BreadcrumbSep() {
  return (
    <span style={{
      fontSize:   "var(--text-xs)",
      color:      "rgba(255,255,255,0.2)",
      flexShrink: 0,
      userSelect: "none",
    }}>
      ›
    </span>
  );
}