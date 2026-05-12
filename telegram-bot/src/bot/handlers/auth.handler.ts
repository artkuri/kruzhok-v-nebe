import { logger } from "../../lib/logger";
import { AuthService } from "../../services/auth.service";
import { BotContext } from "../context";
import { mainMenuKeyboard } from "../keyboards/main-menu";

export function createAuthHandlers(authService: AuthService) {
  async function requestPhone(ctx: BotContext) {
    ctx.session.flow = "waiting_phone";
    ctx.session.auth = undefined;
    await ctx.answerCbQuery();
    await ctx.reply("Отправьте номер телефона в формате +79991234567.");
  }

  async function handlePhone(ctx: BotContext) {
    const text = ctx.message && "text" in ctx.message ? ctx.message.text.trim() : undefined;
    if (!text || ctx.session.flow !== "waiting_phone") {
      return;
    }

    const authRequest = await authService.requestCode(text);
    ctx.session.flow = "waiting_code";
    ctx.session.auth = { phone: authRequest.phone };

    logger.info("Mock auth code requested", { phone: authRequest.phone, code: authRequest.code });
    await ctx.reply(`Код подтверждения отправлен.\n\nДля MVP используйте код: ${authRequest.code}`);
  }

  async function handleCode(ctx: BotContext) {
    const text = ctx.message && "text" in ctx.message ? ctx.message.text.trim() : undefined;
    if (!text || ctx.session.flow !== "waiting_code" || !ctx.from?.id || !ctx.session.auth) {
      return;
    }

    const user = await authService.verifyCode({
      phone: ctx.session.auth.phone,
      code: text,
      telegramId: ctx.from.id.toString(),
    });

    ctx.state.user = user;
    ctx.session.flow = "idle";
    ctx.session.auth = undefined;

    logger.info("Telegram linked", { userId: user.id, telegramId: ctx.from.id.toString() });
    await ctx.reply("Авторизация прошла успешно.", mainMenuKeyboard());
  }

  return {
    requestPhone,
    handlePhone,
    handleCode,
  };
}
