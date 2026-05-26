import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { FaultCard } from "@/components/fault/FaultCard";
import { StatBadge } from "@/components/ui/StatBadge";
import { generateMakeMetadata, generateMakePageSchema } from "@/lib/utils/seo";
import type { Make, Model, Fault } from "@/lib/types";
import Link from "next/link";

interface Props { params: Promise<{ make: string }> }

export const revalidate = 86400;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { make: makeSlug } = await params;
  const supabase = await createClient();
  const { data: make } = await supabase.from("makes").select("*").eq("slug", makeSlug).single();
  if (!make) return { title: "Make Not Found" };
  return generateMakeMetadata(make as Make);
}

export async function generateStaticParams() {
  const { createBuildClient } = await import("@/lib/supabase/build");
  const supabase = createBuildClient();
  const { data } = await supabase.from("makes").select("slug");
  return (data ?? []).map((m) => ({ make: m.slug }));
}

export default async function MakePage({ params }: Props) {
  const { make: makeSlug } = await params;
  const supabase = await createClient();

  const [{ data: make }, { data: models }] = await Promise.all([
    supabase.from("makes").select("*").eq("slug", makeSlug).single(),
    supabase.from("models").select("*").eq("make_id", (await supabase.from("makes").select("id").eq("slug", makeSlug).single()).data?.id ?? "").order("name"),
  ]);

  if (!make) notFound();

  const { data: topFaults } = await supabase
    .from("faults")
    .select("*, variants!inner(slug, name, model_id, models!inner(slug, name, make_id, makes!inner(slug, name)))")
    .eq("published", true)
    .eq("variants.models.makes.slug", makeSlug)
    .order("created_at", { ascending: false })
    .limit(5);

  const makePageSchema = generateMakePageSchema(make as Make, (models ?? []) as Model[]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: makePageSchema }} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: make.name }]} />

      <div className="mt-6 mb-8 flex items-start gap-6">
        {make.logo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={make.logo_url} alt={make.name} className="h-16 w-16 object-contain" />
        )}
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">{make.name} Known Faults</h1>
          <p className="text-[#6B7280] mt-1">{make.country ?? ""}</p>
        </div>
        <div className="ml-auto">
          <StatBadge value={make.fault_count} label="Known Faults" />
        </div>
      </div>

      {make.description && (
        <p className="text-[#374151] mb-8 max-w-3xl">{make.description}</p>
      )}

      <h2 className="text-xl font-bold text-[#111827] mb-4">Models</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
        {(models as Model[] ?? []).map((model) => (
          <Link
            key={model.id}
            href={`/${makeSlug}/${model.slug}`}
            className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:shadow-md hover:border-[#CC0000] transition-all"
          >
            <h3 className="font-semibold text-[#111827]">{model.name}</h3>
            <p className="text-sm text-[#6B7280] mt-1">
              {model.year_start}{model.year_end ? `–${model.year_end}` : "–present"}
            </p>
            <p className="text-sm text-[#CC0000] font-medium mt-1">
              {model.fault_count} faults
            </p>
          </Link>
        ))}
      </div>

      {topFaults && topFaults.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-[#111827] mb-4">Most Reported Faults</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(topFaults as any[]).slice(0, 5).map((fault) => {
              const v = fault.variants;
              const href = `/${makeSlug}/${v.models?.slug}/${v.slug}/${fault.slug}`;
              return <FaultCard key={fault.id} fault={fault} href={href} />;
            })}
          </div>
        </>
      )}
    </div>
  );
}
