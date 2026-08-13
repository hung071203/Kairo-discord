import { Events } from "discord.js";
import { defineEvent } from "@lib/interfaces/event.interface.js";
import { Logger } from "@lib/utils/logger.util.js";

export const readyEvent = defineEvent({
  name: Events.ClientReady,
  once: true,
  execute(client) {
    Logger.info(`Logged in as ${client.user?.tag}`);
  },
});
