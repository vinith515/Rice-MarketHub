import { notFound } from "next/navigation";
import Image from "next/image";
import { ProductImage } from "@/components/marketing/ProductImage";
import { pickProductImageUrl } from "@/lib/product-images";
import Link from "next/link";
import { getProductBySlug, getProducts } from "@/lib/data";
import { ProductShowcase3D } from "@/components/three/ProductShowcase3D";
import { WhatsAppOptionsLoader } from "@/components/marketing/WhatsAppOptionsLoader";
import { EnquiryForm } from "@/components/marketing/EnquiryForm";
import { Badge } from "@/components/ui/badge";
import { buildProductEnquiryMessage } from "@/lib/whatsapp";
import { formatPricePerKgParts } from "@/lib/pricing";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import { getDistricts } from "@/lib/data";
import { ProductViewTracker } from "@/components/marketing/ProductViewTracker";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [product, districts] = await Promise.all([
    getProductBySlug(params.slug),
    getDistricts(),
  ]);

  if (!product) notFound();

  const image = pickProductImageUrl(product);
  const defaultSize = product.package_sizes?.find((p) => p.available)?.size_kg;
  const priceParts = formatPricePerKgParts(product.price_per_kg);

  return (
    <div className="pt-28">
      <ProductViewTracker productId={product.id} />
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/products"
            className="text-sm text-muted-foreground hover:text-rice mb-6 inline-block"
          >
            ← Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <ProductShowcase3D
                posterUrl={product.asset_3d?.poster_url || image}
                productName={product.name}
              />
              {image && (
                <div className="mt-4 relative aspect-video rounded-xl overflow-hidden bg-secondary">
                  <ProductImage
                    src={image}
                    alt={product.name}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              )}
            </div>

            <div>
              <Badge variant="gold" className="mb-2">
                {product.category?.name}
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl mb-4">
                {product.name}
              </h1>
              {product.brand && (
                <div className="flex items-center gap-3 mb-4 p-3 rounded-xl border border-border bg-card">
                  <BrandLogo
                    src={product.brand.logo_url}
                    name={product.brand.name}
                    size="lg"
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-rice">
                      Brand
                    </p>
                    <p className="font-semibold text-foreground">
                      {product.brand.name}
                    </p>
                  </div>
                </div>
              )}
              {priceParts && (
                <div className="rice-price-banner mb-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-rice mb-2">
                    Indicative wholesale rate
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-sans text-4xl font-bold text-charcoal tabular-nums leading-none">
                      {priceParts.amount}
                    </span>
                    <span className="font-sans text-xl font-semibold text-rice leading-none">
                      {priceParts.unit}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/70 mt-2">
                    Enquire in quintals or bags below — final quote on confirmation
                  </p>
                </div>
              )}

              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                {product.description}
              </p>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Package Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {product.package_sizes?.map((p) => (
                    <span
                      key={p.size_kg}
                      className={`px-4 py-2 rounded-lg border ${
                        p.available
                          ? "border-rice bg-rice/5"
                          : "border-border opacity-50"
                      }`}
                    >
                      {p.size_kg}kg
                      {!p.available && " (Unavailable)"}
                    </span>
                  ))}
                </div>
              </div>

              <Badge
                variant={
                  product.availability_status === "in_stock"
                    ? "success"
                    : product.availability_status === "limited"
                      ? "warning"
                      : "outline"
                }
                className="mb-6"
              >
                {product.availability_status.replace(/_/g, " ")}
              </Badge>

              <div className="mb-8">
                <WhatsAppOptionsLoader
                  message={buildProductEnquiryMessage({
                    productName: product.name,
                    packageKg: defaultSize,
                    pricePerKg: product.price_per_kg,
                  })}
                  productId={product.id}
                  layout="stack"
                  showHint
                />
              </div>

              <div>
                <h3 className="font-display text-xl mb-4">Bulk enquiry</h3>
                <EnquiryForm
                  districts={districts}
                  products={[product]}
                  defaultProductId={product.id}
                  variant="classic"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
