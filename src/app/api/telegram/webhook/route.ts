import { NextRequest, NextResponse } from "next/server";

import { getTelegramBot } from "../../../../../telegram-bot/src/app";
import { env } from "../../../../../telegram-bot/src/config/env";
import { logger } from "../../../../../telegram-bot/src/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(req: NextRequest): boolean {
  if (!env.webhookSecret) {
    return true;
  }

  return req.headers.get("x-telegram-bot-api-secret-token") === env.webhookSecret;
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "telegram-webhook" });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const update = await req.json();
    const bot = getTelegramBot();
    await bot.handleUpdate(update);

    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("Webhook update failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
