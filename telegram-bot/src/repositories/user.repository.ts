import { query } from "../lib/db";

type UserRow = {
  id: string;
  name: string;
  phone: string | null;
  familyId: string | null;
  telegramId: string | null;
};

export class UserRepository {
  async findByTelegramId(telegramId: string): Promise<UserRow | null> {
    const result = await query<UserRow>(
      `
        SELECT
          id,
          name,
          phone,
          "familyId" AS "familyId",
          "telegram_id" AS "telegramId"
        FROM "User"
        WHERE "telegram_id" = $1
        LIMIT 1
      `,
      [telegramId],
    );

    return result.rows[0] ?? null;
  }

  async findByPhone(normalizedPhone: string): Promise<UserRow | null> {
    const result = await query<UserRow>(
      `
        SELECT
          id,
          name,
          phone,
          "familyId" AS "familyId",
          "telegram_id" AS "telegramId"
        FROM "User"
        WHERE regexp_replace(COALESCE(phone, ''), '\\D', '', 'g') = $1
        LIMIT 1
      `,
      [normalizedPhone],
    );

    return result.rows[0] ?? null;
  }

  async linkTelegram(userId: string, telegramId: string): Promise<UserRow> {
    const result = await query<UserRow>(
      `
        UPDATE "User"
        SET "telegram_id" = $2
        WHERE id = $1
        RETURNING
          id,
          name,
          phone,
          "familyId" AS "familyId",
          "telegram_id" AS "telegramId"
      `,
      [userId, telegramId],
    );

    return result.rows[0];
  }
}
