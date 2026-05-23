import { NextResponse } from "next/server";
import { analyticsSchema } from "@/lib/validations";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createPublicServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = analyticsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true });
    }

    const supabase = await createPublicServerClient();
    const { error } = await supabase.from("analytics_events").insert({
      event_type: parsed.data.event_type,
      path: parsed.data.path,
      product_id: parsed.data.product_id,
      district_id: parsed.data.district_id,
      session_id: parsed.data.session_id,
      metadata: parsed.data.metadata ?? {},
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
