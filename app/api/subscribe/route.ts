import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email, modelId } = await request.json();

    if (!email || !modelId) {
      return NextResponse.json({ error: "Email and Model ID are required" }, { status: 400 });
    }

    const supabase = await createServiceClient();

    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: email,
      model_id: modelId,
    });

    if (error) {
      // If it's a unique constraint violation, they are already subscribed. We can just return success to not leak info.
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: "Already subscribed" }, { status: 200 });
      }
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("Subscription error:", err.message);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
