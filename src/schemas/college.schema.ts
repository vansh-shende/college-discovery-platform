import { z } from "zod";

// ─── College Query Parameters Schema ────────────────────────────────────────
// Validates and transforms URL search params for GET /api/colleges.
// Uses z.coerce for page/limit since query params arrive as strings.

export const collegeQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .optional()
    .describe("Search colleges by name or description"),

  location: z
    .string()
    .trim()
    .optional()
    .describe("Filter by college location"),

  course: z
    .string()
    .trim()
    .optional()
    .describe("Filter by course name"),

  page: z
    .coerce.number()
    .int({ message: "Page must be a whole number" })
    .min(1, { message: "Page must be at least 1" })
    .default(1)
    .describe("Page number for pagination"),

  limit: z
    .coerce.number()
    .int({ message: "Limit must be a whole number" })
    .min(1, { message: "Limit must be at least 1" })
    .max(50, { message: "Limit must not exceed 50" })
    .default(10)
    .describe("Number of results per page"),
});

// ─── Inferred Type ───────────────────────────────────────────────────────────

export type CollegeQuery = z.infer<typeof collegeQuerySchema>;
