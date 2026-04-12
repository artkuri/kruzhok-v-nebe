import { prisma } from "@/lib/prisma";
import { formatDate, formatRub, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MarkPaidButton } from "@/components/features/admin/mark-paid-button";

export const metadata = { title: "Оплаты" };

const METHOD_LABELS: Record<string, string> = {
  CASH: "Наличные",
  TRANSFER: "Перевод",
  ON_SITE: "На месте",
};

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: {
      booking: {
        include: {
          child: true,
          classSession: { include: { direction: true } },
        },
      },
      subscription: { include: { family: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const pending = payments.filter((p) => !p.isPaid);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Оплаты</h1>

      {pending.length > 0 && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
          <p className="text-sm font-medium text-amber-800">
            {pending.length} {pending.length === 1 ? "ожидает" : "ожидают"} подтверждения
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Кто / За что</th>
              <th className="text-right px-4 py-3">Сумма</th>
              <th className="text-center px-4 py-3 hidden sm:table-cell">Способ</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Дата</th>
              <th className="text-center px-4 py-3">Статус</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.map((p) => {
              const who = p.booking
                ? p.booking.child.name
                : p.subscription?.family.name || "—";
              const what = p.booking
                ? p.booking.classSession.direction.name
                : "Абонемент";

              return (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{who}</p>
                    <p className="text-xs text-gray-400">{what}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    {formatRub(p.amountRub)}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600 hidden sm:table-cell">
                    {METHOD_LABELS[p.method] || p.method}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell text-xs">
                    {p.paidAt ? formatDateTime(p.paidAt) : formatDateTime(p.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.isPaid ? (
                      <Badge variant="success">Оплачено</Badge>
                    ) : (
                      <Badge variant="warning">Ожидает</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {!p.isPaid && <MarkPaidButton paymentId={p.id} />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {payments.length === 0 && (
          <div className="text-center py-12 text-gray-400">Оплат нет</div>
        )}
      </div>
    </div>
  );
}
