import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { collegeQuerySchema } from "@/src/schemas/college.schema";
import type { Prisma } from "@/app/generated/prisma/client";

// ─── GET /api/colleges ───────────────────────────────────────────────────────
// Supports: pagination, search by name, filter by location, filter by course.

export async function GET(request: NextRequest) {
  try {
    // 1. Extract and validate query parameters
    const { searchParams } = request.nextUrl;

    const parsed = collegeQuerySchema.safeParse({
      search: searchParams.get("search") ?? undefined,
      location: searchParams.get("location") ?? undefined,
      course: searchParams.get("course") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const { search, location, course, page, limit } = parsed.data;

    // 2. Build Prisma where clause
    const where: Prisma.CollegeWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (course) {
      where.courses = {
        some: {
          name: { contains: course, mode: "insensitive" },
        },
      };
    }

    // 3. Execute queries in parallel: data + total count
    const skip = (page - 1) * limit;

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        include: {
          courses: {
            select: {
              id: true,
              name: true,
              fees: true,
              duration: true,
            },
          },
        },
        orderBy: { ranking: "asc" },
        skip,
        take: limit,
      }),
      prisma.college.count({ where }),
    ]);

    // 4. Return paginated response
    return NextResponse.json({
      success: true,
      data: colleges,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/colleges] Internal error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
