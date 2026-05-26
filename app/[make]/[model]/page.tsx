import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { FaultCard } from "@/components/fault/FaultCard";
import { ModelAlertForm } from "@/components/community/ModelAlertForm";
import { generateModelMetadata } from "@/lib/utils/seo";
import type { Make, Model, Variant } from "@/lib/types";

interface Props { params: Promise<{ make: string; model: string }> }

export const revalidate = 86400;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { make: makeSlug, model: modelSlug } = await params;
  const supabase = await createClient();
  const { data: model } = await supabase
    .from("models")
    .select("*, makes(*)")
    .eq("slug", modelSlug)
    .single();
  if (!model) return { title: "Model Not Found" };
  return generateModelMetadata(model as Model, model.makes as Make);
}

export async function generateStaticParams() {
  const { createBuildClient } = await import("@/lib/supabase/build");
  const supabase = createBuildClient();
  const { data } = await supabase.from("models").select("slug, makes(slug)");
  return (data ?? []).map((m: any) => ({ make: m.makes?.slug, model: m.slug }));
}

export default async function ModelPage({ params }: Props) {
  const { make: makeSlug, model: modelSlug } = await params;
  const supabase = await createClient();

  const { data: model } = await supabase
    .from("models")
    .select("*, makes(*)")
    .eq("slug", modelSlug)
    .single();

  if (!model || (model as any).makes?.slug !== makeSlug) notFound();

  const make = (model as any).makes as Make;

  const [{ data: variants }, { data: topFaults }, { data: motStats }, { data: buyerGuide }] = await Promise.all([
    supabase.from("variants").select("*").eq("model_id", model.id).order("year_start"),
    supabase
      .from("faults")
      .select("*, variants!inner(slug, name, models!inner(slug, name, makes!inner(slug, name)))")
      .eq("published", true)
      .eq("variants.model_id", model.id)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("mot_stats").select("*").eq("model_id", model.id).single(),
    supabase.from("buyer_guides").select("*").eq("model_id", model.id).single(),
  ]);

  return (
    <div>
      {model.image_url && (
        <div className="w-full h-64 md:h-80 relative overflow-hidden bg-gray-900">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={model.image_url} 
              alt={`${make.name} ${model.name}`}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-6 max-w-5xl mx-auto z-10 flex flex-col justify-end h-full pb-8">
             <Breadcrumb
               items={[
                 { label: "Home", href: "/" },
                 { label: "Makes", href: "/makes" },
                 { label: make.name, href: `/${makeSlug}` },
                 { label: model.name },
               ]}
               className="text-gray-300 mb-4 brightness-200"
             />
             <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
               {make.name} {model.name} Faults
             </h1>
             <p className="text-lg text-gray-300">
               Common problems, known issues, and reliability guide.
             </p>
          </div>
        </div>
      )}

      <div className={`max-w-5xl mx-auto px-4 ${model.image_url ? 'py-8' : 'py-10'}`}>
        {!model.image_url && (
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Makes", href: "/makes" },
              { label: make.name, href: `/${makeSlug}` },
              { label: model.name },
            ]}
          />
        )}
        
        {!model.image_url && (
          <div className="mt-8 mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] tracking-tight mb-4">
              {make.name} {model.name} Known Faults
            </h1>
            <p className="text-lg text-[#6B7280] leading-relaxed max-w-3xl">
              Browse the complete list of known faults for the {make.name} {model.name}. Select your specific variant below to see engine and year-specific problems.
            </p>
          </div>
        )}

      {model.description && <p className="text-[#374151] mb-8 max-w-3xl">{model.description}</p>}

      {motStats && (
        <div className="mb-12">
          <Link href={`/${makeSlug}/${modelSlug}/mot`} className="group block">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <svg className="w-24 h-24 text-blue-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              </div>
              <div className="flex items-center gap-4 mb-2">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">MOT Intelligence</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                View {make.name} {model.name} MOT Pass Rates
              </h2>
              <p className="text-gray-600 mb-4 max-w-2xl">
                See the official MOT pass rate ({motStats.pass_rate}%) and discover the top reasons this model fails its annual inspection. Based on real DVSA testing data.
              </p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                Read the MOT Report <span className="ml-2">→</span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {buyerGuide && (
        <div className="mb-12 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              Pre-Purchase Buyer's Guide
            </h2>
            <span className="text-sm font-medium text-gray-300">Expert Verdict</span>
          </div>
          
          <div className="p-6">
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {buyerGuide.verdict}
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex flex-col items-center justify-center text-center">
                <span className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-2">Repairability Score</span>
                <div className="text-4xl font-black text-gray-900 mb-1">{buyerGuide.repair_score}<span className="text-2xl text-gray-400">/100</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className={`h-2 rounded-full ${buyerGuide.repair_score > 75 ? 'bg-green-500' : buyerGuide.repair_score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${buyerGuide.repair_score}%` }}></div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex flex-col items-center justify-center text-center">
                <span className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-2">Reliability</span>
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-8 h-8 ${i < buyerGuide.reliability_rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex flex-col items-center justify-center text-center">
                <span className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-2">Running Costs</span>
                <div className="flex gap-1 text-green-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-8 h-8 ${i < buyerGuide.running_costs_rating ? 'text-green-500' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                <h3 className="text-green-800 font-bold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  What to Look For
                </h3>
                <ul className="space-y-2 text-green-900 text-sm">
                  {buyerGuide.what_to_look_for.split('\n').map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      <span>{item.replace(/^- /, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                <h3 className="text-red-800 font-bold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  What to Avoid
                </h3>
                <ul className="space-y-2 text-red-900 text-sm">
                  {buyerGuide.what_to_avoid.split('\n').map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      <span>{item.replace(/^- /, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold text-[#111827] mb-4">Variants</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-16">
        {(variants as Variant[] ?? []).map((variant) => (
          <Link
            key={variant.id}
            href={`/${makeSlug}/${modelSlug}/${variant.slug}`}
            className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:shadow-md hover:border-[#CC0000] transition-all"
          >
            <h3 className="font-semibold text-[#111827]">{variant.name}</h3>
            <div className="text-xs text-[#6B7280] mt-1 space-y-0.5">
              {variant.engine && <p>{variant.engine}</p>}
              <p>
                {variant.year_start}{variant.year_end ? `–${variant.year_end}` : "–present"}
                {variant.fuel_type ? ` · ${variant.fuel_type}` : ""}
                {variant.transmission ? ` · ${variant.transmission}` : ""}
              </p>
            </div>
            <p className="text-sm text-[#CC0000] font-medium mt-2">{variant.fault_count} faults</p>
          </Link>
        ))}
      </div>

      <ModelAlertForm modelId={model.id} makeName={make.name} modelName={model.name} />

      {topFaults && topFaults.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-[#111827] mb-4">
            Top Faults Across All {model.name} Variants
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(topFaults as any[]).map((fault) => {
              const v = fault.variants;
              const href = `/${makeSlug}/${modelSlug}/${v.slug}/${fault.slug}`;
              return <FaultCard key={fault.id} fault={fault} href={href} />;
            })}
          </div>
        </>
      )}
    </div>
  </div>
  );
}
