"use client";

import { useEffect, useState } from "react";
import {
  buildGeneralEnquiryMessage,
  type VisitorContactContext,
} from "@/lib/whatsapp";
import { getStoredVisitor } from "@/lib/visitor-profile";

export function useVisitorWhatsAppMessage(extra?: { productInterest?: string }) {
  const [message, setMessage] = useState(() => buildGeneralEnquiryMessage());

  useEffect(() => {
    const v = getStoredVisitor();
    if (!v) {
      setMessage(buildGeneralEnquiryMessage());
      return;
    }
    const ctx: VisitorContactContext & { productInterest?: string } = {
      contactName: v.contact_name,
      phone: v.phone,
      businessType: v.business_type,
      district: v.district_name ?? undefined,
      placeName: v.place_name ?? undefined,
      productInterest: extra?.productInterest,
    };
    setMessage(buildGeneralEnquiryMessage(ctx));
  }, [extra?.productInterest]);

  return message;
}

export function visitorToWhatsAppContext(
  v: ReturnType<typeof getStoredVisitor>
): VisitorContactContext | undefined {
  if (!v) return undefined;
  return {
    contactName: v.contact_name,
    phone: v.phone,
    businessType: v.business_type,
    district: v.district_name ?? undefined,
    placeName: v.place_name ?? undefined,
  };
}
