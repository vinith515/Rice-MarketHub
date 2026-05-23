import { getWhatsAppSettings } from "@/lib/get-whatsapp-settings";
import { StickyWhatsAppBarClient } from "./StickyWhatsAppBarClient";
import { buildGeneralEnquiryMessage } from "@/lib/whatsapp";

export async function StickyWhatsAppBar() {
  const settings = await getWhatsAppSettings();
  return (
    <StickyWhatsAppBarClient
      settings={settings}
      message={buildGeneralEnquiryMessage()}
    />
  );
}
