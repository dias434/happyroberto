import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const hasDbEnv =
    Boolean(process.env.POSTGRES_PRISMA_URL) && Boolean(process.env.POSTGRES_URL_NON_POOLING);
  if (!hasDbEnv) {
    return NextResponse.json({
      rsvps: 0,
      guestsCount: 0,
      configured: false
    });
  }

  try {
    const count = await prisma.rsvp.count();
    const guestsCount = await prisma.rsvpGuest.count();

    return NextResponse.json({
      rsvps: count,
      guestsCount,
      configured: true
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
      return NextResponse.json({
        rsvps: 0,
        guestsCount: 0,
        configured: false
      });
    }

    console.error("Failed to fetch RSVP stats.", error);
    return NextResponse.json(
      { rsvps: 0, guestsCount: 0, configured: true, error: "stats_failed" },
      { status: 500 }
    );
  }
}
