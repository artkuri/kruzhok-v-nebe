"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startHandler = startHandler;
const inline_1 = require("../keyboards/inline");
const main_menu_1 = require("../keyboards/main-menu");
async function startHandler(ctx) {
    if (ctx.state.user) {
        await ctx.reply("Выберите нужный раздел в меню.", (0, main_menu_1.mainMenuKeyboard)());
        return;
    }
    ctx.session.flow = "waiting_phone";
    await ctx.reply("Добро пожаловать в бот студии «Кружок в небе».\n\nОтправьте номер телефона в формате +79991234567.", (0, inline_1.authKeyboard)());
}
