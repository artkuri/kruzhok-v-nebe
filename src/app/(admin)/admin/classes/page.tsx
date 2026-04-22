import { prisma } from "@/lib/prisma";
import { addDays, subDays } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { ru } from "date-fns/locale";
import { formatTime, STUDIO_TZ } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Users, Clock } from "lucide-react";

export const metadata = { title: "Занятия" };

function statusBadge(status: string) {
  if (status === "CANCELLED")   return <Badge variant="destructive">Отменено</Badge>;
  if (status === "COMPLETED")   return <Badge variant="secondary">Завершено</Badge>;
  if (status === "IN_PROGRESS") return <Badge variant="warning">Идёт</Badge>;
  return <Badge variant="success">Запланировано</Badge>;
}

export default async function AdminClassesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const isPast = tab === "past";
  const now = new Date();
  const todayStr = formatInTimeZone(now, STUDIO_TZ, "yyyy-MM-dd");

  let rangeStart: Date;
  let rangeEnd: Date;

  if (isPast) {
    // Last 90 days (up to but not including today)
    const pastStr = formatInTimeZone(subDays(now, 90), STUDIO_TZ, "yyyy-MM-dd");
    rangeStart = fromZonedTime(pastStr  + "T00:00:00",     STUDIO_TZ);
    rangeEnd   = fromZonedTime(todayStr + "T00:00:00",     STUDIO_TZ);
  } else {
    // Last 7 days + next 30 days
    const weekAgoStr = formatInTimeZone(subDays(now, 7), STUDIO_TZ, "yyyy-MM-dd");
    const endStr     = formatInTimeZone(addDays(now, 30), STUDIO_TZ, "yyyy-MM-dd");
    rangeStart = fromZonedTime(weekAgoStr + "T00:00:00",     STUDIO_TZ);
    rangeEnd   = fromZonedTime(endStr     + "T23:59:59.999", STUDIO_TZ);
  }

  const sessions = await prisma.classSession.findMany({
    where: { startTime: { gte: rangeStart, lte: rangeEnd } },
    include: {
      direction: true,
      teacher: { include: { user: true } },
      _count: { select: { bookings: { where: { status: { notIn: ["CANCELLED"] } } } } },
    },
    orderBy: { startTime: isPast ? "desc" : "asc" },
  });

  const byDate = sessions.reduce<Record<string, typeof sessions>>((acc, s) => {
    const key = formatInTimeZone(s.startTime, STUDIO_TZ, "yyyy-MM-dd");
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  const dates = Object.keys(byDate).sort(isPast ? (a, b) => b.localeCompare(a) : undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Занятия</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <Link
          href="/admin/classes"
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            !isPast
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Предстоящие
        </Link>
        <Link
          href="/admin/classes?tab=past"
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isPast
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Прошедшие
        </Link>
      </div>

      {/* Sessions */}
      <div className="space-y-6">
        {dates.length === 0 && (
          <p className="text-center py-16 text-gray-400">Занятий нет</p>
        )}
        {dates.map((dateKey) => {
          const dateObj = new Date(dateKey + "T12:00:00Z");
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
                      {statusBadge(s.status)}
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
