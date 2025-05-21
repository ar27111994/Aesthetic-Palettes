import { createClient } from "@lib/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Password reset request API endpoint
 * Sends a password reset email to the user
 */
export async function POST(req: NextRequest) {
  // Initialize Supabase client
  const supabase = await createClient();

  try {
    // Parse request body
    const { email } = await req.json();

    // Validate input
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Send password reset email via Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/confirm`,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Return success response
    return NextResponse.json({
      message: "Password reset email sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * Password reset confirmation API endpoint
 * Updates the user's password after reset
 */
export async function PUT(req: NextRequest) {
  // Initialize Supabase client
  const supabase = await createClient();

  try {
    // Parse request body
    const { password } = await req.json();

    // Validate input
    if (!password) {
      return NextResponse.json(
        { error: "New password is required" },
        { status: 400 },
      );
    }

    // Update password via Supabase
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Return success response
    return NextResponse.json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
