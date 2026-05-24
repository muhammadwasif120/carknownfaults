import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "20");

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("faults")
    .select("*, variants(slug, name, models(slug, name, makes(slug, name)))")
    .eq("published", true)
    .textSearch("search_vector", q, { type: "websearch", config: "english" })
    .limit(limit);

  if (error) {
    // Fallback: simple ilike search if full-text fails
    const { data: fallback } = await supabase
      .from("faults")
      .select("*, variants(slug, name, models(slug, name, makes(slug, name)))")
      .eq("published", true)
      .or(`title.ilike.%${q}%,summary.ilike.%${q}%`)
      .limit(limit);
    return NextResponse.json({ results: fallback ?? [] });
  }

  return NextResponse.json({ results: data ?? [] });
}
