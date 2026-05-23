import { getWhatsAppSettings } from "@/lib/get-whatsapp-settings";
import { WhatsAppEnquiryOptions } from "./WhatsAppEnquiryOptions";
import { buildGeneralEnquiryMessage } from "@/lib/whatsapp";

type Props = {
  message?: string;
  productId?: string;
  layout?: "row" | "stack" | "compact";
  className?: string;
  showHint?: boolean;
};

/** Server wrapper — loads WhatsApp settings from CMS / env. */
export async function WhatsAppOptionsLoader({
  message,
  productId,
  layout,
  className,
  showHint,
}: Props) {
  const settings = await getWhatsAppSettings();
  const text = message ?? buildGeneralEnquiryMessage();

  return (
    <WhatsAppEnquiryOptions
      message={text}
      settings={settings}
      productId={productId}
      layout={layout}
      className={className}
      showHint={showHint}
    />
  );
}
