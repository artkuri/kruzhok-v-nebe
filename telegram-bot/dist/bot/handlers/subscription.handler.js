"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscriptionHandler = createSubscriptionHandler;
const formatters_1 = require("../utils/formatters");
function createSubscriptionHandler(subscriptionService) {
    return async function showSubscription(ctx) {
        const familyId = ctx.state.user?.familyId;
        if (!familyId) {
            throw new Error("Семья пользователя не найдена.");
        }
        const subscription = await subscriptionService.getActiveByFamilyId(familyId);
        await ctx.reply((0, formatters_1.formatSubscription)(subscription));
    };
}
