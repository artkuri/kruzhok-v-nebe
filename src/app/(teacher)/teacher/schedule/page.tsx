import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DAY_NAMES_FULL } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

export const metadata = { title: "Моё расписание" };

export default async function TeacherSchedulePage() {
  const session = await auth();
  const userId = (session!.user as any).id;

  const teacher = await prisma.teacher.findUnique({ where: { userId } });
  if (!teacher) return <div className="p-6 text-gray-400">Профиль педагога не найден</div>;

  const slots = await prisma.scheduleSlot.findMany({
    where: { teacherId: teacher.id, isActive: true },
    include: { direction: true },
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Моё расписание</h1>
        <p className="text-gray-500 mt-1">Шаблон расписания (назначен администратором)</p>
      </div>

      {days.length === 0 && (
        <div className="text-center py-12 text-gray-400">Расписание не назначено</div>
      )}

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
                  className="rounded-2xl border border-gray-100 bg-white p-4"
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
                    <Badge variant="success">Активен</Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-700 mb-1">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    {slot.startTime} · {slot.durationMin} мин
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Users className="h-3.5 w-3.5" />
                    до {slot.maxStudents} чел.
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
