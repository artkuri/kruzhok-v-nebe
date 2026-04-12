import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDate, formatDateTime, formatRub } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Mail } from "lucide-react";
import Link from "next/link";

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const family = await prisma.family.findUnique({
    where: { id: params.id },
    include: {
      members: true,
      children: {
        include: {
          bookings: {
            include: {
              classSession: { include: { direction: true } },
              attendance: true,
              payment: true,
            },
            orderBy: { classSession: { startTime: "desc" } },
            take: 20,
          },
        },
      },
      subscriptions: {
        include: {
          usages: { include: { booking: { include: { child: true } } } },
          payments: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!family) notFound();

  const STATUS_LABELS: Record<string, { label: string; variant: any }> = {
    PENDING:   { label: "Ожидает",      variant: "warning" },
    CONFIRMED: { label: "Подтверждено", variant: "success" },
    ATTENDED:  { label: "Посетил",      variant: "success" },
    MISSED:    { label: "Не пришёл",    variant: "destructive" },
    CANCELLED: { label: "Отменено",     variant: "outline" },
  };

  const SUB_LABELS: Record<string, string> = {
    DRAWING_ART_OWN: "Рисование/Арт (свои)",
    DRAWING_ART_STUDIO: "Рисование/Арт (студия)",
    CRAFT_CERAMIC: "Рукоделие/Керамика",
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/admin/clients" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" />
        Назад к клиентам
      </Link>

      {/* Family header */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">{family.name}</h1>
        <div className="grid sm:grid-cols-2 gap-4">
          {family.members.map((m) => (
            <div key={m.id} className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center text-sm font-semibold text-brand-700 shrink-0">
                {m.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{m.name}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Mail className="h-3 w-3" />
                  {m.email}
                </div>
                {m.phone && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Phone className="h-3 w-3" />
                    {m.phone}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscriptions */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Абонементы</h2>
          <Link href="/admin/subscriptions" className="text-sm text-brand-600 hover:underline">
            Продать абонемент
          </Link>
        </div>

        {family.subscriptions.length === 0 ? (
          <p className="text-sm text-gray-400">Нет абонементов</p>
        ) : (
          <div className="space-y-3">
            {family.subscriptions.map((sub) => {
              const remaining = sub.totalClasses - sub.usedClasses;
              const isActive = sub.isActive && new Date(sub.validUntil) >= new Date() && remaining > 0;
              return (
                <div key={sub.id} className="rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-medium text-gray-900">{SUB_LABELS[sub.type] || sub.type}</p>
                      <p className="text-sm text-gray-500">
                        {sub.usedClasses}/{sub.totalClasses} занятий · до {formatDate(sub.validUntil)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">{remaining}</span>
                      <span className="text-sm text-gray-400">ост.</span>
                      {isActive ? (
                        <Badge variant="success">Активный</Badge>
                      ) : (
                        <Badge variant="outline">Завершён</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{formatRub(sub.priceRub)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Children & History */}
      {family.children.map((child) => (
        <div key={child.id} className="rounded-2xl border border-gray-100 bg-white p-6">
          <h2 className="font-semibold text-gray-900 mb-1">{child.name}</h2>
          {child.birthDate && (
            <p className="text-sm text-gray-400 mb-4">{formatDate(child.birthDate)}</p>
          )}

          {child.bookings.length === 0 ? (
            <p className="text-sm text-gray-400">Нет записей</p>
          ) : (
            <div className="space-y-2">
              {child.bookings.map((b) => {
                const st = STATUS_LABELS[b.status];
                return (
                  <div key={b.id} className="flex items-center justify-between gap-3 text-sm p-2 rounded-lg hover:bg-gray-50">
                    <div>
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium mr-2"
                        style={{
                          backgroundColor: b.classSession.direction.color + "20",
                          color: b.classSession.direction.color,
                        }}
                      >
                        {b.classSession.direction.name}
                      </span>
                      {formatDateTime(b.classSession.startTime)}
                    </div>
                    {st && <Badge variant={st.variant}>{st.label}</Badge>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
