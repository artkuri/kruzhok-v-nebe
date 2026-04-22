import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";
import { STUDIO_TZ } from "@/lib/utils";

const updateSchema = z.object({
  teacherId: z.string().nullable().optional(),
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  maxStudents: z.number().int().min(1).max(100).optional(),
  durationMin: z.number().int().min(15).max(480).optional(),
  startTime: z.string().optional(), // ISO string
  endTime: z.string().optional(),
  notes: z.string().optional().nullable(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Неверный формат запроса" }, { status: 400 });
  }
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
  }
  const data = parsed.data;

  const classSession = await prisma.classSession.update({
    where: { id },
    data: {
      ...(data.teacherId !== undefined && { teacherId: data.teacherId }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.maxStudents !== undefined && { maxStudents: data.maxStudents }),
      ...(data.durationMin !== undefined && { durationMin: data.durationMin }),
      ...(data.startTime !== undefined && {
        startTime: new Date(data.startTime),
        // date хранится как UTC-полночь Екатеринбургской календарной даты
        date: fromZonedTime(
          formatInTimeZone(new Date(data.startTime), STUDIO_TZ, "yyyy-MM-dd") + "T00:00:00",
          STUDIO_TZ,
        ),
      }),
      ...(data.endTime !== undefined && { endTime: new Date(data.endTime) }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
    include: {
      teacher: { include: { user: true } },
      direction: true,
    },
  });

  return NextResponse.json(classSession);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  // Мягкое удаление — переводим в CANCELLED (сохраняет историю бронирований)
  const classSession = await prisma.classSession.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json(classSession);
}
