import Image from "next/image";
import { getAdminBrands } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { AddBrandForm, EditBrandForm } from "@/components/admin/BrandForm";
import { Tag } from "lucide-react";

export default async function AdminBrandsPage() {
  const brands = await getAdminBrands();

  return (
    <div>
      <AdminPageHeader
        title="Brands"
        description={`${brands.length} brands · Customers can search by brand name on the products page`}
      />

      <div className="mb-8">
        <AddBrandForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {brands.map((brand) => (
          <div key={brand.id} className="admin-card overflow-hidden">
            <div
              className="admin-card-header flex items-center justify-between"
              style={{ backgroundColor: "#faf8f4" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-14 w-14 rounded-lg flex items-center justify-center overflow-hidden relative"
                  style={{ backgroundColor: "#ebe6dc" }}
                >
                  {brand.logo_url ? (
                    <Image
                      src={brand.logo_url}
                      alt={brand.name}
                      fill
                      className="object-contain p-1"
                      sizes="56px"
                    />
                  ) : (
                    <Tag className="h-6 w-6" style={{ color: "#c9a227" }} />
                  )}
                </div>
                <div>
                  <h2 className="font-bold" style={{ color: "#1a1a1a" }}>
                    {brand.name}
                  </h2>
                  <span
                    className={
                      brand.type === "own"
                        ? "admin-badge-gold"
                        : "text-xs px-2 py-0.5 rounded-full"
                    }
                    style={
                      brand.type !== "own"
                        ? { backgroundColor: "#f0ebe3", color: "#5c5c5c" }
                        : undefined
                    }
                  >
                    {brand.type === "own" ? "Own brand" : "External brand"}
                  </span>
                </div>
              </div>
              <span className="text-sm" style={{ color: "#888" }}>
                Priority {brand.priority}
              </span>
            </div>
            <div className="p-4 space-y-4">
              <MediaUploader
                bucket="product-images"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                label="Upload brand logo"
                hint="Square logo · PNG with transparent background recommended"
                brandId={brand.id}
                mode="brand-logo"
                currentUrl={brand.logo_url}
              />
              <EditBrandForm brand={brand} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
