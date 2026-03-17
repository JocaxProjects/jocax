"use client";
// components/admin/SeoForm.tsx
//
// Form for creating and editing SEO landing pages.
//  ✦ Fields: title, slug, metaDescription, content (rich textarea)
//  ✦ Live meta preview (Google snippet simulation)
//  ✦ Character counters for title (60) and meta description (160)

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const seoSchema = z.object({
  title:           z.string().min(5, "Title is required").max(70, "Keep under 70 chars"),
  slug:            z.string().min(2).regex(/^[a-z0-9-/]+$/, "Lowercase, numbers, hyphens, forward-slashes only"),
  metaDescription: z.string().max(165, "Keep under 165 chars").optional(),
  content:         z.string().optional(),
});

type SeoFormValues = z.infer<typeof seoSchema>;

interface SeoFormProps {
  initialData?: Partial<SeoFormValues> & { id?: string };
}

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

export default function SeoForm({ initialData }: SeoFormProps) {
  const router     = useRouter();
  const isEditing  = !!initialData?.id;
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error,    setError]    = useState("");
  const [slugManual, setSlugManual] = useState(isEditing);

  const { register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<SeoFormValues>({ resolver: zodResolver(seoSchema), defaultValues: { title: "", slug: "", metaDescription: "", content: "", ...initialData } });

  const titleValue = watch("title");
  const metaValue  = watch("metaDescription") ?? "";
  const slugValue  = watch("slug");

  useEffect(() => { if (!slugManual) setValue("slug", slugify(titleValue)); }, [titleValue, slugManual, setValue]);

  const onSubmit = useCallback(async (values: SeoFormValues) => {
    setSaving(true); setError("");
    try {
      const url    = isEditing ? `/api/admin/seo/${initialData!.id}` : "/api/admin/seo";
      const method = isEditing ? "PATCH" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Save failed"); }
      router.push("/admin/seo"); router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally { setSaving(false); }
  }, [isEditing, initialData, router]);

  const handleDelete = useCallback(async () => {
    if (!confirm("Delete this SEO page?")) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/seo/${initialData!.id}`, { method: "DELETE" });
      router.push("/admin/seo"); router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally { setDeleting(false); }
  }, [initialData, router]);

  const f: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "7px", padding: "0.55rem 0.8rem", color: "#e8e8e8", fontSize: "0.82rem", outline: "none", boxSizing: "border-box" };
  const l: React.CSSProperties = { display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)", marginBottom: "0.4rem" };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem", alignItems: "start" }}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "1.5rem", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <label style={l}>Page Title *</label>
                <span style={{ fontSize: "0.65rem", color: titleValue.length > 60 ? "#f87171" : "rgba(255,255,255,0.25)" }}>{titleValue.length}/60</span>
              </div>
              <input {...register("title")} style={f} placeholder="e.g. Commercial Ovens for Restaurants" />
              {errors.title && <p style={{ color: "#f87171", fontSize: "0.68rem", marginTop: "0.3rem" }}>{errors.title.message}</p>}
            </div>
            <div>
              <label style={l}>Slug / URL *</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
                <span style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRight: "none", borderRadius: "7px 0 0 7px", padding: "0.55rem 0.7rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>yoursite.com/</span>
                <input {...register("slug")} style={{ ...f, borderRadius: "0 7px 7px 0" }} placeholder="commercial-ovens"
                  onChange={(e) => { setSlugManual(true); register("slug").onChange(e); }} />
              </div>
              {errors.slug && <p style={{ color: "#f87171", fontSize: "0.68rem", marginTop: "0.3rem" }}>{errors.slug.message}</p>}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <label style={l}>Meta Description</label>
                <span style={{ fontSize: "0.65rem", color: metaValue.length > 155 ? "#fbbf24" : "rgba(255,255,255,0.25)" }}>{metaValue.length}/160</span>
              </div>
              <textarea {...register("metaDescription")} style={{ ...f, minHeight: "80px", resize: "vertical" }} placeholder="Concise description shown in Google search results…" />
              {errors.metaDescription && <p style={{ color: "#f87171", fontSize: "0.68rem", marginTop: "0.3rem" }}>{errors.metaDescription.message}</p>}
            </div>
            <div>
              <label style={l}>Page Content (HTML/Markdown)</label>
              <textarea {...register("content")} style={{ ...f, minHeight: "200px", resize: "vertical", fontFamily: "monospace", fontSize: "0.78rem" }} placeholder="<h1>Commercial Ovens</h1>&#10;<p>Browse our full range…</p>" />
            </div>
          </div>
        </div>

        {error && <p style={{ color: "#f87171", fontSize: "0.8rem", marginBottom: "1rem" }}>Error: {error}</p>}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button type="submit" disabled={saving} style={{ background: "#e8a020", color: "#0a0a0b", fontWeight: 800, fontSize: "0.82rem", padding: "0.65rem 1.75rem", borderRadius: "7px", border: "none", cursor: "pointer", opacity: saving ? 0.5 : 1 }}>
            {saving ? "Saving…" : isEditing ? "Save Changes" : "Create SEO Page"}
          </button>
          <button type="button" onClick={() => router.back()} style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "7px", padding: "0.6rem 1.1rem", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>Cancel</button>
          {isEditing && (
            <button type="button" onClick={handleDelete} disabled={deleting} style={{ marginLeft: "auto", background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)", fontWeight: 700, fontSize: "0.78rem", padding: "0.6rem 1.25rem", borderRadius: "7px", cursor: "pointer" }}>
              {deleting ? "Deleting…" : "Delete Page"}
            </button>
          )}
        </div>
      </form>

      {/* ── Google snippet preview ── */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "1.25rem", position: "sticky", top: "72px" }}>
        <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "0.75rem" }}>
          Google Snippet Preview
        </div>
        <div style={{ background: "#fff", borderRadius: "8px", padding: "1rem", fontFamily: "Arial, sans-serif" }}>
          <div style={{ fontSize: "0.7rem", color: "#1a0dab", marginBottom: "0.1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            yoursite.com › {slugValue || "page-slug"}
          </div>
          <div style={{ fontSize: "1rem", color: "#1a0dab", lineHeight: 1.3, marginBottom: "0.25rem", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {titleValue || "Page Title"}
          </div>
          <div style={{ fontSize: "0.82rem", color: "#545454", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
            {metaValue || "Meta description will appear here. Write a compelling summary of the page content to improve click-through rates."}
          </div>
        </div>
        <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.2)", marginTop: "0.75rem" }}>
          Title: {titleValue.length}/60 · Description: {metaValue.length}/160
        </div>
      </div>
    </div>
  );
}