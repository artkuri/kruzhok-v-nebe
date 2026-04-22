import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const childSchema = z.object({
  name: z.string().min(2),
  birthDate: z.string().optional().nullable(),
});

const schema = z.object({
  name:       z.string().min(2),
  phone:      z.string().optional().nullable(),
  email:      z.string().email().optional().nullable(),
  familyName: z.string().optional().nullable(),
  password:   z.string().min(6).optional(),
  children:   z.array(childSchema).optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Неверный формат запроса" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
  }
  const data = parsed.data;

  // Email uniqueness check (only if email provided)
  if (data.email) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 400 }
      );
    }
  }

  // If no email, generate a placeholder (not usable for login)
  const email = data.email || `noemail_${Date.now()}@kruzhok.internal`;
  const rawPassword = data.password || "kruzhok123";
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  const result = await prisma.$transaction(async (tx) => {
    const family = await tx.family.create({
      data: { name: data.familyName || `Семья ${data.name}` },
    });

    const user = await tx.user.create({
      data: {
        email,
        name:  data.name,
        phone: data.phone || null,
        passwordHash,
        role:  "CLIENT",
        familyId: family.id,
      },
    });

    const children = [];
    for (const c of data.children ?? []) {
      const child = await tx.child.create({
        data: {
          name:      c.name,
          birthDate: c.birthDate ? new Date(c.birthDate) : null,
          familyId:  family.id,
        },
      });
      children.push(child);
    }

    return { user, family, children };
  });

  return NextResponse.json(
    {
      success:     true,
      familyId:    result.family.id,
      generatedPw: !data.password ? rawPassword : undefined,
    },
    { status: 201 }
  );
}
