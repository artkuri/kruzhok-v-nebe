import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  type:        z.enum(["DRAWING", "ART_THERAPY", "CERAMICS", "MASTERCLASS", "INDIVIDUAL"]),
  name:        z.string().min(1).max(100),
  description: z.string().max(300).optional().nullable(),
  ageGroup:    z.string().max(20).optional().nullable(),
  color:       z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#6366f1"),
  priceRub:    z.number().int().min(0).optional().nullable(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const data = createSchema.parse(body);

  const direction = await prisma.direction.create({ data });
  return NextResponse.json(direction, { status: 201 });
}
