import { MiddlewareFn } from "telegraf";

import { AuthService } from "../../services/auth.service";
import { BotContext } from "../context";
import { authKeyboard } from "../keyboards/inline";

const PUBLIC_TEXTS = new Set(["/start"]);
const PUBLIC_CALLBACK_PREFIXES = ["auth_phone"];

export function createAuthMiddleware(authService: AuthService): MiddlewareFn<BotContext> {
  return async (ctx, next) => {
    const telegramId = ctx.from?.id?.toString();
    if (!telegramId) {
      return next();
    }

    const messageText = ctx.message && "text" in ctx.message ? ctx.message.text : undefined;
    const callbackData =
      ctx.callbackQuery && "data" in ctx.callbackQuery ? ctx.callbackQuery.data : undefined;

    const user = await authService.findByTelegramId(telegramId);
    if (user) {
      ctx.state.user = user;
      return next();
    }

    const isPublicText = messageText ? PUBLIC_TEXTS.has(messageText) : false;
    const isPublicCallback = callbackData
      ? PUBLIC_CALLBACK_PREFIXES.some((prefix) => callbackData.startsWith(prefix))
      : false;

    if (ctx.session.flow === "waiting_phone" || ctx.session.flow === "waiting_code" || isPublicText || isPublicCallback) {
      return next();
    }

    await ctx.reply("Сначала авторизуйтесь по номеру телефона.", authKeyboard());
  };
}
