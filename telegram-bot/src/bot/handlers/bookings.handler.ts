import { logger } from "../../lib/logger";
import { BookingService } from "../../services/booking.service";
import { ChildService } from "../../services/child.service";
import { ScheduleService } from "../../services/schedule.service";
import { SubscriptionService } from "../../services/subscription.service";
import { BotContext } from "../context";
import {
  cancelBookingKeyboard,
  childrenKeyboard,
  lessonsKeyboard,
  paymentKeyboard,
} from "../keyboards/inline";
import { formatBookings } from "../utils/formatters";

export function createBookingsHandlers(
  bookingService: BookingService,
  childService: ChildService,
  scheduleService: ScheduleService,
  subscriptionService: SubscriptionService,
) {
  async function showBookings(ctx: BotContext) {
    const familyId = ctx.state.user?.familyId;
    if (!familyId) {
      throw new Error("Семья пользователя не найдена.");
    }

    const bookings = await bookingService.getActiveByFamilyId(familyId);
    await ctx.reply(formatBookings(bookings));
  }

  async function startBooking(ctx: BotContext) {
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
    await ctx.reply("Выберите ребенка:", childrenKeyboard(children));
  }

  async function chooseChild(ctx: BotContext, childId: string) {
    ctx.session.booking = { childId };
    const lessons = await scheduleService.getUpcoming(7);

    await ctx.answerCbQuery();
    if (!lessons.length) {
      await ctx.reply("На ближайшие 7 дней занятий нет.");
      return;
    }

    await ctx.reply("Выберите занятие:", lessonsKeyboard(lessons));
  }

  async function chooseLesson(ctx: BotContext, lessonId: string) {
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
    await ctx.reply(
      [
        `Ребенок: ${options.child.name}`,
        `Занятие: ${options.lesson.title}`,
        `Начало: ${new Intl.DateTimeFormat("ru-RU", {
          day: "2-digit",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        }).format(options.lesson.startsAt)}`,
        `Свободных мест: ${options.remainingSeats}`,
      ].join("\n"),
      paymentKeyboard(canUseSubscription),
    );
  }

  async function confirmPayment(ctx: BotContext, paymentMode: "ONE_TIME" | "SUBSCRIPTION") {
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

    logger.info("Booking created", { bookingId: booking.id, paymentMode });

    ctx.session.booking = undefined;
    await ctx.answerCbQuery();
    await ctx.reply(
      `Запись создана.\n\n${booking.childName} записан(а) на "${booking.lessonTitle}" ${new Intl.DateTimeFormat(
        "ru-RU",
        { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" },
      ).format(booking.startsAt)}.`,
    );
  }

  async function startCancellation(ctx: BotContext) {
    const familyId = ctx.state.user?.familyId;
    if (!familyId) {
      throw new Error("Семья пользователя не найдена.");
    }

    const bookings = await bookingService.getActiveByFamilyId(familyId);
    if (!bookings.length) {
      await ctx.reply("У вас нет активных записей для отмены.");
      return;
    }

    await ctx.reply("Выберите запись для отмены:", cancelBookingKeyboard(bookings));
  }

  async function cancelBooking(ctx: BotContext, bookingId: string) {
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
    logger.info("Booking cancelled", { bookingId, burnsLesson: result.burnsLesson });

    await ctx.answerCbQuery();
    await ctx.reply(
      [
        result.burnsLesson ? `До занятия меньше ${result.deadlineHours} часов, занятие сгорит.` : undefined,
        result.refunded ? "Запись отменена, занятие возвращено на абонемент." : "Запись отменена.",
      ]
        .filter(Boolean)
        .join("\n"),
    );
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
