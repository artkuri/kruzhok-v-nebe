"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingsHandlers = createBookingsHandlers;
const logger_1 = require("../../lib/logger");
const inline_1 = require("../keyboards/inline");
const formatters_1 = require("../utils/formatters");
function createBookingsHandlers(bookingService, childService, scheduleService, subscriptionService) {
    async function showBookings(ctx) {
        const familyId = ctx.state.user?.familyId;
        if (!familyId) {
            throw new Error("Семья пользователя не найдена.");
        }
        const bookings = await bookingService.getActiveByFamilyId(familyId);
        await ctx.reply((0, formatters_1.formatBookings)(bookings));
    }
    async function startBooking(ctx) {
        const familyId = ctx.state.user?.familyId;
        if (!familyId) {
            throw new Error("Семья пользователя не найдена.");
        }
        const children = await childService.getChildren(familyId);
        if (!children.length) {
            await ctx.reply("Сначала добавьте ребенка в разделе «Мои дети».");
            return;
        }
        ctx.session.booking = {};
        await ctx.reply("Выберите ребенка:", (0, inline_1.childrenKeyboard)(children));
    }
    async function chooseChild(ctx, childId) {
        ctx.session.booking = { childId };
        const lessons = await scheduleService.getUpcoming(7);
        await ctx.answerCbQuery();
        if (!lessons.length) {
            await ctx.reply("На ближайшие 7 дней занятий нет.");
            return;
        }
        await ctx.reply("Выберите занятие:", (0, inline_1.lessonsKeyboard)(lessons));
    }
    async function chooseLesson(ctx, lessonId) {
        const familyId = ctx.state.user?.familyId;
        const childId = ctx.session.booking?.childId;
        if (!familyId || !childId) {
            throw new Error("Сценарий записи сброшен. Начните заново.");
        }
        const options = await bookingService.getBookingOptions({
            familyId,
            childId,
            lessonId,
        });
        const subscription = await subscriptionService.getActiveByFamilyId(familyId);
        const canUseSubscription = options.hasSubscription && Boolean(subscription?.remainingClasses);
        ctx.session.booking = { childId, lessonId };
        await ctx.answerCbQuery();
        await ctx.reply([
            `Ребенок: ${options.child.name}`,
            `Занятие: ${options.lesson.title}`,
            `Начало: ${new Intl.DateTimeFormat("ru-RU", {
                day: "2-digit",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
            }).format(options.lesson.startsAt)}`,
            `Свободных мест: ${options.remainingSeats}`,
        ].join("\n"), (0, inline_1.paymentKeyboard)(canUseSubscription));
    }
    async function confirmPayment(ctx, paymentMode) {
        const familyId = ctx.state.user?.familyId;
        const childId = ctx.session.booking?.childId;
        const lessonId = ctx.session.booking?.lessonId;
        if (!familyId || !childId || !lessonId) {
            throw new Error("Сценарий записи потерян. Начните заново.");
        }
        const booking = await bookingService.createBooking({
            familyId,
            childId,
            lessonId,
            paymentMode,
        });
        logger_1.logger.info("Booking created", { bookingId: booking.id, paymentMode });
        ctx.session.booking = undefined;
        await ctx.answerCbQuery();
        await ctx.reply(`Запись создана.\n\n${booking.childName} записан(а) на "${booking.lessonTitle}" ${new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" }).format(booking.startsAt)}.`);
    }
    async function startCancellation(ctx) {
        const familyId = ctx.state.user?.familyId;
        if (!familyId) {
            throw new Error("Семья пользователя не найдена.");
        }
        const bookings = await bookingService.getActiveByFamilyId(familyId);
        if (!bookings.length) {
            await ctx.reply("У вас нет активных записей для отмены.");
            return;
        }
        await ctx.reply("Выберите запись для отмены:", (0, inline_1.cancelBookingKeyboard)(bookings));
    }
    async function cancelBooking(ctx, bookingId) {
        const familyId = ctx.state.user?.familyId;
        if (!familyId) {
            throw new Error("Семья пользователя не найдена.");
        }
        const existing = await bookingService.getBookingById(bookingId);
        if (!existing) {
            await ctx.answerCbQuery("Запись не найдена.");
            return;
        }
        const result = await bookingService.cancelBooking({ bookingId, familyId });
        logger_1.logger.info("Booking cancelled", { bookingId, burnsLesson: result.burnsLesson });
        await ctx.answerCbQuery();
        await ctx.reply([
            result.burnsLesson ? `До занятия меньше ${result.deadlineHours} часов, занятие сгорит.` : undefined,
            result.refunded ? "Запись отменена, занятие возвращено на абонемент." : "Запись отменена.",
        ]
            .filter(Boolean)
            .join("\n"));
    }
    return {
        showBookings,
        startBooking,
        chooseChild,
        chooseLesson,
        confirmPayment,
        startCancellation,
        cancelBooking,
    };
}
