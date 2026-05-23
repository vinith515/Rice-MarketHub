import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-charcoal text-cream px-4">
      <h1 className="font-display text-6xl text-gold mb-4">404</h1>
      <p className="text-xl mb-8 text-cream/80">Page not found</p>
      <Button asChild variant="gold">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
