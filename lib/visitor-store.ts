import type { SiteVisitor, VisitorIntent } from "@/types/database";

const visitors: SiteVisitor[] = [];
const intents: VisitorIntent[] = [];

export function findMockVisitorByPhone(
  phoneNormalized: string
): SiteVisitor | undefined {
  return visitors.find((v) => v.phone_normalized === phoneNormalized);
}

export function findMockVisitorById(id: string): SiteVisitor | undefined {
  return visitors.find((v) => v.id === id);
}

export function upsertMockVisitor(
  data: Omit<SiteVisitor, "id" | "created_at" | "updated_at" | "last_seen_at"> & {
    id?: string;
  }
): SiteVisitor {
  const existing = findMockVisitorByPhone(data.phone_normalized);
  const now = new Date().toISOString();
  if (existing) {
    Object.assign(existing, {
      ...data,
      id: existing.id,
      updated_at: now,
      last_seen_at: now,
    });
    return existing;
  }
  const row: SiteVisitor = {
    id: data.id ?? crypto.randomUUID(),
    ...data,
    email: data.email ?? null,
    district_id: data.district_id ?? null,
    place_name: data.place_name ?? null,
    last_seen_at: now,
    created_at: now,
    updated_at: now,
  };
  visitors.unshift(row);
  return row;
}

export function addMockVisitorIntent(
  intent: Omit<VisitorIntent, "id" | "created_at">
): VisitorIntent {
  const row: VisitorIntent = {
    id: crypto.randomUUID(),
    ...intent,
    created_at: new Date().toISOString(),
  };
  intents.unshift(row);
  return row;
}
