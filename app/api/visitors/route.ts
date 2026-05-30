import { NextResponse } from "next/server";
import {
  visitorLookupSchema,
  visitorProfileSchema,
} from "@/lib/validations";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  createPublicServerClient,
  createServiceClient,
} from "@/lib/supabase/server";
import {
  findMockVisitorByPhone,
  upsertMockVisitor,
} from "@/lib/visitor-store";
import type { StoredVisitorProfile } from "@/lib/visitor-profile";
import { normalizePhone } from "@/lib/visitor-profile";
import type { SiteVisitor } from "@/types/database";

function toStoredVisitor(
  row: SiteVisitor,
  districtName?: string | null
): StoredVisitorProfile {
  return {
    id: row.id,
    contact_name: row.contact_name,
    phone: row.phone,
    business_type: row.business_type,
    district_id: row.district_id,
    place_name: row.place_name,
    district_name: districtName ?? row.district?.display_name ?? null,
  };
}

async function fetchVisitorByPhone(
  phoneNormalized: string
): Promise<SiteVisitor | null> {
  const client = await createServiceClient();
  const { data, error } = await client.rpc("get_site_visitor_by_phone", {
    p_phone_normalized: phoneNormalized,
  });
  if (error || !data) {
    const { data: row } = await client
      .from("site_visitors")
      .select("*, district:districts(display_name)")
      .eq("phone_normalized", phoneNormalized)
      .maybeSingle();
    return row as SiteVisitor | null;
  }
  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.id) return null;
  const { data: full } = await client
    .from("site_visitors")
    .select("*, district:districts(display_name)")
    .eq("id", row.id)
    .single();
  return full as SiteVisitor | null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.lookup === true) {
      const parsed = visitorLookupSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
      }
      const phone_normalized = normalizePhone(parsed.data.phone);

      if (!isSupabaseConfigured()) {
        const row = findMockVisitorByPhone(phone_normalized);
        return NextResponse.json({
          found: Boolean(row),
          visitor: row ? toStoredVisitor(row) : null,
        });
      }

      const row = await fetchVisitorByPhone(phone_normalized);
      const districtName =
        row && typeof row.district === "object" && row.district
          ? (row.district as { display_name: string }).display_name
          : null;
      return NextResponse.json({
        found: Boolean(row),
        visitor: row ? toStoredVisitor(row, districtName) : null,
      });
    }

    const parsed = visitorProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const phone_normalized = normalizePhone(parsed.data.phone);
    const district_id = parsed.data.district_id || null;
    const payload = {
      contact_name: parsed.data.contact_name.trim(),
      phone: parsed.data.phone.trim(),
      phone_normalized,
      business_type: parsed.data.business_type,
      district_id,
      place_name: parsed.data.place_name?.trim() || null,
      email: parsed.data.email || null,
      last_seen_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!isSupabaseConfigured()) {
      const row = upsertMockVisitor(payload);
      return NextResponse.json({
        visitor: toStoredVisitor(row),
        is_returning: Boolean(
          findMockVisitorByPhone(phone_normalized)?.created_at !==
            row.created_at
        ),
      });
    }

    const supabase = await createPublicServerClient();
    const { data, error } = await supabase
      .from("site_visitors")
      .upsert(payload, { onConflict: "phone_normalized" })
      .select("*, district:districts(display_name)")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const districtName =
      data.district && typeof data.district === "object"
        ? (data.district as { display_name: string }).display_name
        : null;

    return NextResponse.json({
      visitor: toStoredVisitor(data as SiteVisitor, districtName),
      is_returning: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
