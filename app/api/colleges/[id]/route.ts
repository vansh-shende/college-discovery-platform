import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

// ─── GET /api/colleges/:id ───────────────────────────────────────────────────
// Fetches a single college by UUID with all related courses.

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = rawId.trim();

    // Basic guard — Prisma handles invalid IDs gracefully (returns null)
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "College ID is required",
        },
        { status: 400 }
      );
    }

    // Fetch college with courses
    const college = await prisma.college.findUnique({
      where: { id },
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
    });

    if (!college) {
      return NextResponse.json(
        {
          success: false,
          message: "College not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: college,
    });
  } catch (error) {
    console.error("[GET /api/colleges/:id] Internal error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
