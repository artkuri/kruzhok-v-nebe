import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, addDays, format } from "date-fns";
import { ru } from "date-fns/locale";
import { formatTime } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Моё расписание" };

export default async function TeacherSchedulePage() {
  const session = await auth();
  const userId = (session!.user as any).id;

  const teacher = await prisma.teacher.findUnique({ where: { userId } });
  if (!teacher) return <div className="p-6 text-gray-400">Профиль педагога не найден</div>;

  const sessions = await prisma.classSession.findMany({
    where: {
      teacherId: teacher.id,
      startTime: {
        gte: startOfDay(new Date()),
        lte: endOfDay(addDays(new Date(), 30)),
      },
      status: "SCHEDULED",
    },
    include: {
      direction: true,
      _count: { select: { bookings: { where: { status: { notIn: ["CANCELLED"] } } } } },
    },
    orderBy: { startTime: "asc" },
  });

  const byDate = sessions.reduce<Record<string, typeof sessions>>((acc, s) => {
    const key = format(s.startTime, "yyyy-MM-dd");
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  const dates = Object.keys(byDate).sort();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Моё расписание</h1>
        <p className="text-gray-500 mt-1">Ближайшие 30 дней</p>
      </div>

      {dates.map((dateKey) => (
        <div key={dateKey}>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 capitalize">
            {format(new Date(dateKey + "T00:00:00"), "EEEE, d MMMM", { locale: ru })}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {byDate[dateKey].map((s) => (
              <Link
                key={s.id}
                href={`/teacher/classes/${s.id}`}
                className="rounded-2xl border border-gray-100 bg-white p-5 hover:shadow-md transition-shadow"
              >
                <div
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mb-3"
                  style={{ backgroundColor: s.direction.color + "20", color: s.direction.color }}
                >
                  {s.direction.name}
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatTime(s.startTime)} – {formatTime(s.endTime)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {s._count.bookings}/{s.maxStudents} учеников
                </p>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {dates.length === 0 && (
        <div className="text-center py-12 text-gray-400">Предстоящих занятий нет</div>
      )}
    </div>
  );
}
