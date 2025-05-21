import type { Metadata } from "next";
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

const inter = Inter({ subsets: ["latin"], variable: "--font-family-sans" });

export const metadata: Metadata = {
  title: "Aesthetic Palettes",
  description: "Generate and explore beautiful color palettes",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getLocaleTranslations(locale);

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ReduxProvider>
            {/* Wrap content with Error Boundary */}
            <AppErrorBoundary>
              {/* Update key with locale to re-render on locale change */}
              <LocalesProvider key={locale}>
                <Header />
              </LocalesProvider>
              {children}
              <Footer />
              <CookieConsentBanner />
            </AppErrorBoundary>
            {/* End Error Boundary wrap */}
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
