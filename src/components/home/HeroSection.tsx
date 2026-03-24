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

// ─── Fallback stats (mirrors HeroClient) ─────────────────────────────────────

const FALLBACK_STATS = [
  { value: "1,000+", label: "Products" },
  { value: "50+",    label: "Brands"   },
  { value: "1,000+", label: "Operations served" },
];

// ─── Server Component ─────────────────────────────────────────────────────────

export default async function HeroSection() {
  const { hero, mini } = await getHeroProducts();

  if (!hero) {
    return (
      <>
        <style>{`
          .hero-fallback-actions {
            display:         flex;
            flex-wrap:       wrap;
            gap:             var(--space-3);
            justify-content: center;
            width:           100%;
            max-width:       26rem;
            margin-inline:   auto;
            margin-top:      var(--space-8);
          }
          .hero-fallback-actions > * {
            flex:            1 1 100%;
            justify-content: center !important;
            text-align:      center;
            box-sizing:      border-box;
          }
          .hero-fallback-actions > *:last-child {
            opacity: 0.75;
          }
          @media (min-width: 480px) {
            .hero-fallback-actions > * {
              flex:      1 1 0;
              max-width: 13rem;
            }
          }
          .hero-fallback-stats {
            display:         flex;
            flex-wrap:       wrap;
            gap:             2rem;
            justify-content: center;
            margin-top:      var(--space-8);
            margin-bottom:   0;
          }
          .hero-fallback-stat-value {
            font-family:    var(--font-display);
            font-weight:    800;
            font-size:      var(--text-2xl);
            color:          var(--color-white);
            letter-spacing: var(--tracking-tight);
            line-height:    1;
            display:        block;
          }
          .hero-fallback-stat-label {
            font-size:      var(--text-xs);
            font-weight:    500;
            color:          rgba(255,255,255,0.40);
            text-transform: uppercase;
            letter-spacing: var(--tracking-wider);
            display:        block;
            margin-top:     3px;
          }
        `}</style>

        <section
          aria-label="Hero"
          style={{
            background:     "var(--color-steel)",
            minHeight:      "60vh",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            paddingTop:     "var(--nav-height)",
            position:       "relative",
            overflow:       "hidden",
          }}
        >


          <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>

            {/* Eyebrow */}
            <p style={{
              fontFamily:    "var(--font-display)",
              fontSize:      "var(--text-xs)",
              fontWeight:    700,
              letterSpacing: "var(--tracking-widest)",
              textTransform: "uppercase",
              color:         "var(--color-amber)",
              marginBottom:  "var(--space-4)",
              display:       "flex",
              alignItems:    "center",
              justifyContent:"center",
              gap:           "var(--space-2)",
            }}>
              <span style={{
                display:    "inline-block",
                width:      "24px",
                height:     "2px",
                background: "var(--color-amber)",
                borderRadius: "2px",
              }} aria-hidden="true" />
              East Africa&apos;s Kitchen Specialists
              <span style={{
                display:    "inline-block",
                width:      "24px",
                height:     "2px",
                background: "var(--color-amber)",
                borderRadius: "2px",
              }} aria-hidden="true" />
            </p>

            <h1 style={{ color: "var(--color-white)", marginBottom: 0 }}>
              Professional Kitchen<br/>
              <span style={{ color: "var(--color-amber)" }}>Equipment</span>
            </h1>

            <p style={{
              color:        "rgba(255,255,255,0.55)",
              marginTop:    "var(--space-4)",
              fontSize:     "clamp(var(--text-base), 2vw, var(--text-lg))",
              fontWeight:   300,
              lineHeight:   "var(--leading-relaxed)",
              maxWidth:     "min(480px, 100%)",
              marginInline: "auto",
              marginBottom: 0,
            }}>
              The definitive source for commercial kitchen equipment,
              built for restaurants, hotels, and food service operations.
            </p>

            {/* Stat strip */}
            <div className="hero-fallback-stats" aria-label="Key statistics">
              {FALLBACK_STATS.map(({ value, label }) => (
                <div key={label}>
                  <span className="hero-fallback-stat-value">{value}</span>
                  <span className="hero-fallback-stat-label">{label}</span>
                </div>
              ))}
            </div>

            {/* CTAs — primary dominant, secondary ghost + reduced opacity */}
            <div className="hero-fallback-actions">
              <Link href="/products" className="btn btn-primary btn-lg">
                Browse Catalog →
              </Link>
              <Link href="/search" className="btn btn-outline-light btn-lg">
                Search Equipment
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return <HeroClient hero={hero} mini={mini} />;
}