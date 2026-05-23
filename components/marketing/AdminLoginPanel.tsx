"use client";

import { useState } from "react";
import { loginAdmin } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, X } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/client";

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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-labelledby="admin-login-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rice-enquiry-panel shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          aria-label="Close login"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 mb-2">
          <Lock className="h-5 w-5 text-gold" />
          <h2 id="admin-login-title" className="font-display text-xl">
            Partner admin login
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Sign in to manage products, prices, stock, and enquiries. Login is only
          available from this homepage.
        </p>
        <form action={loginAdmin} className="space-y-4">
          <div>
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              name="email"
              type="email"
              required
              className="mt-1"
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
              className="mt-1"
            />
          </div>
          {!isSupabaseConfigured() && (
            <p className="text-xs text-muted-foreground rounded-lg bg-secondary p-3">
              Demo: admin@example.com / admin123
            </p>
          )}
          <Button type="submit" variant="gold" className="w-full">
            Sign in to admin
          </Button>
        </form>
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
        className="inline-flex items-center gap-2 text-sm text-cream/50 hover:text-gold transition-colors"
      >
        <Lock className="h-3.5 w-3.5" />
        Admin login
      </button>
      <AdminLoginPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
