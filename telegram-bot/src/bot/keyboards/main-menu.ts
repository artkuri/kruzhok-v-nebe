import { Markup } from "telegraf";

import { MENU_BUTTONS } from "../../config/constants";

export function mainMenuKeyboard() {
  return Markup.keyboard([
    [MENU_BUTTONS.schedule, MENU_BUTTONS.children],
    [MENU_BUTTONS.book, MENU_BUTTONS.bookings],
    [MENU_BUTTONS.subscription, MENU_BUTTONS.cancel],
  ]).resize();
}
