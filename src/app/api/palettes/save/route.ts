import { createClient } from "@lib/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Save palette API endpoint
 * Handles saving a palette to the user's account
 */
export async function POST(req: NextRequest) {
  // Initialize Supabase client
  const supabase = await createClient();

  try {
    // Get the user session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Parse request body
    const { name, colors, isPublic, tags } = await req.json();

    // Validate input
    if (!colors || !Array.isArray(colors) || colors.length === 0) {
      return NextResponse.json(
        { error: "Valid colors array is required" },
        { status: 400 },
      );
    }

    // Save palette to database
    const { data, error } = await supabase
      .from("palettes")
      .insert({
        name: name || "Untitled Palette",
        colors,
        is_public: isPublic ?? false,
        tags: tags || [],
        user_id: session.user.id,
        likes: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving palette:", error);
      return NextResponse.json(
        { error: "Failed to save palette" },
        { status: 500 },
      );
    }

    // Return the saved palette
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Save palette error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
