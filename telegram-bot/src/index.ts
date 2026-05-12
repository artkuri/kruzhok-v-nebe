import { Telegraf } from "telegraf";

import { BotContext } from "./bot/context";
import { registerBot } from "./bot/register";
import { env } from "./config/env";
import { pool } from "./lib/db";
import { logger } from "./lib/logger";
import { BookingRepository } from "./repositories/booking.repository";
import { ChildRepository } from "./repositories/child.repository";
import { LessonRepository } from "./repositories/lesson.repository";
import { SubscriptionRepository } from "./repositories/subscription.repository";
import { UserRepository } from "./repositories/user.repository";
import { AuthService } from "./services/auth.service";
import { BookingService } from "./services/booking.service";
import { ChildService } from "./services/child.service";
import { ScheduleService } from "./services/schedule.service";
import { SubscriptionService } from "./services/subscription.service";

async function bootstrap() {
  const userRepository = new UserRepository();
  const childRepository = new ChildRepository();
  const lessonRepository = new LessonRepository();
  const subscriptionRepository = new SubscriptionRepository();
  const bookingRepository = new BookingRepository();

  const authService = new AuthService(userRepository);
  const childService = new ChildService(childRepository);
  const scheduleService = new ScheduleService(lessonRepository);
  const subscriptionService = new SubscriptionService(subscriptionRepository);
  const bookingService = new BookingService(
    bookingRepository,
    childRepository,
    lessonRepository,
    subscriptionRepository,
  );

  const bot = new Telegraf<BotContext>(env.botToken);

  registerBot(bot, {
    authService,
    bookingService,
    childService,
    scheduleService,
    subscriptionService,
  });

  await bot.launch();
  logger.info("Telegram bot started");

  process.once("SIGINT", async () => {
    bot.stop("SIGINT");
    await pool.end();
  });

  process.once("SIGTERM", async () => {
    bot.stop("SIGTERM");
    await pool.end();
  });
}

bootstrap().catch(async (error) => {
  logger.error("Failed to start bot", {
    error: error instanceof Error ? error.message : "Unknown error",
  });
  await pool.end();
  process.exit(1);
});
