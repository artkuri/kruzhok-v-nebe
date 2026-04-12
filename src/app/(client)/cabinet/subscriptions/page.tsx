import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatRub } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar } from "lucide-react";

export const metadata = { title: "Абонементы" };

const TYPE_LABELS: Record<string, string> = {
  DRAWING_ART_OWN: "Рисование / Арт-терапия (свои материалы)",
  DRAWING_ART_STUDIO: "Рисование / Арт-терапия (материалы студии)",
  CRAFT_CERAMIC: "Рукоделие / Керамика",
};

export default async function SubscriptionsPage() {
  const session = await auth();
  const familyId = (session!.user as any).familyId;

  const subscriptions = await prisma.subscription.findMany({
    where: { familyId: familyId || "" },
    include: {
      usages: {
        include: {
          booking: {
            include: {
              classSession: { include: { direction: true } },
              child: true,
            },
          },
        },
        orderBy: { usedAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const active = subscriptions.filter(
    (s) => s.isActive && new Date(s.validUntil) >= new Date() && s.usedClasses < s.totalClasses
  );
  const expired = subscriptions.filter(
    (s) => !s.isActive || new Date(s.validUntil) < new Date() || s.usedClasses >= s.totalClasses
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Абонементы</h1>
        <p className="text-gray-500 mt-1">Семейные абонементы — для всех детей</p>
      </div>

      {active.length === 0 && expired.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-dashed border-gray-200 bg-gray-50">
          <CreditCard className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">У вас нет абонементов</p>
          <p className="text-sm text-gray-400">
            Обратитесь к администратору для покупки абонемента
          </p>
        </div>
      )}

      {active.map((sub) => {
        const remaining = sub.totalClasses - sub.usedClasses;
        const pct = ((sub.usedClasses / sub.totalClasses) * 100).toFixed(0);

        return (
          <div key={sub.id} className="rounded-2xl border-2 border-brand-200 bg-brand-50 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
              <div>
                <Badge variant="success" className="mb-2">Активный</Badge>
                <h2 className="font-semibold text-gray-900">{TYPE_LABELS[sub.type] || sub.type}</h2>
                <p className="text-sm text-gray-500">{formatRub(sub.priceRub)}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-brand-700">{remaining}</p>
                <p className="text-sm text-gray-500">занятий осталось</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 rounded-full bg-brand-100 mb-3">
              <div
                className="h-2 rounded-full bg-brand-500 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mb-4">
              {sub.usedClasses} из {sub.totalClasses} занятий использовано
            </p>

            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="h-3.5 w-3.5" />
              Действует до {formatDate(sub.validUntil)}
            </div>

            {sub.usages.length > 0 && (
              <div className="mt-4 pt-4 border-t border-brand-200">
                <p className="text-xs font-medium text-gray-700 mb-2">История использования</p>
                <div className="space-y-1">
                  {sub.usages.slice(0, 5).map((u) => (
                    <div key={u.id} className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {u.booking.child.name} —{" "}
                        {u.booking.classSession.direction.name}
                      </span>
                      <span>{new Date(u.usedAt).toLocaleDateString("ru-RU")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {expired.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Архив
          </h2>
          <div className="space-y-3">
            {expired.map((sub) => (
              <div key={sub.id} className="rounded-2xl border border-gray-100 bg-white p-4 opacity-60">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-medium text-gray-700">{TYPE_LABELS[sub.type] || sub.type}</p>
                    <p className="text-xs text-gray-400">
                      {sub.usedClasses}/{sub.totalClasses} занятий · до {formatDate(sub.validUntil)}
                    </p>
                  </div>
                  <Badge variant="outline">Завершён</Badge>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
