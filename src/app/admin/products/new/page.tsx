// app/admin/products/new/page.tsx
//
// Admin: create a new product.
// Loads brands and categories server-side, then renders the shared ProductForm
// in create mode (no initialData passed).

import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";

async function getSelectData() {
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  return { brands, categories };
}

export default async function NewProductPage() {
  const { brands, categories } = await getSelectData();

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
        <Link href="/admin/products" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: "0.8rem" }}>
          ← Products
        </Link>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
        <h1 style={{ fontSize: "1rem", fontWeight: 800, color: "#e8e8e8" }}>New Product</h1>
      </div>

      <ProductForm brands={brands} categories={categories} />
    </>
  );
}