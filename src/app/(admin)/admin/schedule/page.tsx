import { prisma } from "@/lib/prisma";
import { DAY_NAMES_FULL } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { CreateScheduleSlotButton } from "@/components/features/admin/create-schedule-slot-button";
import { EditScheduleSlotButton } from "@/components/features/admin/edit-schedule-slot-button";
import { DeleteScheduleSlotButton } from "@/components/features/admin/delete-schedule-slot-button";
import { GenerateSessionsButton } from "@/components/features/admin/generate-sessions-button";
import { DeleteSessionsButton } from "@/components/features/admin/delete-sessions-button";

export const metadata = { title: "Расписание" };

export default async function AdminSchedulePage() {
  const [slots, teachers] = await Promise.all([
    prisma.scheduleSlot.findMany({
      include: {
        direction: true,
        teacher: { include: { user: true } },
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    }),
    prisma.teacher.findMany({
      where: { isActive: true },
      include: { user: true },
    }),
  ]);

  const byDay = slots.reduce<Record<number, typeof slots>>((acc, s) => {
    if (!acc[s.dayOfWeek]) acc[s.dayOfWeek] = [];
    acc[s.dayOfWeek].push(s);
    return acc;
  }, {});

  const days = Object.keys(byDay).map(Number).sort();

  // Serializable slots for client component
  const slotData = slots.map(s => ({
    id:          s.id,
    dayOfWeek:   s.dayOfWeek,
    startTime:   s.startTime,
    durationMin: s.durationMin,
    maxStudents: s.maxStudents,
    directionId: s.directionId,
    teacherId:   s.teacherId,
  }));

  const directionData = slots
    .map(s => s.direction)
    .filter((d, i, arr) => arr.findIndex(x => x.id === d.id) === i)
    .map(d => ({ id: d.id, name: d.name, color: d.color }));

  const teacherData = teachers.map(t => ({ id: t.id, user: { name: t.user.name } }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-bold text-gray-900">Шаблон расписания</h1>
        <div className="flex gap-2 flex-wrap">
          <DeleteSessionsButton />
          <GenerateSessionsButton slots={slotData} />
          <CreateScheduleSlotButton directions={directionData} teachers={teacherData} />
        </div>
      </div>

      {slots.length === 0 && (
        <div className="text-center py-16 text-gray-400">Слотов расписания нет. Добавьте первый.</div>
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
                    <div className="flex items-center gap-1">
                      <Badge variant={slot.isActive ? "success" : "outline"}>
                        {slot.isActive ? "Активен" : "Пауза"}
                      </Badge>
                      <EditScheduleSlotButton
                        slot={{
                          id:          slot.id,
                          startTime:   slot.startTime,
                          durationMin: slot.durationMin,
                          maxStudents: slot.maxStudents,
                          isActive:    slot.isActive,
                          teacherId:   slot.teacherId,
                        }}
                        teachers={teacherData}
                      />
                      <DeleteScheduleSlotButton
                        slotId={slot.id}
                        label={`${slot.direction.name} ${slot.startTime}`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-700 mb-1">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    {slot.startTime} · {slot.durationMin} мин
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                    <Users className="h-3.5 w-3.5" />
                    до {slot.maxStudents} чел.
                  </div>
                  {slot.teacher ? (
                    <p className="text-xs text-gray-500">{slot.teacher.user.name}</p>
                  ) : (
                    <p className="text-xs text-gray-300">Педагог не назначен</p>
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
