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
  const { bookingId, attended, notes, deductFromSubscription } = body;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      classSession: { include: { teacher: true } },
      subscriptionUsage: true,
    },
  });

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

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

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: attended ? "ATTENDED" : "MISSED" },
  });

  // Ручное списание занятия с абонемента (если ребёнок не пришёл и у него нет usage)
  if (!attended && deductFromSubscription && !booking.subscriptionUsage) {
    const { subscriptionId } = deductFromSubscription;
    const sub = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
    if (sub && sub.isActive && sub.usedClasses < sub.totalClasses) {
      await prisma.$transaction([
        prisma.subscriptionUsage.create({
          data: { bookingId, subscriptionId },
        }),
        prisma.subscription.update({
          where: { id: subscriptionId },
          data: { usedClasses: { increment: 1 } },
        }),
      ]);
    }
  }

  return NextResponse.json(attendance);
}
