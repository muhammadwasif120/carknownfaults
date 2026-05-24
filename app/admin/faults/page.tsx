"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { SeverityBadge } from "@/components/fault/SeverityBadge";
import type { Fault, Severity } from "@/lib/types";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function AdminFaultsPage() {
  const [faults, setFaults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadFaults() {
    const supabase = createClient();
    const { data } = await supabase
      .from("faults")
      .select("*, variants(name, models(name, makes(name)))")
      .order("created_at", { ascending: false });
    setFaults(data ?? []);
    setLoading(false);
  }

  useEffect(() => { loadFaults(); }, []);

  async function togglePublished(id: string, current: boolean) {
    const res = await fetch(`/api/faults/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !current }),
    });
    if (res.ok) loadFaults();
  }

  async function deleteFault(id: string) {
    if (!confirm("Delete this fault?")) return;
    await fetch(`/api/faults/${id}`, { method: "DELETE" });
    loadFaults();
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Faults</h1>
        <Link
          href="/admin/faults/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#CC0000] text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          <Plus size={16} /> Add Fault
        </Link>
      </div>

      {loading ? (
        <p className="text-[#6B7280]">Loading…</p>
      ) : (
        <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F3F4F6] border-b border-[#E5E7EB]">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-[#111827]">Fault</th>
                <th className="text-left px-4 py-3 font-semibold text-[#111827]">Vehicle</th>
                <th className="text-left px-4 py-3 font-semibold text-[#111827]">Severity</th>
                <th className="text-left px-4 py-3 font-semibold text-[#111827]">Published</th>
                <th className="text-right px-4 py-3 font-semibold text-[#111827]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {faults.map((fault) => (
                <tr key={fault.id} className="hover:bg-[#F3F4F6] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#111827]">{fault.title}</p>
                    <p className="text-xs text-[#6B7280]">{fault.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">
                    {fault.variants?.models?.makes?.name} {fault.variants?.models?.name} {fault.variants?.name}
                  </td>
                  <td className="px-4 py-3">
                    <SeverityBadge severity={fault.severity as Severity} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublished(fault.id, fault.published)}
                      className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${fault.published ? "bg-green-500" : "bg-gray-300"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${fault.published ? "translate-x-4" : ""}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/faults/${fault.id}/edit`}
                        className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB] rounded transition-colors"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => deleteFault(fault.id)}
                        className="p-1.5 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
