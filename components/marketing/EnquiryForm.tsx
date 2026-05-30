"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { enquirySchema, type EnquiryFormData } from "@/lib/validations";
import { BUSINESS_TYPES } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import {
  estimateLineTotal,
  formatPricePerKg,
  formatQuantityLine,
  KG_PER_QUINTAL,
} from "@/lib/pricing";
import type { District, Product } from "@/types/database";
import { cn } from "@/lib/utils";
import {
  getStoredVisitor,
  getBusinessLabel,
  saveVisitorProfile,
} from "@/lib/visitor-profile";
import { useVisitorProfile } from "./VisitorProfileProvider";

type Props = {
  districts: District[];
  products?: Product[];
  defaultProductId?: string;
  /** When true, uses classic rice-styled panel */
  variant?: "default" | "classic";
};

export function EnquiryForm({
  districts,
  products = [],
  defaultProductId,
  variant = "default",
}: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile: ctxProfile, refreshProfile } = useVisitorProfile();
  const storedProfile = ctxProfile ?? getStoredVisitor();
  const hasSavedProfile = Boolean(storedProfile);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      product_id: defaultProductId,
      quantity_unit: "quintals",
      website: "",
      contact_name: storedProfile?.contact_name ?? "",
      phone: storedProfile?.phone ?? "",
      business_type: storedProfile?.business_type ?? "",
      district_id: storedProfile?.district_id ?? "",
    },
  });

  useEffect(() => {
    if (!storedProfile) return;
    setValue("contact_name", storedProfile.contact_name);
    setValue("phone", storedProfile.phone);
    setValue("business_type", storedProfile.business_type);
    if (storedProfile.district_id) {
      setValue("district_id", storedProfile.district_id);
    }
  }, [storedProfile, setValue]);

  const productId = watch("product_id");
  const quantityUnit = watch("quantity_unit");
  const quantityValue = watch("quantity_value");
  const packageSizeKg = watch("package_size_kg");

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === productId),
    [products, productId]
  );

  const showQuantity = Boolean(productId && products.length > 0);
  const priceLabel = formatPricePerKg(selectedProduct?.price_per_kg ?? null);
  const estimate = estimateLineTotal(
    selectedProduct?.price_per_kg,
    quantityUnit,
    quantityValue,
    packageSizeKg
  );

  useEffect(() => {
    if (quantityUnit === "quintals") {
      setValue("package_size_kg", undefined);
    }
  }, [quantityUnit, setValue]);

  const onSubmit = async (data: EnquiryFormData) => {
    if (data.website) return;
    setError(null);

    const qtyLine = formatQuantityLine(
      data.quantity_unit,
      data.quantity_value,
      data.package_size_kg
    );
    let message = data.message;
    if (qtyLine && !message.includes(qtyLine)) {
      message = `${message}\n\nQuantity: ${qtyLine}`;
    }
    if (selectedProduct?.price_per_kg && !message.includes("/kg")) {
      message = `${message}\nReference price: ₹${selectedProduct.price_per_kg}/kg`;
    }

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          message,
          source: "form",
          visitor_id: storedProfile?.id,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(
          typeof err.error === "string"
            ? err.error
            : "Failed to submit enquiry"
        );
      }

      if (!hasSavedProfile) {
        const district = districts.find((d) => d.id === data.district_id);
        await saveVisitorProfile({
          contact_name: data.contact_name,
          phone: data.phone,
          business_type: data.business_type,
          district_id: data.district_id || null,
          district_name: district?.display_name ?? null,
        });
        refreshProfile();
      }

      trackEvent("enquiry_submit", {
        product_id: data.product_id,
        district_id: data.district_id,
      });
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  const panelClass =
    variant === "classic"
      ? "rice-enquiry-panel"
      : "rounded-2xl border border-border/60 bg-card p-6 md:p-8";

  if (submitted) {
    return (
      <div className={cn(panelClass, "text-center")}>
        <h3 className="font-display text-2xl text-rice mb-2">Enquiry Received</h3>
        <p className="text-muted-foreground">
          Thank you. Our team will contact you with pricing and availability.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn(panelClass, "space-y-5")}>
      <input
        type="text"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        {...register("website")}
      />

      {selectedProduct && priceLabel && (
        <div className="rice-price-banner">
          <span className="text-sm text-muted-foreground">Indicative wholesale rate</span>
          <p className="font-display text-2xl text-rice">{priceLabel}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Final quote may vary by volume and district. 1 quintal = {KG_PER_QUINTAL} kg.
          </p>
        </div>
      )}

      {hasSavedProfile && storedProfile ? (
        <div className="rounded-xl border border-rice/25 bg-rice/5 px-4 py-3 text-sm text-charcoal">
          <p className="font-semibold text-rice">Your saved details</p>
          <p className="mt-1">
            {storedProfile.contact_name} · {storedProfile.phone}
          </p>
          <p className="text-charcoal/75">
            {getBusinessLabel(storedProfile.business_type)}
            {storedProfile.district_name
              ? ` · ${storedProfile.district_name}`
              : storedProfile.place_name
                ? ` · ${storedProfile.place_name}`
                : ""}
          </p>
          <input type="hidden" {...register("contact_name")} />
          <input type="hidden" {...register("phone")} />
          <input type="hidden" {...register("business_type")} />
          <input type="hidden" {...register("district_id")} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="contact_name">Name *</Label>
              <Input
                id="contact_name"
                {...register("contact_name")}
                className="mt-1 h-12 text-base"
              />
              {errors.contact_name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.contact_name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                {...register("phone")}
                className="mt-1 h-12 text-base"
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="mt-1 h-12 text-base"
            />
          </div>

          <div>
            <Label>Business Type *</Label>
            <Controller
              name="business_type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-1 h-12">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.business_type && (
              <p className="text-sm text-red-500 mt-1">
                {errors.business_type.message}
              </p>
            )}
          </div>

          {districts.length > 0 && (
            <div>
              <Label>District</Label>
              <Controller
                name="district_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="mt-1 h-12">
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.display_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}
        </>
      )}

      {products.length > 0 && (
        <div>
          <Label>Product</Label>
          <Controller
            name="product_id"
            control={control}
            defaultValue={defaultProductId}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select product (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                      {p.price_per_kg != null ? ` — ₹${p.price_per_kg}/kg` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}

      {showQuantity && (
        <div className="space-y-4 rounded-xl border border-rice/20 bg-rice/5 p-4">
          <Label className="text-base font-semibold">Quantity required *</Label>
          <div className="flex flex-wrap gap-2">
            {(["quintals", "bags"] as const).map((unit) => (
              <button
                key={unit}
                type="button"
                onClick={() => setValue("quantity_unit", unit)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  quantityUnit === unit
                    ? "bg-rice text-cream"
                    : "bg-secondary hover:bg-secondary/80"
                )}
              >
                {unit === "quintals" ? "Quintals" : "Number of bags"}
              </button>
            ))}
          </div>
          <input type="hidden" {...register("quantity_unit")} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity_value">
                {quantityUnit === "quintals"
                  ? "Quintals required *"
                  : "Number of bags *"}
              </Label>
              <Input
                id="quantity_value"
                type="number"
                min={0.1}
                step={quantityUnit === "quintals" ? 0.5 : 1}
                {...register("quantity_value")}
                className="mt-1"
                placeholder={quantityUnit === "quintals" ? "e.g. 10" : "e.g. 50"}
              />
              {errors.quantity_value && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.quantity_value.message}
                </p>
              )}
              {quantityUnit === "quintals" && quantityValue && (
                <p className="text-xs text-muted-foreground mt-1">
                  ≈ {Number(quantityValue) * KG_PER_QUINTAL} kg total
                </p>
              )}
            </div>

            {quantityUnit === "bags" && (
              <div>
                <Label>Bag size (kg) *</Label>
                <Controller
                  name="package_size_kg"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      value={field.value ? String(field.value) : undefined}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select bag size" />
                      </SelectTrigger>
                      <SelectContent>
                        {(selectedProduct?.package_sizes ?? [])
                          .filter((p) => p.available)
                          .map((p) => (
                            <SelectItem key={p.size_kg} value={String(p.size_kg)}>
                              {p.size_kg} kg bag
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.package_size_kg && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.package_size_kg.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {estimate != null && (
            <p className="text-sm text-rice font-medium">
              Estimated value (indicative): ₹
              {estimate.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="message">Additional details *</Label>
        <Textarea
          id="message"
          rows={4}
          placeholder="Delivery timeline, preferred brand, monthly volume…"
          {...register("message")}
          className="mt-1"
        />
        {errors.message && (
          <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="submit"
        variant="default"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting…" : "Submit bulk enquiry"}
      </Button>
    </form>
  );
}
