"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Props = {
  message: string;
  label?: string;
  variant?: "whatsapp" | "outline" | "gold";
  size?: "default" | "sm" | "lg";
  className?: string;
  productId?: string;
  fullWidth?: boolean;
};

export function WhatsAppButton({
  message,
  label = "Enquire on WhatsApp",
  variant = "whatsapp",
  size = "default",
  className,
  productId,
  fullWidth,
}: Props) {
  const handleClick = () => {
    trackEvent("whatsapp_click", {
      product_id: productId,
      metadata: { message },
    });
    window.open(getWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(fullWidth && "w-full", className)}
      onClick={handleClick}
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </Button>
  );
}
