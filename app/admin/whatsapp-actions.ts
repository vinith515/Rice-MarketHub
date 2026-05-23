"use server";

import { revalidatePath } from "next/cache";
import { updateSiteContentAction } from "@/app/admin/actions";
import type { WhatsAppSettings } from "@/lib/whatsapp";

export async function saveWhatsAppSettingsAction(
  settings: WhatsAppSettings
) {
  const payload = {
    number: settings.number.replace(/\D/g, ""),
    group_invite_url: settings.group_invite_url?.trim() || null,
    group_enabled: settings.group_enabled && Boolean(settings.group_invite_url),
    direct_label: settings.direct_label,
    group_label: settings.group_label,
    group_description: settings.group_description,
  };

  const result = await updateSiteContentAction("whatsapp", payload);

  if (result.error) return { error: result.error };

  revalidatePath("/", "layout");
  revalidatePath("/contact");
  revalidatePath("/products");
  revalidatePath("/admin/whatsapp");

  return { success: true };
}
