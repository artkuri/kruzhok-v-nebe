import { query } from "../lib/db";

type SubscriptionRow = {
  id: string;
  type: string;
  totalClasses: number;
  usedClasses: number;
  validUntil: Date;
  isActive: boolean;
};

export class SubscriptionRepository {
  async findActiveByFamilyId(familyId: string): Promise<SubscriptionRow | null> {
    const result = await query<SubscriptionRow>(
      `
        SELECT
          id,
          type,
          "totalClasses" AS "totalClasses",
          "usedClasses" AS "usedClasses",
          "validUntil" AS "validUntil",
          "isActive" AS "isActive"
        FROM "Subscription"
        WHERE "familyId" = $1
          AND "isActive" = true
          AND "validUntil" >= NOW()
        ORDER BY "validUntil" DESC, "createdAt" DESC
        LIMIT 1
      `,
      [familyId],
    );

    return result.rows[0] ?? null;
  }
}
