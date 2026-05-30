import { getWhatsAppSettings } from "@/lib/get-whatsapp-settings";
import { StickyWhatsAppBarClient } from "./StickyWhatsAppBarClient";
export async function StickyWhatsAppBar() {
  const settings = await getWhatsAppSettings();
  return <StickyWhatsAppBarClient settings={settings} />;
}
