import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SeverityBadge } from "@/components/fault/SeverityBadge";
import { FaultSummaryBox } from "@/components/fault/FaultSummaryBox";
import { CostTable } from "@/components/fault/CostTable";
import { FaultCard } from "@/components/fault/FaultCard";
import { AdSlot } from "@/components/ads/AdSlot";
import { generateFaultMetadata, generateFaultHowToSchema } from "@/lib/utils/seo";
import type { Make, Model, Variant, Fault } from "@/lib/types";

interface Props {
  params: Promise<{ make: string; model: string; variant: string; fault: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const supabase = await createClient();
  const { data: fault } = await supabase
    .from("faults")
    .select("*, variants(*, models(*, makes(*)))")
    .eq("slug", p.fault)
    .single();
  if (!fault) return { title: "Fault Not Found" };
  const v = (fault as any).variants as Variant & { models: Model & { makes: Make } };
  return generateFaultMetadata(fault as Fault, v, v.models, v.models.makes);
}

export async function generateStaticParams() {
  const { createBuildClient } = await import("@/lib/supabase/build");
  const supabase = createBuildClient();
  const { data } = await supabase
    .from("faults")
    .select("slug, variants(slug, models(slug, makes(slug)))")
    .eq("published", true);
  return (data ?? []).map((f: any) => ({
    make: f.variants?.models?.makes?.slug,
    model: f.variants?.models?.slug,
    variant: f.variants?.slug,
    fault: f.slug,
  }));
}

export default async function FaultArticlePage({ params }: Props) {
  const p = await params;
  const supabase = await createClient();

  const { data: fault } = await supabase
    .from("faults")
    .select("*, variants(*, models(*, makes(*)))")
    .eq("slug", p.fault)
    .eq("published", true)
    .single();

  if (!fault) notFound();

  const variant = (fault as any).variants as Variant & { models: Model & { makes: Make } };
  const model = variant.models;
  const make = model.makes;

  if (make.slug !== p.make || model.slug !== p.model || variant.slug !== p.variant) notFound();

  // Related faults on same variant
  const { data: relatedFaults } = await supabase
    .from("faults")
    .select("*")
    .eq("variant_id", variant.id)
    .eq("published", true)
    .neq("id", fault.id)
    .limit(3);

  const howToSchema = generateFaultHowToSchema(fault as Fault);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: howToSchema }}
      />

      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: make.name, href: `/${p.make}` },
          { label: model.name, href: `/${p.make}/${p.model}` },
          { label: variant.name, href: `/${p.make}/${p.model}/${p.variant}` },
          { label: fault.title },
        ]}
      />

      {/* Fault header */}
      <div className="mt-6 mb-4">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <SeverityBadge severity={fault.severity} />
          {fault.affected_years && (
            <span className="text-sm text-[#6B7280]">Affected: {fault.affected_years}</span>
          )}
          {fault.mileage_start && (
            <span className="text-sm text-[#6B7280]">
              {fault.mileage_start.toLocaleString()}–{fault.mileage_end?.toLocaleString() ?? "+"} miles
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-[#111827]">
          {make.name} {model.name} {variant.name} — {fault.title}
        </h1>
        <p className="text-[#374151] mt-2 text-lg">{fault.summary}</p>
      </div>

      {/* Quick summary box */}
      <div className="mb-8">
        <FaultSummaryBox fault={fault as Fault} />
      </div>

      <AdSlot slot="fault-article-1" format="rectangle" />

      {/* Symptoms */}
      <section className="mt-8 mb-6">
        <h2 className="text-xl font-bold text-[#111827] mb-3">Symptoms</h2>
        <div className="prose prose-slate max-w-none text-[#374151]">
          <ReactMarkdown>{fault.symptoms}</ReactMarkdown>
        </div>
      </section>

      {/* Root Cause */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-[#111827] mb-3">Root Cause</h2>
        <div className="prose prose-slate max-w-none text-[#374151]">
          <ReactMarkdown>{fault.cause}</ReactMarkdown>
        </div>
      </section>

      {/* How to Fix */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#111827] mb-3">How To Fix</h2>
        <div className="prose prose-slate max-w-none text-[#374151]">
          <ReactMarkdown>{fault.fix}</ReactMarkdown>
        </div>
      </section>

      {/* Cost table */}
      {fault.repair_cost_low && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#111827] mb-3">Estimated Repair Costs</h2>
          <CostTable costLow={fault.repair_cost_low} costHigh={fault.repair_cost_high!} />
        </section>
      )}

      <AdSlot slot="fault-article-2" format="leaderboard" />

      {/* Related faults */}
      {relatedFaults && relatedFaults.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-[#111827] mb-4">
            Other Faults on This Variant
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(relatedFaults as Fault[]).map((f) => (
              <FaultCard
                key={f.id}
                fault={f}
                href={`/${p.make}/${p.model}/${p.variant}/${f.slug}`}
              />
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 p-5 bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg">
        <p className="text-sm text-[#6B7280]">
          <strong className="text-[#111827]">Disclaimer:</strong> Repair cost estimates are indicative
          and based on community data. Always get a quote from a qualified mechanic before proceeding
          with any repair.
        </p>
      </div>
    </div>
  );
}
