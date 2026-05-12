import { BotContext } from "../context";
import { authKeyboard } from "../keyboards/inline";
import { mainMenuKeyboard } from "../keyboards/main-menu";

export async function startHandler(ctx: BotContext) {
  if (ctx.state.user) {
    await ctx.reply("Выберите нужный раздел в меню.", mainMenuKeyboard());
    return;
  }

  ctx.session.flow = "waiting_phone";
  await ctx.reply(
    "Добро пожаловать в бот студии «Кружок в небе».\n\nОтправьте номер телефона в формате +79991234567.",
    authKeyboard(),
  );
}
