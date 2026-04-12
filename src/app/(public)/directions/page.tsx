import { prisma } from "@/lib/prisma";
import { DAY_NAMES } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Направления" };

export default async function DirectionsPage() {
  const directions = await prisma.direction.findMany({
    where: { isActive: true },
    include: {
      scheduleSlots: {
        where: { isActive: true },
        include: { teacher: { include: { user: true } } },
      },
    },
  });

  return (
    <div className="page-container py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Направления</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Выбирайте занятие по интересу и возрасту. Все занятия подходят для начинающих.
        </p>
      </div>

      <div className="grid gap-8">
        {directions.map((dir) => (
          <div key={dir.id} className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div
                className="h-12 w-12 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0"
                style={{ backgroundColor: dir.color + "20", color: dir.color }}
              >
                {dir.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h2 className="text-xl font-bold text-gray-900">{dir.name}</h2>
                  {dir.ageGroup && (
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                      {dir.ageGroup} лет
                    </span>
                  )}
                </div>
                {dir.description && <p className="text-gray-500">{dir.description}</p>}
              </div>
            </div>

            {dir.scheduleSlots.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-3">Расписание:</p>
                <div className="flex flex-wrap gap-2">
                  {dir.scheduleSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="rounded-xl border border-gray-100 px-3 py-2 text-sm"
                    >
                      <span className="font-medium">{DAY_NAMES[slot.dayOfWeek]}</span>{" "}
                      <span className="text-gray-500">{slot.startTime}</span>
                      {slot.teacher && (
                        <span className="text-gray-400 text-xs ml-2">
                          — {slot.teacher.user.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <Button asChild>
                <Link href="/register">Записаться</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
