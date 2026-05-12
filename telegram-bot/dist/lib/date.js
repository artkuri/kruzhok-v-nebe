"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDays = addDays;
exports.subtractHours = subtractHours;
exports.canCancelBooking = canCancelBooking;
function addDays(base, days) {
    const copy = new Date(base);
    copy.setDate(copy.getDate() + days);
    return copy;
}
function subtractHours(base, hours) {
    return new Date(base.getTime() - hours * 60 * 60 * 1000);
}
function canCancelBooking(startsAt) {
    return new Date() < subtractHours(startsAt, 3);
}
