import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, phone } = body;

  const user = await prisma.user.update({
    where: { id: (session.user as any).id },
    data: { name, phone },
  });

  return NextResponse.json({ id: user.id, name: user.name, phone: user.phone });
}
