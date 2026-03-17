"use client";
// components/admin/AttributeForm.tsx
//
// Form for creating and editing attributes.
//  ✦ Fields: name, slug, type (SELECT/TEXT/NUMBER/BOOLEAN), unit
//  ✦ Dynamic predefined values list (for SELECT type)
//  ✦ POST/PATCH to /api/admin/attributes/[id]

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const attributeSchema = z.object({
  name:   z.string().min(2, "Name is required"),
  slug:   z.string().min(2).regex(/^[a-z0-9-]+$/, "Lowercase, numbers, hyphens only"),
  type:   z.enum(["TEXT", "NUMBER", "BOOLEAN", "SELECT"]),
  unit:   z.string().optional(),
  values: z.array(z.object({ value: z.string().min(1, "Value required") })).optional(),
});

type AttributeFormValues = z.infer<typeof attributeSchema>;

interface AttributeFormProps {
  initialData?: Partial<AttributeFormValues> & {
    id?: string;
    existingValues?: { id: string; value: string }[];
  };
}

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

export default function AttributeForm({ initialData }: AttributeFormProps) {
  const router     = useRouter();
  const isEditing  = !!initialData?.id;
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error,    setError]    = useState("");
  const [slugManual, setSlugManual] = useState(isEditing);

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } =
    useForm<AttributeFormValues>({
      resolver: zodResolver(attributeSchema),
      defaultValues: {
        name: "", slug: "", type: "TEXT", unit: "",
        values: initialData?.existingValues?.map((v) => ({ value: v.value })) ?? [],
        ...initialData,
      },
    });

  const { fields: valueFields, append: addValue, remove: removeValue } =
    useFieldArray({ control, name: "values" });

  const nameValue = watch("name");
  const typeValue = watch("type");
  useEffect(() => { if (!slugManual) setValue("slug", slugify(nameValue)); }, [nameValue, slugManual, setValue]);

  const onSubmit = useCallback(async (values: AttributeFormValues) => {
    setSaving(true); setError("");
    try {
      const url    = isEditing ? `/api/admin/attributes/${initialData!.id}` : "/api/admin/attributes";
      const method = isEditing ? "PATCH" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Save failed"); }
      router.push("/admin/attributes"); router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally { setSaving(false); }
  }, [isEditing, initialData, router]);

  const handleDelete = useCallback(async () => {
    if (!confirm("Delete this attribute?")) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/attributes/${initialData!.id}`, { method: "DELETE" });
      router.push("/admin/attributes"); router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally { setDeleting(false); }
  }, [initialData, router]);

  const f: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "7px", padding: "0.55rem 0.8rem", color: "#e8e8e8", fontSize: "0.82rem", outline: "none", boxSizing: "border-box" };
  const l: React.CSSProperties = { display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)", marginBottom: "0.4rem" };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "1.5rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={l}>Attribute Name *</label>
            <input {...register("name")} style={f} placeholder="e.g. Power Output" />
            {errors.name && <p style={{ color: "#f87171", fontSize: "0.68rem", marginTop: "0.3rem" }}>{errors.name.message}</p>}
          </div>
          <div>
            <label style={l}>Slug *</label>
            <input {...register("slug")} style={f} placeholder="power-output"
              onChange={(e) => { setSlugManual(true); register("slug").onChange(e); }} />
            {errors.slug && <p style={{ color: "#f87171", fontSize: "0.68rem", marginTop: "0.3rem" }}>{errors.slug.message}</p>}
          </div>
          <div>
            <label style={l}>Type *</label>
            <select {...register("type")} style={{ ...f, background: "rgba(255,255,255,0.05)" }}>
              <option value="TEXT">TEXT — free string</option>
              <option value="NUMBER">NUMBER — numeric value</option>
              <option value="BOOLEAN">BOOLEAN — yes/no</option>
              <option value="SELECT">SELECT — predefined list</option>
            </select>
          </div>
          <div>
            <label style={l}>Unit (optional)</label>
            <input {...register("unit")} style={f} placeholder="e.g. kW, V, L, kg" />
          </div>
        </div>
      </div>

      {/* Predefined values — only relevant for SELECT type */}
      {typeValue === "SELECT" && (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "1.25rem", marginBottom: "1.25rem" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.75rem" }}>
            Predefined Values
          </div>
          {valueFields.map((field, idx) => (
            <div key={field.id} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <input {...register(`values.${idx}.value`)} style={{ ...f, flex: 1 }} placeholder={`Value ${idx + 1}`} />
              <button type="button" onClick={() => removeValue(idx)} style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "5px", padding: "0.45rem 0.65rem", color: "#f87171", cursor: "pointer", fontSize: "0.75rem" }}>✕</button>
            </div>
          ))}
          <button type="button" onClick={() => addValue({ value: "" })} style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: "6px", padding: "0.5rem 1rem", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.78rem", marginTop: "0.25rem" }}>
            + Add Value
          </button>
        </div>
      )}

      {error && <p style={{ color: "#f87171", fontSize: "0.8rem", marginBottom: "1rem" }}>Error: {error}</p>}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <button type="submit" disabled={saving} style={{ background: "#e8a020", color: "#0a0a0b", fontWeight: 800, fontSize: "0.82rem", padding: "0.65rem 1.75rem", borderRadius: "7px", border: "none", cursor: "pointer", opacity: saving ? 0.5 : 1 }}>
          {saving ? "Saving…" : isEditing ? "Save Changes" : "Create Attribute"}
        </button>
        <button type="button" onClick={() => router.back()} style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "7px", padding: "0.6rem 1.1rem", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>Cancel</button>
        {isEditing && (
          <button type="button" onClick={handleDelete} disabled={deleting} style={{ marginLeft: "auto", background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)", fontWeight: 700, fontSize: "0.78rem", padding: "0.6rem 1.25rem", borderRadius: "7px", cursor: "pointer" }}>
            {deleting ? "Deleting…" : "Delete Attribute"}
          </button>
        )}
      </div>
    </form>
  );
}