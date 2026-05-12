"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const register_1 = require("./bot/register");
const env_1 = require("./config/env");
const db_1 = require("./lib/db");
const logger_1 = require("./lib/logger");
const booking_repository_1 = require("./repositories/booking.repository");
const child_repository_1 = require("./repositories/child.repository");
const lesson_repository_1 = require("./repositories/lesson.repository");
const subscription_repository_1 = require("./repositories/subscription.repository");
const user_repository_1 = require("./repositories/user.repository");
const auth_service_1 = require("./services/auth.service");
const booking_service_1 = require("./services/booking.service");
const child_service_1 = require("./services/child.service");
const schedule_service_1 = require("./services/schedule.service");
const subscription_service_1 = require("./services/subscription.service");
async function bootstrap() {
    const userRepository = new user_repository_1.UserRepository();
    const childRepository = new child_repository_1.ChildRepository();
    const lessonRepository = new lesson_repository_1.LessonRepository();
    const subscriptionRepository = new subscription_repository_1.SubscriptionRepository();
    const bookingRepository = new booking_repository_1.BookingRepository();
    const authService = new auth_service_1.AuthService(userRepository);
    const childService = new child_service_1.ChildService(childRepository);
    const scheduleService = new schedule_service_1.ScheduleService(lessonRepository);
    const subscriptionService = new subscription_service_1.SubscriptionService(subscriptionRepository);
    const bookingService = new booking_service_1.BookingService(bookingRepository, childRepository, lessonRepository, subscriptionRepository);
    const bot = new telegraf_1.Telegraf(env_1.env.botToken);
    (0, register_1.registerBot)(bot, {
        authService,
        bookingService,
        childService,
        scheduleService,
        subscriptionService,
    });
    await bot.launch();
    logger_1.logger.info("Telegram bot started");
    process.once("SIGINT", async () => {
        bot.stop("SIGINT");
        await db_1.pool.end();
    });
    process.once("SIGTERM", async () => {
        bot.stop("SIGTERM");
        await db_1.pool.end();
    });
}
bootstrap().catch(async (error) => {
    logger_1.logger.error("Failed to start bot", {
        error: error instanceof Error ? error.message : "Unknown error",
    });
    await db_1.pool.end();
    process.exit(1);
});
