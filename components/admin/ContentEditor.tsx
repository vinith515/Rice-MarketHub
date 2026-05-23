"use client";

import { useState, useTransition } from "react";
import { updateSiteContentAction } from "@/app/admin/actions";
import type { SiteContent } from "@/types/database";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContentEditor({ items }: { items: SiteContent[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <ContentBlock key={item.id} item={item} pending={pending} onSave={(value) =>
          startTransition(() => { void updateSiteContentAction(item.key, value); })
        } />
      ))}
    </div>
  );
}

function ContentBlock({
  item,
  pending,
  onSave,
}: {
  item: SiteContent;
  pending: boolean;
  onSave: (value: Record<string, unknown>) => void;
}) {
  const [json, setJson] = useState(JSON.stringify(item.value, null, 2));
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(json);
      setError(null);
      onSave(parsed);
    } catch {
      setError("Invalid JSON");
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3 className="font-semibold capitalize" style={{ color: "#1a1a1a" }}>
          {item.key}
        </h3>
      </div>
      <div className="p-6">
        <Label>JSON Content</Label>
        <Textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={8}
          className="mt-2 font-mono text-sm"
        />
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        <button
          type="button"
          className="admin-btn-primary mt-4"
          disabled={pending}
          onClick={handleSave}
        >
          Save {item.key}
        </button>
      </div>
    </div>
  );
}
