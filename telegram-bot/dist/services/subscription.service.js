"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
class SubscriptionService {
    subscriptionRepository;
    constructor(subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }
    async getActiveByFamilyId(familyId) {
        const subscription = await this.subscriptionRepository.findActiveByFamilyId(familyId);
        if (!subscription) {
            return null;
        }
        return {
            id: subscription.id,
            type: subscription.type,
            totalClasses: subscription.totalClasses,
            usedClasses: subscription.usedClasses,
            remainingClasses: Math.max(subscription.totalClasses - subscription.usedClasses, 0),
            validUntil: subscription.validUntil,
            isActive: subscription.isActive,
        };
    }
}
exports.SubscriptionService = SubscriptionService;
