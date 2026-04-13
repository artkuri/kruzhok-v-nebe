import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";
import { EditTeacherButton } from "@/components/features/admin/edit-teacher-button";
import { CreateTeacherButton } from "@/components/features/admin/create-teacher-button";
import { DeleteTeacherButton } from "@/components/features/admin/delete-teacher-button";

export const metadata = { title: "Педагоги" };

export default async function TeachersPage() {
  const teachers = await prisma.teacher.findMany({
    include: {
      user: true,
      scheduleSlots: {
        include: { direction: true },
        where: { isActive: true },
      },
      _count: {
        select: {
          classSessions: {
            where: {
              startTime: { gte: new Date() },
              status: "SCHEDULED",
            },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Педагоги</h1>
        <CreateTeacherButton />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {teachers.map((t) => (
          <div key={t.id} className="rounded-2xl border border-gray-100 bg-white p-5">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center text-lg font-semibold text-brand-700 shrink-0">
                {t.user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-gray-900">{t.user.name}</p>
                  <div className="flex items-center gap-1.5">
                    <Badge variant={t.isActive ? "success" : "outline"}>
                      {t.isActive ? "Активен" : "Неактивен"}
                    </Badge>
                    <EditTeacherButton
                      teacherId={t.id}
                      initial={{ name: t.user.name, phone: t.user.phone, bio: t.bio }}
                    />
                    <DeleteTeacherButton teacherId={t.id} teacherName={t.user.name} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                  <Mail className="h-3 w-3" />
                  {t.user.email}
                </div>
                {t.user.phone && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Phone className="h-3 w-3" />
                    {t.user.phone}
                  </div>
                )}
              </div>
            </div>

            {t.bio && <p className="text-sm text-gray-500 mb-3">{t.bio}</p>}

            <div className="flex flex-wrap gap-1.5">
              {t.scheduleSlots.map((slot) => (
                <span
                  key={slot.id}
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: slot.direction.color + "20",
                    color: slot.direction.color,
                  }}
                >
                  {slot.direction.name}
                </span>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-3">
              Предстоящих занятий: {t._count.classSessions}
            </p>
          </div>
        ))}
      </div>

      {teachers.length === 0 && (
        <div className="text-center py-12 text-gray-400">Педагоги не добавлены</div>
      )}
    </div>
  );
}
