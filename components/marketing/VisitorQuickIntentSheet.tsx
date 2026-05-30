"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getBusinessLabel,
  recordVisitorIntent,
  type StoredVisitorProfile,
} from "@/lib/visitor-profile";

type ProductOption = { id: string; name: string };

export function VisitorQuickIntentSheet({
  open,
  profile,
  products,
  onComplete,
  onDismiss,
}: {
  open: boolean;
  profile: StoredVisitorProfile | null;
  products: ProductOption[];
  onComplete: () => void;
  onDismiss: () => void;
}) {
  const [productId, setProductId] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open || !profile) return null;

  const placeLabel =
    profile.district_name || profile.place_name || "your area";

  const handleSubmit = async () => {
    if (!productId && note.trim().length < 3) {
      setError("Pick a product or describe what you need (min 3 characters).");
      return;
    }
    setError(null);
    setSubmitting(true);
    const product = products.find((p) => p.id === productId);
    const message = [
      product ? `Looking for: ${product.name}.` : "",
      note.trim() ? note.trim() : "",
    ]
      .filter(Boolean)
      .join(" ");

    try {
      await recordVisitorIntent({
        visitor_id: profile.id,
        product_id: productId || undefined,
        message: message || "Browsing rice varieties",
        source: "quick_intent",
      });
      onComplete();
    } catch {
      setError("Could not save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[190] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 bg-charcoal/50"
        aria-label="Close"
        onClick={onDismiss}
      />
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-white border border-rice/20 shadow-2xl p-5 pb-8 max-h-[85dvh] overflow-y-auto">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-rice">
              Welcome back
            </p>
            <h2 className="font-display text-xl font-semibold text-charcoal">
              Hi {profile.contact_name.split(" ")[0]}, what do you need today?
            </h2>
            <p className="text-sm text-charcoal/70 mt-1">
              {getBusinessLabel(profile.business_type)} · {placeLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="p-2 rounded-lg hover:bg-charcoal/5 shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="intent-product">Rice variety (optional)</Label>
            <select
              id="intent-product"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="mt-1 w-full h-12 rounded-md border border-input bg-white px-3 text-base"
            >
              <option value="">Not sure yet / general enquiry</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="intent-note">Details (quantity, brand, timing)</Label>
            <Textarea
              id="intent-note"
              rows={3}
              placeholder="e.g. 20 quintals basmati for hotel, delivery next week"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 text-base bg-white"
            />
          </div>

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="button"
            variant="gold"
            className="w-full h-12"
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? "Saving…" : "Save & browse"}
          </Button>
        </div>
      </div>
    </div>
  );
}
