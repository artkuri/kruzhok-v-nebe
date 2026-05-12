"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthHandlers = createAuthHandlers;
const logger_1 = require("../../lib/logger");
const main_menu_1 = require("../keyboards/main-menu");
function createAuthHandlers(authService) {
    async function requestPhone(ctx) {
        ctx.session.flow = "waiting_phone";
        ctx.session.auth = undefined;
        await ctx.answerCbQuery();
        await ctx.reply("Отправьте номер телефона в формате +79991234567.");
    }
    async function handlePhone(ctx) {
        const text = ctx.message && "text" in ctx.message ? ctx.message.text.trim() : undefined;
        if (!text || ctx.session.flow !== "waiting_phone") {
            return;
        }
        const authRequest = await authService.requestCode(text);
        ctx.session.flow = "waiting_code";
        ctx.session.auth = { phone: authRequest.phone };
        logger_1.logger.info("Mock auth code requested", { phone: authRequest.phone, code: authRequest.code });
        await ctx.reply(`Код подтверждения отправлен.\n\nДля MVP используйте код: ${authRequest.code}`);
    }
    async function handleCode(ctx) {
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
        logger_1.logger.info("Telegram linked", { userId: user.id, telegramId: ctx.from.id.toString() });
        await ctx.reply("Авторизация прошла успешно.", (0, main_menu_1.mainMenuKeyboard)());
    }
    return {
        requestPhone,
        handlePhone,
        handleCode,
    };
}
