import Link from "next/link";
import { Lock } from "lucide-react";

/** Link to the dedicated admin login page (no homepage overlay). */
export function AdminLoginTrigger() {
  return (
    <Link
      href="/admin/login"
      className="inline-flex items-center gap-2 text-sm text-cream/50 hover:text-gold transition-colors min-h-[44px]"
    >
      <Lock className="h-3.5 w-3.5" />
      Admin login
    </Link>
  );
}
