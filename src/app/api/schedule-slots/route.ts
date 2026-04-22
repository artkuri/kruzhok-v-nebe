import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  directionId: z.string(),
  dayOfWeek:   z.number().int().min(1).max(7),
  startTime:   z.string().regex(/^\d{2}:\d{2}$/), // "HH:MM"
  durationMin: z.number().int().min(15).max(480).default(60),
  maxStudents: z.number().int().min(1).max(100).default(10),
  teacherId:   z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Неверный формат запроса" }, { status: 400 });
  }
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
  }
  const data = parsed.data;

  const slot = await prisma.scheduleSlot.create({
    data: {
      directionId: data.directionId,
      dayOfWeek:   data.dayOfWeek,
      startTime:   data.startTime,
      durationMin: data.durationMin,
      maxStudents: data.maxStudents,
      teacherId:   data.teacherId ?? null,
    },
    include: { direction: true, teacher: { include: { user: true } } },
  });

  return NextResponse.json(slot, { status: 201 });
}
