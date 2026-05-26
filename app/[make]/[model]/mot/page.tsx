import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

interface Props { params: Promise<{ make: string; model: string }> }

export const revalidate = 86400;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { make: makeSlug, model: modelSlug } = await params;
  const supabase = await createClient();
  const { data: model } = await supabase
    .from("models")
    .select("name, makes!inner(name)")
    .eq("slug", modelSlug)
    .single();

  if (!model) return { title: "Not Found" };
  const makeName = (model as any).makes.name;

  return {
    title: `${makeName} ${model.name} MOT Pass Rates & Common Failures`,
    description: `Official MOT pass rates and the top reasons the ${makeName} ${model.name} fails its MOT test. Based on DVSA data.`,
  };
}

export default async function ModelMotPage({ params }: Props) {
  const { make: makeSlug, model: modelSlug } = await params;
  const supabase = await createClient();

  const { data: model } = await supabase
    .from("models")
    .select("*, makes!inner(*), mot_stats(*)")
    .eq("slug", modelSlug)
    .single();

  if (!model || (model as any).makes?.slug !== makeSlug || !(model as any).mot_stats || (model as any).mot_stats.length === 0) {
    notFound();
  }

  const make = (model as any).makes;
  const motStats = (model as any).mot_stats[0];
  
  // Calculate stroke dasharray for the circular progress (circumference = 2 * pi * r)
  // r = 60, circumference = 2 * 3.14159 * 60 = 376.99
  const circumference = 376.99;
  const strokeDashoffset = circumference - (motStats.pass_rate / 100) * circumference;

  let colorClass = "text-green-500";
  if (motStats.pass_rate < 70) colorClass = "text-red-500";
  else if (motStats.pass_rate < 80) colorClass = "text-yellow-500";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: make.name, href: `/${makeSlug}` },
          { label: model.name, href: `/${makeSlug}/${modelSlug}` },
          { label: "MOT Pass Rates" },
        ]}
      />

      <div className="mt-8 mb-12">
        <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 inline-block">MOT Intelligence</span>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          {make.name} {model.name} MOT Pass Rates
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Based on DVSA test data, here is the real-world performance of the {make.name} {model.name} during its annual MOT inspection.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Overall Pass Rate</h2>
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 140 140">
              <circle
                cx="70" cy="70" r="60"
                fill="transparent"
                stroke="#F3F4F6"
                strokeWidth="12"
              />
              {/* Progress Circle */}
              <circle
                cx="70" cy="70" r="60"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
                className={`transition-all duration-1000 ease-out ${colorClass}`}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="text-center">
              <span className="text-4xl font-extrabold text-gray-900">{motStats.pass_rate}%</span>
              <p className="text-sm text-gray-500 mt-1">Pass Rate</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-6 font-medium">Based on {motStats.tested_count.toLocaleString()} tests</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            Top Reasons for Failure
          </h2>
          <ul className="space-y-4">
            {[motStats.top_failure_1, motStats.top_failure_2, motStats.top_failure_3].filter(Boolean).map((reason, index) => (
              <li key={index} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">{reason}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">Commonly flagged as a major or dangerous defect.</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Want the full picture?</h2>
          <p className="text-blue-800">
            MOT data only tells half the story. See the deeply researched common mechanical faults, symptoms, and repair costs for the {model.name}.
          </p>
        </div>
        <Link
          href={`/${makeSlug}/${modelSlug}`}
          className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          View Known Faults
        </Link>
      </div>
    </div>
  );
}
