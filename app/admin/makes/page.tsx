"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils/slugify";
import type { Make } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";

export default function AdminMakesPage() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("makes").select("*").order("name");
    setMakes(data ?? []);
  }

  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.from("makes").insert({ name, slug: slugify(name), country: country || null });
    setName(""); setCountry(""); setLoading(false); load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this make and all related data?")) return;
    await supabase.from("makes").delete().eq("id", id);
    load();
  }

  const inputClass = "border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#CC0000]";

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">Makes</h1>

      <form onSubmit={add} className="flex gap-3 mb-6">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Make name" className={inputClass} />
        <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country (optional)" className={inputClass} />
        <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-[#CC0000] text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60">
          <Plus size={15} /> Add
        </button>
      </form>

      <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F3F4F6]">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-[#111827]">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-[#111827]">Slug</th>
              <th className="text-left px-4 py-3 font-semibold text-[#111827]">Country</th>
              <th className="text-left px-4 py-3 font-semibold text-[#111827]">Faults</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {makes.map((make) => (
              <tr key={make.id} className="hover:bg-[#F3F4F6]">
                <td className="px-4 py-3 font-medium">{make.name}</td>
                <td className="px-4 py-3 text-[#6B7280] font-mono text-xs">{make.slug}</td>
                <td className="px-4 py-3 text-[#6B7280]">{make.country ?? "—"}</td>
                <td className="px-4 py-3">{make.fault_count}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => remove(make.id)} className="p-1.5 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded transition-colors">
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
