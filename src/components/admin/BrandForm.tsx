"use client";
// components/admin/BrandForm.tsx
//
// Shared form for creating and editing brands.
//  ✦ Fields: name, slug (auto-generated), logoUrl
//  ✦ POST to /api/admin/brands or PATCH to /api/admin/brands/[id]

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const brandSchema = z.object({
  name:    z.string().min(2, "Name is required"),
  slug:    z.string().min(2).regex(/^[a-z0-9-]+$/, "Lowercase, numbers, hyphens only"),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandFormProps {
  initialData?: Partial<BrandFormValues> & { id?: string };
}

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

export default function BrandForm({ initialData }: BrandFormProps) {
  const router     = useRouter();
  const isEditing  = !!initialData?.id;
  const [saving,   setSaving]     = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [error,    setError]      = useState("");
  const [slugManual, setSlugManual] = useState(isEditing);

  const { register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<BrandFormValues>({ resolver: zodResolver(brandSchema), defaultValues: { name: "", slug: "", logoUrl: "", ...initialData } });

  const nameValue = watch("name");
  useEffect(() => { if (!slugManual) setValue("slug", slugify(nameValue)); }, [nameValue, slugManual, setValue]);

  const onSubmit = useCallback(async (values: BrandFormValues) => {
    setSaving(true); setError("");
    try {
      const url    = isEditing ? `/api/admin/brands/${initialData!.id}` : "/api/admin/brands";
      const method = isEditing ? "PATCH" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Save failed"); }
      router.push("/admin/brands"); router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally { setSaving(false); }
  }, [isEditing, initialData, router]);

  const handleDelete = useCallback(async () => {
    if (!confirm("Delete this brand?")) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/brands/${initialData!.id}`, { method: "DELETE" });
      router.push("/admin/brands"); router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally { setDeleting(false); }
  }, [initialData, router]);

  const f: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "7px", padding: "0.55rem 0.8rem", color: "#e8e8e8", fontSize: "0.82rem", outline: "none", boxSizing: "border-box" };
  const l: React.CSSProperties = { display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" as const, marginBottom: "0.4rem" };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "1.5rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={l}>Brand Name *</label>
            <input {...register("name")} style={f} placeholder="e.g. Vulcan" />
            {errors.name && <p style={{ color: "#f87171", fontSize: "0.68rem", marginTop: "0.3rem" }}>{errors.name.message}</p>}
          </div>
          <div>
            <label style={l}>Slug *</label>
            <input {...register("slug")} style={f} placeholder="vulcan"
              onChange={(e) => { setSlugManual(true); register("slug").onChange(e); }} />
            {errors.slug && <p style={{ color: "#f87171", fontSize: "0.68rem", marginTop: "0.3rem" }}>{errors.slug.message}</p>}
          </div>
          <div>
            <label style={l}>Logo URL</label>
            <input {...register("logoUrl")} style={f} placeholder="https://…" />
            {errors.logoUrl && <p style={{ color: "#f87171", fontSize: "0.68rem", marginTop: "0.3rem" }}>{errors.logoUrl.message}</p>}
          </div>
        </div>
      </div>

      {error && <p style={{ color: "#f87171", fontSize: "0.8rem", marginBottom: "1rem" }}>Error: {error}</p>}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <button type="submit" disabled={saving} style={{ background: "#e8a020", color: "#0a0a0b", fontWeight: 800, fontSize: "0.82rem", padding: "0.65rem 1.75rem", borderRadius: "7px", border: "none", cursor: "pointer", opacity: saving ? 0.5 : 1 }}>
          {saving ? "Saving…" : isEditing ? "Save Changes" : "Create Brand"}
        </button>
        <button type="button" onClick={() => router.back()} style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "7px", padding: "0.6rem 1.1rem", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
          Cancel
        </button>
        {isEditing && (
          <button type="button" onClick={handleDelete} disabled={deleting} style={{ marginLeft: "auto", background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)", fontWeight: 700, fontSize: "0.78rem", padding: "0.6rem 1.25rem", borderRadius: "7px", cursor: "pointer" }}>
            {deleting ? "Deleting…" : "Delete Brand"}
          </button>
        )}
      </div>
    </form>
  );
}