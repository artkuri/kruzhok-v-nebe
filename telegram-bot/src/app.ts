import { Telegraf } from "telegraf";

import { BotContext } from "./bot/context";
import { registerBot } from "./bot/register";
import { env } from "./config/env";
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

declare global {
  // eslint-disable-next-line no-var
  var __telegramBot: Telegraf<BotContext> | undefined;
}

export function createTelegramBot(): Telegraf<BotContext> {
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

  return bot;
}

export function getTelegramBot(): Telegraf<BotContext> {
  if (!global.__telegramBot) {
    global.__telegramBot = createTelegramBot();
  }

  return global.__telegramBot;
}
