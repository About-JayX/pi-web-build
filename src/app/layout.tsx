import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pi.Sale - MEME Token Launch Platform on Pi Network",
  description:
    "One-stop MEME token deployment and trading ecosystem, efficient, secure, and convenient",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }, { url: "/pis.png" }],
    apple: "/pis.png",
    shortcut: "/pis.png",
  },
  openGraph: {
    title: "Pi.Sale - MEME Token Launch Platform on Pi Network",
    description:
      "One-stop MEME token deployment and trading ecosystem, efficient, secure, and convenient",
    url: "https://pi.sale",
    siteName: "Pi.Sale",
    images: [
      {
        url: "https://p.pi.sale/banner.png",
        width: 1200,
        height: 630,
        alt: "Pi.Sale - Pi Network MEME Token Platform Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pi.Sale - MEME Token Launch Platform on Pi Network",
    description:
      "One-stop MEME token deployment and trading ecosystem, efficient, secure, and convenient",
    images: ["https://p.pi.sale/banner.png"],
    creator: "@PiSale_official",
  },
  metadataBase: new URL("https://pi.sale"),
  alternates: {
    canonical: "https://pi.sale",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning data-js-focus-visible>
      <head>
        <link rel="icon" href="/pis.png" />
        <link
          rel="preload"
          href="/fonts/EDIX.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Space-Grotesk.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-30XL4ZTGXR"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-30XL4ZTGXR');
            `,
          }}
        />
      </head>
      <body
        className={inter.variable}
        suppressHydrationWarning
        style={{ position: "relative" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
