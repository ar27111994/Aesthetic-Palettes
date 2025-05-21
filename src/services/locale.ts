"use server";

import fs from "fs";
import { Locale } from "next-intl";
import { cookies } from "next/headers";
import path from "path";

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = "NEXT_LOCALE";
let cachedLocales: Locale[] | null = null; //Simple in-memory cache

export async function getLocales(): Promise<Locale[]> {
  if (cachedLocales) {
    return cachedLocales; // Serve from cache if available
  }

  try {
    const files = await fs.promises.readdir("messages");
    cachedLocales = files.map((file) => path.basename(file, ".json")); // Return file names without extensions
    return cachedLocales;
  } catch (err: any) {
    console.error(`Error reading directory: ${err.message}`);
    return [];
  }
}

export async function getUserLocale(): Promise<Locale> {
  return (
    ((await cookies()).get(COOKIE_NAME)?.value as Locale) ||
    (await getDefaultLocale())
  );
}

export async function setUserLocale(locale: Locale): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: locale,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", //Recommend only setting secure cookies in production
  });
}

export async function getDefaultLocale(): Promise<Locale> {
  const locales = await getLocales();
  return locales.length > 0 ? locales[0] : "en"; //Check for array length to avoid error.
}
