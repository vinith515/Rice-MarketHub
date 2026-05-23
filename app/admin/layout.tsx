import "@/app/globals.css";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root min-h-screen bg-[#f0ebe3] text-[#1a1a1a] antialiased">
      {children}
    </div>
  );
}
