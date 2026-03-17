// app/admin/categories/page.tsx
//
// Admin categories index — lists all categories in a hierarchy-aware table.
//  ✦ Shows parent/child relationship with indented display
//  ✦ Inline delete via API route
//  ✦ Links to edit page per category

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CategoryRowActions from "@/components/admin/CategoryRowActions";

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: [{ parentId: "asc" }, { name: "asc" }],
    select: {
      id: true, name: true, slug: true, description: true,
      parentId: true,
      parent:   { select: { name: true } },
      _count:   { select: { products: true, children: true } },
    },
  });
  return categories;
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#e8e8e8", marginBottom: "0.2rem" }}>Categories</h1>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>{categories.length} categories</p>
        </div>
        <Link href="/admin/categories/new" style={{
          background: "#e8a020", color: "#0a0a0b", fontWeight: 800, fontSize: "0.78rem",
          padding: "0.55rem 1.1rem", borderRadius: "7px", textDecoration: "none",
        }}>
          + New Category
        </Link>
      </div>

      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
          <thead>
            <tr>
              {["Name", "Slug", "Parent", "Products", "Subcategories", "Actions"].map((h) => (
                <th key={h} style={{
                  fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.09em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
                  padding: "0 0.75rem 0.6rem", textAlign: "left", whiteSpace: "nowrap",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.25)" }}>
                  No categories yet
                </td>
              </tr>
            )}
            {categories.map((cat) => (
              <tr key={cat.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "0.7rem 0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    {cat.parentId && <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.7rem" }}>└</span>}
                    <Link
                      href={`/admin/categories/${cat.id}/edit`}
                      style={{ color: "#e8e8e8", fontWeight: 700, textDecoration: "none" }}
                    >
                      {cat.name}
                    </Link>
                  </div>
                </td>
                <td style={{ padding: "0.7rem 0.75rem", fontFamily: "monospace", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>
                  {cat.slug}
                </td>
                <td style={{ padding: "0.7rem 0.75rem", color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" }}>
                  {cat.parent?.name ?? <span style={{ color: "rgba(255,255,255,0.15)" }}>Root</span>}
                </td>
                <td style={{ padding: "0.7rem 0.75rem", fontWeight: 700, color: cat._count.products > 0 ? "#e8a020" : "rgba(255,255,255,0.25)" }}>
                  {cat._count.products}
                </td>
                <td style={{ padding: "0.7rem 0.75rem", color: "rgba(255,255,255,0.4)" }}>
                  {cat._count.children}
                </td>
                <td style={{ padding: "0.7rem 0.75rem" }}>
                  <CategoryRowActions categoryId={cat.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}