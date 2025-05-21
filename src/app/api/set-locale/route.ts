import { NextRequest, NextResponse } from "next/server";
import { getLocales, setUserLocale } from "@services/locale"; // adjust path
import { Locale } from "next-intl";

export async function POST(request: NextRequest) {
  try {
    const { locale } = await request.json();
    // Validate the locale against a list of supported locales.
    const supportedLocales: Locale[] = await getLocales();
    if (!locale || !supportedLocales.includes(locale as Locale)) {
      //Explicitly assert locale to Locale type
      return NextResponse.json(
        { success: false, error: "Unsupported locale" },
        { status: 400 },
      );
    }

    await setUserLocale(locale as Locale); //Make sure locale is a Locale type
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting user locale:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
