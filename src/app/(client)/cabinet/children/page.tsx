import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChildrenManager } from "@/components/features/schedule/children-manager";

export const metadata = { title: "Мои дети" };

export default async function ChildrenPage() {
  const session = await auth();
  const familyId = (session!.user as any).familyId;

  const children = await prisma.child.findMany({
    where: { familyId: familyId || "" },
    include: {
      _count: { select: { bookings: { where: { status: { notIn: ["CANCELLED"] } } } } },
    },
  });

  return <ChildrenManager initialChildren={children} />;
}
