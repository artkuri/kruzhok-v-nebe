import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const sessions = await prisma.classSession.findMany({
    where: { status: { not: "CANCELLED" } },
    include: { _count: { select: { bookings: true } } },
    orderBy: { startTime: "asc" },
  });

  // Group by scheduleSlotId (or directionId if no slot) + UTC day of startTime
  const groups = new Map<string, typeof sessions>();
  for (const s of sessions) {
    const day = s.startTime.toISOString().slice(0, 10);
    const key = `${s.scheduleSlotId ?? s.directionId}_${day}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(s);
  }

  let deleted = 0;
  const skipped: string[] = [];

  for (const group of groups.values()) {
    if (group.length <= 1) continue;

    // Keep the one with most bookings, tie-break by earliest id
    const sorted = group.sort(
      (a, b) => b._count.bookings - a._count.bookings || a.id.localeCompare(b.id)
    );
    const [, ...remove] = sorted;

    for (const s of remove) {
      if (s._count.bookings > 0) {
        skipped.push(s.id);
        continue;
      }
      await prisma.classSession.delete({ where: { id: s.id } });
      deleted++;
    }
  }

  return NextResponse.json({ deleted, skipped });
}
