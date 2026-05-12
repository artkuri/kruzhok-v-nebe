import { pool } from "../lib/db";
import { BotSession } from "./context";

export class PostgresSessionStore {
  async get(key: string): Promise<BotSession | undefined> {
    const result = await pool.query<{ session: BotSession }>(
      `
        SELECT session
        FROM "TelegramSession"
        WHERE key = $1
        LIMIT 1
      `,
      [key],
    );

    return result.rows[0]?.session;
  }

  async set(key: string, value: BotSession): Promise<void> {
    await pool.query(
      `
        INSERT INTO "TelegramSession" (key, session, updated_at)
        VALUES ($1, $2::jsonb, NOW())
        ON CONFLICT (key)
        DO UPDATE SET
          session = EXCLUDED.session,
          updated_at = NOW()
      `,
      [key, JSON.stringify(value)],
    );
  }

  async delete(key: string): Promise<void> {
    await pool.query(`DELETE FROM "TelegramSession" WHERE key = $1`, [key]);
  }
}
