import { createClient } from "@lib/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Collections API endpoint
 * Handles creating, listing, and managing palette collections
 */

// Get all collections for the authenticated user
export async function GET(_req: NextRequest) {
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

    // Get collections from database
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching collections:", error);
      return NextResponse.json(
        { error: "Failed to fetch collections" },
        { status: 500 },
      );
    }

    // Return the collections
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Collections error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Create a new collection
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
    const { name } = await req.json();

    // Validate input
    if (!name) {
      return NextResponse.json(
        { error: "Collection name is required" },
        { status: 400 },
      );
    }

    // Create collection in database
    const { data, error } = await supabase
      .from("collections")
      .insert({
        name,
        user_id: session.user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating collection:", error);
      return NextResponse.json(
        { error: "Failed to create collection" },
        { status: 500 },
      );
    }

    // Return the created collection
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Create collection error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Update a collection
export async function PUT(req: NextRequest) {
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
    const { id, name } = await req.json();

    // Validate input
    if (!id || !name) {
      return NextResponse.json(
        { error: "Collection ID and name are required" },
        { status: 400 },
      );
    }

    // Check if the user owns the collection
    const { data: collection, error: fetchError } = await supabase
      .from("collections")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching collection:", fetchError);
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 },
      );
    }

    if (collection.user_id !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to update this collection" },
        { status: 403 },
      );
    }

    // Update collection in database
    const { data, error } = await supabase
      .from("collections")
      .update({ name })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating collection:", error);
      return NextResponse.json(
        { error: "Failed to update collection" },
        { status: 500 },
      );
    }

    // Return the updated collection
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Update collection error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Delete a collection
export async function DELETE(req: NextRequest) {
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

    // Get collection ID from URL
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    // Validate input
    if (!id) {
      return NextResponse.json(
        { error: "Collection ID is required" },
        { status: 400 },
      );
    }

    // Check if the user owns the collection
    const { data: collection, error: fetchError } = await supabase
      .from("collections")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching collection:", fetchError);
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 },
      );
    }

    if (collection.user_id !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this collection" },
        { status: 403 },
      );
    }

    // Delete collection from database
    const { error } = await supabase.from("collections").delete().eq("id", id);

    if (error) {
      console.error("Error deleting collection:", error);
      return NextResponse.json(
        { error: "Failed to delete collection" },
        { status: 500 },
      );
    }

    // Return success response
    return NextResponse.json({
      message: "Collection deleted successfully",
    });
  } catch (error) {
    console.error("Delete collection error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
