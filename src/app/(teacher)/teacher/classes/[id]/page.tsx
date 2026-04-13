import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDateTime, formatTime } from "@/lib/utils";
import { AttendanceMarker } from "@/components/features/admin/attendance-marker";
import { AdminBookingCreator } from "@/components/features/admin/booking-creator";
import { ArrowLeft, Clock, Users } from "lucide-react";
import Link from "next/link";

export default async function TeacherClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const userId = (session!.user as any).id;

  const teacher = await prisma.teacher.findUnique({ where: { userId } });

  const classSession = await prisma.classSession.findUnique({
    where: { id },
    include: {
      direction: true,
      teacher: { include: { user: true } },
      bookings: {
        where: { status: { notIn: ["CANCELLED"] } },
        include: {
          child: { include: { family: { include: { members: { take: 1 } } } } },
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
  const freeSlots = classSession.maxStudents - classSession.bookings.length;
  const bookedChildIds = classSession.bookings.map((b) => b.childId);

  // Only family name and children for the booking creator (no financial info)
  const families = await prisma.family.findMany({
    include: { children: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/teacher/classes" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" />
        К занятиям
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
        {classSession.durationMin && (
          <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-1">
            <Clock className="h-4 w-4" />
            {classSession.durationMin} мин
          </div>
        )}
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Users className="h-4 w-4 text-gray-400" />
            <span>Занято: <strong>{classSession.bookings.length}</strong>/{classSession.maxStudents}</span>
          </div>
          <span className={`text-sm font-medium ${freeSlots === 0 ? "text-red-500" : "text-emerald-600"}`}>
            {freeSlots === 0 ? "Мест нет" : `Свободно: ${freeSlots}`}
          </span>
        </div>
      </div>

      {/* Add student manually */}
      <AdminBookingCreator
        sessionId={classSession.id}
        families={families}
        bookedChildIds={bookedChildIds}
      />

      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Список учеников</h2>

        {classSession.bookings.length === 0 ? (
          <p className="text-sm text-gray-400">Нет записей</p>
        ) : (
          <div className="space-y-3">
            {classSession.bookings.map((b) => {
              const parentName = b.child.family?.members[0]?.name;
              return (
                <div key={b.id} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600 shrink-0">
                      {b.child.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{b.child.name}</p>
                      {parentName && (
                        <p className="text-xs text-gray-400 truncate">Родитель: {parentName}</p>
                      )}
                    </div>
                  </div>
                  <AttendanceMarker
                    bookingId={b.id}
                    currentAttendance={b.attendance}
                    sessionStarted={sessionStarted}
                  />
                </div>
              );
            })}
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
