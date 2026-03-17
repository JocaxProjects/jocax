"use client";
// components/admin/ProductForm.tsx
//
// Shared product create/edit form.
// Used by:
//   /admin/products/new        → create mode (no initialData)
//   /admin/products/[id]/edit  → edit mode   (initialData populated)
//
//  ✦ react-hook-form + zod validation (unchanged from original)
//  ✦ All original fields preserved exactly as-is
//  ✦ Images section: replaced manual URL rows with Cloudinary drag-and-drop upload
//      - Files upload immediately to POST /api/admin/upload on selection
//      - Returns { publicId, secureUrl } — both stored in RHF field array
//      - publicId saved as cloudinaryPublicId in DB (needed for deletion)
//      - imageUrl (secureUrl) used for all display
//      - Existing images in edit mode pre-load from initialData with their URLs
//  ✦ Submit sends { ...fields, images: [{ publicId, imageUrl, altText, position }] }

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useForm, useFieldArray, SubmitHandler, Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ─── Schema ───────────────────────────────────────────────────────────────────
// imageUrl  = Cloudinary secure_url  (display, stored in DB)
// publicId  = Cloudinary public_id   (deletion, stored in DB as cloudinaryPublicId)

const productSchema = z.object({
  name:             z.string().min(2, "Name is required"),
  slug:             z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  shortDescription: z.string().optional(),
  description:      z.string().optional(),
  price:            z.coerce.number().positive().optional().nullable(),
  currency:         z.string().default("USD"),
  sku:              z.string().optional(),
  modelNumber:      z.string().optional(),
  stockQuantity:    z.coerce.number().int().min(0).default(0),
  isActive:         z.boolean().default(true),
  isFeatured:       z.boolean().default(false),
  brandId:          z.string().optional(),
  categoryId:       z.string().optional(),
  images: z.array(z.object({
    publicId:  z.string(),             // Cloudinary public_id (empty string while uploading)
    imageUrl:  z.string(),             // Cloudinary secure_url
    altText:   z.string().optional(),
    position:  z.coerce.number().int().default(0),
  })).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface InitialImage {
  imageUrl:              string;
  altText?:              string | null;
  position:              number;
  cloudinaryPublicId?:   string | null;  // present when fetched via GET /api/admin/products/[id]
}

interface ProductFormProps {
  initialData?: Partial<Omit<ProductFormValues, "images">> & {
    id?:     string;
    images?: InitialImage[];
  };
  brands:     { id: string; name: string }[];
  categories: { id: string; name: string }[];
}

// ─── Upload state (per-image progress) ───────────────────────────────────────
// Lives outside RHF because it's UI state only, not form data.

interface UploadState {
  fieldIndex: number;    // which RHF images[N] this corresponds to
  uploading:  boolean;
  preview:    string;    // object URL or Cloudinary URL
  error:      string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str: string) {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Generate a unique SKU from a product name.
 * Format: JCX-<ABBREVIATED-NAME>-<4-char random hex>
 * Example: "Vulcan VC44GD Double Deck Oven" → "JCX-VUL-VC4-DDC-OVE-3A9F"
 * The random hex suffix ensures uniqueness even for products with the same name.
 */
function skuFromName(name: string): string {
  const words = name.trim().toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4);
  const abbreviated = words.map(w => w.slice(0, 3)).join("-");
  const suffix = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `JCX-${abbreviated}-${suffix}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductForm({ initialData, brands, categories }: ProductFormProps) {
  const router     = useRouter();
  const isEditing  = !!initialData?.id;
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error,    setError]    = useState("");
  const [slugManual, setSlugManual] = useState(isEditing);
  const [skuManual,  setSkuManual]  = useState(isEditing); // true = user has typed a custom SKU

  // Upload UI state — keyed by field index
  const [uploadStates, setUploadStates] = useState<Record<number, UploadState>>(() => {
    // Pre-load existing images in edit mode
    const initial: Record<number, UploadState> = {};
    (initialData?.images ?? []).forEach((img, i) => {
      initial[i] = {
        fieldIndex: i,
        uploading:  false,
        preview:    img.imageUrl,   // Cloudinary URL used as preview directly
        error:      null,
      };
    });
    return initial;
  });

  // ── RHF setup ──────────────────────────────────────────────────────────────
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<ProductFormValues>({
      resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
      defaultValues: {
        name: "", slug: "", currency: "USD", stockQuantity: 0,
        isActive: true, isFeatured: false,
        ...initialData,
        // Map initialData.images → RHF format (publicId + imageUrl)
        images: (initialData?.images ?? []).map((img, i) => ({
          publicId: img.cloudinaryPublicId ?? "",
          imageUrl: img.imageUrl,
          altText:  img.altText ?? "",
          position: i,
        })),
      },
    });

  const { fields: imageFields, append: addImage, remove: removeImage } =
    useFieldArray({ control, name: "images" });

  // ── Auto slug + auto SKU ──────────────────────────────────────────────────
  const nameValue = watch("name");
  useEffect(() => {
    if (!slugManual) setValue("slug", slugify(nameValue));
    if (!skuManual && nameValue.trim().length >= 2) setValue("sku", skuFromName(nameValue));
  }, [nameValue, slugManual, skuManual, setValue]);

  // ── Image upload ───────────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleFiles(files: FileList) {
    const arr = Array.from(files);

    arr.forEach((file, i) => {
      // Append a placeholder RHF row first — gives us the field index
      const newIndex = imageFields.length + i;
      addImage({ publicId: "", imageUrl: "", altText: "", position: newIndex });

      // Immediately show a local preview
      const localUrl = URL.createObjectURL(file);
      setUploadStates(prev => ({
        ...prev,
        [newIndex]: { fieldIndex: newIndex, uploading: true, preview: localUrl, error: null },
      }));
    });

    // Upload each file in parallel
    await Promise.all(arr.map(async (file, i) => {
      const fieldIdx = imageFields.length + i;
      const fd = new FormData();
      fd.append("file", file);

      try {
        const res  = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();

        if (!res.ok) {
          setUploadStates(prev => ({
            ...prev,
            [fieldIdx]: { ...prev[fieldIdx], uploading: false, error: data.error || "Upload failed" },
          }));
          return;
        }

        // Write Cloudinary values into RHF
        setValue(`images.${fieldIdx}.publicId`,  data.publicId);
        setValue(`images.${fieldIdx}.imageUrl`,  data.secureUrl);
        setValue(`images.${fieldIdx}.position`,  fieldIdx);

        // Update preview to Cloudinary URL and release object URL
        setUploadStates(prev => {
          URL.revokeObjectURL(prev[fieldIdx]?.preview ?? "");
          return {
            ...prev,
            [fieldIdx]: { fieldIndex: fieldIdx, uploading: false, preview: data.secureUrl, error: null },
          };
        });
      } catch {
        setUploadStates(prev => ({
          ...prev,
          [fieldIdx]: { ...prev[fieldIdx], uploading: false, error: "Network error" },
        }));
      }
    }));
  }

  function handleRemove(idx: number) {
    removeImage(idx);
    // Rebuild upload states with shifted indices
    setUploadStates(prev => {
      const next: Record<number, UploadState> = {};
      Object.entries(prev).forEach(([k, v]) => {
        const ki = Number(k);
        if (ki === idx) return;           // removed
        const newIdx = ki > idx ? ki - 1 : ki;
        next[newIdx] = { ...v, fieldIndex: newIdx };
      });
      return next;
    });
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const onSubmit: SubmitHandler<ProductFormValues> = useCallback(async (values) => {
    // Block if any image is still uploading
    const anyUploading = Object.values(uploadStates).some(s => s.uploading);
    if (anyUploading) { setError("Please wait for all images to finish uploading."); return; }

    setSaving(true);
    setError("");
    try {
      // Strip errored / incomplete images before sending
      const cleanImages = (values.images ?? [])
        .filter((img) => img.imageUrl)
        .map((img, i) => ({ ...img, position: i }));

      const url    = isEditing ? `/api/admin/products/${initialData!.id}` : "/api/admin/products";
      const method = isEditing ? "PATCH" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, images: cleanImages }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(typeof d.error === "string" ? d.error : "Save failed");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setSaving(false);
    }
  }, [isEditing, initialData, router, uploadStates]);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async () => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${initialData!.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setDeleting(false);
    }
  }, [initialData, router]);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  const anyUploading = Object.values(uploadStates).some(s => s.uploading);

  return (
    <>
      <style>{`
        /* ── Preserved original styles ── */
        .pf-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .pf-full   { grid-column: 1 / -1; }
        .pf-label  { display: block; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 0.4rem; }
        .pf-input, .pf-select, .pf-textarea {
          width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 7px; padding: 0.55rem 0.8rem; color: #e8e8e8; font-size: 0.82rem;
          outline: none; transition: border-color 140ms ease; box-sizing: border-box;
        }
        .pf-input:focus, .pf-select:focus, .pf-textarea:focus { border-color: rgba(232,160,32,0.5); }
        .pf-textarea { min-height: 110px; resize: vertical; }
        .pf-select option { background: #111114; }
        .pf-error  { font-size: 0.68rem; color: #f87171; margin-top: 0.3rem; }
        .pf-toggle { display: flex; align-items: center; gap: 0.6rem; cursor: pointer; }
        .pf-section { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 1.25rem; margin-bottom: 1.25rem; }
        .pf-section-title { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 1rem; }
        .pf-save-btn {
          background: #e8a020; color: #0a0a0b; font-weight: 800; font-size: 0.82rem;
          padding: 0.65rem 1.75rem; border-radius: 7px; border: none; cursor: pointer;
          transition: opacity 140ms ease; letter-spacing: 0.04em;
        }
        .pf-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .pf-delete-btn {
          background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.25);
          font-weight: 700; font-size: 0.78rem; padding: 0.6rem 1.25rem; border-radius: 7px;
          cursor: pointer; transition: all 140ms ease;
        }
        .pf-delete-btn:hover { background: rgba(248,113,113,0.18); }

        /* ── New: Cloudinary image upload ── */
        @keyframes pf-spin { to { transform: rotate(360deg); } }
        .pf-dropzone {
          border: 2px dashed rgba(255,255,255,0.12); border-radius: 8px;
          padding: 1.75rem 1rem; text-align: center; cursor: pointer;
          transition: border-color 150ms ease, background 150ms ease;
        }
        .pf-dropzone.over {
          border-color: #e8a020; background: rgba(232,160,32,0.05);
        }
        .pf-dropzone:hover { border-color: rgba(255,255,255,0.22); }
        .pf-img-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
          gap: 0.625rem; margin-top: 0.875rem;
        }
        .pf-img-tile {
          position: relative; border-radius: 7px; overflow: hidden;
          border: 1.5px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
        }
        .pf-img-tile-inner { aspect-ratio: 4/3; position: relative; }
        .pf-img-thumb { width: 100%; height: 100%; object-fit: cover; display: block; }
        .pf-img-spinner {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 0.35rem;
        }
        .pf-spinner-ring {
          width: 1.25rem; height: 1.25rem; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.1); border-top-color: #e8a020;
          animation: pf-spin 0.7s linear infinite;
        }
        .pf-img-badge {
          position: absolute; top: 4px; left: 4px;
          font-size: 0.5rem; font-weight: 800; letter-spacing: 0.06em;
          padding: 0.15rem 0.35rem; border-radius: 4px;
        }
        .pf-img-remove {
          position: absolute; top: 4px; right: 4px;
          width: 1.25rem; height: 1.25rem; border-radius: 50%;
          background: rgba(0,0,0,0.65); border: 1px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.8); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; line-height: 1;
        }
        .pf-img-alt {
          padding: 0.25rem 0.35rem;
        }
        .pf-img-alt input {
          width: 100%; box-sizing: border-box;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 4px; padding: 0.2rem 0.375rem;
          font-size: 0.6rem; color: rgba(255,255,255,0.5);
          font-family: inherit; outline: none;
        }
      `}</style>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* ── Core info — UNCHANGED ── */}
        <div className="pf-section">
          <div className="pf-section-title">Core Information</div>
          <div className="pf-grid">
            <div className="pf-full">
              <label className="pf-label">Product Name *</label>
              <input {...register("name")} className="pf-input" placeholder="e.g. Vulcan 60-Inch Convection Oven" />
              {errors.name && <p className="pf-error">{errors.name.message}</p>}
            </div>
            <div>
              <label className="pf-label">Slug *</label>
              <input {...register("slug")} className="pf-input" placeholder="auto-generated"
                onChange={(e) => { setSlugManual(true); register("slug").onChange(e); }} />
              {errors.slug && <p className="pf-error">{errors.slug.message}</p>}
            </div>
            <div>
              <label className="pf-label">
                SKU
                {!skuManual && (
                  <span style={{ marginLeft: "0.4rem", fontSize: "0.58rem", color: "rgba(232,160,32,0.6)", fontWeight: 500, letterSpacing: 0, textTransform: "none" }}>
                    auto-generated
                  </span>
                )}
              </label>
              <input
                {...register("sku")}
                className="pf-input"
                placeholder="Auto-generated from name"
                onChange={(e) => { setSkuManual(true); register("sku").onChange(e); }}
              />
              {!skuManual && (
                <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.25)", marginTop: "0.25rem" }}>
                  Edit to override · unique suffix added automatically
                </p>
              )}
            </div>
            <div>
              <label className="pf-label">Model Number</label>
              <input {...register("modelNumber")} className="pf-input" placeholder="e.g. VC4GD" />
            </div>
            <div className="pf-full">
              <label className="pf-label">Short Description</label>
              <input {...register("shortDescription")} className="pf-input" placeholder="One-line summary shown in listings" />
            </div>
            <div className="pf-full">
              <label className="pf-label">Full Description</label>
              <textarea {...register("description")} className="pf-textarea" placeholder="Detailed product description…" />
            </div>
          </div>
        </div>

        {/* ── Pricing & inventory — UNCHANGED ── */}
        <div className="pf-section">
          <div className="pf-section-title">Pricing & Inventory</div>
          <div className="pf-grid">
            <div>
              <label className="pf-label">Price</label>
              <input {...register("price")} type="number" step="0.01" className="pf-input" placeholder="0.00" />
              {errors.price && <p className="pf-error">{errors.price.message}</p>}
            </div>
            <div>
              <label className="pf-label">Currency</label>
              <select {...register("currency")} className="pf-select">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="KES">KES</option>
              </select>
            </div>
            <div>
              <label className="pf-label">Stock Quantity</label>
              <input {...register("stockQuantity")} type="number" min="0" className="pf-input" />
              {errors.stockQuantity && <p className="pf-error">{errors.stockQuantity.message}</p>}
            </div>
          </div>
        </div>

        {/* ── Classification — UNCHANGED ── */}
        <div className="pf-section">
          <div className="pf-section-title">Classification</div>
          <div className="pf-grid">
            <div>
              <label className="pf-label">Category</label>
              <select {...register("categoryId")} className="pf-select">
                <option value="">— None —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="pf-label">Brand</label>
              <select {...register("brandId")} className="pf-select">
                <option value="">— None —</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── Visibility — UNCHANGED ── */}
        <div className="pf-section">
          <div className="pf-section-title">Visibility</div>
          <div style={{ display: "flex", gap: "2rem" }}>
            <label className="pf-toggle">
              <input {...register("isActive")} type="checkbox" />
              <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                Active (visible to shoppers)
              </span>
            </label>
            <label className="pf-toggle">
              <input {...register("isFeatured")} type="checkbox" />
              <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                Featured (homepage carousel)
              </span>
            </label>
          </div>
        </div>

        {/* ── Images — REPLACED with Cloudinary uploader ── */}
        <div className="pf-section">
          <div className="pf-section-title">
            Product Images
            <span style={{ marginLeft: "0.5rem", fontSize: "0.62rem", color: "rgba(255,255,255,0.2)", fontWeight: 400, letterSpacing: 0, textTransform: "none" }}>
              — uploads directly to Cloudinary on selection
            </span>
          </div>

          {/* Hidden RHF fields — values written programmatically after upload */}
          {imageFields.map((field, idx) => (
            <div key={field.id} style={{ display: "none" }}>
              <input {...register(`images.${idx}.publicId`)} />
              <input {...register(`images.${idx}.imageUrl`)} />
              <input {...register(`images.${idx}.position`)} />
            </div>
          ))}

          {/* Drop zone */}
          <div
            className={`pf-dropzone${dragOver ? " over" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); }}
          >
            <input
              ref={fileInputRef} type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/gif"
              multiple
              style={{ display: "none" }}
              onChange={e => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ""; }}
            />
            <svg style={{ width: "1.75rem", height: "1.75rem", color: "#e8a020", margin: "0 auto 0.5rem", display: "block" }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#e8e8e8", margin: 0 }}>
              Drop images here or{" "}
              <span style={{ color: "#e8a020", textDecoration: "underline" }}>browse</span>
            </p>
            <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.25)", marginTop: "0.25rem" }}>
              JPEG · PNG · WebP · AVIF — max 10 MB per file
            </p>
          </div>

          {/* Preview grid */}
          {imageFields.length > 0 && (
            <div className="pf-img-grid">
              {imageFields.map((field, idx) => {
                const us = uploadStates[idx];
                return (
                  <div key={field.id} className="pf-img-tile">
                    <div className="pf-img-tile-inner">
                      {us?.uploading ? (
                        <div className="pf-img-spinner">
                          <div className="pf-spinner-ring" />
                          <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)" }}>Uploading…</span>
                        </div>
                      ) : us?.error ? (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0.5rem" }}>
                          <span style={{ fontSize: "0.6rem", color: "#f87171", textAlign: "center", lineHeight: 1.4 }}>{us.error}</span>
                        </div>
                      ) : us?.preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={us.preview} alt="" className="pf-img-thumb" />
                      ) : null}

                      {/* Main badge */}
                      {!us?.uploading && !us?.error && (
                        <span className="pf-img-badge" style={{
                          background: idx === 0 ? "#e8a020" : "rgba(0,0,0,0.6)",
                          color:      idx === 0 ? "#0a0a0b" : "rgba(255,255,255,0.7)",
                        }}>
                          {idx === 0 ? "MAIN" : `#${idx + 1}`}
                        </span>
                      )}

                      {/* Remove button */}
                      <button
                        type="button"
                        className="pf-img-remove"
                        onClick={() => handleRemove(idx)}
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>

                    {/* Alt text — wired to RHF */}
                    {!us?.uploading && !us?.error && (
                      <div className="pf-img-alt">
                        <input
                          {...register(`images.${idx}.altText`)}
                          placeholder="Alt text…"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {imageFields.length === 0 && (
            <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.2)", marginTop: "0.75rem" }}>
              No images yet. The first image becomes the main product photo.
            </p>
          )}
        </div>

        {/* ── Actions — UNCHANGED structure, disabled hint added ── */}
        {error && <p style={{ color: "#f87171", fontSize: "0.8rem", marginBottom: "1rem" }}>Error: {error}</p>}

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button type="submit" className="pf-save-btn" disabled={saving || anyUploading}>
            {saving       ? "Saving…"
             : anyUploading ? "Uploading images…"
             : isEditing  ? "Save Changes"
             : "Create Product"}
          </button>
          <button type="button" onClick={() => router.back()} style={{
            background: "none", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "7px", padding: "0.6rem 1.1rem",
            color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
          }}>
            Cancel
          </button>
          {isEditing && (
            <button type="button" className="pf-delete-btn" onClick={handleDelete} disabled={deleting} style={{ marginLeft: "auto" }}>
              {deleting ? "Deleting…" : "Delete Product"}
            </button>
          )}
        </div>

      </form>
    </>
  );
}