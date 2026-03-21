// app/admin/categories/new/page.tsx

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/admin/CategoryForm";

export default async function NewCategoryPage() {
  const allCategories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
        <Link
          href="/admin/categories"
          style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: "0.8rem" }}
        >
          ← Categories
        </Link>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
        <h1 style={{ fontSize: "1rem", fontWeight: 800, color: "#e8e8e8" }}>New Category</h1>
      </div>
      <CategoryForm allCategories={allCategories} />
    </>
  );
}