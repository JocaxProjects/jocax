// app/admin/products/[id]/edit/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  const [product, brands, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        description: true,
        price: true,
        currency: true,
        sku: true,
        modelNumber: true,
        stockQuantity: true,
        isActive: true,
        isFeatured: true,
        brandId: true,
        categoryId: true,
        images: {
          select: {
            imageUrl: true,
            altText: true,
            position: true,
          },
          orderBy: { position: "asc" },
        },
      },
    }),
    prisma.brand.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return { product, brands, categories };
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  const { product, brands, categories } = await getProduct(id);

  if (!product) notFound();

  // Convert null → undefined for form compatibility
  const initialData = {
    ...product,
    description: product.description ?? undefined,
    shortDescription: product.shortDescription ?? undefined,
    sku: product.sku ?? undefined,
    modelNumber: product.modelNumber ?? undefined,
    brandId: product.brandId ?? undefined,
    categoryId: product.categoryId ?? undefined,
    price: product.price ?? undefined,
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "1.75rem",
        }}
      >
        <Link
          href="/admin/products"
          style={{
            color: "rgba(255,255,255,0.3)",
            textDecoration: "none",
            fontSize: "0.8rem",
          }}
        >
          ← Products
        </Link>

        <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>

        <h1
          style={{
            fontSize: "1rem",
            fontWeight: 800,
            color: "#e8e8e8",
          }}
        >
          {product.name}
        </h1>

        <a
          href={`/products/${product.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginLeft: "auto",
            fontSize: "0.72rem",
            color: "rgba(255,255,255,0.3)",
            textDecoration: "none",
          }}
        >
          View on site ↗
        </a>
      </div>

      <ProductForm
        initialData={initialData}
        brands={brands}
        categories={categories}
      />
    </>
  );
}