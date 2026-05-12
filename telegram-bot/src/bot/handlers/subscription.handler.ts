import { SubscriptionService } from "../../services/subscription.service";
import { BotContext } from "../context";
import { formatSubscription } from "../utils/formatters";

export function createSubscriptionHandler(subscriptionService: SubscriptionService) {
  return async function showSubscription(ctx: BotContext) {
    const familyId = ctx.state.user?.familyId;
    if (!familyId) {
      throw new Error("Семья пользователя не найдена.");
    }

    const subscription = await subscriptionService.getActiveByFamilyId(familyId);
    await ctx.reply(formatSubscription(subscription));
  };
}
