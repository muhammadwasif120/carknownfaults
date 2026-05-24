"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils/slugify";
import type { Fault, Make, Model, Variant } from "@/lib/types";

interface FaultFormProps {
  initialData?: Partial<Fault>;
  mode: "new" | "edit";
}

export function FaultForm({ initialData, mode }: FaultFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [form, setForm] = useState({
    variant_id: initialData?.variant_id ?? "",
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    summary: initialData?.summary ?? "",
    symptoms: initialData?.symptoms ?? "",
    cause: initialData?.cause ?? "",
    fix: initialData?.fix ?? "",
    severity: initialData?.severity ?? "moderate",
    diy_difficulty: initialData?.diy_difficulty ?? "moderate",
    mileage_start: initialData?.mileage_start?.toString() ?? "",
    mileage_end: initialData?.mileage_end?.toString() ?? "",
    repair_cost_low: initialData?.repair_cost_low?.toString() ?? "",
    repair_cost_high: initialData?.repair_cost_high?.toString() ?? "",
    affected_years: initialData?.affected_years ?? "",
    obd_codes: initialData?.obd_codes?.join(", ") ?? "",
    published: initialData?.published ?? false,
  });

  const supabase = createClient();

  useEffect(() => {
    supabase.from("makes").select("*").order("name").then(({ data }) => setMakes(data ?? []));
  }, []);

  useEffect(() => {
    if (!selectedMake) return;
    supabase.from("models").select("*").eq("make_id", selectedMake).order("name").then(({ data }) => setModels(data ?? []));
  }, [selectedMake]);

  useEffect(() => {
    if (!selectedModel) return;
    supabase.from("variants").select("*").eq("model_id", selectedModel).order("name").then(({ data }) => setVariants(data ?? []));
  }, [selectedModel]);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setForm((f) => ({ ...f, title, slug: slugify(title) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      variant_id: form.variant_id,
      title: form.title,
      slug: form.slug,
      summary: form.summary,
      symptoms: form.symptoms,
      cause: form.cause,
      fix: form.fix,
      severity: form.severity,
      diy_difficulty: form.diy_difficulty,
      mileage_start: form.mileage_start ? parseInt(form.mileage_start) : null,
      mileage_end: form.mileage_end ? parseInt(form.mileage_end) : null,
      repair_cost_low: form.repair_cost_low ? parseInt(form.repair_cost_low) : null,
      repair_cost_high: form.repair_cost_high ? parseInt(form.repair_cost_high) : null,
      affected_years: form.affected_years || null,
      obd_codes: form.obd_codes ? form.obd_codes.split(",").map((s) => s.trim()).filter(Boolean) : [],
      published: form.published,
    };

    const method = mode === "new" ? "POST" : "PATCH";
    const url = mode === "new" ? "/api/faults" : `/api/faults/${initialData?.id}`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (res.ok) router.push("/admin/faults");
  }

  const inputClass = "w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#CC0000]";
  const labelClass = "block text-sm font-medium text-[#111827] mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      {/* Cascading selects */}
      <div className="bg-[#F3F4F6] rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-[#111827]">Vehicle</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Make</label>
            <select className={inputClass} value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)}>
              <option value="">Select make</option>
              {makes.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Model</label>
            <select className={inputClass} value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedMake}>
              <option value="">Select model</option>
              {models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Variant *</label>
            <select className={inputClass} required value={form.variant_id} onChange={(e) => setForm((f) => ({ ...f, variant_id: e.target.value }))} disabled={!selectedModel}>
              <option value="">Select variant</option>
              {variants.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Basic info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Title *</label>
          <input required className={inputClass} value={form.title} onChange={handleTitleChange} placeholder="EGR Valve Failure" />
        </div>
        <div>
          <label className={labelClass}>Slug *</label>
          <input required className={inputClass} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Summary * (shown in meta description, 150 chars)</label>
        <textarea required rows={2} maxLength={150} className={inputClass} value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} />
        <p className="text-xs text-[#6B7280] mt-1">{form.summary.length}/150</p>
      </div>

      {(["symptoms", "cause", "fix"] as const).map((field) => (
        <div key={field}>
          <label className={labelClass}>{field.charAt(0).toUpperCase() + field.slice(1)} * (Markdown)</label>
          <textarea required rows={5} className={`${inputClass} font-mono text-xs resize-y`} value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} />
        </div>
      ))}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Severity *</label>
          <select required className={inputClass} value={form.severity} onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value as any }))}>
            <option value="minor">Minor</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>DIY Difficulty</label>
          <select className={inputClass} value={form.diy_difficulty} onChange={(e) => setForm((f) => ({ ...f, diy_difficulty: e.target.value as any }))}>
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="hard">Hard</option>
            <option value="professional_only">Professional Only</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className={labelClass}>Mileage Start</label>
          <input type="number" className={inputClass} value={form.mileage_start} onChange={(e) => setForm((f) => ({ ...f, mileage_start: e.target.value }))} />
        </div>
        <div>
          <label className={labelClass}>Mileage End</label>
          <input type="number" className={inputClass} value={form.mileage_end} onChange={(e) => setForm((f) => ({ ...f, mileage_end: e.target.value }))} />
        </div>
        <div>
          <label className={labelClass}>Cost Low (£)</label>
          <input type="number" className={inputClass} value={form.repair_cost_low} onChange={(e) => setForm((f) => ({ ...f, repair_cost_low: e.target.value }))} />
        </div>
        <div>
          <label className={labelClass}>Cost High (£)</label>
          <input type="number" className={inputClass} value={form.repair_cost_high} onChange={(e) => setForm((f) => ({ ...f, repair_cost_high: e.target.value }))} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Affected Years</label>
          <input className={inputClass} value={form.affected_years} onChange={(e) => setForm((f) => ({ ...f, affected_years: e.target.value }))} placeholder="2005-2011" />
        </div>
        <div>
          <label className={labelClass}>OBD Codes</label>
          <input className={inputClass} value={form.obd_codes} onChange={(e) => setForm((f) => ({ ...f, obd_codes: e.target.value }))} placeholder="P0401, P0403" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setForm((f) => ({ ...f, published: !f.published }))}
          className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${form.published ? "bg-green-500" : "bg-gray-300"}`}
        >
          <span className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.published ? "translate-x-5" : ""}`} />
        </button>
        <label className="text-sm font-medium text-[#111827]">Published</label>
      </div>

      <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#CC0000] text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
        >
          {loading ? "Saving…" : mode === "new" ? "Create Fault" : "Update Fault"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/faults")}
          className="px-6 py-2.5 border border-[#E5E7EB] text-[#374151] rounded-lg hover:bg-[#F3F4F6] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
