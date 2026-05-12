import { Context } from "telegraf";

import { UserDto } from "../dto";

export type FlowStep =
  | "idle"
  | "waiting_phone"
  | "waiting_code"
  | "waiting_child_name"
  | "waiting_child_birth_date";

export interface BotSession {
  flow: FlowStep;
  auth?: {
    phone: string;
  };
  booking?: {
    childId?: string;
    lessonId?: string;
  };
  childDraft?: {
    name?: string;
  };
}

export interface BotContext extends Context {
  session: BotSession;
  state: {
    user?: UserDto;
  };
}

export function defaultSession(): BotSession {
  return {
    flow: "idle",
  };
}
