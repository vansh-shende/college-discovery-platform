import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/prisma";
import { savedItemSchema } from "@/src/schemas/saved.schema";

// ─── Validation ──────────────────────────────────────────────────────────────

const userIdSchema = z.object({
  userId: z
    .string({ message: "userId is required" })
    .uuid({ message: "userId must be a valid UUID" }),
});

// ─── GET /api/saved?userId=<uuid> ────────────────────────────────────────────
// Fetches all saved colleges for a user, newest first.

export async function GET(request: NextRequest) {
  try {
    // 1. Validate query parameter
    const { searchParams } = request.nextUrl;

    const parsed = userIdSchema.safeParse({
      userId: searchParams.get("userId") ?? undefined,
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

    const { userId } = parsed.data;

    // 2. Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // 3. Fetch saved items with related college data
    const savedItems = await prisma.savedItem.findMany({
      where: { userId },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            location: true,
            ranking: true,
            description: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: savedItems,
    });
  } catch (error) {
    console.error("[GET /api/saved] Internal error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// ─── POST /api/saved ─────────────────────────────────────────────────────────
// Bookmarks a college for a user. Prevents duplicate saves via unique constraint.

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await request.json();

    const parsed = savedItemSchema.safeParse(body);

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

    const { userId, collegeId } = parsed.data;

    // 2. Create the saved item
    const savedItem = await prisma.savedItem.create({
      data: { userId, collegeId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "College saved successfully",
        data: savedItem,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // 3. Handle duplicate bookmark (Prisma unique constraint violation)
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "College already saved",
        },
        { status: 409 }
      );
    }

    console.error("[POST /api/saved] Internal error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/saved ────────────────────────────────────────────────────────
// Unbookmarks a college for a user.
export async function DELETE(request: NextRequest) {
  try {
    let userId: string | null = null;
    let collegeId: string | null = null;

    // Support both JSON body and search parameters
    try {
      const body = await request.json();
      const parsed = savedItemSchema.safeParse(body);
      if (parsed.success) {
        userId = parsed.data.userId;
        collegeId = parsed.data.collegeId;
      }
    } catch {
      const { searchParams } = request.nextUrl;
      userId = searchParams.get("userId");
      collegeId = searchParams.get("collegeId");
    }

    if (!userId || !collegeId) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed: userId and collegeId are required",
        },
        { status: 400 }
      );
    }

    // Delete the saved item
    await prisma.savedItem.delete({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "College unsaved successfully",
    });
  } catch (error: any) {
    // Check for Prisma record not found error (P2025)
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Saved item not found",
        },
        { status: 404 }
      );
    }

    console.error("[DELETE /api/saved] Internal error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

