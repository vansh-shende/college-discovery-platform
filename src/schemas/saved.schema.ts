import { z } from "zod";

// ─── Saved Item (Bookmark) Schema ────────────────────────────────────────────
// Validates the request body for POST /api/saved and DELETE /api/saved.

export const savedItemSchema = z.object({
  userId: z
    .string({ message: "userId is required" })
    .uuid({ message: "userId must be a valid UUID" }),

  collegeId: z
    .string({ message: "collegeId is required" })
    .uuid({ message: "collegeId must be a valid UUID" }),
});

// ─── Inferred Type ───────────────────────────────────────────────────────────

export type SavedItemInput = z.infer<typeof savedItemSchema>;
