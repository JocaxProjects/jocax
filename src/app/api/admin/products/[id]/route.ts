// src/app/api/admin/products/[id]/route.ts
//
// GET    /api/admin/products/[id] — fetch full product for edit form
// PATCH  /api/admin/products/[id] — partial update (fields + image replacement)
// DELETE /api/admin/products/[id] — hard delete (cascades in DB, cleans Cloudinary)
//
// PATCH image replacement:
//   When `images` is present in the PATCH body, this route:
//     1. Reads existing images to collect their cloudinaryPublicId values
//     2. Deletes old images from Cloudinary (best-effort, non-blocking)
//     3. Replaces all ProductImage rows in a transaction
//     4. Creates new rows with { imageUrl, cloudinaryPublicId, altText, position }
//
// DELETE:
//   Deletes all Cloudinary files for the product's images before removing
//   the DB record (cascade handles the ProductImage rows).

import { NextRequest, NextResponse } from "next/server";
import { prisma }       from "@/lib/prisma";
import { z }            from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteImage }  from "@/lib/cloudinary";

// ─── Schema ───────────────────────────────────────────────────────────────────

const imageSchema = z.object({
  publicId:  z.string().min(1),
  imageUrl:  z.string().url(),
  altText:   z.string().optional().nullable(),
  position:  z.coerce.number().int().default(0),
});

const updateSchema = z.object({
  name:             z.string().min(2).optional(),
  slug:             z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
  shortDescription: z.string().optional().nullable(),
  description:      z.string().optional().nullable(),
  price:            z.coerce.number().positive().optional().nullable(),
  currency:         z.string().optional(),
  sku:              z.string().optional().nullable(),
  modelNumber:      z.string().optional().nullable(),
  stockQuantity:    z.coerce.number().int().min(0).optional(),
  isActive:         z.boolean().optional(),
  isFeatured:       z.boolean().optional(),
  brandId:          z.string().optional().nullable(),
  categoryId:       z.string().optional().nullable(),
  images:           z.array(imageSchema).optional(),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Delete Cloudinary files for a list of image rows — best-effort, logs warnings. */
async function purgeCloudinaryImages(
  images: { cloudinaryPublicId: string | null }[]
) {
  await Promise.allSettled(
    images
      .filter((img) => img.cloudinaryPublicId)
      .map((img) =>
        deleteImage(img.cloudinaryPublicId!).catch((e) =>
          console.warn(`[Cloudinary] Failed to delete ${img.cloudinaryPublicId}:`, e)
        )
      )
  );
}

// ─── GET ──────────────────────────────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      brand:      true,
      category:   true,
      images:     { orderBy: { position: "asc" } },
      attributes: { include: { attribute: true } },
      variants:   true,
      documents:  true,
    },
  });

  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

// ─── PATCH ────────────────────────────────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const { images, ...data } = parsed.data;

  // Slug uniqueness check (skip if slug not changing)
  if (data.slug) {
    const conflict = await prisma.product.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });
    if (conflict) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
  }

  // When images are being replaced, delete old Cloudinary files first
  if (images !== undefined) {
    const oldImages = await prisma.productImage.findMany({
      where:  { productId: id },
      select: { cloudinaryPublicId: true },
    });
    await purgeCloudinaryImages(oldImages);
  }

  // Replace images + update product fields in one transaction
  const product = await prisma.$transaction(async (tx) => {
    if (images !== undefined) {
      await tx.productImage.deleteMany({ where: { productId: id } });
      if (images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((img) => ({
            productId:          id,
            imageUrl:           img.imageUrl,
            cloudinaryPublicId: img.publicId,
            altText:            img.altText ?? null,
            position:           img.position,
          })),
        });
      }
    }

    return tx.product.update({
      where: { id },
      data,
      include: {
        brand:    true,
        category: true,
        images:   { orderBy: { position: "asc" } },
      },
    });
  });

  return NextResponse.json(product);
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Collect Cloudinary public IDs before deleting the DB record
  const images = await prisma.productImage.findMany({
    where:  { productId: id },
    select: { cloudinaryPublicId: true },
  });

  // Delete from Cloudinary (best-effort — don't let this block the DB delete)
  await purgeCloudinaryImages(images);

  // Hard delete — DB cascade removes ProductImage, Variant, Attribute, Document rows
  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ deleted: true });
}