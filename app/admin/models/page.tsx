"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils/slugify";
import type { Make, Model } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";

export default function AdminModelsPage() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [name, setName] = useState("");
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  const supabase = createClient();

  async function loadMakes() {
    const { data } = await supabase.from("makes").select("*").order("name");
    setMakes(data ?? []);
  }

  async function loadModels() {
    if (!selectedMake) { setModels([]); return; }
    const { data } = await supabase.from("models").select("*, makes(name)").eq("make_id", selectedMake).order("name");
    setModels(data ?? []);
  }

  useEffect(() => { loadMakes(); }, []);
  useEffect(() => { loadModels(); }, [selectedMake]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMake) return;
    await supabase.from("models").insert({
      make_id: selectedMake, name, slug: slugify(name),
      year_start: yearStart ? parseInt(yearStart) : null,
      year_end: yearEnd ? parseInt(yearEnd) : null,
    });
    setName(""); setYearStart(""); setYearEnd(""); loadModels();
  }

  async function remove(id: string) {
    if (!confirm("Delete this model?")) return;
    await supabase.from("models").delete().eq("id", id);
    loadModels();
  }

  const inputClass = "border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#CC0000]";

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">Models</h1>

      <div className="mb-4">
        <select value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)} className={inputClass}>
          <option value="">Filter by make</option>
          {makes.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      {selectedMake && (
        <form onSubmit={add} className="flex gap-3 mb-6">
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Model name" className={inputClass} />
          <input value={yearStart} onChange={(e) => setYearStart(e.target.value)} placeholder="Year start" className={`${inputClass} w-28`} type="number" />
          <input value={yearEnd} onChange={(e) => setYearEnd(e.target.value)} placeholder="Year end" className={`${inputClass} w-28`} type="number" />
          <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-[#CC0000] text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
            <Plus size={15} /> Add
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F3F4F6]">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Make</th>
              <th className="text-left px-4 py-3 font-semibold">Model</th>
              <th className="text-left px-4 py-3 font-semibold">Years</th>
              <th className="text-left px-4 py-3 font-semibold">Faults</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {models.map((model) => (
              <tr key={model.id} className="hover:bg-[#F3F4F6]">
                <td className="px-4 py-3 text-[#6B7280]">{model.makes?.name}</td>
                <td className="px-4 py-3 font-medium">{model.name}</td>
                <td className="px-4 py-3 text-[#6B7280]">{model.year_start}–{model.year_end ?? "present"}</td>
                <td className="px-4 py-3">{model.fault_count}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => remove(model.id)} className="p-1.5 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
