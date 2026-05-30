"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUSINESS_TYPES } from "@/lib/constants";
import {
  visitorProfileSchema,
  type VisitorProfileFormData,
} from "@/lib/validations";
import {
  lookupVisitorByPhone,
  saveVisitorProfile,
  type StoredVisitorProfile,
} from "@/lib/visitor-profile";
import type { District } from "@/types/database";

export function VisitorOnboardingSheet({
  open,
  districts,
  onComplete,
  onSkip,
}: {
  open: boolean;
  districts: District[];
  onComplete: (profile: StoredVisitorProfile) => void;
  onSkip: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [lookupHint, setLookupHint] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VisitorProfileFormData>({
    resolver: zodResolver(visitorProfileSchema),
    defaultValues: {
      district_id: "",
      place_name: "",
      email: "",
    },
  });

  const phone = watch("phone");

  useEffect(() => {
    if (!open) return;
    const digits = phone?.replace(/\D/g, "") ?? "";
    if (digits.length < 10) {
      setLookupHint(null);
      return;
    }
    const t = setTimeout(async () => {
      const { found, visitor } = await lookupVisitorByPhone(phone);
      if (found && visitor) {
        setValue("contact_name", visitor.contact_name);
        setValue("business_type", visitor.business_type);
        if (visitor.district_id) setValue("district_id", visitor.district_id);
        if (visitor.place_name) setValue("place_name", visitor.place_name);
        setLookupHint(`Welcome back, ${visitor.contact_name}! We saved your details.`);
      } else {
        setLookupHint(null);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [phone, open, setValue]);

  const onSubmit = async (data: VisitorProfileFormData) => {
    setError(null);
    setSubmitting(true);
    try {
      const district = districts.find((d) => d.id === data.district_id);
      const profile = await saveVisitorProfile({
        contact_name: data.contact_name,
        phone: data.phone,
        business_type: data.business_type,
        district_id: data.district_id || null,
        place_name: data.place_name || null,
        district_name: district?.display_name ?? null,
      });
      onComplete(profile);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="visitor-onboarding-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm"
        aria-label="Close"
        onClick={onSkip}
      />
      <div className="relative w-full max-w-lg max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-cream border border-gold/30 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 py-4 border-b border-gold/20 bg-cream">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-rice">
              Quick setup
            </p>
            <h2
              id="visitor-onboarding-title"
              className="font-display text-xl font-semibold text-charcoal"
            >
              Tell us about your business
            </h2>
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="p-2 rounded-lg hover:bg-charcoal/5 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Skip for now"
          >
            <X className="h-5 w-5 text-charcoal" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4 pb-8">
          <p className="text-sm text-charcoal/75 leading-relaxed">
            We save your details once so WhatsApp and enquiry forms stay fast on
            your next visit.
          </p>

          {lookupHint && (
            <p className="text-sm font-medium text-rice bg-rice/10 border border-rice/25 rounded-lg px-3 py-2">
              {lookupHint}
            </p>
          )}

          <div>
            <Label htmlFor="v-phone">Phone number *</Label>
            <Input
              id="v-phone"
              type="tel"
              inputMode="tel"
              className="mt-1 h-12 text-base bg-white"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-red-700 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="v-name">Your name *</Label>
            <Input
              id="v-name"
              className="mt-1 h-12 text-base bg-white"
              {...register("contact_name")}
            />
            {errors.contact_name && (
              <p className="text-sm text-red-700 mt-1">
                {errors.contact_name.message}
              </p>
            )}
          </div>

          <div>
            <Label>Business type *</Label>
            <select
              className="mt-1 w-full h-12 rounded-md border border-input bg-white px-3 text-base text-charcoal"
              {...register("business_type")}
              defaultValue=""
            >
              <option value="" disabled>
                Select…
              </option>
              {BUSINESS_TYPES.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
            {errors.business_type && (
              <p className="text-sm text-red-700 mt-1">
                {errors.business_type.message}
              </p>
            )}
          </div>

          <div>
            <Label>District (Telangana)</Label>
            <select
              className="mt-1 w-full h-12 rounded-md border border-input bg-white px-3 text-base text-charcoal"
              {...register("district_id")}
            >
              <option value="">Select district (optional)</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.display_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="v-place">Town / area (optional)</Label>
            <Input
              id="v-place"
              placeholder="e.g. Secunderabad, Kukatpally"
              className="mt-1 h-12 text-base bg-white"
              {...register("place_name")}
            />
          </div>

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="gold"
            className="w-full h-12 text-base"
            disabled={submitting}
          >
            {submitting ? "Saving…" : "Continue"}
          </Button>
          <button
            type="button"
            onClick={onSkip}
            className="w-full text-sm text-charcoal/60 py-2 min-h-[44px]"
          >
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
}
