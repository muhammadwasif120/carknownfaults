"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils/slugify";
import type { Make, Model } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";

export default function AdminVariantsPage() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [form, setForm] = useState({ name: "", engine: "", yearStart: "", yearEnd: "", bodyType: "", transmission: "", fuelType: "" });
  const supabase = createClient();

  useEffect(() => { supabase.from("makes").select("*").order("name").then(({ data }) => setMakes(data ?? [])); }, []);
  useEffect(() => {
    if (!selectedMake) return;
    supabase.from("models").select("*").eq("make_id", selectedMake).order("name").then(({ data }) => setModels(data ?? []));
  }, [selectedMake]);
  useEffect(() => {
    if (!selectedModel) { setVariants([]); return; }
    supabase.from("variants").select("*, models(name, makes(name))").eq("model_id", selectedModel).order("name").then(({ data }) => setVariants(data ?? []));
  }, [selectedModel]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedModel) return;
    await supabase.from("variants").insert({
      model_id: selectedModel, name: form.name, slug: slugify(form.name),
      engine: form.engine || null, body_type: form.bodyType || null,
      transmission: form.transmission || null, fuel_type: form.fuelType || null,
      year_start: form.yearStart ? parseInt(form.yearStart) : null,
      year_end: form.yearEnd ? parseInt(form.yearEnd) : null,
    });
    setForm({ name: "", engine: "", yearStart: "", yearEnd: "", bodyType: "", transmission: "", fuelType: "" });
    supabase.from("variants").select("*, models(name, makes(name))").eq("model_id", selectedModel).order("name").then(({ data }) => setVariants(data ?? []));
  }

  async function remove(id: string) {
    if (!confirm("Delete this variant?")) return;
    await supabase.from("variants").delete().eq("id", id);
    supabase.from("variants").select("*, models(name, makes(name))").eq("model_id", selectedModel).order("name").then(({ data }) => setVariants(data ?? []));
  }

  const inputClass = "border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#CC0000]";

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">Variants</h1>
      <div className="flex gap-3 mb-4">
        <select value={selectedMake} onChange={(e) => { setSelectedMake(e.target.value); setSelectedModel(""); }} className={inputClass}>
          <option value="">Select make</option>
          {makes.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedMake} className={inputClass}>
          <option value="">Select model</option>
          {models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      {selectedModel && (
        <form onSubmit={add} className="grid grid-cols-4 gap-3 mb-6">
          <input required placeholder="Variant name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputClass} />
          <input placeholder="Engine" value={form.engine} onChange={(e) => setForm((f) => ({ ...f, engine: e.target.value }))} className={inputClass} />
          <input placeholder="Year start" type="number" value={form.yearStart} onChange={(e) => setForm((f) => ({ ...f, yearStart: e.target.value }))} className={inputClass} />
          <input placeholder="Year end" type="number" value={form.yearEnd} onChange={(e) => setForm((f) => ({ ...f, yearEnd: e.target.value }))} className={inputClass} />
          <select value={form.fuelType} onChange={(e) => setForm((f) => ({ ...f, fuelType: e.target.value }))} className={inputClass}>
            <option value="">Fuel type</option>
            <option>Petrol</option><option>Diesel</option><option>Hybrid</option><option>Electric</option>
          </select>
          <select value={form.transmission} onChange={(e) => setForm((f) => ({ ...f, transmission: e.target.value }))} className={inputClass}>
            <option value="">Transmission</option>
            <option>Manual</option><option>Automatic</option>
          </select>
          <input placeholder="Body type" value={form.bodyType} onChange={(e) => setForm((f) => ({ ...f, bodyType: e.target.value }))} className={inputClass} />
          <button type="submit" className="flex items-center justify-center gap-2 px-4 py-2 bg-[#CC0000] text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
            <Plus size={15} /> Add
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F3F4F6]">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Vehicle</th>
              <th className="text-left px-4 py-3 font-semibold">Engine</th>
              <th className="text-left px-4 py-3 font-semibold">Years</th>
              <th className="text-left px-4 py-3 font-semibold">Fuel / Gearbox</th>
              <th className="text-left px-4 py-3 font-semibold">Faults</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {variants.map((v) => (
              <tr key={v.id} className="hover:bg-[#F3F4F6]">
                <td className="px-4 py-3"><p className="font-medium">{v.name}</p><p className="text-xs text-[#6B7280]">{v.models?.makes?.name} {v.models?.name}</p></td>
                <td className="px-4 py-3 text-[#6B7280]">{v.engine ?? "—"}</td>
                <td className="px-4 py-3 text-[#6B7280]">{v.year_start}–{v.year_end ?? "present"}</td>
                <td className="px-4 py-3 text-[#6B7280]">{v.fuel_type} {v.transmission ? `· ${v.transmission}` : ""}</td>
                <td className="px-4 py-3">{v.fault_count}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => remove(v.id)} className="p-1.5 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
