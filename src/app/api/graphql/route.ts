import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest, NextResponse } from "next/server";
import { typeDefs } from "@lib/graphql/schema";
import { resolvers } from "@lib/graphql/resolvers";
import { createClient } from "@lib/utils/supabase/server";

// Export the API route handler
export async function POST(req: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = await createClient();

    // Create Apollo Server instance
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
    });

    // Create handler with context function
    const handler = startServerAndCreateNextHandler(apolloServer, {
      context: async () => {
        return { supabase, req };
      },
    });

    // Process the GraphQL request
    return handler(req);
  } catch (error) {
    console.error("GraphQL API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// Also support GET requests for GraphQL playground
export async function GET(req: NextRequest) {
  return POST(req);
}

// Configure the API route
export const config = {
  api: {
    bodyParser: false,
  },
};
