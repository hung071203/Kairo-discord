import type { BotClient } from "@src/bot/client.js";
import { allCommands } from "@src/modules/index.js";
import { Logger } from "@lib/utils/logger.util.js";

export function loadCommands(client: BotClient) {
  for (const command of allCommands) {
    client.commands.set(command.data.name, command);
  }
  Logger.info(`Loaded ${client.commands.size} command(s)`);
}
