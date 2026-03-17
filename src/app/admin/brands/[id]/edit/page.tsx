// app/admin/brands/[id]/edit/page.tsx
// Admin: edit an existing brand.

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BrandForm from "@/components/admin/BrandForm";

interface PageProps { params: Promise<{ id: string }>; }

export default async function EditBrandPage({ params }: PageProps) {
  const { id } = await params;
  const brand = await prisma.brand.findUnique({
    where: { id },
    select: { id: true, name: true, slug: true, logoUrl: true },
  });
  if (!brand) notFound();

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
        <Link href="/admin/brands" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: "0.8rem" }}>← Brands</Link>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
        <h1 style={{ fontSize: "1rem", fontWeight: 800, color: "#e8e8e8" }}>{brand.name}</h1>
      </div>
      <BrandForm initialData={{ ...brand, logoUrl: brand.logoUrl ?? "" }} />
    </>
  );
}