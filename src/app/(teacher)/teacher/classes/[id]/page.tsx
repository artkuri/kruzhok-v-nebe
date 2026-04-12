import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDateTime, formatTime } from "@/lib/utils";
import { AttendanceMarker } from "@/components/features/admin/attendance-marker";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function TeacherClassDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const userId = (session!.user as any).id;

  const teacher = await prisma.teacher.findUnique({ where: { userId } });

  const classSession = await prisma.classSession.findUnique({
    where: { id: params.id },
    include: {
      direction: true,
      teacher: { include: { user: true } },
      bookings: {
        where: { status: { notIn: ["CANCELLED"] } },
        include: {
          child: true,
          attendance: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!classSession) notFound();
  if (classSession.teacherId !== teacher?.id && (session!.user as any).role !== "ADMIN") {
    notFound();
  }

  const sessionStarted = new Date(classSession.startTime) <= new Date();

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/teacher/schedule" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" />
        Назад к расписанию
      </Link>

      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <div
          className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium mb-3"
          style={{
            backgroundColor: classSession.direction.color + "20",
            color: classSession.direction.color,
          }}
        >
          {classSession.direction.name}
        </div>
        <h1 className="text-xl font-bold text-gray-900">
          {formatDateTime(classSession.startTime)} – {formatTime(classSession.endTime)}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Учеников: {classSession.bookings.length}/{classSession.maxStudents}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Список учеников</h2>

        {classSession.bookings.length === 0 ? (
          <p className="text-sm text-gray-400">Нет записей</p>
        ) : (
          <div className="space-y-3">
            {classSession.bookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
                    {b.child.name.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-900">{b.child.name}</span>
                </div>
                <AttendanceMarker
                  bookingId={b.id}
                  currentAttendance={b.attendance}
                  sessionStarted={sessionStarted}
                />
              </div>
            ))}
          </div>
        )}

        {!sessionStarted && (
          <p className="text-xs text-gray-400 mt-4">
            Отметить посещаемость можно после начала занятия
          </p>
        )}
      </div>
    </div>
  );
}
