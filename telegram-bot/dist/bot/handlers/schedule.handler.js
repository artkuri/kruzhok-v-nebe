"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScheduleHandler = createScheduleHandler;
const formatters_1 = require("../utils/formatters");
function createScheduleHandler(scheduleService) {
    return async function showSchedule(ctx) {
        const lessons = await scheduleService.getUpcoming(7);
        await ctx.reply((0, formatters_1.formatSchedule)(lessons));
    };
}
