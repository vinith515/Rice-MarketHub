"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { loginAdmin, type LoginAdminState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const initialState: LoginAdminState = {};

function AdminLoginSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="gold"
      className="w-full h-12 text-base"
      disabled={pending}
    >
      {pending ? "Signing in…" : "Sign in to admin"}
    </Button>
  );
}

export function AdminLoginForm() {
  const [state, formAction] = useFormState(loginAdmin, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const supabaseLive = isSupabaseConfigured();

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Lock className="h-6 w-6 text-[#c9a227] shrink-0" />
        <h1 className="font-display text-2xl text-[#1a1a1a]">Admin login</h1>
      </div>
      <p className="text-sm text-[#5c5c5c] mb-6">
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
        <p className="text-xs text-[#5c5c5c] mb-5 rounded-lg bg-[#f0ebe3] p-3 leading-relaxed">
          Use your Supabase admin email and password (Authentication → Users).
        </p>
      ) : (
        <p className="text-xs text-[#5c5c5c] mb-5 rounded-lg bg-[#f0ebe3] p-3">
          Demo: admin@example.com / admin123
        </p>
      )}

      <form action={formAction} className="space-y-5">
        <div>
          <Label htmlFor="admin-email" className="text-[#1a1a1a]">
            Email
          </Label>
          <Input
            id="admin-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1.5 h-12 text-base text-charcoal bg-white border-[#e5dfd4]"
            placeholder="admin@yourbusiness.com"
          />
        </div>
        <div>
          <Label htmlFor="admin-password" className="text-[#1a1a1a]">
            Password
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="admin-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              className="h-12 text-base text-charcoal bg-white border-[#e5dfd4] pr-12 [-webkit-text-fill-color:#1a1a1a]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-charcoal/70 hover:text-charcoal min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <AdminLoginSubmitButton />
      </form>
    </div>
  );
}
