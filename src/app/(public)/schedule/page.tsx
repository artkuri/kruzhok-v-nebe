import { prisma } from "@/lib/prisma";
import { addDays } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { ru } from "date-fns/locale";
import { STUDIO_TZ, formatTime } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";

export const metadata = { title: "Расписание" };
export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const now = new Date();
  const sessions = await prisma.classSession.findMany({
    where: {
      status: "SCHEDULED",
      startTime: {
        gte: fromZonedTime(formatInTimeZone(now, STUDIO_TZ, "yyyy-MM-dd") + "T00:00:00", STUDIO_TZ),
        lte: fromZonedTime(
          formatInTimeZone(addDays(now, 28), STUDIO_TZ, "yyyy-MM-dd") + "T23:59:59.999",
          STUDIO_TZ
        ),
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

  return (
    <div className="page-container py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Расписание занятий</h1>
        <p className="text-gray-500">
          Регулярные занятия каждую неделю. Запись через личный кабинет.
        </p>
      </div>

      {dates.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Нет предстоящих занятий</div>
      ) : (
        <div className="space-y-8">
          {dates.map((dateKey) => {
            const label = formatInTimeZone(
              new Date(dateKey + "T12:00:00Z"),
              STUDIO_TZ,
              "EEEE, d MMMM",
              { locale: ru }
            );

            return (
              <div key={dateKey}>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 capitalize">
                  {label}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {byDate[dateKey].map((s) => {
                    const spots = s.maxStudents - s._count.bookings;

                    return (
                      <div
                        key={s.id}
                        className="rounded-2xl border border-gray-100 bg-white p-5 hover:shadow-md transition-shadow"
                      >
                        <div
                          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium mb-3"
                          style={{
                            backgroundColor: s.direction.color + "20",
                            color: s.direction.color,
                          }}
                        >
                          {s.direction.name}
                        </div>

                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {formatTime(s.startTime)} – {formatTime(s.endTime)}
                        </div>

                        {s.teacher && (
                          <p className="text-xs text-gray-400 mb-3">{s.teacher.user.name}</p>
                        )}

                        <div className="flex items-center gap-2 text-xs mb-4">
                          <Users className="h-3.5 w-3.5 text-gray-400" />
                          <span className={spots <= 2 ? "text-orange-600 font-medium" : "text-gray-500"}>
                            {spots > 0 ? `Свободно ${spots} мест` : "Мест нет"}
                          </span>
                        </div>

                        <Button size="sm" asChild className="w-full">
                          <Link href="/login">Записаться</Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-12 rounded-2xl bg-brand-50 border border-brand-100 p-6 text-center">
        <p className="text-brand-700 font-medium mb-2">Запись через личный кабинет</p>
        <p className="text-sm text-gray-500 mb-4">
          Зарегистрируйтесь, чтобы записывать детей и управлять абонементами
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/register">Создать аккаунт</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Войти</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
