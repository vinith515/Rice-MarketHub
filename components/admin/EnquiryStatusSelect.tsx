"use client";

import { useTransition } from "react";
import { updateEnquiryStatusAction } from "@/app/admin/actions";
import type { Enquiry } from "@/types/database";

const statuses = ["new", "contacted", "quoted", "closed"] as const;

export function EnquiryStatusSelect({
  id,
  status,
}: {
  id: string;
  status: Enquiry["status"];
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) =>
        startTransition(() => {
          void updateEnquiryStatusAction(
            id,
            e.target.value as Enquiry["status"]
          );
        })
      }
      className="text-sm border rounded-md px-2 py-1 bg-background"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
