import { prisma } from "@/lib/prisma";
import { DAY_NAMES_FULL } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

export const metadata = { title: "Расписание" };

export default async function AdminSchedulePage() {
  const slots = await prisma.scheduleSlot.findMany({
    include: {
      direction: true,
      teacher: { include: { user: true } },
    },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  const byDay = slots.reduce<Record<number, typeof slots>>((acc, s) => {
    if (!acc[s.dayOfWeek]) acc[s.dayOfWeek] = [];
    acc[s.dayOfWeek].push(s);
    return acc;
  }, {});

  const days = Object.keys(byDay).map(Number).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Шаблон расписания</h1>
      </div>

      <div className="space-y-4">
        {days.map((day) => (
          <div key={day}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {DAY_NAMES_FULL[day]}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {byDay[day].map((slot) => (
                <div
                  key={slot.id}
                  className={`rounded-2xl border p-4 ${
                    slot.isActive ? "border-gray-100 bg-white" : "border-gray-100 bg-gray-50 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: slot.direction.color + "20",
                        color: slot.direction.color,
                      }}
                    >
                      {slot.direction.name}
                    </div>
                    <Badge variant={slot.isActive ? "success" : "outline"}>
                      {slot.isActive ? "Активен" : "Пауза"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-700 mb-1">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    {slot.startTime} · {slot.durationMin} мин
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Users className="h-3.5 w-3.5" />
                    до {slot.maxStudents} чел.
                  </div>
                  {slot.teacher && (
                    <p className="text-xs text-gray-400 mt-1">
                      {slot.teacher.user.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
