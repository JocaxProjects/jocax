// src/app/api/admin/upload/route.ts
//
// POST /api/admin/upload
//
// Accepts:  multipart/form-data  { file: File, folder?: string }
// Returns:  { publicId, secureUrl, width, height, format, bytes }

import { NextRequest, NextResponse }         from "next/server";
import { cloudinary, configureCloudinary, FOLDERS } from "@/lib/cloudinary";
import { requireAdmin }                      from "@/lib/admin-auth";

const MAX_BYTES     = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg", "image/jpg", "image/png",
  "image/webp", "image/avif", "image/gif",
];

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file     = formData.get("file")    as File   | null;
    const folder   = (formData.get("folder") as string) || FOLDERS.PRODUCTS;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported type: ${file.type}. Allowed: JPEG, PNG, WebP, AVIF, GIF` },
        { status: 415 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max: 10 MB` },
        { status: 413 }
      );
    }

    // Convert File → base64 data URI
    const bytes   = await file.arrayBuffer();
    const buffer  = Buffer.from(bytes);
    const base64  = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    // Configure Cloudinary at request time — ensures env vars are fully loaded
    configureCloudinary();

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: "image",
    });

    return NextResponse.json({
      publicId:  result.public_id,
      secureUrl: result.secure_url,
      width:     result.width,
      height:    result.height,
      format:    result.format,
      bytes:     result.bytes,
    });

  } catch (error) {
    console.error("[POST /api/admin/upload]", error);
    return NextResponse.json(
      { error: "Upload failed. Check CLOUDINARY_* environment variables." },
      { status: 500 }
    );
  }
}