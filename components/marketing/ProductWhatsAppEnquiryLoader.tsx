import { getWhatsAppSettings } from "@/lib/get-whatsapp-settings";
import { ProductWhatsAppEnquiry } from "./ProductWhatsAppEnquiry";
import type { Product } from "@/types/database";

export async function ProductWhatsAppEnquiryLoader({
  product,
}: {
  product: Product;
}) {
  const settings = await getWhatsAppSettings();
  return <ProductWhatsAppEnquiry product={product} settings={settings} layout="stack" />;
}
