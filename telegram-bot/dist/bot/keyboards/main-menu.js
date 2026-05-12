"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainMenuKeyboard = mainMenuKeyboard;
const telegraf_1 = require("telegraf");
const constants_1 = require("../../config/constants");
function mainMenuKeyboard() {
    return telegraf_1.Markup.keyboard([
        [constants_1.MENU_BUTTONS.schedule, constants_1.MENU_BUTTONS.children],
        [constants_1.MENU_BUTTONS.book, constants_1.MENU_BUTTONS.bookings],
        [constants_1.MENU_BUTTONS.subscription, constants_1.MENU_BUTTONS.cancel],
    ]).resize();
}
