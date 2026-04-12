import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const childSchema = z.object({
  name: z.string().min(2),
  birthDate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: { family: { include: { children: true } } },
  });

  return NextResponse.json(user?.family?.children || []);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
  });

  if (!user?.familyId) {
    return NextResponse.json({ error: "Семья не найдена" }, { status: 400 });
  }

  const body = await req.json();
  const data = childSchema.parse(body);

  const child = await prisma.child.create({
    data: {
      name: data.name,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      notes: data.notes,
      familyId: user.familyId,
    },
  });

  return NextResponse.json(child, { status: 201 });
}
