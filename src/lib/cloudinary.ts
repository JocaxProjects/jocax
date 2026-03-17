// lib/cloudinary.ts

import { v2 as cloudinary } from "cloudinary";

// ─── Configuration ────────────────────────────────────────────────────────────
//
// IMPORTANT: config() is called as a function rather than at module-level so
// that it runs at request time — after Next.js has fully loaded the .env vars.
// Calling cloudinary.config() at module import time in the App Router can
// produce an empty api_secret (env not yet resolved), which generates an
// Invalid Signature 401 even when the .env values are correct.
//
// Call configureCloudinary() at the top of any server function that uses the
// Cloudinary SDK before making any uploader/api calls.

export function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    api_key:    process.env.CLOUDINARY_API_KEY    ?? "",
    api_secret: process.env.CLOUDINARY_API_SECRET ?? "",
    secure:     true,
  });
}

// Re-export the configured instance for use after configureCloudinary() is called
export { cloudinary };

// ─── Folders ──────────────────────────────────────────────────────────────────

export const FOLDERS = {
  PRODUCTS:   "jocax/products",
  BRANDS:     "jocax/brands",
  CATEGORIES: "jocax/categories",
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UploadResult {
  publicId:  string;
  secureUrl: string;
  width:     number;
  height:    number;
  format:    string;
  bytes:     number;
}

export interface CloudinaryTransformation {
  width?:   number;
  height?:  number;
  crop?:    "fill" | "fit" | "limit" | "scale" | "thumb" | "pad";
  quality?: "auto" | number;
  format?:  "auto" | "webp" | "avif" | "jpg" | "png";
  gravity?: "auto" | "face" | "center";
}

// ─── Upload ───────────────────────────────────────────────────────────────────

/**
 * Upload a product image from a base64 data URI or remote URL.
 * Calls configureCloudinary() internally — safe to call from any context.
 */
export async function uploadProductImage(
  source: string,
  options?: { publicId?: string; overwrite?: boolean }
): Promise<UploadResult> {
  configureCloudinary();
  const result = await cloudinary.uploader.upload(source, {
    folder:        FOLDERS.PRODUCTS,
    public_id:     options?.publicId,
    overwrite:     options?.overwrite ?? false,
    resource_type: "image",
  });
  return {
    publicId:  result.public_id,
    secureUrl: result.secure_url,
    width:     result.width,
    height:    result.height,
    format:    result.format,
    bytes:     result.bytes,
  };
}

/**
 * Upload a brand logo.
 */
export async function uploadBrandLogo(
  source: string,
  brandSlug: string
): Promise<UploadResult> {
  configureCloudinary();
  const result = await cloudinary.uploader.upload(source, {
    folder:        FOLDERS.BRANDS,
    public_id:     brandSlug,
    overwrite:     true,
    resource_type: "image",
  });
  return {
    publicId:  result.public_id,
    secureUrl: result.secure_url,
    width:     result.width,
    height:    result.height,
    format:    result.format,
    bytes:     result.bytes,
  };
}

/**
 * Delete an image from Cloudinary by its public ID.
 */
export async function deleteImage(publicId: string): Promise<void> {
  configureCloudinary();
  const result = await cloudinary.uploader.destroy(publicId);
  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(`Failed to delete image: ${publicId}`);
  }
}

// ─── URL Generation ───────────────────────────────────────────────────────────

/**
 * Generate an optimized Cloudinary URL with transformations.
 * Use this in components when you need a custom-sized image URL.
 *
 * @example
 * getImageUrl("jocax/products/abc123", { width: 800, height: 600, crop: "fill" })
 */
export function getImageUrl(
  publicId: string,
  transformations: CloudinaryTransformation = {}
): string {
  configureCloudinary();
  return cloudinary.url(publicId, {
    secure:       true,
    quality:      transformations.quality ?? "auto",
    fetch_format: transformations.format  ?? "auto",
    width:        transformations.width,
    height:       transformations.height,
    crop:         transformations.crop,
    gravity:      transformations.gravity,
  });
}

/**
 * Generate a thumbnail URL for product listing cards.
 */
export function getProductThumbnail(publicId: string): string {
  return getImageUrl(publicId, {
    width:   400,
    height:  300,
    crop:    "pad",
    quality: "auto",
    format:  "auto",
  });
}

/**
 * Generate a full-size URL for product detail pages.
 */
export function getProductDetailImage(publicId: string): string {
  return getImageUrl(publicId, {
    width:   900,
    height:  900,
    crop:    "pad",
    quality: "auto",
    format:  "auto",
  });
}

/**
 * Extract the Cloudinary public ID from a full secure URL.
 * Useful when you store the full URL in the DB and need to delete by public ID.
 */
export function extractPublicId(secureUrl: string): string {
  const match = secureUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
  if (!match) throw new Error(`Could not extract public ID from URL: ${secureUrl}`);
  return match[1];
}