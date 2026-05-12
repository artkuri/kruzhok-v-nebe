import { ScheduleService } from "../../services/schedule.service";
import { BotContext } from "../context";
import { formatSchedule } from "../utils/formatters";

export function createScheduleHandler(scheduleService: ScheduleService) {
  return async function showSchedule(ctx: BotContext) {
    const lessons = await scheduleService.getUpcoming(7);
    await ctx.reply(formatSchedule(lessons));
  };
}
