"use client";

export type AnalyticsEventType =
  | "page_view"
  | "product_view"
  | "enquiry_submit"
  | "whatsapp_click";

export type AnalyticsPayload = {
  path?: string;
  product_id?: string;
  district_id?: string;
  metadata?: Record<string, unknown>;
};

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  const key = "rice_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export async function trackEvent(
  eventType: AnalyticsEventType,
  payload: AnalyticsPayload = {}
) {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: eventType,
        path: payload.path ?? window.location.pathname,
        product_id: payload.product_id,
        district_id: payload.district_id,
        session_id: getSessionId(),
        metadata: payload.metadata,
      }),
    });
  } catch {
    // Non-blocking analytics
  }
}
