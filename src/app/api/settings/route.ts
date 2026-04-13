import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  studioName: z.string().min(1).max(100).optional(),
  maxGroupSize: z.number().int().min(1).max(100).optional(),
  cancellationHours: z.number().int().min(0).max(72).optional(),
  defaultDurationMin: z.number().int().min(15).max(480).optional(),
  address: z.string().max(200).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
});

async function getSettings() {
  return prisma.studioSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
}

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const data = updateSchema.parse(body);

  const settings = await prisma.studioSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  return NextResponse.json(settings);
}
