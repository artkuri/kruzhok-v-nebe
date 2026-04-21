import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addDays } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { ru } from "date-fns/locale";
import { STUDIO_TZ } from "@/lib/utils";
import { formatTime, formatRub, canCancelBooking } from "@/lib/utils";
import { BookSessionButton } from "@/components/features/booking/book-session-button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

export const metadata = { title: "Расписание" };

export default async function ClientSchedulePage() {
  const session = await auth();
  const userId = (session!.user as any).id;
  const familyId = (session!.user as any).familyId;

  const [sessions, children, activeSubs] = await Promise.all([
    prisma.classSession.findMany({
      where: {
        status: "SCHEDULED",
        startTime: {
          gte: fromZonedTime(formatInTimeZone(new Date(), STUDIO_TZ, "yyyy-MM-dd") + "T00:00:00", STUDIO_TZ),
          lte: fromZonedTime(formatInTimeZone(addDays(new Date(), 28), STUDIO_TZ, "yyyy-MM-dd") + "T23:59:59.999", STUDIO_TZ),
        },
      },
      include: {
        direction: true,
        teacher: { include: { user: true } },
        bookings: {
          where: { status: { notIn: ["CANCELLED"] } },
          include: { child: true },
        },
        _count: { select: { bookings: { where: { status: { notIn: ["CANCELLED"] } } } } },
      },
      orderBy: { startTime: "asc" },
    }),
    prisma.child.findMany({ where: { familyId: familyId || "" } }),
    prisma.subscription.findMany({
      where: {
        familyId: familyId || "",
        isActive: true,
        validUntil: { gte: new Date() },
      },
    }),
  ]);

  // Group by date
  const byDate = sessions.reduce<Record<string, typeof sessions>>((acc, s) => {
    const key = formatInTimeZone(s.startTime, STUDIO_TZ, "yyyy-MM-dd");
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  const dates = Object.keys(byDate).sort();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Расписание занятий</h1>
        <p className="text-gray-500 mt-1">Ближайшие 4 недели</p>
      </div>

      {children.length === 0 && (
        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-800">
          Добавьте детей в разделе{" "}
          <a href="/cabinet/children" className="font-medium underline">
            «Мои дети»
          </a>{" "}
          для записи на занятия.
        </div>
      )}

      <div className="space-y-6">
        {dates.map((dateKey) => {
          const dateObj = new Date(dateKey + "T00:00:00Z");
          const label = formatInTimeZone(dateObj, STUDIO_TZ, "EEEE, d MMMM", { locale: ru });

          return (
            <div key={dateKey}>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 capitalize">
                {label}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {byDate[dateKey].map((s) => {
                  const booked = s.bookings.filter((b) => b.status !== "CANCELLED");
                  const spots = s.maxStudents - s._count.bookings;
                  const myBookings = s.bookings.filter((b) =>
                    children.some((c) => c.id === b.childId)
                  );
                  const bookedChildIds = new Set(s.bookings.map((b) => b.childId));

                  return (
                    <div
                      key={s.id}
                      className="rounded-2xl border border-gray-100 bg-white p-5"
                    >
                      <div
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mb-3"
                        style={{
                          backgroundColor: s.direction.color + "20",
                          color: s.direction.color,
                        }}
                      >
                        {s.direction.name}
                      </div>

                      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 mb-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {formatTime(s.startTime)} – {formatTime(s.endTime)}
                      </div>

                      {s.teacher && (
                        <p className="text-xs text-gray-400 mb-3">{s.teacher.user.name}</p>
                      )}

                      <div className="flex items-center gap-1.5 text-xs mb-4">
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        <span className={spots <= 2 ? "text-orange-600 font-medium" : "text-gray-500"}>
                          {spots > 0 ? `Свободно ${spots} мест` : "Мест нет"}
                        </span>
                      </div>

                      {myBookings.length > 0 && (
                        <div className="mb-3 space-y-1">
                          {myBookings.map((b) => (
                            <div
                              key={b.id}
                              className="text-xs rounded-lg bg-emerald-50 text-emerald-700 px-2.5 py-1"
                            >
                              ✓ {b.child.name} записан
                            </div>
                          ))}
                        </div>
                      )}

                      {children.length > 0 && spots > 0 && (
                        <BookSessionButton
                          session={s}
                          children={children}
                          subscriptions={activeSubs}
                          bookedChildIds={Array.from(bookedChildIds)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {dates.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Нет предстоящих занятий
          </div>
        )}
      </div>
    </div>
  );
}
