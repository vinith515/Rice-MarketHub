import { NextResponse } from "next/server";
import { visitorIntentSchema } from "@/lib/validations";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  createPublicServerClient,
  createServiceClient,
} from "@/lib/supabase/server";
import {
  addMockVisitorIntent,
  findMockVisitorById,
} from "@/lib/visitor-store";
import { addMockEnquiry } from "@/lib/data";
import type { Enquiry } from "@/types/database";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = visitorIntentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      visitor_id,
      product_id,
      message,
      quantity_unit,
      quantity_value,
      package_size_kg,
      source = "quick_intent",
    } = parsed.data;

    const intentRow = {
      visitor_id,
      product_id: product_id || null,
      message: message || null,
      quantity_unit: quantity_unit || null,
      quantity_value: quantity_value ?? null,
      package_size_kg: package_size_kg || null,
      source,
    };

    if (!isSupabaseConfigured()) {
      addMockVisitorIntent(intentRow);
      const visitor = findMockVisitorById(visitor_id);
      if (message && visitor) {
        const mockEnquiry: Enquiry = {
          id: crypto.randomUUID(),
          source: "visitor_intent",
          visitor_id,
          business_type: visitor.business_type,
          contact_name: visitor.contact_name,
          phone: visitor.phone,
          email: visitor.email,
          district_id: visitor.district_id,
          product_id: product_id || null,
          package_size_kg: package_size_kg || null,
          quantity_unit: quantity_unit || null,
          quantity_value: quantity_value ?? null,
          message,
          status: "new",
          metadata: { visitor_id },
          created_at: new Date().toISOString(),
        };
        await addMockEnquiry(mockEnquiry);
      }
      return NextResponse.json({ success: true });
    }

    const supabase = await createPublicServerClient();
    const { error: intentError } = await supabase
      .from("visitor_intents")
      .insert(intentRow);

    if (intentError) {
      return NextResponse.json({ error: intentError.message }, { status: 500 });
    }

    if (message?.trim()) {
      const adminClient = await createServiceClient();
      const { data: visitor } = await adminClient
        .from("site_visitors")
        .select("contact_name, phone, business_type, district_id")
        .eq("id", visitor_id)
        .single();

      if (visitor) {
        await supabase.from("enquiries").insert({
          source: "visitor_intent",
          visitor_id,
          business_type: visitor.business_type,
          contact_name: visitor.contact_name,
          phone: visitor.phone,
          email: null,
          district_id: visitor.district_id,
          product_id: product_id || null,
          package_size_kg: package_size_kg || null,
          quantity_unit: quantity_unit || null,
          quantity_value: quantity_value ?? null,
          message: message.trim(),
          status: "new",
          metadata: { visitor_id, intent_source: source },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
