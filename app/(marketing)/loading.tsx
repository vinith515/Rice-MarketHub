export default function MarketingLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-28">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-2 border-gold border-t-transparent animate-spin" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}
