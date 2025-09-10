import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth/context";
import { QueryProvider } from "@/lib/providers/query-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { siteConfig, absoluteUrl, defaultImages } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#06B6D4" },
    { media: "(prefers-color-scheme: dark)", color: "#06B6D4" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Payment System for Supply Chains Optimized for Low Trust Environments`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: `${siteConfig.name} Team` }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: "en_UG",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - Payment System for Supply Chains Optimized for Low Trust Environments`,
    description: siteConfig.description,
    images: defaultImages(),
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitter,
    creator: siteConfig.twitter,
    title: `${siteConfig.name} - Payment System for Supply Chains Optimized for Low Trust Environments`,
    description: siteConfig.description,
    images: [absoluteUrl('/images/twitter-image.png')],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "Next.js",
  category: 'finance',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="/favicon-32x32.png"
          sizes="32x32"
          type="image/png"
        />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          sizes="16x16"
          type="image/png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="piaxis" />
        <meta name="application-name" content="piaxis" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#06B6D4" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-oriented" content="portrait" />
        {/* Organization / WebSite structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "FinancialService",
                name: siteConfig.name,
                description: siteConfig.description,
                url: siteConfig.url,
                logo: absoluteUrl('/images/logo.png'),
                sameAs: [
                  "https://twitter.com/piaxis",
                  "https://www.linkedin.com/company/piaxis-me",
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+256757951430",
                  contactType: "customer service",
                  availableLanguage: ["English", "Luganda", "Swahili"],
                },
                address: {
                  "@type": "PostalAddress",
                  addressCountry: "UG",
                  addressRegion: "Central Region",
                  addressLocality: "Kampala",
                },
                offers: [
                  { "@type": "Offer", name: "Escrow Payment Protection" },
                  { "@type": "Offer", name: "POS-free Payments" },
                  { "@type": "Offer", name: "Payment API" },
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: siteConfig.name,
                url: siteConfig.url,
                potentialAction: {
                  "@type": "SearchAction",
                  target: `${siteConfig.url}/search?q={search_term_string}`,
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: siteConfig.name,
                operatingSystem: "Android, iOS, Web",
                applicationCategory: "FinanceApplication",
                description: siteConfig.description,
                url: siteConfig.url,
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
              }
            ])
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <QueryProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <PWAInstallPrompt />
              </div>
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
