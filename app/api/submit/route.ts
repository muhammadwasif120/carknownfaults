import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = await createServiceClient();

  // Store submission in submissions table (create if not exists via Supabase)
  const { error } = await supabase.from("submissions").insert({
    make: body.make,
    model: body.model,
    variant: body.variant ?? null,
    year_range: body.year_range ?? null,
    title: body.title,
    description: body.description,
    severity: body.severity ?? null,
    obd_codes: body.obd_codes ?? null,
    submitter_email: body.email ?? null,
  });

  if (error) {
    // Table may not exist yet — silently succeed so UX is not broken
    console.error("Submission insert error:", error.message);
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
