/** Public site name — brand logos (Veer, etc.) stay on product cards only */

export type BusinessBrandAssets = {
  businessName: string;
  /** Only if NEXT_PUBLIC_BUSINESS_LOGO is set — never a product brand logo */
  logoUrl: string | null;
};

export async function getBusinessBrandAssets(): Promise<BusinessBrandAssets> {
  const businessName =
    process.env.NEXT_PUBLIC_BUSINESS_NAME || "Telangana Premium Rice";
  const logoUrl = process.env.NEXT_PUBLIC_BUSINESS_LOGO?.trim() || null;
  return { businessName, logoUrl };
}
