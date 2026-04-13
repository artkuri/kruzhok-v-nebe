import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDateTime, formatTime } from "@/lib/utils";
import { AttendanceMarker } from "@/components/features/admin/attendance-marker";
import { AdminBookingCreator } from "@/components/features/admin/booking-creator";
import { AssignTeacherSelect } from "@/components/features/admin/assign-teacher-select";
import { EditSessionButton } from "@/components/features/admin/edit-session-button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await prisma.classSession.findUnique({
    where: { id },
    include: {
      direction: true,
      teacher: { include: { user: true } },
      bookings: {
        include: {
          child: { include: { family: true } },
          attendance: true,
          payment: true,
          subscriptionUsage: { include: { subscription: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!session) notFound();

  const activeBookings = session.bookings.filter((b) => b.status !== "CANCELLED");
  const isStarted = new Date(session.startTime) <= new Date();
  const [families, teachers] = await Promise.all([
    prisma.family.findMany({ include: { children: true } }),
    prisma.teacher.findMany({
      where: { isActive: true },
      include: { user: true },
    }),
  ]);

  const STATUS_LABELS: Record<string, { label: string; variant: any }> = {
    PENDING:   { label: "Ожидает",      variant: "warning" },
    CONFIRMED: { label: "Подтверждено", variant: "success" },
    ATTENDED:  { label: "Посетил",      variant: "success" },
    MISSED:    { label: "Не пришёл",    variant: "destructive" },
    CANCELLED: { label: "Отменено",     variant: "outline" },
  };

  const SESSION_STATUS: Record<string, { label: string; variant: any }> = {
    SCHEDULED:   { label: "Запланировано", variant: "success" },
    IN_PROGRESS: { label: "Идёт",          variant: "warning" },
    COMPLETED:   { label: "Завершено",     variant: "secondary" },
    CANCELLED:   { label: "Отменено",      variant: "destructive" },
  };
  const sessionStatus = SESSION_STATUS[session.status] ?? SESSION_STATUS.SCHEDULED;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link href="/admin/classes" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="h-4 w-4" />
          К списку занятий
        </Link>
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
            <div
              className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
              style={{ backgroundColor: session.direction.color + "20", color: session.direction.color }}
            >
              {session.direction.name}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={sessionStatus.variant}>{sessionStatus.label}</Badge>
              <EditSessionButton
                sessionId={session.id}
                initial={{
                  startTime: session.startTime.toISOString(),
                  endTime: session.endTime.toISOString(),
                  maxStudents: session.maxStudents,
                  durationMin: session.durationMin,
                  notes: session.notes,
                }}
                isStarted={isStarted}
              />
            </div>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            {formatDateTime(session.startTime)} – {formatTime(session.endTime)}
          </h1>
          {session.durationMin && (
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
              <Clock className="h-3.5 w-3.5" />
              {session.durationMin} мин
            </div>
          )}
          {session.notes && (
            <p className="text-sm text-gray-500 mb-2">{session.notes}</p>
          )}
          <div className="mb-3">
            <AssignTeacherSelect
              sessionId={session.id}
              currentTeacherId={session.teacherId}
              teachers={teachers}
            />
          </div>
          <p className="text-sm text-gray-600">
            Записей: {activeBookings.length}/{session.maxStudents}
          </p>
        </div>
      </div>

      {/* Add booking */}
      <AdminBookingCreator
        sessionId={session.id}
        families={families}
        bookedChildIds={activeBookings.map((b) => b.childId)}
      />

      {/* Students list */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <h2 className="font-semibold text-gray-900 mb-4">
          Список учеников ({activeBookings.length})
        </h2>

        {activeBookings.length === 0 ? (
          <p className="text-sm text-gray-400">Нет записей</p>
        ) : (
          <div className="space-y-3">
            {activeBookings.map((b) => {
              const st = STATUS_LABELS[b.status];
              return (
                <div key={b.id} className="flex items-start gap-4 p-3 rounded-xl border border-gray-100">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900">{b.child.name}</span>
                      <span className="text-xs text-gray-400">{b.child.family?.name}</span>
                      {st && <Badge variant={st.variant}>{st.label}</Badge>}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      {b.subscriptionUsage ? (
                        <span className="text-emerald-600">Абонемент</span>
                      ) : b.payment?.isPaid ? (
                        <span className="text-blue-600">Оплачено</span>
                      ) : (
                        <span className="text-amber-600">Не оплачено</span>
                      )}
                    </div>
                  </div>
                  <AttendanceMarker
                    bookingId={b.id}
                    currentAttendance={b.attendance}
                    sessionStarted={new Date(session.startTime) <= new Date()}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
