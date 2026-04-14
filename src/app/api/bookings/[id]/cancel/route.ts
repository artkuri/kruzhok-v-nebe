import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canCancelBooking } from "@/lib/utils";

// Reason codes stored in DB — server-determined, not trusted from client
const REASON = {
  REFUNDED:     "CLIENT_CANCEL_REFUNDED",    // >3h, subscription lesson returned
  BURNED:       "CLIENT_CANCEL_BURNED",      // <3h, subscription lesson forfeited
  NO_SUB:       "CLIENT_CANCEL_NO_SUB",      // no subscription, no deduction
  ADMIN_CANCEL: "ADMIN_CANCEL",              // admin forced cancellation
} as const;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as any).role;
  const userId = (session.user as any).id;

  // Admin can explicitly choose whether to refund. Default = true (safe/generous).
  // Clients cannot set this — their refund is time-window based only.
  let adminWantsRefund = true;
  try {
    const body = await req.json();
    if (role === "ADMIN" && typeof body.refund === "boolean") {
      adminWantsRefund = body.refund;
    }
  } catch { /* empty body is fine */ }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      classSession: true,
      child: true,
      subscriptionUsage: { include: { subscription: true } },
    },
  });

  if (!booking) return NextResponse.json({ error: "Запись не найдена" }, { status: 404 });

  // ── Guard 1: already cancelled ─────────────────────────────────────────────
  if (booking.status === "CANCELLED") {
    return NextResponse.json({ error: "Запись уже отменена" }, { status: 400 });
  }

  // ── Guard 2: attendance already marked ────────────────────────────────────
  if (booking.status === "ATTENDED" || booking.status === "MISSED") {
    return NextResponse.json(
      { error: "Нельзя отменить запись после отметки посещаемости" },
      { status: 400 }
    );
  }

  // ── Guard 3: session already completed or cancelled ────────────────────────
  const sessionStatus = booking.classSession.status;
  if (sessionStatus === "COMPLETED" || sessionStatus === "CANCELLED") {
    return NextResponse.json(
      { error: "Нельзя отменить запись на завершённое или отменённое занятие" },
      { status: 400 }
    );
  }

  // ── Guard 4: client cannot cancel a session that has already started ───────
  const sessionStarted = new Date(booking.classSession.startTime) <= new Date();
  if (role === "CLIENT" && sessionStarted) {
    return NextResponse.json(
      { error: "Нельзя отменить запись на занятие, которое уже началось" },
      { status: 400 }
    );
  }

  // ── Guard 5: client can only cancel own family's children ──────────────────
  if (role === "CLIENT") {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.familyId !== booking.child.familyId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // ── Business logic ─────────────────────────────────────────────────────────
  // canCancelBooking: true when now < (startTime - 3h) — re-computed server-side
  const withinWindow = canCancelBooking(booking.classSession.startTime);
  const hasSubscription = !!booking.subscriptionUsage;
  const refund = withinWindow && hasSubscription;

  // Determine the stored reason code
  let reasonCode: string;
  if (role === "ADMIN" || role === "TEACHER") {
    reasonCode = REASON.ADMIN_CANCEL;
    // Admin can always refund even past window — their discretion
    // (but we only auto-refund subscription within 3h window for clients)
  } else if (!hasSubscription) {
    reasonCode = REASON.NO_SUB;
  } else if (refund) {
    reasonCode = REASON.REFUNDED;
  } else {
    reasonCode = REASON.BURNED;
  }

  // For admin: refund only if they chose to (defaults true); teacher always refunds
  const adminForceRefund =
    hasSubscription &&
    ((role === "TEACHER") || (role === "ADMIN" && adminWantsRefund));

  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancellationReason: reasonCode,
      },
    });

    const shouldRefund = refund || adminForceRefund;
    if (shouldRefund && booking.subscriptionUsage) {
      await tx.subscriptionUsage.delete({
        where: { bookingId: id },
      });
      await tx.subscription.update({
        where: { id: booking.subscriptionUsage.subscriptionId },
        data: { usedClasses: { decrement: 1 } },
      });
    }
  });

  return NextResponse.json({
    success: true,
    refunded: refund || adminForceRefund,
    burned: !withinWindow && hasSubscription && role === "CLIENT",
    reasonCode,
  });
}
