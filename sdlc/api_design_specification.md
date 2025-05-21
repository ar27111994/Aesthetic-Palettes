# API Design Specification: AestheticPalettes

## 1. Introduction

This document outlines the API design for the AestheticPalettes application, as per task T026. The API will be built using serverless functions (e.g., Vercel Functions, Netlify Functions) and will primarily serve the SvelteKit frontend. The design prioritizes RESTful principles where applicable, clarity, and ease of use, while ensuring security and efficiency.

## 2. Guiding Principles

- **Stateless:** APIs will be stateless; each request will contain all necessary information.
- **JSON:** Request and response bodies will use JSON format.
- **HTTPS:** All API communication will be over HTTPS.
- **Authentication:** Endpoints requiring authentication will use JWTs provided by Supabase Auth.
- **Error Handling:** Consistent error response formats will be used.
- **Versioning:** (Optional for initial version, but consider `/api/v1/...` for future-proofing).

## 3. Authentication

- Authentication will be handled by Supabase Auth. Client obtains a JWT upon login.
- Protected API endpoints will require an `Authorization: Bearer <JWT>` header.
- Serverless functions will validate the JWT using Supabase's libraries.

## 4. API Endpoints

Base URL: `/api` (or `/api/v1`)

### 4.1. User Management (Primarily handled by Supabase Auth, but custom endpoints might be needed)

- **`GET /api/users/me`**
  - Description: Get the profile of the currently authenticated user.
  - Authentication: Required.
  - Response Body:
    ```json
    {
      "id": "uuid",
      "email": "user@example.com",
      "username": "string | null",
      "avatar_url": "string | null",
      "bio": "string | null",
      "website_url": "string | null",
      "created_at": "timestamp"
    }
    ```
- **`PUT /api/users/me`**
  - Description: Update the profile of the currently authenticated user.
  - Authentication: Required.
  - Request Body:
    ```json
    {
      "username": "string | null",
      "avatar_url": "string | null",
      "bio": "string | null",
      "website_url": "string | null"
    }
    ```
  - Response Body: Updated user profile (as above).

### 4.2. Palettes (FR1.x, FR4.x)

- **`POST /api/palettes`**
  - Description: Create a new palette.
  - Authentication: Required.
  - Request Body:
    ```json
    {
      "name": "string",
      "description": "string | null",
      "colors": [{"hex_value": "#RRGGBB", "name": "string | null", "sort_order": "integer"}, ...],
      "is_public": "boolean",
      "tags": ["uuid", ...]
    }
    ```
  - Response Body: The created palette object.
    ```json
    {
      "id": "uuid",
      "user_id": "uuid",
      "name": "string",
      "description": "string | null",
      "is_public": "boolean",
      "slug": "string",
      "views_count": 0,
      "likes_count": 0,
      "created_at": "timestamp",
      "updated_at": "timestamp",
      "colors": [{"id": "uuid", "hex_value": "#RRGGBB", "name": "string | null", "sort_order": "integer"}, ...],
      "tags": [{"id": "uuid", "name": "string"}, ...]
    }
    ```
- **`GET /api/palettes`**
  - Description: Get a list of palettes (e.g., user's own, public, trending).
  - Authentication: Optional (shows public if not auth, user-specific if auth).
  - Query Parameters: `user_id`, `public=true`, `trending=true`, `search`, `tag`, `page`, `limit`, `sort_by` (e.g., `created_at`, `likes_count`).
  - Response Body: Array of palette objects (condensed view).
- **`GET /api/palettes/{palette_id_or_slug}`**
  - Description: Get a single palette by its ID or slug.
  - Authentication: Optional.
  - Response Body: Full palette object (as in POST response).
- **`PUT /api/palettes/{palette_id}`**
  - Description: Update an existing palette.
  - Authentication: Required (user must own the palette).
  - Request Body: Similar to POST, but with fields to update.
  - Response Body: Updated palette object.
- **`DELETE /api/palettes/{palette_id}`**
  - Description: Delete a palette.
  - Authentication: Required (user must own the palette).
  - Response: `204 No Content` or `200 OK` with confirmation.

### 4.3. Palette Colors (If using separate `palette_colors` table)

- These would be sub-resources of palettes, e.g., `POST /api/palettes/{palette_id}/colors`.
- Alternatively, color updates can be part of the `PUT /api/palettes/{palette_id}` request body.

### 4.4. Collections (FR4.x)

- **`POST /api/collections`**
  - Description: Create a new collection.
  - Authentication: Required.
  - Request Body: `{"name": "string", "description": "string | null", "is_public": "boolean"}`
  - Response Body: Created collection object.
- **`GET /api/collections`**
  - Description: Get a list of collections (user's own, public).
  - Authentication: Optional.
  - Query Parameters: `user_id`, `public=true`, `page`, `limit`.
  - Response Body: Array of collection objects.
- **`GET /api/collections/{collection_id_or_slug}`**
  - Description: Get a single collection.
  - Authentication: Optional.
  - Response Body: Full collection object with associated palettes (condensed view).
- **`PUT /api/collections/{collection_id}`**
  - Description: Update a collection.
  - Authentication: Required (user must own collection).
  - Request Body: Fields to update.
  - Response Body: Updated collection object.
- **`DELETE /api/collections/{collection_id}`**
  - Description: Delete a collection.
  - Authentication: Required (user must own collection).
  - Response: `204 No Content`.
- **`POST /api/collections/{collection_id}/palettes`**
  - Description: Add a palette to a collection.
  - Authentication: Required.
  - Request Body: `{"palette_id": "uuid"}`
  - Response: `201 Created` or updated collection object.
- **`DELETE /api/collections/{collection_id}/palettes/{palette_id}`**
  - Description: Remove a palette from a collection.
  - Authentication: Required.
  - Response: `204 No Content`.

### 4.5. Tags (FR4.x)

- **`GET /api/tags`**
  - Description: Get a list of all available tags or popular tags.
  - Authentication: None.
  - Query Parameters: `popular=true`, `search`.
  - Response Body: `[{"id": "uuid", "name": "string"}, ...]`
- **`POST /api/tags`** (Potentially admin only, or allow users to create tags implicitly when tagging palettes)
  - Description: Create a new tag.
  - Authentication: Required (Admin or specific logic).
  - Request Body: `{"name": "string"}`
  - Response Body: Created tag object.

### 4.6. Likes (FR6.x)

- **`POST /api/palettes/{palette_id}/like`**
  - Description: Like a palette.
  - Authentication: Required.
  - Response: `201 Created` or `200 OK` with updated like status and count.
- **`DELETE /api/palettes/{palette_id}/like`**
  - Description: Unlike a palette.
  - Authentication: Required.
  - Response: `204 No Content` or `200 OK` with updated like status and count.

### 4.7. Comments (FR6.x)

- **`POST /api/palettes/{palette_id}/comments`**
  - Description: Add a comment to a palette.
  - Authentication: Required.
  - Request Body: `{"content": "string", "parent_comment_id": "uuid | null"}`
  - Response Body: Created comment object.
- **`GET /api/palettes/{palette_id}/comments`**
  - Description: Get comments for a palette.
  - Authentication: None.
  - Query Parameters: `page`, `limit`.
  - Response Body: Array of comment objects.
- **`PUT /api/comments/{comment_id}`**
  - Description: Update a comment.
  - Authentication: Required (user must own comment).
  - Request Body: `{"content": "string"}`
  - Response Body: Updated comment object.
- **`DELETE /api/comments/{comment_id}`**
  - Description: Delete a comment.
  - Authentication: Required (user must own comment or be admin).
  - Response: `204 No Content`.

### 4.8. User Follows (FR6.x)

- **`POST /api/users/{user_id_to_follow}/follow`**
  - Description: Follow a user.
  - Authentication: Required.
  - Response: `201 Created` or `200 OK`.
- **`DELETE /api/users/{user_id_to_unfollow}/follow`**
  - Description: Unfollow a user.
  - Authentication: Required.
  - Response: `204 No Content`.

### 4.9. AI & Color Tools (FR1.x, FR2.x, Enhanced Features)

- **`POST /api/ai/suggest-palette`**
  - Description: Get AI-powered palette suggestions.
  - Authentication: Required (or rate-limited for anonymous).
  - Request Body: `{"keywords": ["string"], "mood": "string", "image_url": "string | null"}`
  - Response Body: Array of suggested palette objects.
- **`GET /api/colors/shades-tints`**
  - Description: Generate shades and tints for a given color.
  - Authentication: None.
  - Query Parameters: `hex=RRGGBB` (no #), `count=5`.
  - Response Body: `{"shades": ["#hex", ...], "tints": ["#hex", ...]}`
- **`GET /api/colors/contrast-check`**
  - Description: Check contrast between two colors.
  - Authentication: None.
  - Query Parameters: `color1=RRGGBB`, `color2=RRGGBB`.
  - Response Body: `{"ratio": "float", "wcag_aa_normal": "boolean", "wcag_aaa_normal": "boolean", ...}`

## 5. Data Types (Conceptual)

- **`uuid`**: Universally Unique Identifier (string).
- **`string`**: Text.
- **`integer`**: Whole number.
- **`boolean`**: `true` or `false`.
- **`timestamp`**: ISO 8601 date-time string (e.g., `2023-10-27T10:00:00Z`).
- **`object`**: JSON object.
- **`array`**: JSON array.

## 6. Error Handling

Standard HTTP status codes will be used:

- `200 OK`: Request successful.
- `201 Created`: Resource successfully created.
- `204 No Content`: Request successful, no response body.
- `400 Bad Request`: Invalid request payload or parameters.
- `401 Unauthorized`: Authentication failed or missing.
- `403 Forbidden`: Authenticated user does not have permission.
- `404 Not Found`: Resource not found.
- `422 Unprocessable Entity`: Semantic errors in payload (e.g., validation failed).
- `500 Internal Server Error`: Server-side error.

Error Response Body:

```json
{
  "error": {
    "message": "A human-readable error message",
    "code": "ERROR_CODE_SLUG | null",
    "details": "object | array | null" // Optional additional details
  }
}
```

## 7. Rate Limiting

- Rate limiting will be implemented on sensitive or computationally expensive endpoints to prevent abuse, especially for unauthenticated users. This can be handled at the serverless function platform level or within the function code.

## 8. Future Considerations

- **GraphQL:** While REST is chosen for simplicity initially, GraphQL could be considered for more complex data fetching needs in the future.
- **WebSockets:** For real-time features (e.g., live collaboration), WebSockets (Supabase Realtime) would be integrated.

This API design provides a comprehensive set of endpoints to support the core functionalities of AestheticPalettes. It will be implemented iteratively as features are developed.
