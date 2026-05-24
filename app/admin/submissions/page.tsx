import { createClient } from "@/lib/supabase/server";

export default async function AdminSubmissionsPage() {
  const supabase = await createClient();

  let submissions: any[] = [];
  try {
    const { data } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    submissions = data ?? [];
  } catch {
    submissions = [];
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">Community Submissions</h1>
      {submissions.length === 0 ? (
        <p className="text-[#6B7280]">No submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((s: any) => (
            <div key={s.id} className="bg-white border border-[#E5E7EB] rounded-lg p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-[#111827]">{s.title}</h3>
                <span className="text-xs text-[#6B7280]">{new Date(s.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-[#6B7280] mb-2">{s.make} {s.model} {s.variant} · {s.year_range}</p>
              <p className="text-sm text-[#374151]">{s.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
