"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  createBrandAction,
  updateBrandAction,
  deleteBrandAction,
} from "@/app/admin/catalog-actions";
import type { Brand } from "@/types/database";

function BrandFormFields({
  brand,
  formId,
  formRef,
  onSubmit,
  onDelete,
  pending,
  error,
  success,
}: {
  brand?: Brand;
  formId: string;
  formRef?: React.Ref<HTMLFormElement>;
  onSubmit: (fd: FormData) => void;
  onDelete?: () => void;
  pending: boolean;
  error: string | null;
  success: string | null;
}) {
  return (
    <form
      id={formId}
      ref={formRef}
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget));
      }}
    >
      <h3 className="font-semibold" style={{ color: "#1a1a1a" }}>
        {brand ? "Edit brand" : "Add new brand"}
      </h3>
      <div>
        <label className="admin-label" htmlFor={`${formId}-name`}>
          Brand name
        </label>
        <input
          id={`${formId}-name`}
          name="name"
          defaultValue={brand?.name}
          required
          className="admin-input w-full mt-1"
          placeholder="e.g. Kohinoor, Sri Sri, your own brand"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="admin-label" htmlFor={`${formId}-type`}>
            Type
          </label>
          <select
            id={`${formId}-type`}
            name="type"
            defaultValue={brand?.type ?? "external"}
            className="admin-input w-full mt-1"
          >
            <option value="own">Own brand</option>
            <option value="external">External / distributed</option>
          </select>
        </div>
        <div>
          <label className="admin-label" htmlFor={`${formId}-priority`}>
            Display priority
          </label>
          <input
            id={`${formId}-priority`}
            name="priority"
            type="number"
            defaultValue={brand?.priority ?? 10}
            className="admin-input w-full mt-1"
          />
          <p className="text-xs mt-1" style={{ color: "#888" }}>
            Lower number = higher in lists
          </p>
        </div>
      </div>
      {error && (
        <p
          className="text-sm rounded-lg p-3"
          style={{ color: "#b91c1c", backgroundColor: "#fef2f2" }}
        >
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm rounded-lg p-3 admin-badge-green">{success}</p>
      )}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={pending} className="admin-btn-gold">
          {pending ? "Saving…" : brand ? "Save brand" : "Add brand"}
        </button>
        {brand && onDelete && (
          <button
            type="button"
            disabled={pending}
            className="text-sm px-4 py-2 rounded-lg"
            style={{ color: "#b91c1c", border: "1px solid #fecaca" }}
            onClick={onDelete}
          >
            Delete brand
          </button>
        )}
      </div>
    </form>
  );
}

export function AddBrandForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="admin-card p-5">
      <BrandFormFields
        formId="add-brand-form"
        formRef={formRef}
        onSubmit={(fd) => {
          setError(null);
          setSuccess(null);
          startTransition(async () => {
            const result = await createBrandAction(fd);
            if (result?.error) {
              setError(result.error);
              return;
            }
            setSuccess(`Brand "${fd.get("name")}" added successfully.`);
            formRef.current?.reset();
            router.refresh();
          });
        }}
        pending={pending}
        error={error}
        success={success}
      />
    </div>
  );
}

export function EditBrandForm({ brand }: { brand: Brand }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <BrandFormFields
      brand={brand}
      formId={`edit-brand-${brand.id}`}
      onSubmit={(fd) => {
        setError(null);
        setSuccess(null);
        startTransition(async () => {
          const result = await updateBrandAction(brand.id, fd);
          if (result?.error) {
            setError(result.error);
            return;
          }
          setSuccess("Brand updated.");
          router.refresh();
        });
      }}
      onDelete={() => {
        if (
          !confirm(
            `Delete brand "${brand.name}"? Products using it will lose brand link.`
          )
        )
          return;
        setError(null);
        startTransition(async () => {
          const result = await deleteBrandAction(brand.id);
          if (result?.error) setError(result.error);
          else router.refresh();
        });
      }}
      pending={pending}
      error={error}
      success={success}
    />
  );
}

export function BrandForm({ brand }: { brand?: Brand }) {
  return brand ? <EditBrandForm brand={brand} /> : <AddBrandForm />;
}
