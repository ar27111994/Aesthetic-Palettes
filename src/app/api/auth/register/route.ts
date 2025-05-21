import { createClient } from "@lib/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Registration API endpoint
 * Handles new user registration via email/password
 */
export async function POST(req: NextRequest) {
  // Initialize Supabase client
  const supabase = await createClient();

  try {
    // Parse request body
    const { email, password, name } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Register user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create user profile in the database
    if (data.user) {
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        email: data.user.email,
        name: name || null,
      });

      if (profileError) {
        console.error("Error creating user profile:", profileError);
      }
    }

    // Return success response
    return NextResponse.json({
      message:
        "Registration successful. Please check your email for verification.",
      data,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
