import { getUserLocale } from "@services/locale";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = await getUserLocale();
  let messages;

  try {
    messages = await getLocaleTranslations(locale);
    return { locale, messages };
  } catch (error) {
    throw new Error("Locale not found", { cause: error });
  }
});

export async function getLocaleTranslations(
  locale: string,
): Promise<Record<string, string>> {
  return (await import(`../../messages/${locale}.json`)).default;
}
