import Image from "next/image";
import { getGallery } from "@/lib/data";
import { SectionHeading } from "@/components/marketing/SectionHeading";

export const metadata = {
  title: "Gallery",
  description: "Warehouse, packaging, transportation, and supply visuals.",
};

export default async function GalleryPage() {
  const items = await getGallery();

  return (
    <div className="pt-28">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Gallery"
            title="Our Operations in Pictures"
            description="Warehouse facilities, premium rice, packaging, and delivery across Telangana."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden"
              >
                <Image
                  src={item.image_url}
                  alt={item.caption || item.category}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 text-cream opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs uppercase tracking-wider text-gold">
                    {item.category}
                  </p>
                  {item.caption && (
                    <p className="text-sm mt-1">{item.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
