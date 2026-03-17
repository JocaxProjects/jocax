"use client";
// components/admin/CategoryForm.tsx
//
// Shared form for creating and editing categories.
//  ✦ Fields: name, slug (auto-generated), description, parentId
//  ✦ Parent category select excludes itself to prevent circular hierarchy
//  ✦ POST to /api/admin/categories or PATCH to /api/admin/categories/[id]

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const categorySchema = z.object({
  name:        z.string().min(2, "Name is required"),
  slug:        z.string().min(2).regex(/^[a-z0-9-]+$/, "Lowercase, numbers, hyphens only"),
  description: z.string().optional(),
  parentId:    z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialData?: Partial<CategoryFormValues> & { id?: string };
  allCategories: { id: string; name: string }[];
}

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

export default function CategoryForm({ initialData, allCategories }: CategoryFormProps) {
  const router     = useRouter();
  const isEditing  = !!initialData?.id;
  const [saving,   setSaving]     = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [error,    setError]      = useState("");
  const [slugManual, setSlugManual] = useState(isEditing);

  const { register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<CategoryFormValues>({
      resolver: zodResolver(categorySchema),
      defaultValues: { name: "", slug: "", ...initialData },
    });

  const nameValue = watch("name");
  useEffect(() => {
    if (!slugManual) setValue("slug", slugify(nameValue));
  }, [nameValue, slugManual, setValue]);

  const onSubmit = useCallback(async (values: CategoryFormValues) => {
    setSaving(true); setError("");
    try {
      const url    = isEditing ? `/api/admin/categories/${initialData!.id}` : "/api/admin/categories";
      const method = isEditing ? "PATCH" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Save failed"); }
      router.push("/admin/categories");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally { setSaving(false); }
  }, [isEditing, initialData, router]);

  const handleDelete = useCallback(async () => {
    if (!confirm("Delete this category? Products will be unassigned.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${initialData!.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/admin/categories"); router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally { setDeleting(false); }
  }, [initialData, router]);

  const parentOptions = allCategories.filter((c) => c.id !== initialData?.id);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "1.5rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.4rem" }}>
              Category Name *
            </label>
            <input {...register("name")} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "7px", padding: "0.55rem 0.8rem", color: "#e8e8e8", fontSize: "0.82rem", outline: "none", boxSizing: "border-box" }} placeholder="e.g. Commercial Ovens" />
            {errors.name && <p style={{ color: "#f87171", fontSize: "0.68rem", marginTop: "0.3rem" }}>{errors.name.message}</p>}
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.4rem" }}>
              Slug *
            </label>
            <input {...register("slug")} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "7px", padding: "0.55rem 0.8rem", color: "#e8e8e8", fontSize: "0.82rem", outline: "none", boxSizing: "border-box" }} placeholder="commercial-ovens"
              onChange={(e) => { setSlugManual(true); register("slug").onChange(e); }} />
            {errors.slug && <p style={{ color: "#f87171", fontSize: "0.68rem", marginTop: "0.3rem" }}>{errors.slug.message}</p>}
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.4rem" }}>
              Parent Category
            </label>
            <select {...register("parentId")} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "7px", padding: "0.55rem 0.8rem", color: "#e8e8e8", fontSize: "0.82rem", outline: "none" }}>
              <option value="">— Root (no parent) —</option>
              {parentOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.4rem" }}>
              Description
            </label>
            <textarea {...register("description")} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "7px", padding: "0.55rem 0.8rem", color: "#e8e8e8", fontSize: "0.82rem", outline: "none", minHeight: "90px", resize: "vertical", boxSizing: "border-box" }} placeholder="Optional category description…" />
          </div>
        </div>
      </div>

      {error && <p style={{ color: "#f87171", fontSize: "0.8rem", marginBottom: "1rem" }}>Error: {error}</p>}

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <button type="submit" disabled={saving} style={{ background: "#e8a020", color: "#0a0a0b", fontWeight: 800, fontSize: "0.82rem", padding: "0.65rem 1.75rem", borderRadius: "7px", border: "none", cursor: "pointer", opacity: saving ? 0.5 : 1 }}>
          {saving ? "Saving…" : isEditing ? "Save Changes" : "Create Category"}
        </button>
        <button type="button" onClick={() => router.back()} style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "7px", padding: "0.6rem 1.1rem", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
          Cancel
        </button>
        {isEditing && (
          <button type="button" onClick={handleDelete} disabled={deleting} style={{ marginLeft: "auto", background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)", fontWeight: 700, fontSize: "0.78rem", padding: "0.6rem 1.25rem", borderRadius: "7px", cursor: "pointer" }}>
            {deleting ? "Deleting…" : "Delete Category"}
          </button>
        )}
      </div>
    </form>
  );
}