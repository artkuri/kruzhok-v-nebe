import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Search } from "lucide-react";

export const metadata = { title: "Клиенты" };

export default async function ClientsPage() {
  const families = await prisma.family.findMany({
    include: {
      members: { where: { role: "CLIENT" } },
      children: true,
      subscriptions: {
        where: {
          isActive: true,
          validUntil: { gte: new Date() },
        },
      },
      _count: {
        select: {
          children: true,
          subscriptions: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Клиенты</h1>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Семья</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Контакт</th>
              <th className="text-center px-4 py-3 hidden md:table-cell">Детей</th>
              <th className="text-center px-4 py-3 hidden md:table-cell">Абонементы</th>
              <th className="text-right px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {families.map((fam) => {
              const mainMember = fam.members[0];
              const activeSubs = fam.subscriptions.filter(s => s.usedClasses < s.totalClasses);
              return (
                <tr key={fam.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{fam.name}</p>
                    <p className="text-xs text-gray-400">{formatDate(fam.createdAt)}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-600">
                    {mainMember?.name}
                    <br />
                    <span className="text-xs text-gray-400">{mainMember?.email}</span>
                  </td>
                  <td className="px-4 py-3 text-center hidden md:table-cell text-gray-600">
                    {fam._count.children}
                  </td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">
                    {activeSubs.length > 0 ? (
                      <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs font-medium">
                        {activeSubs.length} активных
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">нет</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/clients/${fam.id}`}
                      className="text-brand-600 text-sm font-medium hover:underline"
                    >
                      Открыть
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {families.length === 0 && (
          <div className="text-center py-12 text-gray-400">Клиентов нет</div>
        )}
      </div>
    </div>
  );
}
