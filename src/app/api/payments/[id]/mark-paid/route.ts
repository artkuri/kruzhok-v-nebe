import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await _req.json().catch(() => ({}));

  const payment = await prisma.payment.update({
    where: { id },
    data: {
      isPaid: true,
      paidAt: new Date(),
      method: body.method || undefined,
    },
  });

  if (payment.bookingId) {
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: "CONFIRMED" },
    });
  }

  return NextResponse.json(payment);
}
