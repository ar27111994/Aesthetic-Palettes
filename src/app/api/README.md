# Serverless Functions Implementation

This directory contains the serverless functions implementation for the AestheticPalettes application, as specified in Task T050 of the project roadmap. The implementation uses Vercel Functions with Next.js API routes to provide backend functionality while adhering to the zero-cost infrastructure constraint.

## Directory Structure

```
src/app/api/
  ├── graphql/
  │   └── route.ts       # Main GraphQL API endpoint
  ├── auth/
  │   ├── login/
  │   │   └── route.ts   # User login endpoint
  │   ├── register/
  │   │   └── route.ts   # User registration endpoint
  │   └── reset-password/
  │       └── route.ts   # Password reset endpoint
  ├── palettes/
  │   ├── save/
  │   │   └── route.ts   # Save palette endpoint
  │   ├── collections/
  │   │   └── route.ts   # Manage palette collections
  │   └── search/
  │       └── route.ts   # Search palettes endpoint
  └── set-locale/
      └── route.ts       # Set user locale endpoint
```

## GraphQL API

The main API is implemented as a GraphQL endpoint using Apollo Server. The schema and resolvers are defined in the `src/lib/graphql/` directory.

- **Schema**: Defines the GraphQL types, queries, and mutations
- **Resolvers**: Implements the business logic for each query and mutation
- **Context**: Provides access to the Supabase client and request object

## Authentication

Authentication is handled through Supabase Auth, with the following endpoints:

- **Login**: Authenticates users with email/password
- **Register**: Creates new user accounts
- **Reset Password**: Handles password reset requests and confirmations

## Palette Management

Palette management functionality is implemented through the following endpoints:

- **Save**: Saves a palette to the user's account
- **Collections**: Creates and manages palette collections
- **Search**: Searches for palettes by name, tag, or color

## Security Considerations

The implementation includes several security measures:

1. **Input Validation**: All user inputs are validated before processing
2. **Authentication Checks**: Protected endpoints verify user authentication
3. **Authorization Checks**: Ensures users can only access their own data
4. **Error Handling**: Proper error handling to prevent information leakage
5. **HTTPS**: All API endpoints are served over HTTPS

## Environment Variables

The following environment variables are required:

- `SUPABASE_URL`: The URL of your Supabase project
- `SUPABASE_ANON_KEY`: The anonymous API key for your Supabase project
- `NEXT_PUBLIC_APP_URL`: The public URL of your application (for redirects)

## Local Development

To run the serverless functions locally:

1. Install dependencies: `npm install`
2. Set up environment variables in a `.env.local` file
3. Start the development server: `npm run dev`

## Testing

Unit tests for the serverless functions can be implemented using Jest. Integration tests should verify the end-to-end functionality with Supabase.

## Deployment

The serverless functions will be automatically deployed when the application is deployed to Vercel. No additional configuration is required.
