// src/app/products/page.tsx
//
// Architecture:
//  - This file stays a Server Component (no "use client")
//  - It fetches the initial data on the server for SEO + fast first paint
//  - ProductsClient handles all on-the-fly filtering, sorting, and search
//    via URL state + a /api/products route (no full page reloads)

// src/app/products/page.tsx

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { ProductListItem } from "@/types";
import ProductsClient from "./ProductsClient";
// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Commercial Kitchen Equipment | Jocax Solutions",
  description:
    "Browse our full catalog of professional commercial kitchen equipment including ovens, fryers, refrigerators, prep tables, and more.",
  openGraph: {
    title:       "Commercial Kitchen Equipment | Jocax Solutions",
    description: "Browse our full catalog of professional commercial kitchen equipment.",
    type:        "website",
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: {
    brand?:     string;
    category?:  string;
    minPrice?:  string;
    maxPrice?:  string;
    sort?:      string;
    page?:      string;
    q?:         string;
  };
}

const PRODUCTS_PER_PAGE = 24;

// ─── Data Fetching ────────────────────────────────────────────────────────────

async function getProducts(searchParams: PageProps["searchParams"]) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const skip = (page - 1) * PRODUCTS_PER_PAGE;

 const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(searchParams.brand    && { brand:    { slug: searchParams.brand    } }),
    ...(searchParams.category && { category: { slug: searchParams.category } }),
    ...((searchParams.minPrice || searchParams.maxPrice) && {
      price: {
        ...(searchParams.minPrice && { gte: parseFloat(searchParams.minPrice) }),
        ...(searchParams.maxPrice && { lte: parseFloat(searchParams.maxPrice) }),
      },
    }),
    ...(searchParams.q && {
      OR: [
        { name:             { contains: searchParams.q, mode: "insensitive" } },
        { shortDescription: { contains: searchParams.q, mode: "insensitive" } },
      ],
    }),
  };

  const orderBy = (() => {
    switch (searchParams.sort) {
      case "price_asc":  return { price:      "asc"  as const };
      case "price_desc": return { price:      "desc" as const };
      case "newest":     return { createdAt:  "desc" as const };
      default:           return { isFeatured: "desc" as const };
    }
  })();

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take:    PRODUCTS_PER_PAGE,
      orderBy,
      select: {
        id:               true,
        name:             true,
        slug:             true,
        shortDescription: true,
        price:            true,
        currency:         true,
        isFeatured:       true,
        stockQuantity:    true,
        brand:    { select: { id: true, name: true, slug: true, logoUrl: true } },
        category: { select: { id: true, name: true, slug: true, parentId: true } },
        images: {
          select:  { imageUrl: true, altText: true },
          orderBy: { position: "asc" },
          take:    1,
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
      where:   { products: { some: { isActive: true } } },
      select:  { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      where:   { products: { some: { isActive: true } }, parentId: null },
      select:  { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);
  return { brands, categories };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductsPage({ searchParams }: PageProps) {
  const [{ products, total }, { brands, categories }] = await Promise.all([
    getProducts(searchParams),
    getFilterOptions(),
  ]);

  return (
    <ProductsClient
      initialProducts={products}
      initialTotal={total}
      brands={brands}
      categories={categories}
      searchParams={searchParams}
    />
  );
}