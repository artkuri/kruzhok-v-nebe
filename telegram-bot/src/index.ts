import { env } from "./config/env";
import { getTelegramBot } from "./app";
import { pool } from "./lib/db";
import { logger } from "./lib/logger";

async function bootstrap() {
  const bot = getTelegramBot();

  await bot.telegram.deleteWebhook({ drop_pending_updates: false }).catch(() => undefined);
  await bot.launch();
  logger.info("Telegram bot started");

  process.once("SIGINT", async () => {
    bot.stop("SIGINT");
    await pool.end();
  });

  process.once("SIGTERM", async () => {
    bot.stop("SIGTERM");
    await pool.end();
  });
}

bootstrap().catch(async (error) => {
  logger.error("Failed to start bot", {
    error: error instanceof Error ? error.message : "Unknown error",
  });
  await pool.end();
  process.exit(1);
});
