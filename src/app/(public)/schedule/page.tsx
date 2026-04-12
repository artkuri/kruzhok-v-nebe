import { prisma } from "@/lib/prisma";
import { DAY_NAMES_FULL } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";

export const metadata = { title: "Расписание" };

export default async function SchedulePage() {
  const slots = await prisma.scheduleSlot.findMany({
    where: { isActive: true },
    include: { direction: true, teacher: { include: { user: true } } },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  const byDay = slots.reduce<Record<number, typeof slots>>((acc, slot) => {
    if (!acc[slot.dayOfWeek]) acc[slot.dayOfWeek] = [];
    acc[slot.dayOfWeek].push(slot);
    return acc;
  }, {});

  const days = Object.keys(byDay)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="page-container py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Расписание занятий</h1>
        <p className="text-gray-500">
          Регулярные занятия каждую неделю. Запись через личный кабинет.
        </p>
      </div>

      <div className="grid gap-6">
        {days.map((day) => (
          <div key={day}>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">{DAY_NAMES_FULL[day]}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {byDay[day].map((slot) => (
                <div
                  key={slot.id}
                  className="rounded-2xl border border-gray-100 bg-white p-5 hover:shadow-md transition-shadow"
                >
                  <div
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium mb-3"
                    style={{
                      backgroundColor: slot.direction.color + "20",
                      color: slot.direction.color,
                    }}
                  >
                    {slot.direction.name}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Clock className="h-4 w-4" />
                    {slot.startTime} · {slot.durationMin} мин
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Users className="h-4 w-4" />
                    До {slot.maxStudents} человек
                  </div>
                  {slot.teacher && (
                    <p className="text-xs text-gray-400 mb-4">
                      Педагог: {slot.teacher.user.name}
                    </p>
                  )}
                  <Button size="sm" asChild className="w-full">
                    <Link href="/register">Записаться</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
