import { session, Telegraf } from "telegraf";

import { MENU_BUTTONS } from "../config/constants";
import { logger } from "../lib/logger";
import { AuthService } from "../services/auth.service";
import { BookingService } from "../services/booking.service";
import { ChildService } from "../services/child.service";
import { ScheduleService } from "../services/schedule.service";
import { SubscriptionService } from "../services/subscription.service";
import { BotContext, defaultSession } from "./context";
import { createAuthHandlers } from "./handlers/auth.handler";
import { createBookingsHandlers } from "./handlers/bookings.handler";
import { createChildrenHandlers } from "./handlers/children.handler";
import { createScheduleHandler } from "./handlers/schedule.handler";
import { startHandler } from "./handlers/start.handler";
import { createSubscriptionHandler } from "./handlers/subscription.handler";
import { createAuthMiddleware } from "./middleware/auth";
import { PostgresSessionStore } from "./session-store";

type Services = {
  authService: AuthService;
  bookingService: BookingService;
  childService: ChildService;
  scheduleService: ScheduleService;
  subscriptionService: SubscriptionService;
};

export function registerBot(bot: Telegraf<BotContext>, services: Services) {
  const sessionStore = new PostgresSessionStore();

  bot.use(
    session({
      defaultSession,
      store: sessionStore,
      getSessionKey: (ctx) => {
        if (!ctx.from || !ctx.chat) {
          return undefined;
        }

        return `chat:${ctx.chat.id}:user:${ctx.from.id}`;
      },
    }),
  );

  bot.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      logger.error("Bot error", {
        updateId: ctx.update.update_id,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      await ctx.reply("Произошла ошибка. Попробуйте еще раз.");
    }
  });

  bot.use(createAuthMiddleware(services.authService));

  const authHandlers = createAuthHandlers(services.authService);
  const scheduleHandler = createScheduleHandler(services.scheduleService);
  const childrenHandlers = createChildrenHandlers(services.childService);
  const subscriptionHandler = createSubscriptionHandler(services.subscriptionService);
  const bookingsHandlers = createBookingsHandlers(
    services.bookingService,
    services.childService,
    services.scheduleService,
    services.subscriptionService,
  );

  bot.start(startHandler);

  bot.action("auth_phone", authHandlers.requestPhone);
  bot.action("child_add", childrenHandlers.startAddChild);
  bot.action(/^book_child:(.+)$/, async (ctx) => bookingsHandlers.chooseChild(ctx, ctx.match[1]));
  bot.action(/^book_lesson:(.+)$/, async (ctx) => bookingsHandlers.chooseLesson(ctx, ctx.match[1]));
  bot.action(/^book_pay:(ONE_TIME|SUBSCRIPTION)$/, async (ctx) =>
    bookingsHandlers.confirmPayment(ctx, ctx.match[1] as "ONE_TIME" | "SUBSCRIPTION"),
  );
  bot.action(/^cancel_booking:(.+)$/, async (ctx) => bookingsHandlers.cancelBooking(ctx, ctx.match[1]));

  bot.hears(MENU_BUTTONS.schedule, scheduleHandler);
  bot.hears(MENU_BUTTONS.children, childrenHandlers.showChildren);
  bot.hears(MENU_BUTTONS.book, bookingsHandlers.startBooking);
  bot.hears(MENU_BUTTONS.bookings, bookingsHandlers.showBookings);
  bot.hears(MENU_BUTTONS.subscription, subscriptionHandler);
  bot.hears(MENU_BUTTONS.cancel, bookingsHandlers.startCancellation);

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
