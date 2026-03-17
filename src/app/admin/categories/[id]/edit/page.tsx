// app/admin/categories/[id]/edit/page.tsx
//
// Admin: edit an existing category.

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/admin/CategoryForm";

interface PageProps { params: Promise<{ id: string }>; }

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const [category, allCategories] = await Promise.all([
    prisma.category.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true, description: true, parentId: true },
    }),
    prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  if (!category) notFound();

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
        <Link href="/admin/categories" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: "0.8rem" }}>← Categories</Link>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
        <h1 style={{ fontSize: "1rem", fontWeight: 800, color: "#e8e8e8" }}>{category.name}</h1>
      </div>
      <CategoryForm
        initialData={{ ...category, parentId: category.parentId ?? undefined, description: category.description ?? undefined }}
        allCategories={allCategories}
      />
    </>
  );
}