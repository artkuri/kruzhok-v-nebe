import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  birthDate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: familyId } = await params;
  const family = await prisma.family.findUnique({ where: { id: familyId } });
  if (!family) return NextResponse.json({ error: "Family not found" }, { status: 404 });

  const body = await req.json();
  const data = schema.parse(body);

  const child = await prisma.child.create({
    data: {
      name: data.name,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      notes: data.notes,
      familyId,
    },
  });

  return NextResponse.json(child, { status: 201 });
}
