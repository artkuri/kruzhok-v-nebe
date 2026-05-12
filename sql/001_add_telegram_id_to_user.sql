ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "telegram_id" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "User_telegram_id_key"
ON "User" ("telegram_id")
WHERE "telegram_id" IS NOT NULL;
