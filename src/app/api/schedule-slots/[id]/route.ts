import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { fromZonedTime, toZonedTime, format } from "date-fns-tz";
import { STUDIO_TZ } from "@/lib/utils";

const updateSchema = z.object({
  teacherId:   z.string().nullable().optional(),
  startTime:   z.string().regex(/^\d{2}:\d{2}$/).optional(), // "HH:MM" в часовом поясе студии
  durationMin: z.number().int().min(15).max(480).optional(),
  maxStudents: z.number().int().min(1).max(100).optional(),
  isActive:    z.boolean().optional(),
  timezone:    z.string().optional(), // игнорируется, оставлен для обратной совместимости
});

/**
 * Re-stamps startTime/endTime on future sessions linked to a slot.
 * Время всегда интерпретируется в часовом поясе студии (STUDIO_TZ, UTC+5).
 * Only touches SCHEDULED sessions in the future (status not COMPLETED/CANCELLED/IN_PROGRESS).
 * Never creates or deletes sessions — only updates time fields.
 */
async function syncFutureSessions(
  slotId: string,
  newStartTime: string, // "HH:MM" в часовом поясе студии
  newDurationMin: number,
): Promise<number> {
  const timezone = STUDIO_TZ;
  const now = new Date();

  const sessions = await prisma.classSession.findMany({
    where: {
      scheduleSlotId: slotId,
      startTime: { gt: now },
      status: { notIn: ["COMPLETED", "CANCELLED", "IN_PROGRESS"] },
    },
    select: { id: true, startTime: true },
  });

  if (sessions.length === 0) return 0;

  const [hh, mm] = newStartTime.split(":").map(Number);

  await prisma.$transaction(
    sessions.map((s) => {
      // Convert existing UTC startTime → local date in the admin's timezone
      const zonedDate = toZonedTime(s.startTime, timezone);
      const localDateStr = format(zonedDate, "yyyy-MM-dd", { timeZone: timezone });

      // Apply new HH:MM to that local date, then convert back to UTC
      const newLocalStr = `${localDateStr}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`;
      const newUtcStart = fromZonedTime(newLocalStr, timezone);
      const newUtcEnd   = new Date(newUtcStart.getTime() + newDurationMin * 60_000);

      return prisma.classSession.update({
        where: { id: s.id },
        data: {
          startTime:   newUtcStart,
          endTime:     newUtcEnd,
          durationMin: newDurationMin,
        },
      });
    }),
  );

  return sessions.length;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const data = updateSchema.parse(body);

  const timeChanged = data.startTime !== undefined || data.durationMin !== undefined;

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

  let updatedSessions = 0;
  if (timeChanged) {
    updatedSessions = await syncFutureSessions(
      id,
      slot.startTime,
      slot.durationMin,
    );
  }

  return NextResponse.json({ slot, updatedSessions });
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
