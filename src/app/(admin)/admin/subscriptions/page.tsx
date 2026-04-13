import { prisma } from "@/lib/prisma";
import { formatDate, formatRub } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CreateSubscriptionButton } from "@/components/features/admin/create-subscription-button";
import { EditSubscriptionButton } from "@/components/features/admin/edit-subscription-button";

export const metadata = { title: "Абонементы" };

const TYPE_LABELS: Record<string, string> = {
  DRAWING_ART_OWN: "Рисование / Арт (свои матер.)",
  DRAWING_ART_STUDIO: "Рисование / Арт (студия)",
  CRAFT_CERAMIC: "Рукоделие / Керамика",
};

export default async function AdminSubscriptionsPage() {
  const [subscriptions, families] = await Promise.all([
    prisma.subscription.findMany({
      include: { family: true, payments: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.family.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Абонементы</h1>
        <CreateSubscriptionButton families={families} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Семья</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Тип</th>
              <th className="text-center px-4 py-3">Остаток</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Действует до</th>
              <th className="text-right px-4 py-3 hidden md:table-cell">Сумма</th>
              <th className="text-center px-4 py-3">Статус</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {subscriptions.map((sub) => {
              const remaining = sub.totalClasses - sub.usedClasses;
              const isActive =
                sub.isActive && new Date(sub.validUntil) >= new Date() && remaining > 0;
              const isPaid = sub.payments.some((p) => p.isPaid);
              return (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{sub.family.name}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                    {TYPE_LABELS[sub.type] || sub.type}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`font-semibold ${
                        remaining === 0 ? "text-red-500" : remaining <= 2 ? "text-orange-500" : "text-gray-900"
                      }`}
                    >
                      {remaining}/{sub.totalClasses}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                    {formatDate(sub.validUntil)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600 hidden md:table-cell">
                    {formatRub(sub.priceRub)}
                    {!isPaid && (
                      <span className="ml-1 text-xs text-amber-600">(не оплачен)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {isActive ? (
                      <Badge variant="success">Активный</Badge>
                    ) : (
                      <Badge variant="outline">Завершён</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <EditSubscriptionButton
                      subscriptionId={sub.id}
                      initial={{
                        priceRub: sub.priceRub,
                        totalClasses: sub.totalClasses,
                        usedClasses: sub.usedClasses,
                        includesMaterials: sub.includesMaterials,
                        includesMasterclass: sub.includesMasterclass,
                        notes: sub.notes,
                        isActive: sub.isActive,
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {subscriptions.length === 0 && (
          <div className="text-center py-12 text-gray-400">Абонементов нет</div>
        )}
      </div>
    </div>
  );
}
