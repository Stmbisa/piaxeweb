import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth/context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#06B6D4" },
    { media: "(prefers-color-scheme: dark)", color: "#06B6D4" },
  ],
}

export const metadata: Metadata = {
  title: "Piaxe - Secure Payment System for Low Trust Environments",
  description:
    "Piaxe offers escrow payments, POS-free physical store payments, CRM, fundraising, and social e-commerce all in one platform. Perfect for consumers, SMEs, and online businesses.",
  keywords: [
    "escrow payments",
    "mobile money",
    "digital payments",
    "payment API",
    "secure transactions",
    "SME payments",
    "Uganda payments",
    "financial technology",
  ],
  authors: [{ name: "Piaxe Team" }],
  creator: "Piaxe",
  publisher: "Piaxe",
  metadataBase: new URL("https://piaxe.com"),
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://piaxe.com",
    title: "Piaxe - Secure Payment System for Low Trust Environments",
    description:
      "Piaxe offers escrow payments, POS-free physical store payments, CRM, fundraising, and social e-commerce all in one platform.",
    siteName: "Piaxe",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Piaxe - Secure Payment System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Piaxe - Secure Payment System for Low Trust Environments",
    description:
      "Piaxe offers escrow payments, POS-free physical store payments, CRM, fundraising, and social e-commerce all in one platform.",
    images: ["/images/og-image.png"],
    creator: "@piaxe",
  },
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
