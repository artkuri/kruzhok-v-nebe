import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata = { title: "Мои занятия" };

export default async function TeacherClassesPage() {
  const session = await auth();
  const userId = (session!.user as any).id;

  const teacher = await prisma.teacher.findUnique({ where: { userId } });
  if (!teacher) return <div className="p-6 text-gray-400">Профиль педагога не найден</div>;

  const sessions = await prisma.classSession.findMany({
    where: { teacherId: teacher.id },
    include: {
      direction: true,
      _count: { select: { bookings: { where: { status: { notIn: ["CANCELLED"] } } } } },
    },
    orderBy: { startTime: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Мои занятия</h1>

      <div className="space-y-2">
        {sessions.map((s) => {
          const isPast = new Date(s.startTime) < new Date();
          return (
            <Link
              key={s.id}
              href={`/teacher/classes/${s.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 hover:shadow-sm transition-shadow"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: s.direction.color + "20",
                      color: s.direction.color,
                    }}
                  >
                    {s.direction.name}
                  </span>
                  {isPast && <Badge variant="outline">Прошло</Badge>}
                  {s.status === "CANCELLED" && <Badge variant="destructive">Отменено</Badge>}
                </div>
                <p className="text-sm text-gray-700">{formatDateTime(s.startTime)}</p>
              </div>
              <div className="text-right text-sm text-gray-500 shrink-0">
                {s._count.bookings}/{s.maxStudents}
              </div>
            </Link>
          );
        })}
        {sessions.length === 0 && (
          <div className="text-center py-12 text-gray-400">Занятий нет</div>
        )}
      </div>
    </div>
  );
}
