// GraphQL Context Types
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Context interface for GraphQL resolvers
 * Provides access to Supabase client and request object
 */
export interface Context {
  supabase: SupabaseClient;
  req: Request;
}
