import { createClient } from "@lib/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Login API endpoint
 * Handles user authentication via email/password
 */
export async function POST(req: NextRequest) {
  // Initialize Supabase client
  const supabase = await createClient();

  try {
    // Parse request body
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Authenticate user with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Return user session data
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
