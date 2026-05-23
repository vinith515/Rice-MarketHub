import { getBrands, getCategories, getProducts } from "@/lib/data";
import { getWhatsAppSettings } from "@/lib/get-whatsapp-settings";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { ProductCatalog } from "@/components/marketing/ProductCatalog";
export const metadata = {
  title: "Products",
  description:
    "Search by brand and browse Basmati, HMT Sona Masoori, and Sona Masoori varieties. Bulk packaging from 5kg to 50kg.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const [categories, products, brands, whatsappSettings] = await Promise.all([
    getCategories(),
    getProducts(),
    getBrands(),
    getWhatsAppSettings(),
  ]);

  return (
    <div className="pt-28">
      <section className="section-padding rice-section-surface">
        <div className="max-w-7xl mx-auto">
          <div className="rice-section-frame text-center mb-4">
            <SectionHeading
              eyebrow="Product Showcase"
              title="Every Brand & Variety You Stock"
              description="Search by brand, filter by rice type, and view indicative ₹/kg prices. Submit enquiries in quintals or bags."
            />
          </div>
          <div className="rice-divider mb-8" />

          <ProductCatalog
            products={products}
            categories={categories}
            brands={brands}
            whatsappSettings={whatsappSettings}
            initialCategory={searchParams.category}
            initialQuery={searchParams.q}
          />
        </div>
      </section>
    </div>
  );
}
