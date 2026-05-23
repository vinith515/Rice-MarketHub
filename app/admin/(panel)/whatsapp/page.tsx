import { getWhatsAppSettings } from "@/lib/get-whatsapp-settings";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { WhatsAppSettingsForm } from "@/components/admin/WhatsAppSettingsForm";

export default async function AdminWhatsAppPage() {
  const settings = await getWhatsAppSettings();

  return (
    <div>
      <AdminPageHeader
        title="WhatsApp settings"
        description="Configure direct business number and optional team group for enquiries"
      />

      <div className="admin-card p-4 mb-6 text-sm" style={{ color: "#5c5c5c" }}>
        <p>
          <strong>Direct number:</strong> Opens WhatsApp chat with one number
          and a prefilled message (best for single owner).
        </p>
        <p className="mt-2">
          <strong>Team group:</strong> Opens your WhatsApp group invite — any
          team member online can respond. Enquiry text is copied to clipboard
          when the customer taps the group button.
        </p>
      </div>

      <WhatsAppSettingsForm initial={settings} />
    </div>
  );
}
