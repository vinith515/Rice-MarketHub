import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validations";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createPublicServerClient } from "@/lib/supabase/server";
import { addMockEnquiry } from "@/lib/data";
import type { Enquiry } from "@/types/database";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = enquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    if (parsed.data.website) {
      return NextResponse.json({ success: true });
    }

    const enquiryData = {
      source: (body.source as string) || "form",
      business_type: parsed.data.business_type,
      contact_name: parsed.data.contact_name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      district_id: parsed.data.district_id || null,
      product_id: parsed.data.product_id || null,
      package_size_kg: parsed.data.package_size_kg || null,
      quantity_unit: parsed.data.quantity_unit || null,
      quantity_value: parsed.data.quantity_value ?? null,
      message: parsed.data.message,
      status: "new" as const,
      metadata: {},
    };

    if (!isSupabaseConfigured()) {
      const mockEnquiry: Enquiry = {
        id: crypto.randomUUID(),
        ...enquiryData,
        source: enquiryData.source as "form" | "whatsapp_click",
        email: enquiryData.email,
        created_at: new Date().toISOString(),
      };
      await addMockEnquiry(mockEnquiry);
      return NextResponse.json({ success: true, id: mockEnquiry.id });
    }

    const supabase = await createPublicServerClient();
    const { data, error } = await supabase
      .from("enquiries")
      .insert(enquiryData)
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
