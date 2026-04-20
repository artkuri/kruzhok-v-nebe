import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, addDays } from "date-fns";
import { format } from "date-fns-tz";
import { ru } from "date-fns/locale";
import { STUDIO_TZ } from "@/lib/utils";
import { formatDateTime, formatRub } from "@/lib/utils";
import { Users, CalendarDays, CreditCard, Banknote } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Дашборд" };

export default async function DashboardPage() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const [
    totalClients,
    totalChildren,
    todaySessions,
    weekBookings,
    pendingPayments,
    recentBookings,
    activeSubscriptions,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.child.count(),
    prisma.classSession.findMany({
      where: {
        startTime: { gte: todayStart, lte: todayEnd },
        status: "SCHEDULED",
      },
      include: {
        direction: true,
        teacher: { include: { user: true } },
        _count: { select: { bookings: { where: { status: { notIn: ["CANCELLED"] } } } } },
      },
      orderBy: { startTime: "asc" },
    }),
    prisma.booking.count({
      where: {
        classSession: { startTime: { gte: weekStart, lte: weekEnd } },
        status: { notIn: ["CANCELLED"] },
      },
    }),
    prisma.payment.count({ where: { isPaid: false } }),
    prisma.booking.findMany({
      where: { status: { notIn: ["CANCELLED"] } },
      include: {
        child: true,
        classSession: { include: { direction: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.subscription.count({
      where: {
        isActive: true,
        validUntil: { gte: now },
      },
    }),
  ]);

  const stats = [
    { label: "Клиентов",          value: totalClients,       icon: Users,       color: "bg-blue-50 text-blue-600" },
    { label: "Детей",             value: totalChildren,      icon: Users,       color: "bg-violet-50 text-violet-600" },
    { label: "Записей на неделю", value: weekBookings,       icon: CalendarDays, color: "bg-amber-50 text-amber-600" },
    { label: "Активных абонементов", value: activeSubscriptions, icon: CreditCard, color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Pending payments alert */}
      {pendingPayments > 0 && (
        <Link
          href="/admin/payments"
          className="flex items-center gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4 hover:bg-amber-100 transition-colors"
        >
          <Banknote className="h-5 w-5 text-amber-600 shrink-0" />
          <p className="text-sm font-medium text-amber-800">
            {pendingPayments} {pendingPayments === 1 ? "ожидает" : "ожидают"} подтверждения оплаты
          </p>
        </Link>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's sessions */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <h2 className="font-semibold text-gray-900 mb-4">
            Занятия сегодня — {format(now, "d MMMM", { locale: ru, timeZone: STUDIO_TZ })}
          </h2>
          {todaySessions.length === 0 ? (
            <p className="text-sm text-gray-400">Занятий сегодня нет</p>
          ) : (
            <div className="space-y-3">
              {todaySessions.map((s) => (
                <Link
                  key={s.id}
                  href={`/admin/classes/${s.id}`}
                  className="flex items-center justify-between rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: s.direction.color }}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {s.direction.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {format(s.startTime, "HH:mm", { timeZone: STUDIO_TZ })}
                      {s.teacher && ` · ${s.teacher.user.name}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {s._count.bookings}/{s.maxStudents}
                    </p>
                    <p className="text-xs text-gray-400">записей</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent bookings */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Последние записи</h2>
            <Link href="/admin/bookings" className="text-sm text-brand-600 hover:underline">
              Все
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="text-sm text-gray-400">Записей нет</p>
          ) : (
            <div className="space-y-2">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center gap-3 text-sm">
                  <div
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: b.classSession.direction.color }}
                  />
                  <span className="font-medium text-gray-700 truncate flex-1">{b.child.name}</span>
                  <span className="text-gray-400 text-xs shrink-0">
                    {b.classSession.direction.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
