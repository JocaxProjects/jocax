// services/productService.ts

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GetProductsOptions {
  page?: number;
  limit?: number;
  categorySlug?: string;
  brandSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "featured" | "newest" | "price_asc" | "price_desc";
  search?: string;
}

export interface GetProductsResult {
  products: ProductListItem[];
  total: number;
  page: number;
  totalPages: number;
}

export type ProductListItem = Prisma.ProductGetPayload<{
  select: {
    id: true;
    name: true;
    slug: true;
    shortDescription: true;
    price: true;
    currency: true;
    isFeatured: true;
    stockQuantity: true;
    brand: { select: { name: true; slug: true } };
    category: { select: { name: true; slug: true } };
    images: { select: { imageUrl: true; altText: true } };
  };
}>;

export type ProductDetail = Prisma.ProductGetPayload<{
  include: {
    brand: { select: { name: true; slug: true; logoUrl: true } };
    category: { select: { name: true; slug: true } };
    images: true;
    attributes: {
      include: { attribute: { select: { name: true; unit: true } } };
    };
    variants: true;
    documents: true;
  };
}>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DEFAULT_LIMIT = 24;

function buildOrderBy(
  sort: GetProductsOptions["sort"]
): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "newest":
      return { createdAt: "desc" };
    case "featured":
    default:
      return { isFeatured: "desc" };
  }
}

function buildWhereClause(
  opts: GetProductsOptions
): Prisma.ProductWhereInput {
  return {
    isActive: true,
    ...(opts.categorySlug && {
      category: { slug: opts.categorySlug },
    }),
    ...(opts.brandSlug && {
      brand: { slug: opts.brandSlug },
    }),
    ...((opts.minPrice !== undefined || opts.maxPrice !== undefined) && {
      price: {
        ...(opts.minPrice !== undefined && { gte: opts.minPrice }),
        ...(opts.maxPrice !== undefined && { lte: opts.maxPrice }),
      },
    }),
    ...(opts.search && {
      OR: [
        { name: { contains: opts.search, mode: "insensitive" } },
        { shortDescription: { contains: opts.search, mode: "insensitive" } },
        { description: { contains: opts.search, mode: "insensitive" } },
        { sku: { contains: opts.search, mode: "insensitive" } },
        { modelNumber: { contains: opts.search, mode: "insensitive" } },
      ],
    }),
  };
}

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * Fetch a paginated list of active products with optional filters and sorting.
 */
export async function getProducts(
  opts: GetProductsOptions = {}
): Promise<GetProductsResult> {
  const page = Math.max(1, opts.page ?? 1);
  const limit = opts.limit ?? DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  const where = buildWhereClause(opts);
  const orderBy = buildOrderBy(opts.sort);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
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
        brand: { select: { name: true, slug: true } },
        category: { select: { name: true, slug: true } },
        images: {
          select: { imageUrl: true, altText: true },
          orderBy: { position: "asc" },
          take: 1,
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Fetch a single active product by slug including all relations.
 */
export async function getProductBySlug(
  slug: string
): Promise<ProductDetail | null> {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      brand: { select: { name: true, slug: true, logoUrl: true } },
      category: { select: { name: true, slug: true } },
      images: { orderBy: { position: "asc" } },
      attributes: {
        include: {
          attribute: { select: { name: true, unit: true } },
        },
      },
      variants: true,
      documents: true,
    },
  });
}

/**
 * Fetch featured products for homepage or promotional sections.
 */
export async function getFeaturedProducts(limit = 8): Promise<ProductListItem[]> {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      shortDescription: true,
      price: true,
      currency: true,
      isFeatured: true,
      stockQuantity: true,
      brand: { select: { name: true, slug: true } },
      category: { select: { name: true, slug: true } },
      images: {
        select: { imageUrl: true, altText: true },
        orderBy: { position: "asc" },
        take: 1,
      },
    },
  });
}

/**
 * Fetch related products from the same category, excluding the current product.
 */
export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4
): Promise<ProductListItem[]> {
  return prisma.product.findMany({
    where: {
      isActive: true,
      categoryId,
      id: { not: excludeId },
    },
    take: limit,
    orderBy: { isFeatured: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      shortDescription: true,
      price: true,
      currency: true,
      isFeatured: true,
      stockQuantity: true,
      brand: { select: { name: true, slug: true } },
      category: { select: { name: true, slug: true } },
      images: {
        select: { imageUrl: true, altText: true },
        orderBy: { position: "asc" },
        take: 1,
      },
    },
  });
}

/**
 * Fetch all active product slugs for static generation (generateStaticParams).
 */
export async function getAllProductSlugs(): Promise<{ slug: string }[]> {
  return prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
}

/**
 * Fetch all brands that have at least one active product.
 */
export async function getActiveBrands() {
  return prisma.brand.findMany({
    where: { products: { some: { isActive: true } } },
    select: { id: true, name: true, slug: true, logoUrl: true },
    orderBy: { name: "asc" },
  });
}

/**
 * Fetch total product count — useful for admin dashboards.
 */
export async function getProductCount(activeOnly = true): Promise<number> {
  return prisma.product.count({
    where: activeOnly ? { isActive: true } : undefined,
  });
}