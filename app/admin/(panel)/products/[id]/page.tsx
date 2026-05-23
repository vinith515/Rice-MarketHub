import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdminProductById,
  getAdminBrands,
} from "@/app/admin/actions";
import { getCategories } from "@/lib/data";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { ProductToggleButtons } from "@/components/admin/ProductToggleButtons";
import { ProductImageList } from "@/components/admin/ProductImageList";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";

export default async function AdminProductEditPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories, brands] = await Promise.all([
    getAdminProductById(params.id),
    getCategories(),
    getAdminBrands(),
  ]);
  if (!product) notFound();

  const asset = product.asset_3d as
    | { glb_url?: string | null; poster_url?: string | null; video_url?: string | null }
    | null
    | undefined;

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm mb-6"
        style={{ color: "#2d5a3d" }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <AdminPageHeader
        title={product.name}
        description={`${product.category?.name} · ${product.brand?.name}`}
        action={
          <ProductToggleButtons
            productId={product.id}
            featured={product.featured}
            published={product.published}
          />
        }
      />

      <div className="mb-8">
        <ProductForm
          product={product}
          brands={brands}
          categories={categories}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: "#2d5a3d" }}
          >
            Product images
          </h2>
          <MediaUploader
            bucket="product-images"
            accept="image/jpeg,image/png,image/webp"
            label="Upload product photo"
            hint="JPG, PNG or WebP · Shows on website & product cards"
            productId={product.id}
            mode="product-image"
          />
          <div className="mt-4">
            <ProductImageList
              productId={product.id}
              images={product.images ?? []}
            />
          </div>
        </section>

        <section>
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: "#2d5a3d" }}
          >
            3D showcase
          </h2>
          <div className="space-y-4">
            <MediaUploader
              bucket="product-models"
              accept=".glb,model/gltf-binary,application/octet-stream"
              label="Upload 3D model (.glb)"
              hint="GLB format for interactive 3D bag preview"
              productId={product.id}
              mode="product-3d"
              currentUrl={asset?.glb_url}
            />
            <MediaUploader
              bucket="site-media"
              accept="video/mp4,video/webm"
              label="Upload 3D / product video"
              hint="MP4 or WebM · Cinematic product showcase"
              productId={product.id}
              mode="product-video"
              currentUrl={asset?.video_url}
            />
            <MediaUploader
              bucket="product-images"
              accept="image/jpeg,image/png,image/webp"
              label="3D poster / fallback image"
              hint="Static image when 3D is disabled on mobile"
              productId={product.id}
              mode="product-poster"
              currentUrl={asset?.poster_url}
            />
          </div>
        </section>
      </div>

    </div>
  );
}
