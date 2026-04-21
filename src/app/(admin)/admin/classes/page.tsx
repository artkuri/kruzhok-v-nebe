import { prisma } from "@/lib/prisma";
import { startOfDay, addDays, endOfDay } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { ru } from "date-fns/locale";
import { formatTime, STUDIO_TZ } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Users, Clock } from "lucide-react";

export const metadata = { title: "Занятия" };

export default async function AdminClassesPage() {
  const sessions = await prisma.classSession.findMany({
    where: {
      date: {
        gte: startOfDay(new Date()),
        lte: endOfDay(addDays(new Date(), 30)),
      },
    },
    include: {
      direction: true,
      teacher: { include: { user: true } },
      _count: { select: { bookings: { where: { status: { notIn: ["CANCELLED"] } } } } },
    },
    orderBy: { startTime: "asc" },
  });

  const byDate = sessions.reduce<Record<string, typeof sessions>>((acc, s) => {
    const key = formatInTimeZone(s.startTime, STUDIO_TZ, "yyyy-MM-dd");
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  const dates = Object.keys(byDate).sort();

  const statusBadge = (s: { status: string }) => {
    if (s.status === "CANCELLED")   return <Badge variant="destructive">Отменено</Badge>;
    if (s.status === "COMPLETED")   return <Badge variant="secondary">Завершено</Badge>;
    if (s.status === "IN_PROGRESS") return <Badge variant="warning">Идёт</Badge>;
    return <Badge variant="success">Запланировано</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Занятия</h1>
      </div>

      <div className="space-y-6">
        {dates.map((dateKey) => {
          const dateObj = new Date(dateKey + "T00:00:00Z");
          return (
            <div key={dateKey}>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 capitalize">
                {formatInTimeZone(dateObj, STUDIO_TZ, "EEEE, d MMMM", { locale: ru })}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {byDate[dateKey].map((s) => (
                  <Link
                    key={s.id}
                    href={`/admin/classes/${s.id}`}
                    className="rounded-2xl border border-gray-100 bg-white p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: s.direction.color + "20",
                          color: s.direction.color,
                        }}
                      >
                        {s.direction.name}
                      </div>
                      {statusBadge(s)}
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-gray-700 mb-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {formatTime(s.startTime)} – {formatTime(s.endTime)}
                    </div>

                    {s.teacher && (
                      <p className="text-xs text-gray-500 mb-2">{s.teacher.user.name}</p>
                    )}

                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span
                        className={
                          s._count.bookings >= s.maxStudents
                            ? "text-red-600"
                            : s._count.bookings >= s.maxStudents - 2
                            ? "text-orange-500"
                            : "text-gray-700"
                        }
                      >
                        {s._count.bookings}/{s.maxStudents}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
