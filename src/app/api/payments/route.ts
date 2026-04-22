import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  amountRub: z.number(),
  method: z.enum(["CASH", "TRANSFER", "ON_SITE"]),
  bookingId: z.string().optional().nullable(),
  subscriptionId: z.string().optional().nullable(),
  notes: z.string().optional(),
  isPaid: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payments = await prisma.payment.findMany({
    include: {
      booking: {
        include: { child: true, classSession: { include: { direction: true } } },
      },
      subscription: { include: { family: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json(payments);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Неверный формат запроса" }, { status: 400 });
  }
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
  }
  const data = parsed.data;

  const payment = await prisma.payment.create({
    data: {
      amountRub: data.amountRub,
      method: data.method,
      bookingId: data.bookingId || null,
      subscriptionId: data.subscriptionId || null,
      notes: data.notes,
      isPaid: data.isPaid ?? false,
      paidAt: data.isPaid ? new Date() : null,
    },
  });

  // Update booking status if payment marked as paid
  if (data.isPaid && data.bookingId) {
    await prisma.booking.update({
      where: { id: data.bookingId },
      data: { status: "CONFIRMED" },
    });
  }

  return NextResponse.json(payment, { status: 201 });
}
