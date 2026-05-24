import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { FaultCard } from "@/components/fault/FaultCard";
import { SeverityBadge } from "@/components/fault/SeverityBadge";
import { AdSlot } from "@/components/ads/AdSlot";
import { generateVariantMetadata } from "@/lib/utils/seo";
import type { Make, Model, Variant, Fault } from "@/lib/types";
import { CheckCircle } from "lucide-react";

interface Props { params: Promise<{ make: string; model: string; variant: string }> }

export const revalidate = 86400;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { make: makeSlug, model: modelSlug, variant: variantSlug } = await params;
  const supabase = await createClient();
  const { data: variant } = await supabase
    .from("variants")
    .select("*, models(*, makes(*))")
    .eq("slug", variantSlug)
    .single();
  if (!variant) return { title: "Variant Not Found" };
  const m = (variant as any).models as Model & { makes: Make };
  return generateVariantMetadata(variant as Variant, m, m.makes);
}

export async function generateStaticParams() {
  const { createBuildClient } = await import("@/lib/supabase/build");
  const supabase = createBuildClient();
  const { data } = await supabase.from("variants").select("slug, models(slug, makes(slug))");
  return (data ?? []).map((v: any) => ({
    make: v.models?.makes?.slug,
    model: v.models?.slug,
    variant: v.slug,
  }));
}

const severityOrder = ["critical", "severe", "moderate", "minor"];

export default async function VariantPage({ params }: Props) {
  const { make: makeSlug, model: modelSlug, variant: variantSlug } = await params;
  const supabase = await createClient();

  const { data: variant } = await supabase
    .from("variants")
    .select("*, models(*, makes(*))")
    .eq("slug", variantSlug)
    .single();

  if (!variant) notFound();
  const model = (variant as any).models as Model & { makes: Make };
  const make = model.makes as Make;

  if (make.slug !== makeSlug || model.slug !== modelSlug) notFound();

  const { data: faults } = await supabase
    .from("faults")
    .select("*")
    .eq("variant_id", variant.id)
    .eq("published", true);

  const sorted = ((faults as Fault[]) ?? []).sort(
    (a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
  );

  const checklist = [
    "Check service history — was oil changed regularly?",
    "Look for blue/black smoke on startup and under load",
    "Listen for rattles, knocking, or turbo whine",
    "Test all electrics including windows, AC, and central locking",
    "Check for DPF warning light or recent regenerations",
    "Inspect for rust underneath and around wheel arches",
    "Request a pre-purchase inspection by an independent mechanic",
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: make.name, href: `/${makeSlug}` },
          { label: model.name, href: `/${makeSlug}/${modelSlug}` },
          { label: variant.name },
        ]}
      />

      <div className="mt-6 mb-4">
        <h1 className="text-3xl font-bold text-[#111827]">
          {make.name} {model.name} {variant.name} Known Faults
        </h1>
        <div className="flex flex-wrap gap-3 mt-2 text-sm text-[#6B7280]">
          {variant.engine && <span>{variant.engine}</span>}
          {variant.year_start && (
            <span>{variant.year_start}{variant.year_end ? `–${variant.year_end}` : "–present"}</span>
          )}
          {variant.fuel_type && <span>{variant.fuel_type}</span>}
          {variant.transmission && <span>{variant.transmission}</span>}
          {variant.body_type && <span>{variant.body_type}</span>}
          <span className="text-[#CC0000] font-semibold">{variant.fault_count} known faults</span>
        </div>
      </div>

      {variant.description && (
        <p className="text-[#374151] mb-8 max-w-3xl">{variant.description}</p>
      )}

      {/* Pre-purchase checklist */}
      <div className="bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg p-6 mb-10">
        <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">
          <CheckCircle size={20} className="text-green-600" />
          What To Check Before Buying
        </h2>
        <ul className="space-y-2">
          {checklist.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#374151]">
              <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Faults list */}
      <h2 className="text-xl font-bold text-[#111827] mb-4">Known Faults</h2>
      {sorted.length === 0 ? (
        <p className="text-[#6B7280]">No faults recorded yet for this variant.</p>
      ) : (
        <div className="space-y-4">
          {sorted.map((fault, i) => (
            <>
              <FaultCard
                key={fault.id}
                fault={fault}
                href={`/${makeSlug}/${modelSlug}/${variantSlug}/${fault.slug}`}
              />
              {(i + 1) % 3 === 0 && (
                <AdSlot key={`ad-${i}`} slot="variant-between" format="rectangle" />
              )}
            </>
          ))}
        </div>
      )}

      <div className="mt-10 p-6 bg-[#111827] text-white rounded-lg text-center">
        <p className="font-semibold mb-2">Know a fault we&apos;ve missed?</p>
        <p className="text-gray-400 text-sm mb-4">
          Help the community by submitting known issues for this variant.
        </p>
        <a
          href="/submit"
          className="inline-block px-5 py-2 bg-[#CC0000] text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          Submit a Fault
        </a>
      </div>
    </div>
  );
}
