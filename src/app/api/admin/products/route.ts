// src/app/api/admin/products/route.ts
//
// GET  /api/admin/products  — paginated product list (admin table)
// POST /api/admin/products  — create a new product with Cloudinary images
//
// Image contract (POST body):
//   images: [{ publicId: string, imageUrl: string, altText?: string, position: number }]
//   - publicId  → stored as cloudinaryPublicId in ProductImage (needed for deletion)
//   - imageUrl  → Cloudinary secure_url, used for all display across the site

import { NextRequest, NextResponse } from "next/server";
import { prisma }       from "@/lib/prisma";
import { z }            from "zod";
import { requireAdmin } from "@/lib/admin-auth";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const imageSchema = z.object({
  publicId:  z.string().min(1),          // Cloudinary public_id
  imageUrl:  z.string().url(),           // Cloudinary secure_url
  altText:   z.string().optional(),
  position:  z.coerce.number().int().default(0),
});

const createSchema = z.object({
  name:             z.string().min(2),
  slug:             z.string().min(2).regex(/^[a-z0-9-]+$/),
  shortDescription: z.string().optional().nullable(),
  description:      z.string().optional().nullable(),
  price:            z.coerce.number().positive().optional().nullable(),
  currency:         z.string().default("USD"),
  sku:              z.string().optional().nullable(),
  modelNumber:      z.string().optional().nullable(),
  stockQuantity:    z.coerce.number().int().min(0).default(0),
  isActive:         z.boolean().default(true),
  isFeatured:       z.boolean().default(false),
  brandId:          z.string().optional().nullable(),
  categoryId:       z.string().optional().nullable(),
  images:           z.array(imageSchema).optional(),
});

// ─── GET — list ───────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const take = 20;
  const skip = (page - 1) * take;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip, take,
      orderBy: { createdAt: "desc" },
      include: {
        brand:    true,
        category: true,
        images:   { take: 1, orderBy: { position: "asc" } },
      },
    }),
    prisma.product.count(),
  ]);

  return NextResponse.json({ products, total, page });
}

// ─── POST — create ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const { images, ...data } = parsed.data;

  // Slug uniqueness check
  const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const product = await prisma.product.create({
    data: {
      ...data,
      brandId:    data.brandId    || null,
      categoryId: data.categoryId || null,
      images: images?.length
        ? {
            create: images.map((img) => ({
              imageUrl:           img.imageUrl,   // Cloudinary secure_url
              cloudinaryPublicId: img.publicId,   // Cloudinary public_id
              altText:            img.altText ?? null,
              position:           img.position,
            })),
          }
        : undefined,
    },
    include: {
      brand:    true,
      category: true,
      images:   { orderBy: { position: "asc" } },
    },
  });

  return NextResponse.json(product, { status: 201 });
}