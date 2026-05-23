import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const businessName =
  process.env.NEXT_PUBLIC_BUSINESS_NAME || "Telangana Premium Rice";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: `${businessName} | Premium B2B Rice Distribution`,
    template: `%s | ${businessName}`,
  },
  description:
    "Premium B2B rice distribution across Telangana. Basmati, HMT Sona Masoori bulk supply for retailers, hotels, and caterers. Enquire on WhatsApp.",
  keywords: [
    "rice distribution",
    "Telangana",
    "basmati",
    "HMT Sona Masoori",
    "wholesale rice",
    "B2B rice",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: businessName,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="min-h-screen overflow-x-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
