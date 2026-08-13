import type { ClientEvents } from "discord.js";
import type { BotClient } from "@src/bot/client.js";

export interface BotEvent<K extends keyof ClientEvents = keyof ClientEvents> {
  name: K;
  once?: boolean;
  execute: (
    client: BotClient,
    ...args: ClientEvents[K]
  ) => Promise<void> | void;
}

// Type-checks `execute` against the specific event `name`, then widens the
// result to `BotEvent` so events with different signatures can share one array.
export function defineEvent<K extends keyof ClientEvents>(
  event: BotEvent<K>,
): BotEvent {
  return event as unknown as BotEvent;
}
