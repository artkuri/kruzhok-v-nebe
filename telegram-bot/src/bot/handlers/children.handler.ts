import { Markup } from "telegraf";

import { logger } from "../../lib/logger";
import { ChildService } from "../../services/child.service";
import { BotContext } from "../context";
import { formatChildren } from "../utils/formatters";

function parseBirthDate(raw: string): Date {
  const match = raw.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) {
    throw new Error("Введите дату в формате ДД.ММ.ГГГГ.");
  }

  const [, day, month, year] = match;
  const date = new Date(`${year}-${month}-${day}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Некорректная дата рождения.");
  }

  return date;
}

export function createChildrenHandlers(childService: ChildService) {
  async function showChildren(ctx: BotContext) {
    const familyId = ctx.state.user?.familyId;
    if (!familyId) {
      throw new Error("Семья пользователя не найдена.");
    }

    const children = await childService.getChildren(familyId);
    await ctx.reply(
      `${formatChildren(children)}\n\nМожно добавить нового ребенка.`,
      Markup.inlineKeyboard([Markup.button.callback("Добавить ребенка", "child_add")]),
    );
  }

  async function startAddChild(ctx: BotContext) {
    ctx.session.flow = "waiting_child_name";
    ctx.session.childDraft = {};
    await ctx.answerCbQuery();
    await ctx.reply("Введите имя и фамилию ребенка.");
  }

  async function handleName(ctx: BotContext) {
    const text = ctx.message && "text" in ctx.message ? ctx.message.text.trim() : undefined;
    if (!text || ctx.session.flow !== "waiting_child_name") {
      return;
    }

    ctx.session.childDraft = { name: text };
    ctx.session.flow = "waiting_child_birth_date";
    await ctx.reply("Введите дату рождения в формате ДД.ММ.ГГГГ.");
  }

  async function handleBirthDate(ctx: BotContext) {
    const text = ctx.message && "text" in ctx.message ? ctx.message.text.trim() : undefined;
    const familyId = ctx.state.user?.familyId;
    const name = ctx.session.childDraft?.name;

    if (!text || ctx.session.flow !== "waiting_child_birth_date" || !familyId || !name) {
      return;
    }

    const child = await childService.addChild({
      familyId,
      name,
      birthDate: parseBirthDate(text),
    });

    logger.info("Child added", { childId: child.id, familyId });
    ctx.session.flow = "idle";
    ctx.session.childDraft = undefined;
    await ctx.reply(`Ребенок ${child.name} добавлен.`);
  }

  return {
    showChildren,
    startAddChild,
    handleName,
    handleBirthDate,
  };
}
