import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  isActive: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Неверный формат запроса" }, { status: 400 });
  }
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
  }
  const data = parsed.data;

  const teacher = await prisma.teacher.findUnique({ where: { id } });
  if (!teacher) return NextResponse.json({ error: "Педагог не найден" }, { status: 404 });

  const [updatedTeacher] = await prisma.$transaction([
    ...(data.bio !== undefined || data.isActive !== undefined
      ? [prisma.teacher.update({
          where: { id },
          data: {
            ...(data.bio !== undefined && { bio: data.bio }),
            ...(data.isActive !== undefined && { isActive: data.isActive }),
          },
        })]
      : []),
    ...(data.name !== undefined || data.phone !== undefined
      ? [prisma.user.update({
          where: { id: teacher.userId },
          data: {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.phone !== undefined && { phone: data.phone }),
          },
        })]
      : []),
  ]);

  const full = await prisma.teacher.findUnique({
    where: { id },
    include: { user: true },
  });

  return NextResponse.json(full);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const teacher = await prisma.teacher.findUnique({ where: { id } });
  if (!teacher) return NextResponse.json({ error: "Педагог не найден" }, { status: 404 });

  // Снимаем педагога с будущих занятий
  await prisma.classSession.updateMany({
    where: { teacherId: id, startTime: { gte: new Date() } },
    data: { teacherId: null },
  });
  await prisma.scheduleSlot.updateMany({
    where: { teacherId: id },
    data: { teacherId: null },
  });

  // Удаляем user (cascade удалит teacher)
  await prisma.user.delete({ where: { id: teacher.userId } });

  return NextResponse.json({ success: true });
}
