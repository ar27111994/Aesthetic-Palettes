"use client";

import { MenuItem } from "@typings/Menu";
import { getDefaultLocale, getLocales, getUserLocale } from "@services/locale";
import { Observable } from "@utils/observable";
import { Locale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const localesObservable = new Observable();
export const LocalesContext = createContext<{
  language: string;
  availableLanguages: MenuItem[];
}>({ language: "", availableLanguages: [] });

export function LocalesProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Header");
  const router = useRouter();
  const [language, setLanguage] = useState("");
  const [availableLanguages, setAvailableLanguages] = useState(
    [] as MenuItem[],
  );

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts quickly

    async function fetchInitialLocaleData() {
      try {
        const [userLocale, languages] = await Promise.all([
          getUserLocale(),
          getAvailableLanguages(t),
        ]);

        if (isMounted) {
          setAvailableLanguages(languages);
          setLanguage(userLocale);
        }
      } catch (error) {
        console.error("Failed to fetch initial locale data:", error);
        if (isMounted) {
          // Set defaults or error states
          setAvailableLanguages([]);
          setLanguage(await getDefaultLocale());
        }
      }
    }

    fetchInitialLocaleData();

    // Subscribe to changes in the observable
    const unsubscribe = localesObservable.subscribe(
      () => router.refresh(), // Refresh the page to apply the new locale
    );

    // Unsubscribe when the component unmounts
    // Cleanup function to prevent setting state on unmounted component
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [router, t]); // Add router and t as dependencies

  return (
    <LocalesContext.Provider value={{ language, availableLanguages }}>
      {children}
    </LocalesContext.Provider>
  );
}

export const useLocalesContext = () => {
  const context = useContext(LocalesContext);
  if (context === null) {
    throw new Error("useLocalesContext must be used within a LocalesProvider");
  }
  return context;
};

const getAvailableLanguages = async (t: (key: string) => string) => {
  const locales: readonly string[] = await getLocales();

  return locales.map((locale) => ({
    label: t(`language.${locale}`),
    value: locale,
    onClick: () => handleLocaleChange(locale),
    isButton: true,
  }));
};

const handleLocaleChange = async (locale: Locale) => {
  try {
    const response = await fetch("/api/set-locale", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ locale }),
    });

    if (response.ok) {
      // Notify subscribers about the change
      localesObservable.notify();
    } else {
      console.error("Failed to set locale:", await response.json());
    }
  } catch (error) {
    console.error("Error setting locale:", error);
  }
};
