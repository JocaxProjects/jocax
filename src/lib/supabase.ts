// lib/supabase.ts

import { createClient } from "@supabase/supabase-js";

// ─── Validation ───────────────────────────────────────────────────────────────

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable: SUPABASE_URL");
}
if (!supabaseAnonKey) {
  throw new Error("Missing environment variable: SUPABASE_ANON_KEY");
}

// ─── Public Client (anon key) ─────────────────────────────────────────────────
// Safe to use in browser and server components.
// Respects Row Level Security policies.

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// ─── Admin Client (service role key) ─────────────────────────────────────────
// Bypasses Row Level Security — only use in trusted server-side contexts
// such as Server Actions, API routes, and admin operations.
// NEVER expose this client to the browser.

export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

// ─── Storage Helpers ──────────────────────────────────────────────────────────

const PRODUCT_IMAGES_BUCKET = "product-images";
const DOCUMENTS_BUCKET = "product-documents";

/**
 * Upload a product image to Supabase Storage.
 * Returns the public URL of the uploaded file.
 */
export async function uploadProductImage(
  file: File,
  path: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload product image: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Upload a product document (PDF, spec sheet, etc.) to Supabase Storage.
 * Returns the public URL of the uploaded file.
 */
export async function uploadProductDocument(
  file: File,
  path: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload product document: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(DOCUMENTS_BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Delete a file from Supabase Storage by its path.
 */
export async function deleteStorageFile(
  bucket: string,
  path: string
): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    throw new Error(`Failed to delete file from storage: ${error.message}`);
  }
}

/**
 * Get a signed URL for a private file (expires after the given number of seconds).
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error || !data) {
    throw new Error(`Failed to create signed URL: ${error?.message}`);
  }

  return data.signedUrl;
}