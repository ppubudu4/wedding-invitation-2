import type { Metadata } from "next";
import { Cormorant_Garamond, Mulish, Caveat } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mulish",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-caveat",
  display: "swap",
});

/**
 * Resolve a valid absolute site URL for metadataBase. Tolerates a
 * NEXT_PUBLIC_SITE_URL set without a protocol (e.g. "example.com") or an
 * invalid value, so a misconfigured env var can never fail the build.
 */
function resolveSiteUrl(): URL {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withProtocol);
  } catch {
    return new URL("http://localhost:3000");
  }
}

const siteUrl = resolveSiteUrl();
const title = "Pubudu & Chaya · 27 September 2026";
const description =
  "Join us as we celebrate the wedding of Pubudu & Chaya on 27 September 2026 at Saminro Grand Palace, Makola, Sri Lanka.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title,
  description,
  icons: {
    icon: "/rose.png",
    shortcut: "/rose.png",
    apple: "/rose.png",
  },
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "Pubudu & Chaya",
    locale: "en_US",
    // og:image is supplied automatically by app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${mulish.variable} ${caveat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
