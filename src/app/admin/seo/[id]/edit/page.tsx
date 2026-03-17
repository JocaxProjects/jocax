// app/admin/seo/[id]/edit/page.tsx
// Admin: edit an existing SEO landing page.

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SeoForm from "@/components/admin/SeoForm";

interface PageProps { params: Promise<{ id: string }>; }

export default async function EditSeoPage({ params }: PageProps) {
  const { id } = await params;
  const page = await prisma.seoPage.findUnique({
    where: { id },
    select: { id: true, title: true, slug: true, metaDescription: true, content: true },
  });
  if (!page) notFound();

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
        <Link href="/admin/seo" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: "0.8rem" }}>← SEO Pages</Link>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
        <h1 style={{ fontSize: "1rem", fontWeight: 800, color: "#e8e8e8" }}>{page.title}</h1>
      </div>
      <SeoForm initialData={{ ...page, metaDescription: page.metaDescription ?? "", content: page.content ?? "" }} />
    </>
  );
}