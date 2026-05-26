import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Press Kit & Media Resources | Car Known Faults",
  description: "Download official Car Known Faults brand assets, view live database statistics, and find contact information for media inquiries.",
};

export const revalidate = 3600; // Revalidate every hour to keep stats fresh

export default async function PressPage() {
  const supabase = await createClient();
  
  // Fetch live stats
  const [{ count: faultCount }, { count: modelCount }] = await Promise.all([
    supabase.from("faults").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("models").select("*", { count: "exact", head: true })
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Press Kit" }]} />
      
      <div className="mt-8 mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] tracking-tight mb-4">
          Press & Media
        </h1>
        <p className="text-xl text-[#6B7280] leading-relaxed max-w-2xl">
          We are building the internet's most comprehensive, structured database of vehicle faults to help buyers make informed decisions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#111827] mb-6">Live Statistics</h2>
          <div className="space-y-6">
            <div>
              <div className="text-4xl font-black text-[#CC0000]">{faultCount?.toLocaleString() ?? "800+"}</div>
              <div className="text-[#6B7280] font-medium mt-1">Published Faults</div>
            </div>
            <div>
              <div className="text-4xl font-black text-[#CC0000]">{modelCount?.toLocaleString() ?? "60+"}</div>
              <div className="text-[#6B7280] font-medium mt-1">Vehicle Models Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-black text-[#CC0000]">100%</div>
              <div className="text-[#6B7280] font-medium mt-1">Free to Access</div>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] rounded-2xl p-8 text-white flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4">Media Inquiries</h2>
          <p className="text-gray-400 mb-6">
            If you are a journalist looking for specific data on vehicle reliability, quotes, or custom reports, we are happy to help.
          </p>
          <a href="mailto:press@carknownfaults.com" className="inline-flex items-center justify-center bg-[#CC0000] text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors">
            Email press@carknownfaults.com
          </a>
        </div>
      </div>

      <hr className="border-[#E5E7EB] my-12" />

      <h2 className="text-2xl font-bold text-[#111827] mb-6">Brand Guidelines</h2>
      <div className="bg-gray-50 rounded-2xl p-8 border border-[#E5E7EB] mb-8">
        <h3 className="font-bold text-[#111827] mb-2">Our Name</h3>
        <p className="text-[#374151] mb-6">
          Please refer to us as <strong>Car Known Faults</strong>. Please do not use "CKF" in public-facing articles unless previously established.
        </p>

        <h3 className="font-bold text-[#111827] mb-2">Color Palette</h3>
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-[#CC0000] shadow-inner"></div>
            <span className="text-xs font-mono text-gray-500">#CC0000</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-[#111827] shadow-inner border border-gray-300"></div>
            <span className="text-xs font-mono text-gray-500">#111827</span>
          </div>
        </div>
      </div>
    </div>
  );
}
