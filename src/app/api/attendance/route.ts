import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as any).role;
  if (role !== "ADMIN" && role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { bookingId, attended, notes } = body;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { classSession: { include: { teacher: true } } },
  });

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  // Teacher can only mark their own sessions
  if (role === "TEACHER") {
    const teacher = await prisma.teacher.findUnique({
      where: { userId: (session.user as any).id },
    });
    if (booking.classSession.teacherId !== teacher?.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const attendance = await prisma.attendance.upsert({
    where: { bookingId },
    update: { attended, notes: notes || null },
    create: {
      bookingId,
      attended,
      notes: notes || null,
      markedBy: (session.user as any).id,
    },
  });

  // Update booking status
  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: attended ? "ATTENDED" : "MISSED",
    },
  });

  // If missed and has subscription usage — burn the lesson (don't return it)
  // This is already handled: lesson was consumed when booked

  return NextResponse.json(attendance);
}
