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
  title: {
    default: "Piaxe - Payment System for Supply Chains Optimized for Low Trust Environments",
    template: "%s | Piaxe - Payment System for Supply Chains",
  },
  description:
    "Piaxe offers escrow payments, POS-free physical store payments, CRM, fundraising, and social e-commerce all in one platform. Perfect for consumers, SMEs, and online businesses in Uganda, East Africa and Beyond.",
  keywords: [
    "escrow payments",
    "mobile money",
    "digital payments",
    "payment API",
    "secure transactions",
    "SME payments",
    "Uganda payments",
    "financial technology",
    "fintech",
    "POS-free payments",
    "CRM",
    "fundraising",
    "social commerce",
    "payment gateway",
    "secure payments",
    "low trust environment",
    "API integration",
    "payment processing",
    "East Africa fintech",
    "supply chain payments",
  ],
  authors: [{ name: "Piaxe Team" }],
  creator: "Piaxe",
  publisher: "Piaxe",
  metadataBase: new URL("https://piaxe.com"),
  alternates: {
    canonical: "https://piaxe.com",
  },
  openGraph: {
    type: "website",
    locale: "en_UG",
    url: "https://piaxe.com",
    siteName: "Piaxe",
    title: "Piaxe - Payment System for Supply Chains Optimized for Low Trust Environments",
    description:
      "Revolutionizing payments in Uganda with escrow protection, POS-free solutions, and comprehensive business tools.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Piaxe - Payment system for supply chains",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@piaxe",
    creator: "@piaxe",
    title: "Piaxe - Payment System for Supply Chains Optimized for Low Trust Environments",
    description:
      "Revolutionizing payments in Uganda with escrow protection, POS-free solutions, and comprehensive business tools.",
    images: ["/images/twitter-image.png"],
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
        <meta name="apple-mobile-web-app-title" content="Piaxe" />
        <meta name="application-name" content="Piaxe" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#06B6D4" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-oriented" content="portrait" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialService",
              name: "Piaxe",
              description:
                "Secure payment system optimized for low trust environments with escrow protection, POS-free payments, and business tools.",
              url: "https://piaxe.com",
              logo: "https://piaxe.com/images/logo.png",
              sameAs: [
                "https://twitter.com/piaxe",
                "https://www.linkedin.com/company/piaxe-me",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+256757951430",
                contactType: "customer service",
                availableLanguage: ["English", "Luganda", "Swahili",],
              },
              address: {
                "@type": "PostalAddress",
                addressCountry: "UG",
                addressRegion: "Central Region",
                addressLocality: "Kampala",
              },
              offers: [
                {
                  "@type": "Offer",
                  name: "Escrow Payment Protection",
                  description:
                    "Secure payment holding until transaction terms are met",
                },
                {
                  "@type": "Offer",
                  name: "POS-free Payments",
                  description:
                    "Accept payments in physical stores using only mobile phones",
                },
                {
                  "@type": "Offer",
                  name: "Payment API",
                  description:
                    "Integrate secure payment processing into your applications",
                },
              ],
            }),
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
