"use client";

import { Pencil } from "lucide-react";
import { useVisitorProfile } from "./VisitorProfileProvider";
import { getBusinessLabel } from "@/lib/visitor-profile";

export function VisitorIntentBar() {
  const { profile, openQuickIntent } = useVisitorProfile();
  if (!profile) return null;

  return (
    <div className="sticky top-[4.5rem] z-[90] mx-4 sm:mx-6 lg:mx-8 -mb-2">
      <div className="max-w-7xl mx-auto">
        <button
          type="button"
          onClick={openQuickIntent}
          className="w-full flex items-center justify-between gap-3 rounded-xl border border-gold/35 bg-cream/95 backdrop-blur px-4 py-3 text-left shadow-md min-h-[48px]"
        >
          <span className="text-sm text-charcoal leading-snug">
            <span className="font-semibold">{profile.contact_name}</span>
            <span className="text-charcoal/70">
              {" "}
              · {getBusinessLabel(profile.business_type)}
            </span>
            <span className="block text-xs text-rice mt-0.5">
              Tap to update what you&apos;re looking for today
            </span>
          </span>
          <Pencil className="h-4 w-4 shrink-0 text-rice" />
        </button>
      </div>
    </div>
  );
}
