// app/admin/brands/new/page.tsx
// Admin: create a new brand.

import BrandForm from "@/components/admin/BrandForm";
import Link from "next/link";

export default function NewBrandPage() {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
        <Link href="/admin/brands" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: "0.8rem" }}>← Brands</Link>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
        <h1 style={{ fontSize: "1rem", fontWeight: 800, color: "#e8e8e8" }}>New Brand</h1>
      </div>
      <BrandForm />
    </>
  );
}