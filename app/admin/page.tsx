import { createClient } from "@/lib/supabase/server";
import { StatBadge } from "@/components/ui/StatBadge";
import Link from "next/link";
import type { Fault } from "@/lib/types";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: makeCount },
    { count: modelCount },
    { count: variantCount },
    { count: faultCount },
    { count: publishedCount },
    { data: recentFaults },
  ] = await Promise.all([
    supabase.from("makes").select("*", { count: "exact", head: true }),
    supabase.from("models").select("*", { count: "exact", head: true }),
    supabase.from("variants").select("*", { count: "exact", head: true }),
    supabase.from("faults").select("*", { count: "exact", head: true }),
    supabase.from("faults").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("faults").select("*, variants(name, models(name, makes(name)))").order("created_at", { ascending: false }).limit(5),
  ]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatBadge value={makeCount ?? 0} label="Makes" />
        <StatBadge value={modelCount ?? 0} label="Models" />
        <StatBadge value={variantCount ?? 0} label="Variants" />
        <StatBadge value={faultCount ?? 0} label="Total Faults" />
        <StatBadge value={publishedCount ?? 0} label="Published" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-[#111827]">Recent Faults</h2>
            <Link href="/admin/faults" className="text-xs text-[#CC0000] hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {(recentFaults as any[] ?? []).map((fault) => (
              <div key={fault.id} className="flex justify-between items-start gap-2">
                <div>
                  <p className="text-sm font-medium text-[#111827]">{fault.title}</p>
                  <p className="text-xs text-[#6B7280]">
                    {fault.variants?.models?.makes?.name} · {fault.variants?.models?.name} · {fault.variants?.name}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${fault.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {fault.published ? "Live" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
          <h2 className="font-bold text-[#111827] mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/admin/faults/new" className="flex items-center justify-between px-4 py-3 bg-[#CC0000] text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
              Add New Fault <span>→</span>
            </Link>
            <Link href="/admin/makes" className="flex items-center justify-between px-4 py-3 bg-[#F3F4F6] text-[#111827] rounded-lg text-sm font-medium hover:bg-[#E5E7EB] transition-colors">
              Manage Makes <span>→</span>
            </Link>
            <Link href="/admin/submissions" className="flex items-center justify-between px-4 py-3 bg-[#F3F4F6] text-[#111827] rounded-lg text-sm font-medium hover:bg-[#E5E7EB] transition-colors">
              Review Submissions <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
