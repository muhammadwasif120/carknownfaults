import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { MakeCard } from "@/components/makes/MakeCard";
import type { Make } from "@/lib/types";

export const metadata: Metadata = {
  title: "All Car Makes | Browse by Brand | CKF",
  description: "Browse known faults for every car brand A–Z. Select a make to see all models and their known issues.",
};

export const revalidate = 86400;

export default async function MakesPage() {
  const supabase = await createClient();
  const { data: makes } = await supabase.from("makes").select("*").order("name");

  const grouped: Record<string, Make[]> = {};
  for (const make of (makes ?? []) as Make[]) {
    const letter = make.name[0].toUpperCase();
    grouped[letter] = grouped[letter] ?? [];
    grouped[letter].push(make);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#111827] mb-2">All Car Makes</h1>
      <p className="text-[#6B7280] mb-10">
        {makes?.length ?? 0} makes in the database. Select a brand to browse models and known faults.
      </p>

      {Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([letter, letterMakes]) => (
          <div key={letter} className="mb-8">
            <h2 className="text-lg font-bold text-[#CC0000] border-b border-[#E5E7EB] pb-2 mb-4">{letter}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {letterMakes.map((make) => (
                <MakeCard key={make.id} make={make} />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
