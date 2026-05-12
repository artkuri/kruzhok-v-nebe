"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const db_1 = require("../lib/db");
class UserRepository {
    async findByTelegramId(telegramId) {
        const result = await (0, db_1.query)(`
        SELECT
          id,
          name,
          phone,
          "familyId" AS "familyId",
          "telegram_id" AS "telegramId"
        FROM "User"
        WHERE "telegram_id" = $1
        LIMIT 1
      `, [telegramId]);
        return result.rows[0] ?? null;
    }
    async findByPhone(normalizedPhone) {
        const result = await (0, db_1.query)(`
        SELECT
          id,
          name,
          phone,
          "familyId" AS "familyId",
          "telegram_id" AS "telegramId"
        FROM "User"
        WHERE regexp_replace(COALESCE(phone, ''), '\\D', '', 'g') = $1
        LIMIT 1
      `, [normalizedPhone]);
        return result.rows[0] ?? null;
    }
    async linkTelegram(userId, telegramId) {
        const result = await (0, db_1.query)(`
        UPDATE "User"
        SET "telegram_id" = $2
        WHERE id = $1
        RETURNING
          id,
          name,
          phone,
          "familyId" AS "familyId",
          "telegram_id" AS "telegramId"
      `, [userId, telegramId]);
        return result.rows[0];
    }
}
exports.UserRepository = UserRepository;
