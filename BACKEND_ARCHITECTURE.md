# Backend Architecture & System Design Document

This document outlines the system architecture, design patterns, database optimization strategies, and API specifications implemented in the College Discovery Platform.

---

## 1. Database Connection Management: The Singleton Pattern
To prevent connection pool exhaustion during development hot-reloading (HMR) or under heavy lambda-like execution limits, the database client initializes via a global singleton lifecycle wrapper.

### Implementation Design (`src/lib/prisma.ts`)
- Implements a global cache namespace check to reuse the active `PrismaClient` instance if it exists.
- Restricts multiple instantiations of the database driver to prevent leaking open connection sockets.

---

## 2. Dynamic Input Schema Marshalling & Validation
All API boundaries are guarded by Zod validation schemas. This ensures type safety at runtime, filtering out invalid payloads before database read or write execution.

### Architectural Benefits
- **Zero Schema Infiltration**: Malicious inputs or bad query types are stopped at the network boundary, returning a structured `400 Bad Request` with exact field failures.
- **Strict Query Coercion**: Handles numerical query parameter conversions (e.g. converting `page` and `limit` strings from query strings into integers) automatically and typesafely.

---

## 3. High-Performance Database Operations

### Parallel Query Execution
On the paginated listings API (`GET /api/colleges`), the backend executes database fetch calls in parallel to calculate total count and retrieve page entries:
- Utilizes `Promise.all` to query the list data and count metadata concurrently.
- Reduces response latency (TTFB) by matching database thread efficiency.

### Indexed Retrieval
Database querying is optimized through query indexing configured at the database level (`prisma/schema.prisma`):
- Compound index created on Search Fields: `@@index([name, location, ranking])` inside the `College` model to support fast, non-blocking filtering and partial search matchers.
- Relational mapping constraints: `@@index([collegeId])` on the `Course` table to optimize join performance when resolving college courses.

---

## 4. Relational Constraints & Database Integrity
The schema ensures relational integrity and prevents orphaned records through constraints:
- **Composite Unique Index**: `@@unique([userId, collegeId])` on the `SavedItem` model guarantees that a user cannot duplicate a saved college entry, preventing write conflicts.
- **Cascade Deletes**: Child courses and user bookmarks are automatically cleaned up when parent items are deleted via `onDelete: Cascade` declarations.

---

## 5. API Response & Error Marshalling Standards
API endpoints return consistent response envelopes, standardizing client-side deserialization.

### Response Signature
- **Success States**: Returns a standard wrapper containing data and pagination metadata.
- **Conflict Handling**: Returns `409 Conflict` if compound key constraints are violated during bookmark creation.
- **Not Found Safeguards**: Handled using Prisma error checking (`P2025` RecordNotFound) returning clean `404` errors rather than crashing queries.
- **Fail-safe Exception Interceptors**: General errors are caught in global `try-catch` blocks returning `500 Internal Server Error` to hide sensitive environment logs from client viewers.
