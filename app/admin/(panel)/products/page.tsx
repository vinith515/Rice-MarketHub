import { getAdminProducts } from "@/app/admin/actions";
import { getCategories } from "@/lib/data";
import { getAdminBrands } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminProductCatalog } from "@/components/admin/AdminProductCatalog";
import { ProductForm } from "@/components/admin/ProductForm";
import { Plus } from "lucide-react";

export default async function AdminProductsPage() {
  const [products, categories, brands] = await Promise.all([
    getAdminProducts(),
    getCategories(),
    getAdminBrands(),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Products & varieties"
        description={`${products.length} varieties · Grouped by Basmati, HMT Sona Masoori, Sona Masoori`}
        action={
          <a href="#add-product" className="admin-btn-gold inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add variety
          </a>
        }
      />

      <div id="add-product" className="mb-8">
        <ProductForm brands={brands} categories={categories} />
      </div>

      <AdminProductCatalog products={products} categories={categories} />
    </div>
  );
}
