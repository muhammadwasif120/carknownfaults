import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "Used Car Buyer's Guides & Repair Scores | Car Known Faults",
  description: "Comprehensive pre-purchase advice, reliability ratings, and repair scores for used cars in the UK. Know what to look for and what to avoid before you buy.",
};

export const revalidate = 86400;

export default async function BuyersGuidesHubPage() {
  const supabase = await createClient();
  const { data: makes } = await supabase.from("makes").select("*, models(slug, name, buyer_guides(*))").order("name");

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Buyer's Guides" }]} />
      
      <div className="mt-8 mb-12 text-center max-w-3xl mx-auto">
        <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 inline-block">Premium Data</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Expert Buyer's Guides
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Arm yourself with knowledge before viewing a used car. Discover our exclusive repairability scores, reliability ratings, and exactly what to look out for.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {makes?.map((make) => {
          const modelsWithGuides = make.models?.filter((m: any) => m.buyer_guides !== null);
          if (!modelsWithGuides || modelsWithGuides.length === 0) return null;

          return (
            <div key={make.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-gray-900 px-6 py-4">
                <h2 className="text-xl font-bold text-white">{make.name}</h2>
              </div>
              <div className="divide-y divide-gray-100 flex-grow">
                {modelsWithGuides.map((model: any) => (
                  <Link
                    key={model.slug}
                    href={`/${make.slug}/${model.slug}`}
                    className="p-4 hover:bg-gray-50 transition-colors group flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {model.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                          Repair Score: {model.buyer_guides.repair_score}/100
                        </span>
                        <span className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-3 h-3 ${i < model.buyer_guides.reliability_rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                          ))}
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1">
                      →
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
