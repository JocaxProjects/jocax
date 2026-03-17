// app/admin/seo/page.tsx
//
// Admin SEO pages index — manage landing pages for search rankings.
//  ✦ Lists all SeoPage records with slug, title, and meta description preview
//  ✦ Links to create/edit pages

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SeoRowActions from "@/components/admin/SeoRowActions";

export default async function AdminSeoPage() {
  const pages = await prisma.seoPage.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, slug: true, title: true, metaDescription: true, createdAt: true },
  });

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#e8e8e8", marginBottom: "0.2rem" }}>SEO Pages</h1>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>{pages.length} landing pages</p>
        </div>
        <Link href="/admin/seo/new" style={{ background: "#e8a020", color: "#0a0a0b", fontWeight: 800, fontSize: "0.78rem", padding: "0.55rem 1.1rem", borderRadius: "7px", textDecoration: "none" }}>
          + New SEO Page
        </Link>
      </div>

      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
          <thead>
            <tr>
              {["Title", "Slug / URL", "Meta Description", "Actions"].map((h) => (
                <th key={h} style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", padding: "0 0.75rem 0.6rem", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.25)" }}>No SEO pages yet</td></tr>
            )}
            {pages.map((page) => (
              <tr key={page.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "0.7rem 0.75rem" }}>
                  <Link href={`/admin/seo/${page.id}/edit`} style={{ color: "#e8e8e8", fontWeight: 700, textDecoration: "none" }}>{page.title}</Link>
                </td>
                <td style={{ padding: "0.7rem 0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>/{page.slug}</span>
                    <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.2)" }}>↗</a>
                  </div>
                </td>
                <td style={{ padding: "0.7rem 0.75rem", color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", maxWidth: "320px" }}>
                  <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {page.metaDescription ?? <span style={{ color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>No meta description</span>}
                  </span>
                </td>
                <td style={{ padding: "0.7rem 0.75rem" }}>
                  <SeoRowActions seoPageId={page.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}