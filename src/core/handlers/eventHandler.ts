import type { BotClient } from "@src/bot/client.js";
import type { BotEvent } from "@lib/interfaces/event.interface.js";
import { allEvents } from "@src/modules/index.js";
import { readyEvent } from "../events/ready.js";
import { interactionCreateEvent } from "../events/interactionCreate.js";
import { Logger } from "@lib/utils/logger.util.js";

const coreEvents: BotEvent[] = [readyEvent, interactionCreateEvent];

export function loadEvents(client: BotClient) {
  const events = [...coreEvents, ...allEvents];

  for (const event of events) {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args));
    }
  }
  Logger.info(`Loaded ${events.length} event(s)`);
}
