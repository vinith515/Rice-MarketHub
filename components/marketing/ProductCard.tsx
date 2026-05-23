"use client";

import Link from "next/link";
import { ProductImage } from "./ProductImage";
import { pickProductImageUrl } from "@/lib/product-images";
import { motion } from "framer-motion";
import type { Product } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { ProductWhatsAppEnquiry } from "./ProductWhatsAppEnquiry";
import { BrandLogo } from "./BrandLogo";
import type { WhatsAppSettings } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { formatPricePerKgParts } from "@/lib/pricing";

const statusMap = {
  in_stock: { label: "In Stock", variant: "success" as const },
  limited: { label: "Limited", variant: "warning" as const },
  out_of_stock: { label: "Out of Stock", variant: "outline" as const },
};

export function ProductCard({
  product,
  index = 0,
  whatsappSettings,
}: {
  product: Product;
  index?: number;
  whatsappSettings: WhatsAppSettings;
}) {
  const image = pickProductImageUrl(product);
  const status = statusMap[product.availability_status];
  const priceParts = formatPricePerKgParts(product.price_per_kg);
  const brandName = product.brand?.name;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <div className="relative overflow-hidden rice-card-classic shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
            <ProductImage
              src={image}
              alt={product.images?.[0]?.alt || product.name}
              className="transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
            {brandName && (
              <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-white/95 px-2 py-1.5 shadow-md border border-white/80">
                <BrandLogo
                  src={product.brand?.logo_url}
                  name={brandName}
                  size="sm"
                />
                <span className="text-xs font-semibold text-charcoal pr-1 max-w-[120px] truncate">
                  {brandName}
                </span>
              </div>
            )}
            {product.featured && (
              <Badge variant="gold" className="absolute top-4 left-4">
                Featured
              </Badge>
            )}
            <Badge
              variant={status.variant}
              className="absolute top-4 right-4"
            >
              {status.label}
            </Badge>
          </div>
        </Link>

        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rice bg-rice/10 px-2 py-0.5 rounded">
              {product.category?.name}
            </span>
          </div>

          {priceParts && (
            <div className="mb-3 rounded-xl border border-gold/35 bg-gradient-to-br from-gold/12 via-cream to-rice/5 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-rice mb-1">
                Wholesale indicative
              </p>
              <div className="flex items-baseline gap-1">
                <span className="font-sans text-2xl sm:text-[1.65rem] font-bold text-charcoal leading-none tabular-nums">
                  {priceParts.amount}
                </span>
                <span className="font-sans text-base font-semibold text-rice/90 leading-none">
                  {priceParts.unit}
                </span>
              </div>
            </div>
          )}

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-display text-xl font-semibold text-foreground hover:text-rice transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="text-sm text-foreground/75 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {product.package_sizes && product.package_sizes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {product.package_sizes
                .filter((p) => p.available)
                .map((p) => (
                  <span
                    key={p.size_kg}
                    className="text-xs font-medium px-2.5 py-1 rounded-full border border-rice/25 bg-rice/8 text-charcoal"
                  >
                    {p.size_kg} kg bags
                  </span>
                ))}
            </div>
          )}

          <Link
            href={`/products/${product.slug}`}
            className="mt-4 block text-center text-sm font-medium py-2.5 rounded-lg border-2 border-rice/30 text-rice hover:bg-rice hover:text-cream transition-colors"
          >
            View Details
          </Link>
          <div className="mt-2">
            <ProductWhatsAppEnquiry
              product={product}
              settings={whatsappSettings}
              layout="stack"
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
