import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const env = {
  get botToken() {
    return required("BOT_TOKEN");
  },
  get botName() {
    return process.env.BOT_NAME ?? "@kruzhok_v_nebe_bot";
  },
  get databaseUrl() {
    return required("DATABASE_URL");
  },
  get authMockCode() {
    return process.env.BOT_AUTH_MOCK_CODE ?? "1234";
  },
  get timezone() {
    return process.env.BOT_TIMEZONE ?? "Asia/Yekaterinburg";
  },
  get webhookSecret() {
    return process.env.BOT_WEBHOOK_SECRET ?? "";
  },
};
