import { SubscriptionDto } from "../dto";
import { SubscriptionRepository } from "../repositories/subscription.repository";

export class SubscriptionService {
  constructor(private readonly subscriptionRepository: SubscriptionRepository) {}

  async getActiveByFamilyId(familyId: string): Promise<SubscriptionDto | null> {
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
