"use client";

import { useState, useTransition } from "react";
import { saveWhatsAppSettingsAction } from "@/app/admin/whatsapp-actions";
import type { WhatsAppSettings } from "@/lib/whatsapp";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function WhatsAppSettingsForm({
  initial,
}: {
  initial: WhatsAppSettings;
}) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    number: initial.number,
    group_invite_url: initial.group_invite_url ?? "",
    group_enabled: initial.group_enabled,
    direct_label: initial.direct_label,
    group_label: initial.group_label,
    group_description: initial.group_description,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    setError(null);
    startTransition(async () => {
      const res = await saveWhatsAppSettingsAction({
        number: form.number,
        group_invite_url: form.group_invite_url || null,
        group_enabled: form.group_enabled,
        direct_label: form.direct_label,
        group_label: form.group_label,
        group_description: form.group_description,
      });
      if (res.error) setError(res.error);
      else setSaved(true);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card p-6 space-y-6 max-w-2xl">
      <div>
        <h2 className="font-semibold text-lg mb-1" style={{ color: "#2d5a3d" }}>
          Single business number
        </h2>
        <p className="text-sm mb-4" style={{ color: "#666" }}>
          Customers open a direct chat with your main WhatsApp line (prefilled
          enquiry message).
        </p>
        <Label>WhatsApp number (with country code)</Label>
        <Input
          className="mt-1"
          placeholder="919876543210"
          value={form.number}
          onChange={(e) => setForm({ ...form, number: e.target.value })}
        />
        <Label className="mt-4 block">Button label</Label>
        <Input
          className="mt-1"
          value={form.direct_label}
          onChange={(e) => setForm({ ...form, direct_label: e.target.value })}
        />
      </div>

      <div
        className="pt-6 border-t"
        style={{ borderColor: "#ebe6dc" }}
      >
        <h2 className="font-semibold text-lg mb-1" style={{ color: "#2d5a3d" }}>
          Team WhatsApp group
        </h2>
        <p className="text-sm mb-4" style={{ color: "#666" }}>
          Link to your business group so multiple staff can see and reply to
          enquiries. Get the invite link from WhatsApp → Group info → Invite via
          link.
        </p>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={form.group_enabled}
            onChange={(e) =>
              setForm({ ...form, group_enabled: e.target.checked })
            }
          />
          <span className="text-sm font-medium">Show group option on website</span>
        </label>

        <Label>Group invite URL</Label>
        <Input
          className="mt-1"
          placeholder="https://chat.whatsapp.com/AbCdEfGh..."
          value={form.group_invite_url}
          onChange={(e) =>
            setForm({ ...form, group_invite_url: e.target.value })
          }
        />

        <Label className="mt-4 block">Group button label</Label>
        <Input
          className="mt-1"
          value={form.group_label}
          onChange={(e) => setForm({ ...form, group_label: e.target.value })}
        />

        <Label className="mt-4 block">Description (shown to customers)</Label>
        <Textarea
          className="mt-1"
          rows={3}
          value={form.group_description}
          onChange={(e) =>
            setForm({ ...form, group_description: e.target.value })
          }
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && (
        <p className="text-sm text-green-700">Settings saved. Refresh the public site to verify.</p>
      )}

      <button type="submit" className="admin-btn-primary" disabled={pending}>
        {pending ? "Saving..." : "Save WhatsApp settings"}
      </button>
    </form>
  );
}
