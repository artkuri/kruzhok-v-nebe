import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime, canCancelBooking } from "@/lib/utils";
import { CancelBookingButton } from "@/components/features/booking/cancel-booking-button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { differenceInHours } from "date-fns";

export const metadata = { title: "Мои записи" };

const BOOKING_STATUS_LABELS: Record<string, { label: string; variant: any }> = {
  PENDING:   { label: "Ожидает",    variant: "warning" },
  CONFIRMED: { label: "Подтверждено", variant: "success" },
  ATTENDED:  { label: "Посетил",    variant: "secondary" },
  MISSED:    { label: "Пропущено",  variant: "destructive" },
  CANCELLED: { label: "Отменено",   variant: "outline" },
};

export default async function MyBookingsPage() {
  const session = await auth();
  const familyId = (session!.user as any).familyId;

  const bookings = await prisma.booking.findMany({
    where: { child: { familyId: familyId || "" } },
    include: {
      classSession: {
        include: { direction: true, teacher: { include: { user: true } } },
      },
      child: true,
      attendance: true,
      payment: true,
      subscriptionUsage: { include: { subscription: true } },
    },
    orderBy: { classSession: { startTime: "desc" } },
    take: 50,
  });

  const now = new Date();
  const upcoming = bookings.filter(
    (b) => b.status !== "CANCELLED" && new Date(b.classSession.startTime) >= now
  );
  const past = bookings.filter(
    (b) => b.status !== "CANCELLED" && new Date(b.classSession.startTime) < now
  );
  const cancelled = bookings.filter((b) => b.status === "CANCELLED");

  function paymentLabel(b: typeof bookings[0]) {
    if (b.subscriptionUsage) return { text: "Абонемент", cls: "text-emerald-600" };
    if (b.payment?.isPaid) return { text: "Разовое (оплачено)", cls: "text-blue-600" };
    return { text: "Разовое (не оплачено)", cls: "text-amber-600" };
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Мои записи</h1>

      {upcoming.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Предстоящие
          </h2>
          <div className="space-y-3">
            {upcoming.map((b) => {
              const canCancel = canCancelBooking(b.classSession.startTime);
              const lateCancel = !canCancel && b.status !== "CANCELLED";
              const hoursLeft = differenceInHours(new Date(b.classSession.startTime), now);
              const isEditableStatus = b.status !== "ATTENDED" && b.status !== "MISSED";
              const st = BOOKING_STATUS_LABELS[b.status] || BOOKING_STATUS_LABELS.PENDING;
              const pay = paymentLabel(b);
              return (
                <div key={b.id} className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: b.classSession.direction.color + "20",
                            color: b.classSession.direction.color,
                          }}
                        >
                          {b.classSession.direction.name}
                        </span>
                        <Badge variant={st.variant}>{st.label}</Badge>
                      </div>
                      <p className="font-medium text-gray-900">
                        {formatDateTime(b.classSession.startTime)}
                      </p>
                      <p className="text-sm text-gray-500">{b.child.name}</p>
                      <p className={`text-xs mt-0.5 ${pay.cls}`}>{pay.text}</p>
                    </div>
                    {isEditableStatus && (
                      <div className="flex flex-col items-end gap-1.5">
                        <CancelBookingButton bookingId={b.id} canCancel={canCancel} />
                        {lateCancel && hoursLeft >= 0 && (
                          <div className="flex items-center gap-1 text-xs text-amber-600">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Занятие сгорит при отмене
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Прошедшие
          </h2>
          <div className="space-y-3">
            {past.map((b) => {
              const st = BOOKING_STATUS_LABELS[b.status] || BOOKING_STATUS_LABELS.PENDING;
              const pay = paymentLabel(b);
              return (
                <div key={b.id} className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 opacity-75">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: b.classSession.direction.color + "20",
                            color: b.classSession.direction.color,
                          }}
                        >
                          {b.classSession.direction.name}
                        </span>
                        <Badge variant={st.variant}>{st.label}</Badge>
                      </div>
                      <p className="font-medium text-gray-900">
                        {formatDateTime(b.classSession.startTime)}
                      </p>
                      <p className="text-sm text-gray-500">{b.child.name}</p>
                      <p className={`text-xs mt-0.5 ${pay.cls}`}>{pay.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {cancelled.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Отменённые
          </h2>
          <div className="space-y-3">
            {cancelled.map((b) => (
              <div key={b.id} className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 opacity-60">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: b.classSession.direction.color + "20",
                      color: b.classSession.direction.color,
                    }}
                  >
                    {b.classSession.direction.name}
                  </span>
                  <Badge variant="outline">Отменено</Badge>
                </div>
                <p className="font-medium text-gray-900">{formatDateTime(b.classSession.startTime)}</p>
                <p className="text-sm text-gray-500">{b.child.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {bookings.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          У вас пока нет записей.{" "}
          <a href="/cabinet/schedule" className="text-brand-600 font-medium hover:underline">
            Перейти к расписанию
          </a>
        </div>
      )}
    </div>
  );
}
