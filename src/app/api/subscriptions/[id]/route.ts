import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  priceRub: z.number().int().min(0).optional(),
  totalClasses: z.number().int().min(1).optional(),
  includesMaterials: z.boolean().optional(),
  includesMasterclass: z.boolean().optional(),
  description: z.string().max(300).optional().nullable(),
  notes: z.string().max(300).optional().nullable(),
  isActive: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const data = updateSchema.parse(body);

  const sub = await prisma.subscription.update({
    where: { id },
    data,
    include: { family: true },
  });

  return NextResponse.json(sub);
}
