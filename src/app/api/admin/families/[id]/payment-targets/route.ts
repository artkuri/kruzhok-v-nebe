import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Returns unpaid bookings and subscriptions for a given family
// so the admin can quickly link a manual payment to one of them.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: familyId } = await params;

  const [bookings, subscriptions] = await Promise.all([
    // Unpaid bookings for this family (no linked paid payment)
    prisma.booking.findMany({
      where: {
        child: { familyId },
        status: { notIn: ["CANCELLED"] },
        payment: { is: null },          // no payment linked at all
      },
      include: {
        child: true,
        classSession: { include: { direction: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    // Subscriptions without a paid payment
    prisma.subscription.findMany({
      where: {
        familyId,
        payments: { none: { isPaid: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return NextResponse.json({ bookings, subscriptions });
}
