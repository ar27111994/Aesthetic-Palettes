import { createClient } from "@lib/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Search palettes API endpoint
 * Handles searching for palettes by name, tag, or color
 */
export async function GET(req: NextRequest) {
  // Initialize Supabase client
  const supabase = await createClient();

  try {
    // Get search parameters from URL
    const url = new URL(req.url);
    const query = url.searchParams.get("query") || "";
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);
    const byColor = url.searchParams.get("byColor") === "true";

    // Validate input
    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 },
      );
    }

    let supabaseQuery = supabase
      .from("palettes")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (byColor) {
      // Search by color (hex value)
      // This is a simplified approach - in a real implementation,
      // you might want to use a more sophisticated color similarity algorithm
      supabaseQuery = supabaseQuery.filter("colors", "cs", `{${query}}`);
    } else {
      // Search by name or tags
      supabaseQuery = supabaseQuery.or(
        `name.ilike.%${query}%, tags.cs.{${query}}`,
      );
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error("Error searching palettes:", error);
      return NextResponse.json(
        { error: "Failed to search palettes" },
        { status: 500 },
      );
    }

    // Return the search results
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Search palettes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
