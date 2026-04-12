import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, addDays } from "date-fns";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const teacherId = searchParams.get("teacherId");
  const directionId = searchParams.get("directionId");

  const where: any = {
    status: "SCHEDULED",
    ...(from && { date: { gte: startOfDay(new Date(from)) } }),
    ...(to && { date: { lte: endOfDay(new Date(to)) } }),
    ...(!from && !to && {
      date: {
        gte: startOfDay(new Date()),
        lte: endOfDay(addDays(new Date(), 30)),
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

  const body = await req.json();

  const classSession = await prisma.classSession.create({
    data: {
      date: new Date(body.date),
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      maxStudents: body.maxStudents || 10,
      directionId: body.directionId,
      teacherId: body.teacherId || null,
      scheduleSlotId: body.scheduleSlotId || null,
      notes: body.notes || null,
    },
    include: { direction: true, teacher: { include: { user: true } } },
  });

  return NextResponse.json(classSession, { status: 201 });
}
