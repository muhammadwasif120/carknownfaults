import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "MOT Pass Rates & Common Failures | Car Known Faults",
  description: "Browse official UK MOT pass rates and discover the most common reasons why different car models fail their annual inspection.",
};

export const revalidate = 86400;

export default async function MotHubPage() {
  const supabase = await createClient();
  const { data: makes } = await supabase.from("makes").select("*, models(slug, name, mot_stats(*))").order("name");

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "MOT Intelligence" }]} />
      
      <div className="mt-8 mb-12 text-center max-w-3xl mx-auto">
        <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 inline-block">Beta Feature</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          MOT Intelligence Hub
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Before you buy a used car, check its MOT history. Discover the real-world pass rates and the most common reasons models fail the UK MOT test, based on DVSA data.
        </p>
      </div>

      <div className="space-y-12">
        {makes?.map((make) => {
          const modelsWithMot = make.models?.filter((m: any) => m.mot_stats !== null);
          if (!modelsWithMot || modelsWithMot.length === 0) return null;

          return (
            <div key={make.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
                <h2 className="text-2xl font-bold text-gray-900">{make.name}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x sm:divide-y-0 border-t-0 divide-gray-100">
                {modelsWithMot.map((model: any) => (
                  <Link
                    key={model.slug}
                    href={`/${make.slug}/${model.slug}/mot`}
                    className="p-6 hover:bg-gray-50 transition-colors group flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {model.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Pass Rate: <span className="font-medium text-gray-900">{model.mot_stats.pass_rate}%</span>
                      </p>
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
