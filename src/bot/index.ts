import { BotClient } from "./client.js";
import { env } from "@lib/configs/env.config.js";
import { loadCommands } from "@src/core/handlers/commandHandler.js";
import { loadEvents } from "@src/core/handlers/eventHandler.js";

export async function startBot() {
  const client = new BotClient();

  loadCommands(client);
  loadEvents(client);

  await client.login(env.DISCORD_TOKEN);

  return client;
}
