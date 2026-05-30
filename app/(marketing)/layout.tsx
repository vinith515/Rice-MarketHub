import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { StickyWhatsAppBar } from "@/components/marketing/StickyWhatsAppBar";
import { AnalyticsTracker } from "@/components/marketing/AnalyticsTracker";
import { RicePhotoAmbience } from "@/components/marketing/RicePhotoAmbience";
import { VisitorProfileProvider } from "@/components/marketing/VisitorProfileProvider";
import { VisitorIntentBar } from "@/components/marketing/VisitorIntentBar";
import { getWhatsAppSettings } from "@/lib/get-whatsapp-settings";
import { getDistricts, getProducts } from "@/lib/data";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [whatsappSettings, districts, products] = await Promise.all([
    getWhatsAppSettings(),
    getDistricts(),
    getProducts(),
  ]);

  const productOptions = products.map((p) => ({ id: p.id, name: p.name }));

  return (
    <VisitorProfileProvider districts={districts} products={productOptions}>
      <AnalyticsTracker />
      <Header whatsappSettings={whatsappSettings} />
      <VisitorIntentBar />
      <main className="relative isolate pb-[calc(5rem+env(safe-area-inset-bottom,0px))] lg:pb-0 rice-page-bg min-h-screen overflow-x-hidden">
        <RicePhotoAmbience />
        <div className="relative z-10">{children}</div>
      </main>
      <div className="relative z-30 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
        <Footer />
      </div>
      <StickyWhatsAppBar />
    </VisitorProfileProvider>
  );
}
