// src/app/categories/[slug]/page.tsx
//
// Category landing page — the definitive page for a single category.
//
// Routing contract (app-wide):
//   Every category click → /products?category=[slug]  (direct)
//   This page exists for SEO + richer discovery.
//
// Page structure:
//   1. Hero banner  (image + description + "Browse All" CTA → /products?category=slug)
//   2. Subcategory grid  (each → /products?category=slug)
//   3. Inline product grid  (server-fetched via Prisma, first 12)
//      "View all N" → /products?category=slug
//   4. Horizontal "More categories" strip  (each → /products?category=slug)

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCategoryBySlug, CATEGORIES } from "@/lib/categories.data";
import type { ProductListItem } from "@/types";
import type { Prisma } from "@prisma/client";

// ─── Dynamic params ───────────────────────────────────────────────────────────
// Must be true: without it, any slug not in generateStaticParams returns 404.
export const dynamicParams = true;

// ─── Static params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return { title: "Category Not Found" };
  return {
    title: `${cat.name} | Jocax Solutions Limited`,
    description: cat.description,
    openGraph: { title: `${cat.name} | Jocax Solutions Limited`, images: [cat.heroImage] },
  };
}

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getCategoryProducts(
  categorySlug: string
): Promise<{ products: ProductListItem[]; total: number }> {
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    category: { slug: categorySlug },
  };
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      take: 12,
      orderBy: { isFeatured: "desc" },
      select: {
        id: true, name: true, slug: true, shortDescription: true,
        price: true, currency: true, isFeatured: true, stockQuantity: true,
        brand: { select: { id: true, name: true, slug: true, logoUrl: true } },
        category: { select: { id: true, name: true, slug: true, parentId: true } },
        images: { select: { imageUrl: true, altText: true }, orderBy: { position: "asc" }, take: 1 },
      },
    }),
    prisma.product.count({ where }),
  ]);
  return { products: products as ProductListItem[], total };
}

function fmt(n: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();

  const { products, total } = await getCategoryProducts(cat.slug);
  const related = CATEGORIES.filter((c) => c.slug !== cat.slug);

  return (
    <>
      <style>{`
        .subcat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-3);
        }
        @media (min-width: 480px)  { .subcat-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 768px)  { .subcat-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1280px) { .subcat-grid { grid-template-columns: repeat(5, 1fr); } }

        .subcat-card {
          display: flex; flex-direction: column; gap: var(--space-2);
          padding: var(--space-4) var(--space-4) var(--space-3);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border-dark);
          background: rgba(255,255,255,0.03);
          text-decoration: none;
          transition: background 180ms ease, border-color 180ms ease, transform 180ms ease;
        }
        .subcat-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: var(--subcat-accent, rgba(232,160,32,0.3));
          transform: translateY(-2px);
        }

        .cat-product-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }
        @media (min-width: 540px)  { .cat-product-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 900px)  { .cat-product-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1280px) { .cat-product-grid { grid-template-columns: repeat(4, 1fr); } }

        .cat-pcard {
          display: flex; flex-direction: column;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border-dark);
          background: rgba(255,255,255,0.03);
          text-decoration: none; overflow: hidden;
          transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
        }
        .cat-pcard:hover {
          transform: translateY(-3px);
          border-color: rgba(232,160,32,0.2);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }
        .cat-pcard:hover .cat-pcard-img { transform: scale(1.05); }
        .cat-pcard-img {
          width: 100%; aspect-ratio: 4/3; object-fit: cover;
          transition: transform 280ms ease;
        }

        .related-scroll {
          display: flex; gap: var(--space-3);
          overflow-x: auto; padding-bottom: var(--space-2);
          scrollbar-width: none; -webkit-overflow-scrolling: touch;
          scroll-snap-type: x mandatory;
        }
        .related-scroll::-webkit-scrollbar { display: none; }
        .related-card {
          flex: 0 0 160px; scroll-snap-align: start;
          display: flex; flex-direction: column; gap: var(--space-2);
          padding: var(--space-4); border-radius: var(--radius-lg);
          border: 1px solid var(--color-border-dark);
          background: rgba(255,255,255,0.03);
          text-decoration: none;
          transition: background 150ms ease, border-color 150ms ease;
        }
        .related-card:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.15); }
      `}</style>

      <div style={{ minHeight: "100vh", background: "var(--color-ink)", paddingTop: "var(--nav-height)" }}>

        {/* ═══════════════════════════════════════════════════════════
            1. HERO
        ═══════════════════════════════════════════════════════════ */}
        <div style={{
          position: "relative", overflow: "hidden",
          minHeight: "clamp(300px, 42vw, 500px)",
          display: "flex", alignItems: "flex-end",
        }}>
          <img src={cat.heroImage} alt="" aria-hidden="true" style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", filter: "brightness(0.38)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, transparent 25%, rgba(13,13,13,0.97) 100%)",
          }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "3px",
            background: `linear-gradient(90deg, ${cat.color}, transparent)`,
          }} />

          <div className="container" style={{ position: "relative", paddingBottom: "var(--space-12)" }}>
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" style={{ marginBottom: "var(--space-5)" }}>
              <ol style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", listStyle: "none", margin: 0, padding: 0, flexWrap: "wrap" }}>
                {[
                  { href: "/", label: "Home" },
                  { href: "/categories", label: "Categories" },
                  { href: null, label: cat.name },
                ].map((crumb, i, arr) => (
                  <li key={crumb.label} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    {crumb.href ? (
                      <Link href={crumb.href} style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.4)", fontWeight: 500, letterSpacing: "0.06em" }}>
                        {crumb.label}
                      </Link>
                    ) : (
                      <span style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>{crumb.label}</span>
                    )}
                    {i < arr.length - 1 && <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "var(--text-xs)" }}>/</span>}
                  </li>
                ))}
              </ol>
            </nav>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-6)" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
                  <span style={{ fontSize: "2.5rem" }} aria-hidden="true">{cat.icon}</span>
                  <span style={{
                    background: `${cat.color}22`, border: `1px solid ${cat.color}44`,
                    borderRadius: "var(--radius-sm)", padding: "0.3rem 0.8rem",
                    fontSize: "var(--text-xs)", fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase", color: cat.color,
                  }}>
                    {total} Products
                  </span>
                </div>
                <h1 style={{ color: "var(--color-white)", marginBottom: "var(--space-3)" }}>{cat.name}</h1>
                <p style={{
                  color: "rgba(255,255,255,0.55)", maxWidth: "560px",
                  lineHeight: "var(--leading-relaxed)", fontWeight: 300,
                  fontSize: "clamp(var(--text-sm), 1.5vw, var(--text-base))",
                }}>
                  {cat.description}
                </p>
              </div>
              <Link href={`/products?category=${cat.slug}`} className="btn btn-primary btn-lg" style={{ flexShrink: 0 }}>
                Browse All {cat.name} →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="container" style={{ paddingBlock: "var(--space-12)" }}>

          {/* ═══════════════════════════════════════════════════════════
              2. SUBCATEGORIES
          ═══════════════════════════════════════════════════════════ */}
          {cat.subcategories && cat.subcategories.length > 0 && (
            <div style={{ marginBottom: "var(--space-14)" }}>
              <div style={{
                display: "flex", alignItems: "flex-end", justifyContent: "space-between",
                marginBottom: "var(--space-6)", gap: "var(--space-4)", flexWrap: "wrap",
              }}>
                <div>
                  <p className="eyebrow" style={{ marginBottom: "var(--space-2)" }}>Browse by Type</p>
                  <h2 style={{ color: "var(--color-white)", fontSize: "var(--text-xl)" }}>{cat.name} Types</h2>
                </div>
                <Link href={`/products?category=${cat.slug}`} style={{
                  fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "var(--tracking-wider)",
                  textTransform: "uppercase", borderBottom: `2px solid ${cat.color}`,
                  paddingBottom: "2px", whiteSpace: "nowrap", color: cat.color,
                }}>
                  View all {total} products →
                </Link>
              </div>
              <div className="subcat-grid">
                {cat.subcategories.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/products?category=${cat.slug}`}
                    className="subcat-card"
                    aria-label={`${sub.name} — ${sub.count} products`}
                    style={{ "--subcat-accent": cat.color } as React.CSSProperties}
                  >
                    <span style={{
                      fontFamily: "var(--font-display)", fontWeight: 700,
                      fontSize: "var(--text-sm)", color: "var(--color-white)",
                      textTransform: "uppercase", letterSpacing: "var(--tracking-wide)",
                      lineHeight: "var(--leading-snug)", maxWidth: "none",
                    }}>
                      {sub.name}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontWeight: 500 }}>
                        {sub.count} products
                      </span>
                      <span style={{ fontSize: "var(--text-xs)", fontWeight: 800, color: cat.color }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              3. INLINE PRODUCT GRID
          ═══════════════════════════════════════════════════════════ */}
          <div style={{ marginBottom: "var(--space-14)" }}>
            <div style={{
              display: "flex", alignItems: "flex-end", justifyContent: "space-between",
              marginBottom: "var(--space-6)", gap: "var(--space-4)", flexWrap: "wrap",
            }}>
              <div>
                <p className="eyebrow" style={{ marginBottom: "var(--space-2)" }}>
                  {products.length > 0 ? `Showing ${products.length} of ${total}` : "Products"}
                </p>
                <h2 style={{ color: "var(--color-white)", fontSize: "var(--text-xl)" }}>
                  Featured {cat.name}
                </h2>
              </div>
              {total > 0 && (
                <Link href={`/products?category=${cat.slug}`} style={{
                  fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "var(--tracking-wider)",
                  textTransform: "uppercase", borderBottom: `2px solid ${cat.color}`,
                  paddingBottom: "2px", whiteSpace: "nowrap", color: cat.color,
                }}>
                  View all {total} →
                </Link>
              )}
            </div>

            {products.length > 0 ? (
              <>
                <div className="cat-product-grid">
                  {products.map((product) => {
                    const img = product.images?.[0];
                    const inStock = (product.stockQuantity ?? 0) > 0;
                    return (
                      <Link key={product.id} href={`/products/${product.slug}`} className="cat-pcard">
                        {/* Image */}
                        <div style={{ overflow: "hidden", background: "rgba(255,255,255,0.04)" }}>
                          {img ? (
                            <img src={img.imageUrl} alt={img.altText ?? product.name} className="cat-pcard-img" />
                          ) : (
                            <div style={{
                              width: "100%", aspectRatio: "4/3",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "2.5rem",
                            }}>📦</div>
                          )}
                        </div>

                        {/* Info */}
                        <div style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", flex: 1, gap: "var(--space-2)" }}>
                          {product.brand && (
                            <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
                              {product.brand.name}
                            </span>
                          )}
                          <p style={{
                            fontFamily: "var(--font-display)", fontWeight: 700,
                            fontSize: "var(--text-sm)", color: "var(--color-white)",
                            lineHeight: "var(--leading-snug)", maxWidth: "none",
                            display: "-webkit-box", WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical", overflow: "hidden",
                          }}>
                            {product.name}
                          </p>
                          {product.shortDescription && (
                            <p style={{
                              fontSize: "var(--text-xs)", color: "var(--color-text-muted)",
                              lineHeight: "var(--leading-relaxed)", maxWidth: "none",
                              display: "-webkit-box", WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical", overflow: "hidden",
                            }}>
                              {product.shortDescription}
                            </p>
                          )}
                          <div style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            marginTop: "auto", paddingTop: "var(--space-3)",
                            borderTop: "1px solid var(--color-border-dark)",
                          }}>
                            {product.price !== null && product.price !== undefined ? (
                              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-md)", color: "var(--color-amber)" }}>
                                {fmt(product.price, product.currency)}
                              </span>
                            ) : (
                              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                                Price on request
                              </span>
                            )}
                            <span style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.06em", color: inStock ? "rgb(74,222,128)" : "rgb(248,113,113)" }}>
                              {inStock ? "● In Stock" : "● Low Stock"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {total > products.length && (
                  <div style={{ textAlign: "center", marginTop: "var(--space-10)" }}>
                    <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)" }}>
                      Showing {products.length} of {total} {cat.name.toLowerCase()} products
                    </p>
                    <Link href={`/products?category=${cat.slug}`} className="btn btn-primary">
                      View all {total} {cat.name} products →
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div style={{
                textAlign: "center", padding: "var(--space-16)",
                border: "1px dashed var(--color-border-dark)", borderRadius: "var(--radius-xl)",
              }}>
                <p style={{ fontSize: "2rem", marginBottom: "var(--space-4)" }}>{cat.icon}</p>
                <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-6)" }}>
                  No products found in this category yet.
                </p>
                <Link href="/products" className="btn btn-outline-light">Browse all equipment</Link>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════
              4. MORE CATEGORIES (horizontal scroll)
          ═══════════════════════════════════════════════════════════ */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-5)" }}>
              <p className="eyebrow">More Categories</p>
              <Link href="/categories" style={{
                fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", color: "var(--color-amber)",
                borderBottom: "1px solid rgba(232,160,32,0.4)", paddingBottom: "1px",
              }}>
                All categories →
              </Link>
            </div>
            <div className="related-scroll">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/products?category=${rel.slug}`}
                  className="related-card"
                  style={{ borderTop: `2px solid ${rel.color}55` }}
                >
                  <span style={{ fontSize: "1.5rem" }}>{rel.icon}</span>
                  <span style={{
                    fontFamily: "var(--font-display)", fontWeight: 700,
                    fontSize: "var(--text-xs)", color: "var(--color-white)",
                    textTransform: "uppercase", letterSpacing: "var(--tracking-wide)",
                    maxWidth: "none", lineHeight: 1.3,
                  }}>
                    {rel.name}
                  </span>
                  <span style={{ fontSize: "0.65rem", color: "var(--color-text-muted)", fontWeight: 500 }}>
                    {rel.count} products
                  </span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}