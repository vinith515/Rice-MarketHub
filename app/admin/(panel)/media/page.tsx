import Image from "next/image";
import { getGallery } from "@/lib/data";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaUploader } from "@/components/admin/MediaUploader";

const categories = [
  { value: "warehouse", label: "Warehouse" },
  { value: "rice", label: "Rice closeups" },
  { value: "packaging", label: "Packaging" },
  { value: "transport", label: "Transport" },
  { value: "retailer", label: "Retailer supply" },
  { value: "hotel", label: "Hotel supply" },
];

export default async function AdminMediaPage() {
  const gallery = await getGallery();

  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        description="Upload warehouse photos, rice visuals, packaging, and transport images"
      />

      <div className="admin-card p-6 mb-8">
        <h2 className="font-semibold mb-4" style={{ color: "#2d5a3d" }}>
          Upload gallery image
        </h2>
        <MediaUploader
          bucket="gallery"
          accept="image/jpeg,image/png,image/webp"
          label="Add gallery photo"
          hint="Appears on the public Gallery page"
          mode="gallery"
        />
      </div>

      <h2 className="font-semibold mb-4" style={{ color: "#1a1a1a" }}>
        Gallery ({gallery.length})
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map((item) => (
          <div key={item.id} className="admin-card overflow-hidden">
            <div className="relative aspect-[4/3]">
              <Image
                src={item.image_url}
                alt={item.caption ?? item.category}
                fill
                className="object-cover"
                sizes="300px"
              />
            </div>
            <div className="p-3">
              <span className="admin-badge-gold capitalize">{item.category}</span>
              {item.caption && (
                <p className="text-xs mt-2" style={{ color: "#666" }}>
                  {item.caption}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
