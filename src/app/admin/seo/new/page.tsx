// app/admin/seo/new/page.tsx
// Admin: create a new SEO landing page.

import SeoForm from "@/components/admin/SeoForm";
import Link from "next/link";

export default function NewSeoPage() {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
        <Link href="/admin/seo" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: "0.8rem" }}>← SEO Pages</Link>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
        <h1 style={{ fontSize: "1rem", fontWeight: 800, color: "#e8e8e8" }}>New SEO Page</h1>
      </div>
      <SeoForm />
    </>
  );
}