import { getSiteContent } from "@/lib/data";
import {
  getDefaultWhatsAppSettings,
  parseWhatsAppSettings,
  type WhatsAppSettings,
} from "@/lib/whatsapp";

export async function getWhatsAppSettings(): Promise<WhatsAppSettings> {
  const content = await getSiteContent("whatsapp");
  if (!content) return getDefaultWhatsAppSettings();
  return parseWhatsAppSettings(content);
}
