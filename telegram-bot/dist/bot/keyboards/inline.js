"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authKeyboard = authKeyboard;
exports.childrenKeyboard = childrenKeyboard;
exports.lessonsKeyboard = lessonsKeyboard;
exports.paymentKeyboard = paymentKeyboard;
exports.cancelBookingKeyboard = cancelBookingKeyboard;
const telegraf_1 = require("telegraf");
function authKeyboard() {
    return telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback("Ввести телефон", "auth_phone")],
    ]);
}
function childrenKeyboard(children) {
    return telegraf_1.Markup.inlineKeyboard(children.map((child) => [telegraf_1.Markup.button.callback(child.name, `book_child:${child.id}`)]));
}
function lessonsKeyboard(lessons) {
    return telegraf_1.Markup.inlineKeyboard(lessons.map((lesson) => [
        telegraf_1.Markup.button.callback(`${lesson.title} · ${new Intl.DateTimeFormat("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(lesson.startsAt)}`, `book_lesson:${lesson.id}`),
    ]));
}
function paymentKeyboard(hasSubscription) {
    const rows = [[telegraf_1.Markup.button.callback("Разовое занятие", "book_pay:ONE_TIME")]];
    if (hasSubscription) {
        rows.unshift([telegraf_1.Markup.button.callback("Списать с абонемента", "book_pay:SUBSCRIPTION")]);
    }
    return telegraf_1.Markup.inlineKeyboard(rows);
}
function cancelBookingKeyboard(bookings) {
    return telegraf_1.Markup.inlineKeyboard(bookings.map((booking) => [
        telegraf_1.Markup.button.callback(`${booking.childName} · ${booking.lessonTitle}`, `cancel_booking:${booking.id}`),
    ]));
}
