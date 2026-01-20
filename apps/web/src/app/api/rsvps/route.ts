import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type CreateRsvpBody = {
  name?: unknown;
  phone?: unknown;
  guests?: unknown;
};

function asTrimmedString(value: unknown, maxLen: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > maxLen) return null;
  return trimmed;
}

function asOptionalTrimmedString(value: unknown, maxLen: number): string | null {
  if (value == null || value === "") return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > maxLen) return null;
  return trimmed;
}

function asGuests(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const guests = value
    .map((v) => asTrimmedString(v, 120))
    .filter((v): v is string => Boolean(v));
  return guests.slice(0, 20);
}

export async function POST(req: Request) {
  const hasDbEnv =
    Boolean(process.env.POSTGRES_PRISMA_URL) && Boolean(process.env.POSTGRES_URL_NON_POOLING);
  if (!hasDbEnv) {
    return NextResponse.json(
      { message: "Banco de dados não configurado (envs do Postgres ausentes)." },
      { status: 503 }
    );
  }

  const body = (await req.json().catch(() => null)) as CreateRsvpBody | null;
  if (!body) return NextResponse.json({ message: "JSON inválido." }, { status: 400 });

  const name = asTrimmedString(body.name, 120);
  if (!name) return NextResponse.json({ message: "Nome é obrigatório." }, { status: 400 });

  const phone = asOptionalTrimmedString(body.phone, 40);
  const guests = asGuests(body.guests);

  const created = await prisma.rsvp.create({
    data: {
      name,
      phone,
      guestNames: guests,
      guests: guests.length ? { create: guests.map((guestName) => ({ name: guestName })) } : undefined
    },
    select: {
      id: true,
      name: true,
      phone: true,
      guestNames: true,
      createdAt: true,
      guests: { select: { id: true, name: true } }
    }
  });

  return NextResponse.json(created, { status: 201 });
}
