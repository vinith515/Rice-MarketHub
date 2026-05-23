"use client";

import { MessageCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import {
  getWhatsAppDirectUrl,
  getWhatsAppGroupUrl,
  isGroupConfigured,
  type WhatsAppSettings,
} from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Props = {
  message: string;
  settings: WhatsAppSettings;
  productId?: string;
  layout?: "row" | "stack" | "compact";
  className?: string;
  showHint?: boolean;
};

export function WhatsAppEnquiryOptions({
  message,
  settings,
  productId,
  layout = "row",
  className,
  showHint = false,
}: Props) {
  const showGroup = isGroupConfigured(settings);

  const openDirect = () => {
    trackEvent("whatsapp_click", {
      product_id: productId,
      metadata: { channel: "direct", message },
    });
    window.open(
      getWhatsAppDirectUrl(message, settings.number),
      "_blank",
      "noopener,noreferrer"
    );
  };

  const openGroup = async () => {
    trackEvent("whatsapp_click", {
      product_id: productId,
      metadata: { channel: "group", message },
    });
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(message);
      } catch {
        /* clipboard optional */
      }
    }
    window.open(
      getWhatsAppGroupUrl(settings.group_invite_url!),
      "_blank",
      "noopener,noreferrer"
    );
  };

  const stack = layout === "stack";
  const compact = layout === "compact";

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "flex gap-2",
          stack ? "flex-col" : "flex-col sm:flex-row",
          compact && "flex-row flex-wrap"
        )}
      >
        <Button
          type="button"
          variant="whatsapp"
          size={compact ? "sm" : "default"}
          className={cn(!compact && "flex-1")}
          onClick={openDirect}
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          {settings.direct_label}
        </Button>

        {showGroup && (
          <Button
            type="button"
            variant="outline"
            size={compact ? "sm" : "default"}
            className={cn(
              "flex-1 border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10",
              !compact && "sm:min-w-[200px]"
            )}
            onClick={openGroup}
          >
            <Users className="h-4 w-4 shrink-0" />
            {settings.group_label}
          </Button>
        )}
      </div>

      {showGroup && showHint && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          {settings.group_description}
          {" "}
          <span className="text-rice font-medium">
            Your enquiry text is copied — paste it in the group after opening.
          </span>
        </p>
      )}
    </div>
  );
}
