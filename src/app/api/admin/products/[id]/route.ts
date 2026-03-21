// src/app/api/admin/products/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma }       from "@/lib/prisma";
import { z }            from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteImage }  from "@/lib/cloudinary";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Coerce empty string → null */
const nullableString = z.string().transform((v) => v === "" ? null : v).nullable().optional();

const imageSchema = z.object({
  publicId:  z.string(), // allow empty — we'll derive from URL if blank
  imageUrl:  z.string().url(),
  altText:   nullableString,
  position:  z.coerce.number().int().default(0),
});

const updateSchema = z.object({
  name:             z.string().min(2).optional(),
  slug:             z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
  shortDescription: nullableString,
  description:      nullableString,
  price:            z.coerce.number().positive().optional().nullable(),
  currency:         z.string().optional(),
  sku:              nullableString,
  modelNumber:      nullableString,
  stockQuantity:    z.coerce.number().int().min(0).optional(),
  isActive:         z.boolean().optional(),
  isFeatured:       z.boolean().optional(),
  brandId:          nullableString,
  categoryId:       nullableString,
  images:           z.array(imageSchema).optional(),
});

/** Derive Cloudinary public ID from URL if publicId is blank.
 *  e.g. https://res.cloudinary.com/demo/image/upload/v123/folder/file.png → folder/file
 */
function extractPublicId(publicId: string, imageUrl: string): string {
  if (publicId.trim()) return publicId.trim();
  try {
    const url = new URL(imageUrl);
    const parts = url.pathname.split("/upload/");
    if (parts[1]) {
      return parts[1].replace(/^v\d+\//, "").replace(/\.[^.]+$/, "");
    }
  } catch {}
  return imageUrl; // fallback — won't be used for deletion but won't break
}

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
    console.error("❌ Validation errors:", JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const { images, ...data } = parsed.data;

  // Slug uniqueness check
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
            cloudinaryPublicId: extractPublicId(img.publicId, img.imageUrl),
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

  const images = await prisma.productImage.findMany({
    where:  { productId: id },
    select: { cloudinaryPublicId: true },
  });

  await purgeCloudinaryImages(images);

  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ deleted: true });
}