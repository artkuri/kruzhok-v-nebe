import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  birthDate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const child = await prisma.child.findUnique({ where: { id } });
  if (!child) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  const role = (session.user as any).role;

  if (role !== "ADMIN" && user?.familyId !== child.familyId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const data = updateSchema.parse(body);

  const updated = await prisma.child.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      notes: data.notes,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const child = await prisma.child.findUnique({ where: { id } });
  if (!child) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  const role = (session.user as any).role;

  if (role !== "ADMIN" && user?.familyId !== child.familyId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.child.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
