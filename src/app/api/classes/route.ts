import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addDays } from "date-fns";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";
import { STUDIO_TZ } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const teacherId = searchParams.get("teacherId");
  const directionId = searchParams.get("directionId");

  const studioDay = (dateStr: string) =>
    fromZonedTime(formatInTimeZone(new Date(dateStr), STUDIO_TZ, "yyyy-MM-dd") + "T00:00:00", STUDIO_TZ);
  const studioEndDay = (dateStr: string) =>
    fromZonedTime(formatInTimeZone(new Date(dateStr), STUDIO_TZ, "yyyy-MM-dd") + "T23:59:59.999", STUDIO_TZ);

  const now = new Date();
  const where: any = {
    status: "SCHEDULED",
    ...(from && { startTime: { gte: studioDay(from) } }),
    ...(to   && { startTime: { lte: studioEndDay(to) } }),
    ...(!from && !to && {
      startTime: {
        gte: studioDay(now.toISOString()),
        lte: studioEndDay(addDays(now, 30).toISOString()),
      },
    }),
    ...(teacherId && { teacherId }),
    ...(directionId && { directionId }),
  };

  const sessions = await prisma.classSession.findMany({
    where,
    include: {
      direction: true,
      teacher: { include: { user: true } },
      _count: { select: { bookings: { where: { status: { notIn: ["CANCELLED"] } } } } },
    },
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json(sessions);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: any;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Неверный формат запроса" }, { status: 400 });
  }

  // Skip if a non-cancelled session already exists for this slot+date (idempotent generation)
  if (body.scheduleSlotId && body.date) {
    const dayStart = fromZonedTime(body.date + "T00:00:00", STUDIO_TZ);
    const dayEnd   = fromZonedTime(body.date + "T23:59:59.999", STUDIO_TZ);
    const existing = await prisma.classSession.findFirst({
      where: {
        scheduleSlotId: body.scheduleSlotId,
        startTime: { gte: dayStart, lte: dayEnd },
        status: { not: "CANCELLED" },
      },
    });
    if (existing) {
      return NextResponse.json(existing, { status: 200 });
    }
  }

  const classSession = await prisma.classSession.create({
    data: {
      date: new Date(body.date),
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      maxStudents: body.maxStudents || 10,
      durationMin: body.durationMin || 60,
      directionId: body.directionId,
      teacherId: body.teacherId || null,
      scheduleSlotId: body.scheduleSlotId || null,
      notes: body.notes || null,
    },
    include: { direction: true, teacher: { include: { user: true } } },
  });

  return NextResponse.json(classSession, { status: 201 });
}
