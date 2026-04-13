import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  teacherId: z.string().nullable().optional(),
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  maxStudents: z.number().int().min(1).max(100).optional(),
  durationMin: z.number().int().min(15).max(480).optional(),
  startTime: z.string().optional(), // ISO string
  endTime: z.string().optional(),
  notes: z.string().optional().nullable(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const data = updateSchema.parse(body);

  const classSession = await prisma.classSession.update({
    where: { id },
    data: {
      ...(data.teacherId !== undefined && { teacherId: data.teacherId }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.maxStudents !== undefined && { maxStudents: data.maxStudents }),
      ...(data.durationMin !== undefined && { durationMin: data.durationMin }),
      ...(data.startTime !== undefined && { startTime: new Date(data.startTime) }),
      ...(data.endTime !== undefined && { endTime: new Date(data.endTime) }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
    include: {
      teacher: { include: { user: true } },
      direction: true,
    },
  });

  return NextResponse.json(classSession);
}
