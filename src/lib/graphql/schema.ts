// GraphQL Schema Definition
import { gql } from "graphql-tag";
// Note: If graphql-tag is not available, you can also use: import { gql } from "@apollo/server";

export const typeDefs = gql`
  # User type definition
  type User {
    id: ID!
    email: String!
    name: String
    createdAt: String!
    updatedAt: String!
  }

  # Palette type definition
  type Palette {
    id: ID!
    name: String
    colors: [String!]!
    createdAt: String!
    updatedAt: String!
    userId: ID
    isPublic: Boolean!
    tags: [String]
    likes: Int!
  }

  # Collection type definition
  type Collection {
    id: ID!
    name: String!
    userId: ID!
    palettes: [Palette!]
    createdAt: String!
    updatedAt: String!
  }

  # Input types for mutations
  input CreatePaletteInput {
    name: String
    colors: [String!]!
    isPublic: Boolean
    tags: [String]
  }

  input UpdatePaletteInput {
    id: ID!
    name: String
    colors: [String!]
    isPublic: Boolean
    tags: [String]
  }

  input CreateCollectionInput {
    name: String!
  }

  input UpdateCollectionInput {
    id: ID!
    name: String
  }

  # Query type definition
  type Query {
    # User queries
    me: User

    # Palette queries
    palette(id: ID!): Palette
    palettes(limit: Int, offset: Int): [Palette!]!
    userPalettes(userId: ID!, limit: Int, offset: Int): [Palette!]!
    searchPalettes(query: String!, limit: Int, offset: Int): [Palette!]!

    # Collection queries
    collection(id: ID!): Collection
    collections(limit: Int, offset: Int): [Collection!]!
    userCollections(userId: ID!, limit: Int, offset: Int): [Collection!]!
  }

  # Mutation type definition
  type Mutation {
    # Palette mutations
    createPalette(input: CreatePaletteInput!): Palette!
    updatePalette(input: UpdatePaletteInput!): Palette!
    deletePalette(id: ID!): Boolean!
    likePalette(id: ID!): Palette!
    unlikePalette(id: ID!): Palette!

    # Collection mutations
    createCollection(input: CreateCollectionInput!): Collection!
    updateCollection(input: UpdateCollectionInput!): Collection!
    deleteCollection(id: ID!): Boolean!
    addPaletteToCollection(paletteId: ID!, collectionId: ID!): Collection!
    removePaletteFromCollection(paletteId: ID!, collectionId: ID!): Collection!
  }
`;
