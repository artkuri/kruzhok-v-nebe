"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRepository = void 0;
const db_1 = require("../lib/db");
class SubscriptionRepository {
    async findActiveByFamilyId(familyId) {
        const result = await (0, db_1.query)(`
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
      `, [familyId]);
        return result.rows[0] ?? null;
    }
}
exports.SubscriptionRepository = SubscriptionRepository;
