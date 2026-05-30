export type StoredVisitorProfile = {
  id: string;
  contact_name: string;
  phone: string;
  business_type: string;
  district_id?: string | null;
  place_name?: string | null;
  district_name?: string | null;
};

const PROFILE_KEY = "rice_visitor_profile_v1";
const SESSION_INTENT_KEY = "rice_session_intent_done";

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export function getStoredVisitor(): StoredVisitorProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredVisitorProfile;
    if (!parsed?.id || !parsed.phone || !parsed.contact_name) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setStoredVisitor(profile: StoredVisitorProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearStoredVisitor(): void {
  localStorage.removeItem(PROFILE_KEY);
}

export function isSessionIntentDone(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_INTENT_KEY) === "1";
}

export function markSessionIntentDone(): void {
  sessionStorage.setItem(SESSION_INTENT_KEY, "1");
}

export function clearSessionIntentDone(): void {
  sessionStorage.removeItem(SESSION_INTENT_KEY);
}

export async function lookupVisitorByPhone(
  phone: string
): Promise<{ found: boolean; visitor: StoredVisitorProfile | null }> {
  const res = await fetch("/api/visitors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lookup: true, phone }),
  });
  if (!res.ok) return { found: false, visitor: null };
  return res.json();
}

export async function saveVisitorProfile(
  data: Omit<StoredVisitorProfile, "id"> & {
    email?: string;
  }
): Promise<StoredVisitorProfile> {
  const res = await fetch("/api/visitors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err.error === "string" ? err.error : "Could not save your details"
    );
  }
  const json = await res.json();
  const profile: StoredVisitorProfile = json.visitor;
  setStoredVisitor(profile);
  return profile;
}

export async function recordVisitorIntent(payload: {
  visitor_id: string;
  product_id?: string;
  message?: string;
  quantity_unit?: "quintals" | "bags";
  quantity_value?: number;
  package_size_kg?: number;
  source?: "quick_intent" | "whatsapp" | "form";
}): Promise<void> {
  await fetch("/api/visitor-intents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function getBusinessLabel(value: string): string {
  return value.replace(/_/g, " ");
}
