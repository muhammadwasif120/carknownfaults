"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils/slugify";
import type { Tag } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [name, setName] = useState("");
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("tags").select("*").order("name");
    setTags(data ?? []);
  }

  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("tags").insert({ name, slug: slugify(name) });
    setName(""); load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this tag?")) return;
    await supabase.from("tags").delete().eq("id", id);
    load();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">Tags</h1>
      <form onSubmit={add} className="flex gap-3 mb-6">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Tag name (e.g. EGR, Turbo)" className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
        <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-[#CC0000] text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
          <Plus size={15} /> Add
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-2 text-sm">
            <span className="font-medium">{tag.name}</span>
            <span className="text-xs text-[#6B7280]">/{tag.slug}</span>
            <button onClick={() => remove(tag.id)} className="text-[#6B7280] hover:text-red-600 ml-1"><Trash2 size={12} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
