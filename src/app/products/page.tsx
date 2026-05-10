// src/app/products/page.tsx
//
// Architecture:
//  - This file stays a Server Component (no "use client")
//  - It fetches the initial data on the server for SEO + fast first paint
//  - ProductsClient handles all on-the-fly filtering, sorting, and search
//    via URL state + a /api/products route (no full page reloads)
//
// FIXED (Next.js 15): searchParams is now a Promise — must be awaited before
// accessing any properties. The type reflects this: Promise<{...}>.

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { ProductListItem } from "@/types";
import ProductsClient from "./ProductsClient";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Commercial Kitchen Equipment | Jocax Solutions Limited",
  description:
    "Browse our full catalog of professional commercial kitchen equipment including ovens, fryers, refrigerators, prep tables, and more.",
  openGraph: {
    title: "Commercial Kitchen Equipment | Jocax Solutions Limited",
    description: "Browse our full catalog of professional commercial kitchen equipment.",
    type: "website",
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

// Next.js 15: searchParams is a Promise, not a plain object.
type ResolvedSearchParams = {
  brand?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
  q?: string;
};

interface PageProps {
  searchParams: Promise<ResolvedSearchParams>;
}

const PRODUCTS_PER_PAGE = 24;

// ─── Data Fetching ────────────────────────────────────────────────────────────

// Accepts the already-resolved params object — no Promise here.
async function getProducts(params: ResolvedSearchParams) {
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const skip = (page - 1) * PRODUCTS_PER_PAGE;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(params.brand && { brand: { slug: params.brand } }),
    ...(params.category && { category: { slug: params.category } }),
    ...((params.minPrice || params.maxPrice) && {
      price: {
        ...(params.minPrice && { gte: parseFloat(params.minPrice) }),
        ...(params.maxPrice && { lte: parseFloat(params.maxPrice) }),
      },
    }),
    ...(params.q && {
      OR: [
        { name: { contains: params.q, mode: "insensitive" } },
        { shortDescription: { contains: params.q, mode: "insensitive" } },
      ],
    }),
  };

  const orderBy = (() => {
    switch (params.sort) {
      case "price_asc": return { price: "asc" as const };
      case "price_desc": return { price: "desc" as const };
      case "newest": return { createdAt: "desc" as const };
      default: return { isFeatured: "desc" as const };
    }
  })();

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: PRODUCTS_PER_PAGE,
      orderBy,
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        price: true,
        currency: true,
        isFeatured: true,
        stockQuantity: true,
        brand: { select: { id: true, name: true, slug: true, logoUrl: true } },
        category: { select: { id: true, name: true, slug: true, parentId: true } },
        images: {
          select: { imageUrl: true, altText: true },
          orderBy: { position: "asc" },
          take: 1,
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return { products: products as ProductListItem[], total };
}

async function getFilterOptions() {
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({
      where: { products: { some: { isActive: true } } },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      where: { products: { some: { isActive: true } }, parentId: null },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);
  return { brands, categories };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductsPage({ searchParams }: PageProps) {
  // ✅ Await the Promise before passing resolved params to anything.
  // All downstream code (getProducts, ProductsClient) receives a plain object.
  const params = await searchParams;

  const [{ products, total }, { brands, categories }] = await Promise.all([
    getProducts(params),
    getFilterOptions(),
  ]);

  return (
    <ProductsClient
      initialProducts={products}
      initialTotal={total}
      brands={brands}
      categories={categories}
      searchParams={params}
    />
  );
}