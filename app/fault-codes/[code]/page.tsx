import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { FaultCard } from "@/components/fault/FaultCard";

interface Props { params: Promise<{ code: string }> }

export const revalidate = 86400;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const supabase = await createClient();
  const { data: obd } = await supabase
    .from("obd_codes")
    .select("code, title")
    .ilike("code", code)
    .single();

  if (!obd) return { title: "Code Not Found" };

  return {
    title: `${obd.code} OBD-II Fault Code: ${obd.title} | Car Known Faults`,
    description: `Learn what the ${obd.code} Check Engine Light code means, common symptoms, causes, and see a list of specific cars known to suffer from this fault.`,
  };
}

export default async function ObdCodePage({ params }: Props) {
  const { code } = await params;
  const supabase = await createClient();

  // 1. Fetch the generic OBD code
  const { data: obd } = await supabase
    .from("obd_codes")
    .select("*")
    .ilike("code", code)
    .single();

  if (!obd) notFound();

  // 2. Fetch all specific car faults that contain this code
  // We use the contains operator @> to search the jsonb/array column
  const { data: relatedFaults } = await supabase
    .from("faults")
    .select("*, variants!inner(slug, name, models!inner(slug, name, makes!inner(slug, name)))")
    .eq("published", true)
    .contains("obd_codes", [obd.code.toUpperCase()]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "OBD-II Codes", href: "/fault-codes" },
          { label: obd.code },
        ]}
      />

      <div className="mt-8 mb-10">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl font-black text-gray-900 tracking-tighter">{obd.code}</span>
          <span className={`text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
            obd.severity === 'severe' ? 'bg-red-100 text-red-800' :
            obd.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {obd.severity} Severity
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{obd.title}</h1>
        <p className="text-lg text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-100">
          {obd.description}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            Common Symptoms
          </h2>
          <ul className="space-y-3 text-red-800">
            {obd.symptoms.split('\n').map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span>{item.replace(/^- /, '')}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-orange-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Generic Causes
          </h2>
          <ul className="space-y-3 text-orange-800">
            {obd.causes.split('\n').map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <span>{item.replace(/^- /, '')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <hr className="my-12 border-gray-200" />

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Known Cars Affected by {obd.code}</h2>
      <p className="text-gray-600 mb-8">
        We have cross-referenced {obd.code} against our database of known faults. Below are specific cars where this code frequently appears, along with the detailed diagnostic and repair instructions for that specific vehicle.
      </p>

      {(!relatedFaults || relatedFaults.length === 0) ? (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 text-center">
          <p className="text-blue-800">We don't currently have any specific car faults recorded in our database that trigger the {obd.code} code. However, the generic causes listed above should guide your diagnostic process.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(relatedFaults as any[]).map((fault) => {
            const v = fault.variants;
            const makeSlug = v.models.makes.slug;
            const modelSlug = v.models.slug;
            const variantSlug = v.slug;
            const href = `/${makeSlug}/${modelSlug}/${variantSlug}/${fault.slug}`;
            
            return (
              <FaultCard key={fault.id} fault={fault} href={href} />
            );
          })}
        </div>
      )}
    </div>
  );
}
