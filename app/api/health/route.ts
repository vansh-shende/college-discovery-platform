import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

// ─── GET /api/health ─────────────────────────────────────────────────────────
// Verifies database connectivity. Use for uptime monitors and deploy checks.

export async function GET() {
  try {
    await prisma.$queryRawUnsafe("SELECT 1");

    return NextResponse.json({
      success: true,
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[GET /api/health] Database connection failed:", error);

    return NextResponse.json(
      {
        success: false,
        status: "unhealthy",
        database: "disconnected",
      },
      { status: 500 }
    );
  }
}
