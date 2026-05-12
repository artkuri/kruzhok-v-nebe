"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChildrenHandlers = createChildrenHandlers;
const telegraf_1 = require("telegraf");
const logger_1 = require("../../lib/logger");
const formatters_1 = require("../utils/formatters");
function parseBirthDate(raw) {
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
function createChildrenHandlers(childService) {
    async function showChildren(ctx) {
        const familyId = ctx.state.user?.familyId;
        if (!familyId) {
            throw new Error("Семья пользователя не найдена.");
        }
        const children = await childService.getChildren(familyId);
        await ctx.reply(`${(0, formatters_1.formatChildren)(children)}\n\nМожно добавить нового ребенка.`, telegraf_1.Markup.inlineKeyboard([telegraf_1.Markup.button.callback("Добавить ребенка", "child_add")]));
    }
    async function startAddChild(ctx) {
        ctx.session.flow = "waiting_child_name";
        ctx.session.childDraft = {};
        await ctx.answerCbQuery();
        await ctx.reply("Введите имя и фамилию ребенка.");
    }
    async function handleName(ctx) {
        const text = ctx.message && "text" in ctx.message ? ctx.message.text.trim() : undefined;
        if (!text || ctx.session.flow !== "waiting_child_name") {
            return;
        }
        ctx.session.childDraft = { name: text };
        ctx.session.flow = "waiting_child_birth_date";
        await ctx.reply("Введите дату рождения в формате ДД.ММ.ГГГГ.");
    }
    async function handleBirthDate(ctx) {
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
        logger_1.logger.info("Child added", { childId: child.id, familyId });
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
