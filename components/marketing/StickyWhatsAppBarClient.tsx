"use client";

import { WhatsAppEnquiryOptions } from "./WhatsAppEnquiryOptions";
import type { WhatsAppSettings } from "@/lib/whatsapp";
import { useVisitorWhatsAppMessage } from "@/hooks/useVisitorWhatsAppMessage";

export function StickyWhatsAppBarClient({
  settings,
}: {
  settings: WhatsAppSettings;
  message?: string;
}) {
  const message = useVisitorWhatsAppMessage();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-charcoal border-t border-gold/25 shadow-[0_-8px_24px_rgba(0,0,0,0.25)]">
      <WhatsAppEnquiryOptions
        message={message}
        settings={settings}
        layout="stack"
        showHint={false}
      />
    </div>
  );
}
