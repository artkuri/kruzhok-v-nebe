import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Дети" };

export default async function AdminChildrenPage() {
  const children = await prisma.child.findMany({
    include: {
      family: true,
      _count: {
        select: { bookings: { where: { status: { notIn: ["CANCELLED"] } } } },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Дети ({children.length})</h1>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Имя</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Семья</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Дата рождения</th>
              <th className="text-center px-4 py-3">Записей</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {children.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <Link
                    href={`/admin/clients/${c.familyId}`}
                    className="text-brand-600 hover:underline"
                  >
                    {c.family.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                  {c.birthDate ? formatDate(c.birthDate) : "—"}
                </td>
                <td className="px-4 py-3 text-center text-gray-600">
                  {c._count.bookings}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {children.length === 0 && (
          <div className="text-center py-12 text-gray-400">Детей нет</div>
        )}
      </div>
    </div>
  );
}
