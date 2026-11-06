import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import { getServerLocale } from "@/lib/i18n/locale-server";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://primeflow-materials.up.railway.app"
  ),
  title: {
    default: "PrimeFlow | Prime Quality, Consistent Flow. Recycled PP & PE Resin",
    template: "%s | PrimeFlow Industrial Materials",
  },
  description:
    "Precision-purified post-industrial Polypropylene (PP) and Polyethylene (PE, HDPE, LDPE) resin pellets for manufacturing companies. Verified batch Certificate of Analysis (COA), <0.05% moisture, and Adaptive Locked-Supply.",
  keywords: [
    "PrimeFlow",
    "recycled polypropylene pellets",
    "recycled polyethylene resin",
    "post-industrial plastic recycling Indonesia",
    "near-virgin PP PE pellets",
    "HDPE LDPE industrial resin",
    "closed-loop toll recycling",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/favicon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "PrimeFlow | Prime Quality, Consistent Flow.",
    description:
      "Precision-focused recycled PP and PE materials from selected post-industrial waste for reliable industrial manufacturing.",
    type: "website",
    locale: "en_US",
    siteName: "PrimeFlow Industrial Materials",
    images: [
      {
        url: "/images/materials/hero-pellets.jpg",
        width: 1200,
        height: 675,
        alt: "PrimeFlow recycled polypropylene and polyethylene resin pellets",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col selection:bg-[#02BDEA] selection:text-[#101C2B]">
        <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
