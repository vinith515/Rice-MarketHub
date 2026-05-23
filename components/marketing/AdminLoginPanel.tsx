"use client";

import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAdmin, type LoginAdminState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, X } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const initialState: LoginAdminState = {};

function AdminLoginForm({ onClose }: { onClose: () => void }) {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);
  const supabaseLive = isSupabaseConfigured();

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 text-muted-foreground hover:text-foreground p-1"
        aria-label="Close login"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-2 mb-2">
        <Lock className="h-5 w-5 text-gold shrink-0" />
        <h2 id="admin-login-title" className="font-display text-xl">
          Partner admin login
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Sign in to manage products, prices, stock, and enquiries.
      </p>

      {state.error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-red-300 bg-red-50 text-red-800 text-sm px-3 py-2.5"
        >
          {state.error}
        </p>
      )}

      {supabaseLive ? (
        <p className="text-xs text-muted-foreground mb-4 rounded-lg bg-secondary p-3 leading-relaxed">
          Live site uses your <strong>Supabase</strong> admin user (Authentication →
          Users), not admin@example.com. After login, add{" "}
          <strong>https://rice-distribution.vercel.app</strong> under Supabase →
          Authentication → URL configuration → Redirect URLs.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground mb-4 rounded-lg bg-secondary p-3">
          Demo: admin@example.com / admin123
        </p>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="admin-email">Email</Label>
          <Input
            id="admin-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 text-base"
            placeholder="admin@yourbusiness.com"
          />
        </div>
        <div>
          <Label htmlFor="admin-password">Password</Label>
          <Input
            id="admin-password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 text-base"
          />
        </div>
        <Button
          type="submit"
          variant="gold"
          className="w-full h-11"
          disabled={pending}
        >
          {pending ? "Signing in…" : "Sign in to admin"}
        </Button>
      </form>
    </>
  );
}

export function AdminLoginPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-labelledby="admin-login-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-charcoal/75"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto rice-enquiry-panel shadow-2xl rounded-t-2xl sm:rounded-2xl p-6 pb-8 sm:pb-6">
        <AdminLoginForm onClose={onClose} />
      </div>
    </div>
  );
}

export function AdminLoginTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-sm text-cream/50 hover:text-gold transition-colors min-h-[44px]"
      >
        <Lock className="h-3.5 w-3.5" />
        Admin login
      </button>
      <AdminLoginPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/** Opens admin login when URL has ?admin=1 */
export function HomePageAdminLogin() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("admin") === "1") {
      setOpen(true);
    }
  }, [searchParams]);

  return <AdminLoginPanel open={open} onClose={() => setOpen(false)} />;
}
