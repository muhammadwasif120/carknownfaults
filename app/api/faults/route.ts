import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createServiceClient();

  const { data: { session } } = await (await import("@/lib/supabase/server")).createClient().then((c) => c.auth.getSession());
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const { data, error } = await supabase.from("faults").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Update fault_count on variant (best-effort)
  try { await supabase.rpc("increment_variant_fault_count", { variant_uuid: body.variant_id }); } catch {}

  return NextResponse.json({ fault: data }, { status: 201 });
}
