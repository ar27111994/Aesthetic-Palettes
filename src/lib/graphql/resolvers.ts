// GraphQL Resolvers
import { Context } from "@lib/graphql/types";

export const resolvers = {
  Query: {
    // User queries
    me: async (_: any, __: any, { supabase, req }: Context) => {
      try {
        // Get the user from the session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return null;

        // Get the user profile from the database
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    },

    // Palette queries
    palette: async (_: any, { id }: { id: string }, { supabase }: Context) => {
      try {
        const { data, error } = await supabase
          .from("palettes")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error fetching palette:", error);
        return null;
      }
    },

    palettes: async (
      _: any,
      { limit = 10, offset = 0 }: { limit?: number; offset?: number },
      { supabase }: Context,
    ) => {
      try {
        const { data, error } = await supabase
          .from("palettes")
          .select("*")
          .eq("is_public", true)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching palettes:", error);
        return [];
      }
    },

    userPalettes: async (
      _: any,
      {
        userId,
        limit = 10,
        offset = 0,
      }: { userId: string; limit?: number; offset?: number },
      { supabase }: Context,
    ) => {
      try {
        const { data, error } = await supabase
          .from("palettes")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching user palettes:", error);
        return [];
      }
    },

    searchPalettes: async (
      _: any,
      {
        query,
        limit = 10,
        offset = 0,
      }: { query: string; limit?: number; offset?: number },
      { supabase }: Context,
    ) => {
      try {
        // Search by name, tags, or colors
        const { data, error } = await supabase
          .from("palettes")
          .select("*")
          .eq("is_public", true)
          .or(`name.ilike.%${query}%, tags.cs.{${query}}`)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error searching palettes:", error);
        return [];
      }
    },

    // Collection queries
    collection: async (
      _: any,
      { id }: { id: string },
      { supabase }: Context,
    ) => {
      try {
        const { data, error } = await supabase
          .from("collections")
          .select("*, palettes(*)")
          .eq("id", id)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error fetching collection:", error);
        return null;
      }
    },

    collections: async (
      _: any,
      { limit = 10, offset = 0 }: { limit?: number; offset?: number },
      { supabase }: Context,
    ) => {
      try {
        const { data, error } = await supabase
          .from("collections")
          .select("*")
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching collections:", error);
        return [];
      }
    },

    userCollections: async (
      _: any,
      {
        userId,
        limit = 10,
        offset = 0,
      }: { userId: string; limit?: number; offset?: number },
      { supabase }: Context,
    ) => {
      try {
        const { data, error } = await supabase
          .from("collections")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching user collections:", error);
        return [];
      }
    },
  },

  Mutation: {
    // Palette mutations
    createPalette: async (
      _: any,
      { input }: { input: any },
      { supabase, req }: Context,
    ) => {
      try {
        // Get the user from the session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");

        const { data, error } = await supabase
          .from("palettes")
          .insert({
            name: input.name || "Untitled Palette",
            colors: input.colors,
            is_public: input.isPublic ?? false,
            tags: input.tags || [],
            user_id: session.user.id,
            likes: 0,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error creating palette:", error);
        throw error;
      }
    },

    updatePalette: async (
      _: any,
      { input }: { input: any },
      { supabase, req }: Context,
    ) => {
      try {
        // Get the user from the session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");

        // Check if the user owns the palette
        const { data: palette, error: fetchError } = await supabase
          .from("palettes")
          .select("user_id")
          .eq("id", input.id)
          .single();

        if (fetchError) throw fetchError;
        if (palette.user_id !== session.user.id)
          throw new Error("Not authorized");

        // Update the palette
        const updateData: any = {};
        if (input.name !== undefined) updateData.name = input.name;
        if (input.colors !== undefined) updateData.colors = input.colors;
        if (input.isPublic !== undefined) updateData.is_public = input.isPublic;
        if (input.tags !== undefined) updateData.tags = input.tags;

        const { data, error } = await supabase
          .from("palettes")
          .update(updateData)
          .eq("id", input.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error updating palette:", error);
        throw error;
      }
    },

    deletePalette: async (
      _: any,
      { id }: { id: string },
      { supabase, req }: Context,
    ) => {
      try {
        // Get the user from the session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");

        // Check if the user owns the palette
        const { data: palette, error: fetchError } = await supabase
          .from("palettes")
          .select("user_id")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;
        if (palette.user_id !== session.user.id)
          throw new Error("Not authorized");

        // Delete the palette
        const { error } = await supabase.from("palettes").delete().eq("id", id);

        if (error) throw error;
        return true;
      } catch (error) {
        console.error("Error deleting palette:", error);
        return false;
      }
    },

    // Collection mutations
    createCollection: async (
      _: any,
      { input }: { input: any },
      { supabase, req }: Context,
    ) => {
      try {
        // Get the user from the session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");

        const { data, error } = await supabase
          .from("collections")
          .insert({
            name: input.name,
            user_id: session.user.id,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error creating collection:", error);
        throw error;
      }
    },

    updateCollection: async (
      _: any,
      { input }: { input: any },
      { supabase, req }: Context,
    ) => {
      try {
        // Get the user from the session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");

        // Check if the user owns the collection
        const { data: collection, error: fetchError } = await supabase
          .from("collections")
          .select("user_id")
          .eq("id", input.id)
          .single();

        if (fetchError) throw fetchError;
        if (collection.user_id !== session.user.id)
          throw new Error("Not authorized");

        // Update the collection
        const { data, error } = await supabase
          .from("collections")
          .update({ name: input.name })
          .eq("id", input.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error updating collection:", error);
        throw error;
      }
    },

    deleteCollection: async (
      _: any,
      { id }: { id: string },
      { supabase, req }: Context,
    ) => {
      try {
        // Get the user from the session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");

        // Check if the user owns the collection
        const { data: collection, error: fetchError } = await supabase
          .from("collections")
          .select("user_id")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;
        if (collection.user_id !== session.user.id)
          throw new Error("Not authorized");

        // Delete the collection
        const { error } = await supabase
          .from("collections")
          .delete()
          .eq("id", id);

        if (error) throw error;
        return true;
      } catch (error) {
        console.error("Error deleting collection:", error);
        return false;
      }
    },
  },
};
