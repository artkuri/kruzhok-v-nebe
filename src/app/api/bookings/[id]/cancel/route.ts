import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canCancelBooking } from "@/lib/utils";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      classSession: true,
      child: true,
      subscriptionUsage: { include: { subscription: true } },
    },
  });

  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const role = (session.user as any).role;
  const userId = (session.user as any).id;

  if (role === "CLIENT") {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.familyId !== booking.child.familyId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const canCancel = canCancelBooking(booking.classSession.startTime);
  const body = await req.json().catch(() => ({}));
  const reason = body.reason || "Отменено пользователем";

  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: params.id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
    });

    // Return subscription usage only if cancelled in time
    if (booking.subscriptionUsage && canCancel) {
      await tx.subscriptionUsage.delete({ where: { bookingId: params.id } });
      await tx.subscription.update({
        where: { id: booking.subscriptionUsage.subscriptionId },
        data: { usedClasses: { decrement: 1 } },
      });
    }
    // If cancelled late — subscription usage stays (lesson is burned)
  });

  return NextResponse.json({ success: true, refunded: canCancel && !!booking.subscriptionUsage });
}
