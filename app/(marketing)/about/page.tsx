import Image from "next/image";
import { getSiteContent } from "@/lib/data";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Warehouse, Shield, Truck, Users } from "lucide-react";

export const metadata = {
  title: "About Us",
  description:
    "Family-owned rice distribution heritage, warehouse operations, and Telangana supply network.",
};

export default async function AboutPage() {
  const about = (await getSiteContent("about")) as Record<string, string> | null;

  const blocks = [
    {
      icon: Users,
      title: "Family Heritage",
      text:
        about?.heritage ||
        "A family-owned rice distribution business built on trust, quality, and relationships across Telangana.",
    },
    {
      icon: Warehouse,
      title: "Warehouse Operations",
      text:
        about?.warehouse ||
        "State-of-the-art warehousing with climate-controlled storage ensuring grain freshness.",
    },
    {
      icon: Shield,
      title: "Quality Standards",
      text:
        about?.quality ||
        "Rigorous quality checks at sourcing, processing, and dispatch for every batch.",
    },
    {
      icon: Truck,
      title: "Supply Chain",
      text:
        about?.supply_chain ||
        "Direct relationships with mills and logistics partners for reliable bulk supply.",
    },
  ];

  return (
    <div className="pt-28">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="About Us"
            title="Decades of Trust in Rice Distribution"
            description="Serving retailers, hotels, restaurants, and caterers across Telangana with premium rice supply."
          />

          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-16">
            <Image
              src="https://images.unsplash.com/photo-1586528116311-48aef45b403b?w=1200&q=80"
              alt="Warehouse operations"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
            <div className="absolute bottom-8 left-8 text-cream">
              <p className="font-display text-3xl">25+ Years of Excellence</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blocks.map((block) => (
              <div
                key={block.title}
                className="p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow"
              >
                <block.icon className="h-10 w-10 text-gold mb-4" />
                <h3 className="font-display text-xl mb-3">{block.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {block.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
