import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { StickyWhatsAppBar } from "@/components/marketing/StickyWhatsAppBar";
import { AnalyticsTracker } from "@/components/marketing/AnalyticsTracker";
import { RicePhotoAmbience } from "@/components/marketing/RicePhotoAmbience";
import { getWhatsAppSettings } from "@/lib/get-whatsapp-settings";
export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const whatsappSettings = await getWhatsAppSettings();

  return (
    <>
      <AnalyticsTracker />
      <Header whatsappSettings={whatsappSettings} />
      <main className="relative isolate pb-20 md:pb-0 rice-page-bg min-h-screen overflow-x-hidden">
        <RicePhotoAmbience />
        <div className="relative z-10">{children}</div>
      </main>
      <div className="relative z-30 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
        <Footer />
      </div>
      <StickyWhatsAppBar />
    </>
  );
}
