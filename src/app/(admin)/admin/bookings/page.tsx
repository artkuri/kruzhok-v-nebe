import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AdminCancelBookingButton } from "@/components/features/admin/admin-cancel-booking-button";
import { ChangeBookingStatusButton } from "@/components/features/admin/change-booking-status-button";

export const metadata = { title: "Записи" };

const STATUS_LABELS: Record<string, { label: string; variant: any }> = {
  PENDING:   { label: "Ожидает",      variant: "warning" },
  CONFIRMED: { label: "Подтверждено", variant: "success" },
  ATTENDED:  { label: "Посетил",      variant: "success" },
  MISSED:    { label: "Не пришёл",    variant: "destructive" },
  CANCELLED: { label: "Отменено",     variant: "outline" },
};

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      child: { include: { family: true } },
      classSession: { include: { direction: true, teacher: { include: { user: true } } } },
      payment: true,
      subscriptionUsage: true,
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Все записи</h1>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Ребёнок / Семья</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Занятие</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Дата</th>
              <th className="text-center px-4 py-3 hidden md:table-cell">Оплата</th>
              <th className="text-center px-4 py-3">Статус</th>
              <th className="text-right px-4 py-3">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bookings.map((b) => {
              const st = STATUS_LABELS[b.status] || STATUS_LABELS.PENDING;
              const canAct = b.status !== "CANCELLED" && b.status !== "ATTENDED" && b.status !== "MISSED";
              return (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{b.child.name}</p>
                    <p className="text-xs text-gray-400">{b.child.family?.name}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: b.classSession.direction.color + "20",
                        color: b.classSession.direction.color,
                      }}
                    >
                      {b.classSession.direction.name}
                    </span>
                    {b.classSession.teacher && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {b.classSession.teacher.user.name}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell text-xs">
                    {formatDateTime(b.classSession.startTime)}
                  </td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">
                    {b.subscriptionUsage ? (
                      <span className="text-xs text-emerald-600">Абонемент</span>
                    ) : b.payment?.isPaid ? (
                      <span className="text-xs text-blue-600">Оплачено</span>
                    ) : (
                      <span className="text-xs text-amber-600">Не оплачено</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={st.variant}>{st.label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {canAct && (
                      <div className="flex items-center justify-end gap-1">
                        <ChangeBookingStatusButton
                          bookingId={b.id}
                          currentStatus={b.status}
                        />
                        <AdminCancelBookingButton
                          bookingId={b.id}
                          childName={b.child.name}
                          hasSubscription={!!b.subscriptionUsage}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div className="text-center py-12 text-gray-400">Записей нет</div>
        )}
      </div>
    </div>
  );
}
