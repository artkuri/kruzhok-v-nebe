import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  teacherId:   z.string().nullable().optional(),
  startTime:   z.string().regex(/^\d{2}:\d{2}$/).optional(), // "HH:MM"
  durationMin: z.number().int().min(15).max(480).optional(),
  maxStudents: z.number().int().min(1).max(100).optional(),
  isActive:    z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const data = updateSchema.parse(body);

  const slot = await prisma.scheduleSlot.update({
    where: { id },
    data: {
      ...(data.teacherId   !== undefined && { teacherId:   data.teacherId }),
      ...(data.startTime   !== undefined && { startTime:   data.startTime }),
      ...(data.durationMin !== undefined && { durationMin: data.durationMin }),
      ...(data.maxStudents !== undefined && { maxStudents: data.maxStudents }),
      ...(data.isActive    !== undefined && { isActive:    data.isActive }),
    },
    include: { teacher: { include: { user: true } }, direction: true },
  });

  return NextResponse.json(slot);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.scheduleSlot.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
