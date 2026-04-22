import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let from: string, to: string;
  try {
    const body = await req.json();
    from = body.from;
    to = body.to;
  } catch {
    return NextResponse.json({ error: "Неверный формат запроса" }, { status: 400 });
  }
  if (!from || !to) {
    return NextResponse.json({ error: "from и to обязательны" }, { status: 400 });
  }

  const fromDate = new Date(from + "T00:00:00Z");
  const toDate   = new Date(to   + "T23:59:59Z");

  // Hard-delete sessions with no active (non-cancelled) bookings
  const sessions = await prisma.classSession.findMany({
    where: { date: { gte: fromDate, lte: toDate } },
    select: {
      id: true,
      _count: { select: { bookings: { where: { status: { not: "CANCELLED" } } } } },
    },
  });

  const idsToDelete  = sessions.filter(s => s._count.bookings === 0).map(s => s.id);
  const skippedCount = sessions.length - idsToDelete.length;

  const { count } = await prisma.classSession.deleteMany({
    where: { id: { in: idsToDelete } },
  });

  return NextResponse.json({ deleted: count, skipped: skippedCount });
}
