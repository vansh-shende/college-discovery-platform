// ─── Shared Frontend Types ───────────────────────────────────────────────────
// Single source of truth for all frontend interfaces.
// Backend types (Prisma-generated) remain in app/generated/prisma/.

export interface Course {
  id: string;
  name: string;
  fees: number;
  duration: number;
}

export interface College {
  id: string;
  name: string;
  location: string;
  ranking: number;
  description: string;
  courses: Course[];
}

export interface SavedCollege {
  id: string;
  name: string;
  location: string;
  ranking: number;
  description: string;
}

export interface SavedItem {
  id: string;
  collegeId: string;
  createdAt: string;
  college: SavedCollege;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CollegeApiResponse {
  success: boolean;
  data: College[];
  pagination: PaginationMeta;
}

