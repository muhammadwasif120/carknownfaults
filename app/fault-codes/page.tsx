import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "OBD-II Fault Code Library | Car Known Faults",
  description: "Search our massive library of standard OBD-II diagnostic trouble codes (DTCs). Find out what your Check Engine Light means and which cars are commonly affected.",
};

export const revalidate = 86400;

export default async function ObdCodesHubPage() {
  const supabase = await createClient();
  const { data: codes } = await supabase.from("obd_codes").select("*").order("code");

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "OBD-II Code Library" }]} />
      
      <div className="mt-8 mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          OBD-II Fault Code Library
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          Got a Check Engine Light? Plug in a scanner, get the code, and look it up here. We provide the generic meaning, common causes, and cross-reference the code against known faults in specific cars.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {codes?.map((code: any) => (
          <Link
            key={code.id}
            href={`/fault-codes/${code.code}`}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-blue-500 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                {code.code}
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                code.severity === 'severe' ? 'bg-red-100 text-red-800' :
                code.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {code.severity}
              </span>
            </div>
            <h2 className="font-semibold text-gray-800 mb-2 line-clamp-2">{code.title}</h2>
            <p className="text-sm text-gray-500 line-clamp-2">{code.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
