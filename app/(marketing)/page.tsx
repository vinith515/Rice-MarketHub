import Link from "next/link";
import { AdminLoginTrigger } from "@/components/marketing/AdminLoginPanel";
import {
  getProducts,
  getSiteContent,
  getTestimonials,
} from "@/lib/data";
import { getWhatsAppSettings } from "@/lib/get-whatsapp-settings";
import { Hero } from "@/components/marketing/Hero";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { ProductCard } from "@/components/marketing/ProductCard";
import { StatsSection } from "@/components/marketing/StatsSection";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { Button } from "@/components/ui/button";
import { WhatsAppOptionsLoader } from "@/components/marketing/WhatsAppOptionsLoader";
export default async function HomePage() {
  const [heroContent, statsContent, featuredProducts, testimonials, whatsappSettings] =
    await Promise.all([
      getSiteContent("hero"),
      getSiteContent("stats"),
      getProducts({ featured: true }),
      getTestimonials(),
      getWhatsAppSettings(),
    ]);

  return (
    <>
      <Hero
        content={heroContent as Record<string, string> | null}
        whatsappSettings={whatsappSettings}
      />
      <StatsSection stats={statsContent as Record<string, string> | null} />

      <section className="section-padding rice-section-surface content-visibility-auto">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Our Collection"
            title="Premium Rice Varieties"
            description="Curated for retailers, hotels, restaurants, and bulk buyers."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {featuredProducts.slice(0, 3).map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                whatsappSettings={whatsappSettings}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="gold" size="lg">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      <TestimonialsSection testimonials={testimonials} />

      <section className="section-padding bg-charcoal text-cream relative overflow-hidden border-t border-gold/20">
        <div className="max-w-7xl mx-auto text-center relative z-10 rice-section-frame">
          <SectionHeading
            eyebrow="Get Started"
            title="Ready to Place a Bulk Enquiry?"
            description="Quote in quintals or bags — prices shown per kg on each variety."
            light
          />
          <div className="flex flex-col items-center gap-4 max-w-lg mx-auto">
            <WhatsAppOptionsLoader layout="stack" showHint />
            <Button asChild variant="gold" size="lg">
              <Link href="/contact">Contact form</Link>
            </Button>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10">
            <AdminLoginTrigger />
          </div>
        </div>
      </section>
    </>
  );
}
