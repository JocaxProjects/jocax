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
      <>
        <style>{`
          /* ── Hero fallback button group ─────────────────────────────
             Mobile:  full-width stacked buttons, capped container
             SM+:     equal-width side by side
          ── */
          .hero-fallback-actions {
            margin-top:      var(--space-8);
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
          @media (min-width: 480px) {
            .hero-fallback-actions > * {
              flex:      1 1 0;
              max-width: 13rem;
            }
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
          {/* Ambient diagonal — matches the rest of the site hero pattern */}
          <div aria-hidden="true" style={{
            position:   "absolute", top: 0, right: "-10%",
            width:      "45%",      height: "100%",
            background: "linear-gradient(135deg, transparent 45%, rgba(232,160,32,0.1) 45%)",
            pointerEvents: "none",
          }}/>

          <div className="container" style={{ textAlign: "center", position: "relative" }}>
            <p style={{
              fontFamily:     "var(--font-display)",
              fontSize:       "var(--text-xs)",
              fontWeight:     700,
              letterSpacing:  "var(--tracking-widest)",
              textTransform:  "uppercase",
              color:          "var(--color-amber)",
              marginBottom:   "var(--space-4)",
            }}>
              East Africa&apos;s Kitchen Specialists
            </p>

            <h1 style={{ color: "var(--color-white)", marginBottom: 0 }}>
              Professional Kitchen<br/>
              <span style={{ color: "var(--color-amber)" }}>Equipment</span>
            </h1>

            <p style={{
              color:       "rgba(255,255,255,0.55)",
              marginTop:   "var(--space-4)",
              fontSize:    "clamp(var(--text-base), 2vw, var(--text-lg))",
              fontWeight:  300,
              lineHeight:  "var(--leading-relaxed)",
              maxWidth:    "min(520px, 100%)",
              marginInline:"auto",
            }}>
              Trusted by 3,800+ operations across East Africa — ovens, refrigeration,
              prep equipment, and more.
            </p>

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