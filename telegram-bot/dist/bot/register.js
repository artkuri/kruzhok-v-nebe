"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBot = registerBot;
const telegraf_1 = require("telegraf");
const constants_1 = require("../config/constants");
const logger_1 = require("../lib/logger");
const context_1 = require("./context");
const auth_handler_1 = require("./handlers/auth.handler");
const bookings_handler_1 = require("./handlers/bookings.handler");
const children_handler_1 = require("./handlers/children.handler");
const schedule_handler_1 = require("./handlers/schedule.handler");
const start_handler_1 = require("./handlers/start.handler");
const subscription_handler_1 = require("./handlers/subscription.handler");
const auth_1 = require("./middleware/auth");
function registerBot(bot, services) {
    bot.use((0, telegraf_1.session)({ defaultSession: context_1.defaultSession }));
    bot.use(async (ctx, next) => {
        try {
            await next();
        }
        catch (error) {
            logger_1.logger.error("Bot error", {
                updateId: ctx.update.update_id,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            await ctx.reply("Произошла ошибка. Попробуйте еще раз.");
        }
    });
    bot.use((0, auth_1.createAuthMiddleware)(services.authService));
    const authHandlers = (0, auth_handler_1.createAuthHandlers)(services.authService);
    const scheduleHandler = (0, schedule_handler_1.createScheduleHandler)(services.scheduleService);
    const childrenHandlers = (0, children_handler_1.createChildrenHandlers)(services.childService);
    const subscriptionHandler = (0, subscription_handler_1.createSubscriptionHandler)(services.subscriptionService);
    const bookingsHandlers = (0, bookings_handler_1.createBookingsHandlers)(services.bookingService, services.childService, services.scheduleService, services.subscriptionService);
    bot.start(start_handler_1.startHandler);
    bot.action("auth_phone", authHandlers.requestPhone);
    bot.action("child_add", childrenHandlers.startAddChild);
    bot.action(/^book_child:(.+)$/, async (ctx) => bookingsHandlers.chooseChild(ctx, ctx.match[1]));
    bot.action(/^book_lesson:(.+)$/, async (ctx) => bookingsHandlers.chooseLesson(ctx, ctx.match[1]));
    bot.action(/^book_pay:(ONE_TIME|SUBSCRIPTION)$/, async (ctx) => bookingsHandlers.confirmPayment(ctx, ctx.match[1]));
    bot.action(/^cancel_booking:(.+)$/, async (ctx) => bookingsHandlers.cancelBooking(ctx, ctx.match[1]));
    bot.hears(constants_1.MENU_BUTTONS.schedule, scheduleHandler);
    bot.hears(constants_1.MENU_BUTTONS.children, childrenHandlers.showChildren);
    bot.hears(constants_1.MENU_BUTTONS.book, bookingsHandlers.startBooking);
    bot.hears(constants_1.MENU_BUTTONS.bookings, bookingsHandlers.showBookings);
    bot.hears(constants_1.MENU_BUTTONS.subscription, subscriptionHandler);
    bot.hears(constants_1.MENU_BUTTONS.cancel, bookingsHandlers.startCancellation);
    bot.on("text", async (ctx, next) => {
        if (ctx.session.flow === "waiting_phone") {
            await authHandlers.handlePhone(ctx);
            return;
        }
        if (ctx.session.flow === "waiting_code") {
            await authHandlers.handleCode(ctx);
            return;
        }
        if (ctx.session.flow === "waiting_child_name") {
            await childrenHandlers.handleName(ctx);
            return;
        }
        if (ctx.session.flow === "waiting_child_birth_date") {
            await childrenHandlers.handleBirthDate(ctx);
            return;
        }
        await next();
    });
    bot.command("schedule", scheduleHandler);
    bot.command("children", childrenHandlers.showChildren);
    bot.command("bookings", bookingsHandlers.showBookings);
    bot.command("subscription", subscriptionHandler);
}
