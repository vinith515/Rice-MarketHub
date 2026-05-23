"use client";

import { useTransition } from "react";
import { updateCoverageAction } from "@/app/admin/actions";
import type { DistrictCoverage } from "@/types/database";

export function DistrictCoverageEditor({
  coverage,
}: {
  coverage: DistrictCoverage[];
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {coverage.map((c) => (
        <div key={c.id} className="admin-card p-4">
            <h3 className="font-semibold mb-3">{c.district?.display_name}</h3>
            <label className="flex items-center gap-2 text-sm mb-2">
              <input
                type="checkbox"
                defaultChecked={c.is_served}
                disabled={pending}
                onChange={(e) =>
                  startTransition(() => {
                    void updateCoverageAction(c.id, {
                      is_served: e.target.checked,
                    });
                  })
                }
              />
              District Served
            </label>
            <label className="flex items-center gap-2 text-sm mb-2">
              <input
                type="checkbox"
                defaultChecked={c.delivery_available}
                disabled={pending}
                onChange={(e) =>
                  startTransition(() => {
                    void updateCoverageAction(c.id, {
                      delivery_available: e.target.checked,
                    });
                  })
                }
              />
              Delivery Available
            </label>
            <p className="text-xs text-muted-foreground">{c.notes}</p>
        </div>
      ))}
    </div>
  );
}
