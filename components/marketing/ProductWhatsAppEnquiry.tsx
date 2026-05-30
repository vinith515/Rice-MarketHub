"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WhatsAppEnquiryOptions } from "./WhatsAppEnquiryOptions";
import {
  buildProductEnquiryMessage,
  type WhatsAppSettings,
} from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import {
  getStoredVisitor,
  recordVisitorIntent,
} from "@/lib/visitor-profile";
import { visitorToWhatsAppContext } from "@/hooks/useVisitorWhatsAppMessage";

type ProductInfo = {
  id: string;
  name: string;
  price_per_kg?: number | null;
  brand?: { name: string } | null;
  category?: { name: string } | null;
  package_sizes?: { size_kg: number; available: boolean }[];
};

export function ProductWhatsAppEnquiry({
  product,
  settings,
  layout = "stack",
  className,
}: {
  product: ProductInfo;
  settings: WhatsAppSettings;
  layout?: "row" | "stack" | "compact";
  className?: string;
}) {
  const bagSizes = useMemo(
    () =>
      (product.package_sizes ?? []).filter((p) => p.available).map((p) => p.size_kg),
    [product.package_sizes]
  );
  const defaultBag = bagSizes[0];

  const [unit, setUnit] = useState<"quintals" | "bags">("quintals");
  const [quantity, setQuantity] = useState("");
  const [bagKg, setBagKg] = useState<string>(
    defaultBag != null ? String(defaultBag) : ""
  );
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const qtyNum = quantity.trim() ? Number(quantity) : NaN;

  const message = useMemo(() => {
    const visitorCtx = visitorToWhatsAppContext(getStoredVisitor());
    return buildProductEnquiryMessage({
      ...visitorCtx,
      brandName: product.brand?.name,
      productName: product.name,
      categoryName: product.category?.name,
      pricePerKg: product.price_per_kg,
      quantityUnit: ready && !Number.isNaN(qtyNum) ? unit : undefined,
      quantityValue: ready && !Number.isNaN(qtyNum) ? qtyNum : undefined,
      packageKg:
        unit === "bags" && bagKg ? Number(bagKg) : defaultBag,
    });
  }, [product, unit, qtyNum, bagKg, defaultBag, ready]);

  const handlePrepare = () => {
    if (!quantity.trim() || Number.isNaN(qtyNum) || qtyNum <= 0) {
      setError("Please enter how much you need (e.g. 5 quintals or 20 bags).");
      setReady(false);
      return;
    }
    if (unit === "bags" && !bagKg) {
      setError("Please select bag size.");
      setReady(false);
      return;
    }
    setError(null);
    const visitorCtx = visitorToWhatsAppContext(getStoredVisitor());
    const builtMessage = buildProductEnquiryMessage({
      ...visitorCtx,
      brandName: product.brand?.name,
      productName: product.name,
      categoryName: product.category?.name,
      pricePerKg: product.price_per_kg,
      quantityUnit: unit,
      quantityValue: qtyNum,
      packageKg: unit === "bags" && bagKg ? Number(bagKg) : defaultBag,
    });
    setReady(true);
    const visitor = getStoredVisitor();
    if (visitor) {
      void recordVisitorIntent({
        visitor_id: visitor.id,
        product_id: product.id,
        message: builtMessage,
        quantity_unit: unit,
        quantity_value: qtyNum,
        package_size_kg: unit === "bags" && bagKg ? Number(bagKg) : undefined,
        source: "whatsapp",
      });
    }
  };

  if (!ready) {
    return (
      <div className={cn("space-y-3 rounded-xl border border-rice/20 bg-secondary/40 p-3", className)}>
        <p className="text-xs font-semibold text-rice uppercase tracking-wide">
          WhatsApp enquiry
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Add quantity so your message includes brand, variety, and how much you need.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setUnit("quintals")}
            className={cn(
              "rounded-lg border py-2.5 text-sm font-medium min-h-[44px]",
              unit === "quintals"
                ? "border-rice bg-rice text-cream"
                : "border-border bg-card text-foreground"
            )}
          >
            Quintals
          </button>
          <button
            type="button"
            onClick={() => setUnit("bags")}
            className={cn(
              "rounded-lg border py-2.5 text-sm font-medium min-h-[44px]",
              unit === "bags"
                ? "border-rice bg-rice text-cream"
                : "border-border bg-card text-foreground"
            )}
          >
            Bags
          </button>
        </div>

        <div>
          <Label htmlFor={`qty-${product.id}`} className="text-sm">
            Quantity required *
          </Label>
          <Input
            id={`qty-${product.id}`}
            type="number"
            min={1}
            step={unit === "quintals" ? "0.5" : "1"}
            inputMode="decimal"
            placeholder={unit === "quintals" ? "e.g. 10" : "e.g. 50"}
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              setError(null);
            }}
            className="mt-1 h-11 text-base text-charcoal bg-white"
          />
        </div>

        {unit === "bags" && bagSizes.length > 0 && (
          <div>
            <Label className="text-sm">Bag size (kg)</Label>
            <Select value={bagKg} onValueChange={setBagKg}>
              <SelectTrigger className="mt-1 h-11 bg-white text-charcoal">
                <SelectValue placeholder="Select bag size" />
              </SelectTrigger>
              <SelectContent>
                {bagSizes.map((kg) => (
                  <SelectItem key={kg} value={String(kg)}>
                    {kg} kg
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Button
          type="button"
          variant="whatsapp"
          className="w-full h-11"
          onClick={handlePrepare}
        >
          <MessageCircle className="h-4 w-4" />
          Continue to WhatsApp
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="rounded-lg bg-rice/10 border border-rice/25 px-3 py-2 text-xs text-foreground leading-relaxed">
        <strong>Preview:</strong> {message}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => setReady(false)}
      >
        Edit quantity
      </Button>
      <WhatsAppEnquiryOptions
        message={message}
        settings={settings}
        productId={product.id}
        layout={layout}
      />
    </div>
  );
}
