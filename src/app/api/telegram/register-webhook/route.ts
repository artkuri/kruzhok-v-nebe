import { NextRequest, NextResponse } from "next/server";

import { env } from "../../../../../telegram-bot/src/config/env";
import { logger } from "../../../../../telegram-bot/src/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBaseUrl(req: NextRequest): string {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const protocol = req.headers.get("x-forwarded-proto") ?? "https";

  if (!host) {
    throw new Error("Unable to resolve host for webhook registration.");
  }

  return `${protocol}://${host}`;
}

function isAuthorized(req: NextRequest): boolean {
  if (!env.webhookSecret) {
    return false;
  }

  const header = req.headers.get("authorization");
  return header === `Bearer ${env.webhookSecret}`;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const baseUrl = getBaseUrl(req);
    const webhookUrl = `${baseUrl}/api/telegram/webhook`;

    const response = await fetch(`https://api.telegram.org/bot${env.botToken}/setWebhook`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        url: webhookUrl,
        secret_token: env.webhookSecret || undefined,
        allowed_updates: ["message", "callback_query"],
      }),
    });

    const payload = await response.json();
    logger.info("Telegram webhook registration result", {
      ok: payload?.ok,
      description: payload?.description,
      webhookUrl,
    });

    return NextResponse.json({
      ok: payload?.ok ?? false,
      webhookUrl,
      result: payload,
    });
  } catch (error) {
    logger.error("Webhook registration failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
