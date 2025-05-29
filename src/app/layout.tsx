import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@styles/globals.css";
import CookieConsentBanner from "@components/CookieConsentBanner"; // Import the banner
import Header from "@components/Header"; // Import Header
import Footer from "@components/Footer"; // Import Footer
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { getLocaleTranslations } from "@i18n/request";
import { ReduxProvider } from "./providers"; // Import the Redux Provider
import { LocalesProvider } from "@context/useLocalesContext";
import AppErrorBoundary from "@components/ErrorBoundary"; // Import the Error Boundary
import { Suspense } from "react";
import { LoadingIndicator } from "@components/LoadingIndicator";
import { Toaster } from "@components/ClientToaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-family-sans",
  display: "swap",
});

// Enhanced Metadata for SEO
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ), // Set a base URL
  title: {
    default: "Aesthetic Palettes - Generate & Explore Color Schemes", // Default title
    template: "%s | Aesthetic Palettes", // Template for page-specific titles
  },
  description:
    "Discover, create, and share beautiful color palettes. Perfect for designers, artists, and developers looking for color inspiration.",
  keywords: [
    "color palettes",
    "color schemes",
    "color generator",
    "design tools",
    "ui colors",
    "ux colors",
    "color inspiration",
    "palette creator",
  ],
  authors: [
    { name: "Aesthetic Palettes Team", url: process.env.NEXT_PUBLIC_APP_URL },
  ],
  creator: "Aesthetic Palettes Team",
  publisher: "Aesthetic Palettes Team",
  // Open Graph Metadata (for social sharing)
  openGraph: {
    title: "Aesthetic Palettes - Generate & Explore Color Schemes",
    description:
      "Discover, create, and share beautiful color palettes. Perfect for designers, artists, and developers.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Aesthetic Palettes",
    images: [
      {
        url: "/og-image.png", // Replace with your actual OG image path
        width: 1200,
        height: 630,
        alt: "Aesthetic Palettes App Screenshot",
      },
    ],
    locale: "en_US", // Adjust if supporting multiple locales for OG
    type: "website",
  },
  // Twitter Card Metadata
  twitter: {
    card: "summary_large_image",
    title: "Aesthetic Palettes - Generate & Explore Color Schemes",
    description: "Discover, create, and share beautiful color palettes.",
    // siteId: "YourTwitterSiteID", // Optional: Your Twitter Site ID
    // creator: "@YourTwitterHandle", // Optional: Your Twitter Handle
    // creatorId: "YourTwitterCreatorID", // Optional: Your Twitter Creator ID
    images: ["/twitter-image.png"], // Replace with your actual Twitter image path
  },
  // Icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  // Manifest for PWA capabilities (optional)
  manifest: "/site.webmanifest",
  // Robots meta tag (can be customized per page too)
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
  // Theme color for browser UI
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" }, // Light theme color
    { media: "(prefers-color-scheme: dark)", color: "#1a202c" }, // Dark theme color (adjust as needed)
  ],
  // Verification for search engines (optional)
  // verification: {
  //   google: "your-google-site-verification-code",
  //   yandex: "your-yandex-verification-code",
  //   other: {
  //     me: ["my-email@example.com", "my-link"],
  //   },
  // },
  // Canonical URL (can be set per page for more specific control)
  // alternates: {
  //   canonical: process.env.NEXT_PUBLIC_APP_URL,
  //   languages: {
  //     'en-US': `${process.env.NEXT_PUBLIC_APP_URL}/en-US`,
  //     // Add other locales if applicable
  //   },
  // },
};

// Viewport configuration for responsive design
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Optional: Prevents zooming, consider accessibility implications
  // themeColor: "#ffffff", // Can also be set here
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getLocaleTranslations(locale);

  return (
    <html
      className={`${inter.className} antialiased`}
      lang={locale}
      suppressHydrationWarning
    >
      {/* Added antialiased and suppressHydrationWarning for Next Themes if used later */}
      <body>
        {/* Wrap content with NextIntlClientProvider */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Wrap content with Suspense */}
          <Suspense
            fallback={
              <LoadingIndicator
                className="m-auto"
                key={`${locale}-loader`}
                size="lg"
              />
            }
          >
            <ReduxProvider>
              {/* Wrap content with Error Boundary */}
              <AppErrorBoundary>
                {/* Update key with locale to re-render on locale change */}
                <LocalesProvider key={locale}>
                  <Header />
                </LocalesProvider>
                {/* Main content area with an ID for the skip link */}
                <main id="main-content" className="flex-grow">
                  {children}
                </main>
                <Footer />
                <CookieConsentBanner />
                {/* Use the custom Toaster component. It internally handles position and custom rendering. */}
                <Toaster />
              </AppErrorBoundary>
              {/* End Error Boundary wrap */}
            </ReduxProvider>
          </Suspense>
          {/* End Suspense wrap */}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
