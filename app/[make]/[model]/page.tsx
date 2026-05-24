import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { FaultCard } from "@/components/fault/FaultCard";
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

  const [{ data: variants }, { data: topFaults }] = await Promise.all([
    supabase.from("variants").select("*").eq("model_id", model.id).order("year_start"),
    supabase
      .from("faults")
      .select("*, variants!inner(slug, name, models!inner(slug, name, makes!inner(slug, name)))")
      .eq("published", true)
      .eq("variants.model_id", model.id)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: make.name, href: `/${makeSlug}` },
          { label: model.name },
        ]}
      />

      <div className="mt-6 mb-4">
        <h1 className="text-3xl font-bold text-[#111827]">
          {make.name} {model.name} Known Faults
        </h1>
        <p className="text-[#6B7280] mt-1">
          {model.year_start}{model.year_end ? `–${model.year_end}` : "–present"} ·{" "}
          {model.fault_count} known faults
        </p>
      </div>

      {model.description && <p className="text-[#374151] mb-8 max-w-3xl">{model.description}</p>}

      <h2 className="text-xl font-bold text-[#111827] mb-4">Variants</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
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
  );
}
