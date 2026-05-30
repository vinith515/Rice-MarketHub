export type WhatsAppSettings = {
  number: string;
  group_invite_url: string | null;
  group_enabled: boolean;
  direct_label: string;
  group_label: string;
  group_description: string;
};

export type VisitorContactContext = {
  contactName?: string;
  phone?: string;
  businessType?: string;
  district?: string;
  placeName?: string;
};

export type ProductEnquiryParams = VisitorContactContext & {
  brandName?: string | null;
  productName: string;
  categoryName?: string | null;
  packageKg?: number;
  pricePerKg?: number | null;
  quantityUnit?: "quintals" | "bags";
  quantityValue?: number;
};

function appendVisitorLines(parts: string[], ctx: VisitorContactContext) {
  if (ctx.contactName?.trim()) {
    parts.push(`Name: ${ctx.contactName.trim()}.`);
  }
  if (ctx.phone?.trim()) {
    parts.push(`Phone: ${ctx.phone.trim()}.`);
  }
  const businessPart = ctx.businessType
    ? `Business type: ${ctx.businessType.replace(/_/g, " ")}.`
    : null;
  if (businessPart) parts.push(businessPart);
  if (ctx.district?.trim()) parts.push(`District: ${ctx.district.trim()}.`);
  if (ctx.placeName?.trim()) parts.push(`Place: ${ctx.placeName.trim()}.`);
}

const DEFAULT_SETTINGS: WhatsAppSettings = {
  number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210",
  group_invite_url: process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || null,
  group_enabled: Boolean(process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL),
  direct_label: "Enquire on WhatsApp",
  group_label: "Business WhatsApp Group",
  group_description:
    "Join our team group — multiple members can respond to your bulk rice enquiry faster.",
};

export function getDefaultWhatsAppSettings(): WhatsAppSettings {
  return { ...DEFAULT_SETTINGS };
}

export function parseWhatsAppSettings(
  value: unknown
): WhatsAppSettings {
  const defaults = getDefaultWhatsAppSettings();
  if (!value || typeof value !== "object") return defaults;

  const v = value as Record<string, unknown>;
  return {
    number: String(v.number ?? defaults.number).replace(/\D/g, "") || defaults.number,
    group_invite_url:
      typeof v.group_invite_url === "string" && v.group_invite_url.trim()
        ? v.group_invite_url.trim()
        : defaults.group_invite_url,
    group_enabled:
      typeof v.group_enabled === "boolean"
        ? v.group_enabled
        : Boolean(v.group_invite_url ?? defaults.group_invite_url),
    direct_label: String(v.direct_label ?? defaults.direct_label),
    group_label: String(v.group_label ?? defaults.group_label),
    group_description: String(
      v.group_description ?? defaults.group_description
    ),
  };
}

export function buildProductEnquiryMessage({
  brandName,
  productName,
  categoryName,
  packageKg,
  businessType,
  district,
  placeName,
  contactName,
  phone,
  pricePerKg,
  quantityUnit,
  quantityValue,
}: ProductEnquiryParams): string {
  const parts: string[] = ["Hello, I would like to enquire about bulk rice supply."];
  appendVisitorLines(parts, {
    contactName,
    phone,
    businessType,
    district,
    placeName,
  });

  if (brandName?.trim()) {
    parts.push(`Brand: ${brandName.trim()}.`);
  }
  parts.push(`Variety: ${productName}.`);
  if (categoryName?.trim()) {
    parts.push(`Rice type: ${categoryName.trim()}.`);
  }
  if (pricePerKg != null) {
    parts.push(`Indicative rate: ₹${pricePerKg}/kg.`);
  }

  if (quantityUnit && quantityValue != null && quantityValue > 0) {
    if (quantityUnit === "quintals") {
      parts.push(`Quantity required: ${quantityValue} quintal(s).`);
    } else if (packageKg) {
      parts.push(
        `Quantity required: ${quantityValue} bag(s) of ${packageKg} kg each.`
      );
    } else {
      parts.push(`Quantity required: ${quantityValue} bag(s).`);
    }
  } else if (packageKg) {
    parts.push(`Preferred pack size: ${packageKg} kg bags.`);
    parts.push(`Quantity required: [please specify number of bags or quintals].`);
  } else {
    parts.push(`Quantity required: [please specify quintals or bags].`);
  }

  return parts.join(" ");
}

export function buildGeneralEnquiryMessage(
  ctx?: VisitorContactContext & { productInterest?: string }
): string {
  const parts: string[] = [
    "Hello, I would like to enquire about bulk rice supply across Telangana.",
  ];
  if (ctx) {
    appendVisitorLines(parts, ctx);
    if (ctx.productInterest?.trim()) {
      parts.push(`Looking for: ${ctx.productInterest.trim()}.`);
    }
  }
  return parts.join(" ");
}

/** Direct chat with your business number (prefilled message). */
export function getWhatsAppDirectUrl(
  message: string,
  number?: string
): string {
  const cleanNumber = (number || DEFAULT_SETTINGS.number).replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/** @deprecated Use getWhatsAppDirectUrl */
export function getWhatsAppUrl(message: string): string {
  return getWhatsAppDirectUrl(message);
}

/** Group invite — team members handle enquiries in the group. */
export function getWhatsAppGroupUrl(inviteUrl: string): string {
  const url = inviteUrl.trim();
  if (url.startsWith("http")) return url;
  return `https://chat.whatsapp.com/${url.replace(/^\/+/, "")}`;
}

export function isGroupConfigured(settings: WhatsAppSettings): boolean {
  return Boolean(
    settings.group_enabled &&
      settings.group_invite_url &&
      settings.group_invite_url.length > 10
  );
}
