import { Markup } from "telegraf";

import { BookingDto, ChildDto, LessonDto } from "../../dto";

export function authKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("Ввести телефон", "auth_phone")],
  ]);
}

export function childrenKeyboard(children: ChildDto[]) {
  return Markup.inlineKeyboard(
    children.map((child) => [Markup.button.callback(child.name, `book_child:${child.id}`)]),
  );
}

export function lessonsKeyboard(lessons: LessonDto[]) {
  return Markup.inlineKeyboard(
    lessons.map((lesson) => [
      Markup.button.callback(
        `${lesson.title} · ${new Intl.DateTimeFormat("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }).format(lesson.startsAt)}`,
        `book_lesson:${lesson.id}`,
      ),
    ]),
  );
}

export function paymentKeyboard(hasSubscription: boolean) {
  const rows = [[Markup.button.callback("Разовое занятие", "book_pay:ONE_TIME")]];
  if (hasSubscription) {
    rows.unshift([Markup.button.callback("Списать с абонемента", "book_pay:SUBSCRIPTION")]);
  }
  return Markup.inlineKeyboard(rows);
}

export function cancelBookingKeyboard(bookings: BookingDto[]) {
  return Markup.inlineKeyboard(
    bookings.map((booking) => [
      Markup.button.callback(`${booking.childName} · ${booking.lessonTitle}`, `cancel_booking:${booking.id}`),
    ]),
  );
}
