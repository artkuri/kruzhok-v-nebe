import { prisma } from "@/lib/prisma";
import { formatRub } from "@/lib/utils";
import { EditDirectionPriceButton } from "@/components/features/admin/edit-direction-price-button";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Цены" };

const TYPE_LABELS: Record<string, string> = {
  DRAWING:     "Рисование",
  ART_THERAPY: "Арт-терапия",
  CERAMICS:    "Керамика",
  MASTERCLASS: "Мастер-класс",
  INDIVIDUAL:  "Индивидуальное",
};

export default async function AdminPricesPage() {
  const directions = await prisma.direction.findMany({
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Цены по направлениям</h1>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Направление</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Возраст</th>
              <th className="text-right px-4 py-3">Разовое (₽)</th>
              <th className="text-center px-4 py-3">Статус</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {directions.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: d.color }}
                    />
                    <span className="font-medium text-gray-900">{d.name}</span>
                  </div>
                  {d.description && (
                    <p className="text-xs text-gray-400 mt-0.5 ml-5">{d.description}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                  {d.ageGroup ?? "—"}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">
                  {d.priceRub != null ? formatRub(d.priceRub) : <span className="text-gray-300 font-normal">не задана</span>}
                </td>
                <td className="px-4 py-3 text-center">
                  {d.isActive ? (
                    <Badge variant="success">Активно</Badge>
                  ) : (
                    <Badge variant="outline">Архив</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <EditDirectionPriceButton
                    directionId={d.id}
                    initial={{
                      name: d.name,
                      description: d.description,
                      ageGroup: d.ageGroup,
                      priceRub: d.priceRub,
                      color: d.color,
                      isActive: d.isActive,
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {directions.length === 0 && (
          <div className="text-center py-12 text-gray-400">Направления не добавлены</div>
        )}
      </div>
    </div>
  );
}
