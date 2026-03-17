// app/admin/brands/page.tsx
//
// Admin brands index — table of all brands with product counts.
//  ✦ Sortable by name or product count
//  ✦ Inline delete via API route
//  ✦ Links to edit page

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BrandRowActions from "@/components/admin/BrandRowActions";

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true, name: true, slug: true, logoUrl: true, createdAt: true,
      _count: { select: { products: true } },
    },
  });

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#e8e8e8", marginBottom: "0.2rem" }}>Brands</h1>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>{brands.length} brands</p>
        </div>
        <Link href="/admin/brands/new" style={{ background: "#e8a020", color: "#0a0a0b", fontWeight: 800, fontSize: "0.78rem", padding: "0.55rem 1.1rem", borderRadius: "7px", textDecoration: "none" }}>
          + New Brand
        </Link>
      </div>

      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
          <thead>
            <tr>
              {["Logo", "Name", "Slug", "Products", "Actions"].map((h) => (
                <th key={h} style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", padding: "0 0.75rem 0.6rem", textAlign: "left", whiteSpace: "nowrap", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {brands.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.25)" }}>No brands yet</td></tr>
            )}
            {brands.map((brand) => (
              <tr key={brand.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "0.7rem 0.75rem" }}>
                  {brand.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={brand.logoUrl} alt={brand.name} style={{ width: 32, height: 32, objectFit: "contain", borderRadius: 4, background: "rgba(255,255,255,0.06)" }} />
                  ) : (
                    <div style={{ width: 32, height: 32, borderRadius: 4, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>?</div>
                  )}
                </td>
                <td style={{ padding: "0.7rem 0.75rem" }}>
                  <Link href={`/admin/brands/${brand.id}/edit`} style={{ color: "#e8e8e8", fontWeight: 700, textDecoration: "none" }}>
                    {brand.name}
                  </Link>
                </td>
                <td style={{ padding: "0.7rem 0.75rem", fontFamily: "monospace", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>{brand.slug}</td>
                <td style={{ padding: "0.7rem 0.75rem", fontWeight: 700, color: brand._count.products > 0 ? "#e8a020" : "rgba(255,255,255,0.25)" }}>
                  {brand._count.products}
                </td>
                <td style={{ padding: "0.7rem 0.75rem" }}>
                  <BrandRowActions brandId={brand.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}