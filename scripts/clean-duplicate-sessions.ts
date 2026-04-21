import { config } from "dotenv";
config({ path: ".env.local" });
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL ?? process.env.DATABASE_URL } },
});

async function main() {
  // Fetch all sessions with booking count
  const sessions = await prisma.classSession.findMany({
    where: { status: { not: "CANCELLED" } },
    include: {
      _count: { select: { bookings: true } },
    },
    orderBy: { startTime: "asc" },
  });

  // Group by scheduleSlotId + day (UTC date string of startTime)
  const groups = new Map<string, typeof sessions>();

  for (const s of sessions) {
    const day = s.startTime.toISOString().slice(0, 10); // "YYYY-MM-DD" UTC
    const key = `${s.scheduleSlotId ?? s.directionId}_${day}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(s);
  }

  let totalDeleted = 0;

  for (const [key, group] of groups) {
    if (group.length <= 1) continue;

    // Keep the one with most bookings; tie-break by earliest createdAt
    const sorted = group.sort(
      (a, b) => b._count.bookings - a._count.bookings || a.createdAt.getTime() - b.createdAt.getTime()
    );

    const [keep, ...remove] = sorted;
    console.log(
      `Group ${key}: keep ${keep.id} (${keep._count.bookings} bookings), remove ${remove.length} duplicate(s)`
    );

    for (const s of remove) {
      if (s._count.bookings > 0) {
        console.warn(`  ⚠️  Skipping ${s.id} — has ${s._count.bookings} booking(s), manual review needed`);
        continue;
      }
      await prisma.classSession.delete({ where: { id: s.id } });
      totalDeleted++;
    }
  }

  console.log(`\n✅ Done. Deleted ${totalDeleted} duplicate session(s).`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
