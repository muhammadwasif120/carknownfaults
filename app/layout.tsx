import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    template: "%s | Car Known Faults",
    default: "Car Known Faults | Know Before You Buy",
  },
  description:
    "The UK's most comprehensive database of known car faults. Browse real-world problems by make, model, and variant — with symptoms, fix costs, and DIY guides.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://carknownfaults.com"),
  // Default OG — individual pages override these
  openGraph: {
    siteName: "Car Known Faults",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@CKFaults",
  },
  // Instruct crawlers
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  // Branded colour for mobile chrome / PWA
  themeColor: "#CC0000",
  // App-level verification slots (fill in GSC/Bing codes)
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? undefined,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION ?? "",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html lang="en">
      <head>
        {adsenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
