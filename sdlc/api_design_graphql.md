# API Design (GraphQL) for AestheticPalettes

## 1. Introduction

This document outlines the GraphQL API design for AestheticPalettes, as per task T026. The API will serve as the interface between the frontend application and the backend serverless functions, facilitating data exchange for palettes, user accounts, and other application features. The design prioritizes efficiency, strong typing, and adherence to GraphQL best practices, while supporting the zero-cost infrastructure.

## 2. Guiding Principles

- **GraphQL First:** Design the API with GraphQL principles, enabling clients to request only the data they need.
- **Strong Typing:** Utilize GraphQL's type system to ensure data integrity and provide clear contracts.
- **Modularity:** Organize schema into logical types and operations.
- **Performance:** Design queries and mutations for efficient execution by serverless functions and database interactions (Supabase).
- **Security:** Ensure all operations are authenticated and authorized appropriately.
- **Evolution:** Design the schema to be extensible for future features.

## 3. Core Entities & Types

Based on the `database_schema.md` (T025) and `documentation.md`.

### 3.1. `User` Type

Represents a user of the application.

```graphql
type User {
  id: ID! # Corresponds to Supabase Auth user ID
  username: String! # Unique username
  displayName: String
  avatarUrl: String
  bio: String
  createdAt: Timestamp!
  updatedAt: Timestamp!
  palettes(first: Int, after: String): PaletteConnection # Paginated list of palettes created by the user
  collections(first: Int, after: String): CollectionConnection # Paginated list of collections created by the user
  likedPalettes(first: Int, after: String): PaletteConnection # Palettes liked by the user
  # Add other fields like followers, following counts if implemented
}
```

### 3.2. `PaletteColor` Type

Represents a single color within a palette.

```graphql
type PaletteColor {
  hex: String! # Hex code, e.g., "#FF5733"
  name: String # Optional user-defined name for the color
  # Potentially add RGB, HSL, etc., if needed by client and easily derivable
}
```

### 3.3. `Palette` Type

Represents a color palette.

```graphql
type Palette {
  id: ID!
  name: String
  description: String
  colors: [PaletteColor!]! # Array of colors in the palette
  tags: [String!]
  isPublic: Boolean!
  createdBy: User # The user who created the palette (can be null for system/anonymous palettes)
  createdAt: Timestamp!
  updatedAt: Timestamp!
  likeCount: Int!
  commentCount: Int!
  # likedByCurrentUser: Boolean # Indicates if the currently authenticated user has liked this palette
  # comments(first: Int, after: String): CommentConnection
}
```

### 3.4. `Collection` Type

Represents a collection of palettes.

```graphql
type Collection {
  id: ID!
  name: String!
  description: String
  createdBy: User!
  palettes(first: Int, after: String): PaletteConnection # Paginated list of palettes in this collection
  createdAt: Timestamp!
  updatedAt: Timestamp!
}
```

### 3.5. `Comment` Type (If community features are implemented)

```graphql
type Comment {
  id: ID!
  content: String!
  createdBy: User!
  palette: Palette!
  createdAt: Timestamp!
  updatedAt: Timestamp!
  # parentComment: Comment # For threaded comments
  # replies(first: Int, after: String): CommentConnection
}
```

### 3.6. Pagination Types (Relay Style Cursor Connections)

```graphql
type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type PaletteEdge {
  cursor: String!
  node: Palette!
}

type PaletteConnection {
  edges: [PaletteEdge!]
  pageInfo: PageInfo!
  totalCount: Int!
}

# Similar Connection/Edge types for User, Collection, Comment, etc.
# e.g., UserConnection, UserEdge, CollectionConnection, CollectionEdge
```

### 3.7. Input Types

```graphql
input CreatePaletteInput {
  name: String
  description: String
  colors: [PaletteColorInput!]!
  tags: [String!]
  isPublic: Boolean = true
}

input UpdatePaletteInput {
  id: ID!
  name: String
  description: String
  colors: [PaletteColorInput!]
  tags: [String!]
  isPublic: Boolean
}

input PaletteColorInput {
  hex: String!
  name: String
}

input CreateCollectionInput {
  name: String!
  description: String
  paletteIds: [ID!]
}

input UpdateCollectionInput {
  id: ID!
  name: String
  description: String
  addPaletteIds: [ID!]
  removePaletteIds: [ID!]
}

# Add other input types as needed, e.g., AddCommentInput
```

### 3.8. Scalar Types

```graphql
scalar Timestamp # Represents a point in time, typically ISO 8601 string
```

## 4. Queries

```graphql
type Query {
  # User Queries
  me: User # Get the currently authenticated user
  user(id: ID, username: String): User # Get a user by ID or username
  users(first: Int, after: String): UserConnection # List users (admin or specific use cases)
  # Palette Queries
  palette(id: ID!): Palette # Get a specific palette by ID
  palettes(
    first: Int = 10
    after: String
    userId: ID
    tags: [String!]
    sortBy: PaletteSortEnum = CREATED_AT_DESC
    filter: PaletteFilterInput
  ): PaletteConnection # List/search palettes (public, user-specific, by tags, etc.)
  trendingPalettes(first: Int = 10, after: String): PaletteConnection
  # explorePalettes, etc.

  # Collection Queries
  collection(id: ID!): Collection
  collections(first: Int = 10, after: String, userId: ID): CollectionConnection

  # Tag Queries
  tags(first: Int = 10, after: String, query: String): TagConnection
}

enum PaletteSortEnum {
  CREATED_AT_DESC
  CREATED_AT_ASC
  LIKE_COUNT_DESC
  UPDATED_AT_DESC
}

input PaletteFilterInput {
  isPublic: Boolean
  # other filter criteria like color search if implemented
}

# Define TagConnection and TagEdge if tags become more complex than just strings
type Tag {
  name: String!
  paletteCount: Int # Number of palettes using this tag
}
type TagEdge {
  cursor: String!
  node: Tag!
}
type TagConnection {
  edges: [TagEdge!]
  pageInfo: PageInfo!
  totalCount: Int!
}
```

## 5. Mutations

```graphql
type Mutation {
  # User Profile Mutations (if users can update their own profiles beyond what Supabase handles)
  updateUserProfile(input: UpdateUserProfileInput!): User

  # Palette Mutations
  createPalette(input: CreatePaletteInput!): Palette
  updatePalette(input: UpdatePaletteInput!): Palette
  deletePalette(id: ID!): ID # Returns ID of deleted palette
  likePalette(paletteId: ID!): Palette # Toggles like, returns updated palette
  unlikePalette(paletteId: ID!): Palette # Explicit unlike, returns updated palette
  # Collection Mutations
  createCollection(input: CreateCollectionInput!): Collection
  updateCollection(input: UpdateCollectionInput!): Collection
  deleteCollection(id: ID!): ID
  addPaletteToCollection(collectionId: ID!, paletteId: ID!): Collection
  removePaletteFromCollection(collectionId: ID!, paletteId: ID!): Collection

  # Comment Mutations (if implemented)
  # addComment(input: AddCommentInput!): Comment
  # updateComment(input: UpdateCommentInput!): Comment
  # deleteComment(id: ID!): ID

  # Follow/Unfollow Mutations (if implemented)
  # followUser(userId: ID!): User
  # unfollowUser(userId: ID!): User
}

input UpdateUserProfileInput {
  displayName: String
  avatarUrl: String
  bio: String
}
```

## 6. Authentication and Authorization

- **Authentication:** All mutations and queries requiring user context (e.g., `me`, `createPalette`) will require a valid JWT (from Supabase Auth) in the `Authorization` header.
- **Authorization:** Serverless functions implementing the resolvers will perform authorization checks:
  - Users can only modify/delete their own resources (palettes, collections, profile).
  - Access to private resources is restricted to the owner.
  - Supabase Row Level Security (RLS) will be the primary enforcement mechanism at the database level, and GraphQL resolvers will respect these rules.

## 7. Error Handling

- GraphQL's standard error handling mechanism will be used.
- Errors will include a `message`, `path`, and potentially an `extensions` object with an error `code` for client-side handling (e.g., `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_FAILED`).

## 8. API Endpoint

- A single GraphQL endpoint will be exposed, e.g., `/api/graphql`.
- This endpoint will be handled by a serverless function (e.g., on Vercel/Netlify) that uses a GraphQL server library (like Apollo Server or Yoga GraphQL) to parse requests and execute resolvers.

## 9. Zero-Cost Considerations

- **Efficient Resolvers:** Resolvers will be optimized to minimize database queries and computation to stay within serverless function free tier limits.
- **Data Loaders:** Use data loader patterns to batch database requests and avoid N+1 problems, especially for nested resolvers.
- **Query Complexity/Depth Limiting:** Consider implementing query complexity analysis and depth limiting to prevent abusive queries that could exhaust resources.

## 10. Future Considerations

- **Subscriptions:** For real-time features (e.g., live updates on likes/comments), GraphQL subscriptions could be added. This would require a different infrastructure setup (e.g., Supabase Realtime, or a managed GraphQL service with subscription support, which might go beyond zero-cost).
- **File Uploads:** If image uploads are handled directly via GraphQL (e.g., for palette generation from image), a multipart request specification or a separate REST endpoint for uploads might be needed.

This GraphQL API design provides a flexible and robust interface for AestheticPalettes, aligning with modern best practices and project requirements.
