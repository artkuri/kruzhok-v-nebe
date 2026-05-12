import { BookingDto, ChildDto, LessonDto, SubscriptionDto } from "../../dto";

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatSchedule(lessons: LessonDto[]): string {
  if (!lessons.length) {
    return "На ближайшие 7 дней занятий пока нет.";
  }

  return lessons
    .map(
      (lesson) =>
        `• ${formatDateTime(lesson.startsAt)}\n${lesson.title}\nОсталось мест: ${lesson.remainingSeats}/${lesson.maxStudents}`,
    )
    .join("\n\n");
}

export function formatChildren(children: ChildDto[]): string {
  if (!children.length) {
    return "У вас пока нет добавленных детей.";
  }

  return children.map((child, index) => `${index + 1}. ${child.name}`).join("\n");
}

export function formatBookings(bookings: BookingDto[]): string {
  if (!bookings.length) {
    return "Активных записей нет.";
  }

  return bookings
    .map(
      (booking) =>
        `• ${formatDateTime(booking.startsAt)}\n${booking.childName} — ${booking.lessonTitle}\nСтатус: ${
          booking.hasSubscriptionUsage ? "Абонемент" : "Разовая запись"
        }`,
    )
    .join("\n\n");
}

export function formatSubscription(subscription: SubscriptionDto | null): string {
  if (!subscription) {
    return "Активного абонемента сейчас нет.";
  }

  return [
    `Тип: ${subscription.type}`,
    `Осталось занятий: ${subscription.remainingClasses} из ${subscription.totalClasses}`,
    `Срок действия: ${formatDateTime(subscription.validUntil)}`,
  ].join("\n");
}
