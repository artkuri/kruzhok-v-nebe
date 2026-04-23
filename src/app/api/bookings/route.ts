import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  classSessionId: z.string(),
  childId: z.string(),
  subscriptionId: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const role = (session.user as any).role;
  const userId = (session.user as any).id;
  const familyId = (session.user as any).familyId;

  let where: any = {};

  if (role === "CLIENT") {
    // Show bookings for own family's children
    where = { child: { familyId: familyId } };
  } else if (role === "TEACHER") {
    // Show bookings for sessions taught by this teacher
    const teacher = await prisma.teacher.findUnique({ where: { userId } });
    where = { classSession: { teacherId: teacher?.id } };
  }
  // ADMIN: show all

  const status = searchParams.get("status");
  if (status) where.status = status;

  const childId = searchParams.get("childId");
  if (childId) where.childId = childId;

  const sessionId = searchParams.get("sessionId");
  if (sessionId) where.classSessionId = sessionId;

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      classSession: {
        include: { direction: true, teacher: { include: { user: true } } },
      },
      child: true,
      attendance: true,
      payment: true,
      subscriptionUsage: { include: { subscription: true } },
    },
    orderBy: { classSession: { startTime: "desc" } },
    take: 100,
  });

  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Неверный формат запроса" }, { status: 400 });
  }
  let data: z.infer<typeof createSchema>;
  try { data = createSchema.parse(body); } catch {
    return NextResponse.json({ error: "Не заполнены обязательные поля" }, { status: 400 });
  }
  const role = (session.user as any).role;
  const userId = (session.user as any).id;

  // Verify child belongs to current user's family (or admin)
  const child = await prisma.child.findUnique({ where: { id: data.childId } });
  if (!child) return NextResponse.json({ error: "Ребёнок не найден" }, { status: 404 });

  if (role === "CLIENT") {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.familyId !== child.familyId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // Check session exists and has capacity
  const classSession = await prisma.classSession.findUnique({
    where: { id: data.classSessionId },
    include: {
      direction: true,
      _count: { select: { bookings: { where: { status: { notIn: ["CANCELLED"] } } } } },
    },
  });

  if (!classSession) return NextResponse.json({ error: "Занятие не найдено" }, { status: 404 });
  if (classSession.status !== "SCHEDULED") {
    return NextResponse.json({ error: "Запись на это занятие недоступна" }, { status: 400 });
  }
  if (classSession._count.bookings >= classSession.maxStudents) {
    return NextResponse.json({ error: "Занятие заполнено" }, { status: 400 });
  }

  // Check not already booked
  const existing = await prisma.booking.findUnique({
    where: { classSessionId_childId: { classSessionId: data.classSessionId, childId: data.childId } },
  });
  if (existing && existing.status !== "CANCELLED") {
    return NextResponse.json({ error: "Уже записан на это занятие" }, { status: 400 });
  }

  // Create or restore booking
  const booking = await prisma.$transaction(async (tx) => {
    let bk: any;

    if (existing) {
      // Restore cancelled
      bk = await tx.booking.update({
        where: { id: existing.id },
        data: { status: "PENDING", cancelledAt: null, cancellationReason: null },
      });
    } else {
      bk = await tx.booking.create({
        data: {
          classSessionId: data.classSessionId,
          childId: data.childId,
          createdByAdmin: role === "ADMIN",
        },
      });
    }

    // Auto-create payment for individual lessons
    if (classSession!.direction.type === "INDIVIDUAL") {
      const price = classSession!.direction.priceRub;
      if (price != null) {
        await tx.payment.create({
          data: {
            bookingId: bk.id,
            amountRub: price,
            method: "ON_SITE",
            isPaid: false,
          },
        });
      }
    } else if (data.subscriptionId) {
      // Link subscription for group classes
      const sub = await tx.subscription.findUnique({ where: { id: data.subscriptionId } });
      if (sub && sub.isActive && sub.usedClasses < sub.totalClasses) {
        await tx.subscriptionUsage.upsert({
          where: { bookingId: bk.id },
          update: { subscriptionId: data.subscriptionId },
          create: { bookingId: bk.id, subscriptionId: data.subscriptionId },
        });
        await tx.subscription.update({
          where: { id: data.subscriptionId },
          data: { usedClasses: { increment: 1 } },
        });
        await tx.booking.update({
          where: { id: bk.id },
          data: { status: "CONFIRMED" },
        });
      }
    }

    return bk;
  });

  const full = await prisma.booking.findUnique({
    where: { id: booking.id },
    include: {
      classSession: { include: { direction: true } },
      child: true,
      payment: true,
      subscriptionUsage: { include: { subscription: true } },
    },
  });

  return NextResponse.json(full, { status: 201 });
}
