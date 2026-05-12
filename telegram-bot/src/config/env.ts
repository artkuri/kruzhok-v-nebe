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
  botToken: required("BOT_TOKEN"),
  botName: process.env.BOT_NAME ?? "@kruzhok_v_nebe_bot",
  databaseUrl: required("DATABASE_URL"),
  authMockCode: process.env.BOT_AUTH_MOCK_CODE ?? "1234",
  timezone: process.env.BOT_TIMEZONE ?? "Asia/Yekaterinburg",
};
