import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  const count = await prisma.rsvp.count();
  const guestsCount = await prisma.rsvpGuest.count();

  return NextResponse.json({
    rsvps: count,
    guestsCount,
    configured: true
  });
}
