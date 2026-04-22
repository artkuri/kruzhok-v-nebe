import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addYears } from "date-fns";
import { z } from "zod";

const createSchema = z.object({
  familyId: z.string(),
  type: z.enum(["DRAWING_ART_OWN", "DRAWING_ART_STUDIO", "CRAFT_CERAMIC"]),
  priceRub: z.number(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as any).role;
  const userId = (session.user as any).id;

  let familyId: string | undefined;

  if (role === "CLIENT") {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.familyId) return NextResponse.json([]);
    familyId = user.familyId;
  } else {
    familyId = new URL(req.url).searchParams.get("familyId") || undefined;
  }

  const where: any = familyId ? { familyId } : {};

  const subscriptions = await prisma.subscription.findMany({
    where,
    include: {
      family: true,
      usages: {
        include: {
          booking: {
            include: {
              classSession: { include: { direction: true } },
              child: true,
            },
          },
        },
        orderBy: { usedAt: "desc" },
      },
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(subscriptions);
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

  const now = new Date();
  const subscription = await prisma.subscription.create({
    data: {
      familyId: data.familyId,
      type: data.type,
      totalClasses: 8,
      usedClasses: 0,
      includesMaterials: data.type === "DRAWING_ART_STUDIO" || data.type === "CRAFT_CERAMIC",
      priceRub: data.priceRub,
      validFrom: now,
      validUntil: addYears(now, 1),
      notes: data.notes,
    },
    include: { family: true },
  });

  return NextResponse.json(subscription, { status: 201 });
}
