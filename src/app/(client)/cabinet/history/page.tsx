import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "История посещений" };

const STATUS_LABELS: Record<string, { label: string; variant: any }> = {
  ATTENDED:  { label: "Посетил",        variant: "success" },
  MISSED:    { label: "Не пришёл",      variant: "destructive" },
  CANCELLED: { label: "Отменено",       variant: "outline" },
  CONFIRMED: { label: "Подтверждено",   variant: "secondary" },
  PENDING:   { label: "Ожидает",        variant: "warning" },
};

export default async function HistoryPage() {
  const session = await auth();
  const familyId = (session!.user as any).familyId;

  const bookings = await prisma.booking.findMany({
    where: {
      child: { familyId: familyId || "" },
      classSession: { startTime: { lt: new Date() } },
    },
    include: {
      classSession: { include: { direction: true } },
      child: true,
      attendance: true,
    },
    orderBy: { classSession: { startTime: "desc" } },
    take: 100,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">История посещений</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-12 text-gray-400">История пуста</div>
      ) : (
        <div className="space-y-2">
          {bookings.map((b) => {
            const st = STATUS_LABELS[b.status] || STATUS_LABELS.PENDING;
            return (
              <div
                key={b.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: b.classSession.direction.color + "20",
                        color: b.classSession.direction.color,
                      }}
                    >
                      {b.classSession.direction.name}
                    </span>
                    <span className="text-sm font-medium text-gray-700 truncate">{b.child.name}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDateTime(b.classSession.startTime)}
                  </p>
                </div>
                <Badge variant={st.variant}>{st.label}</Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
