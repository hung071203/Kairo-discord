import { REST, Routes } from "discord.js";
import { env } from "@lib/configs/env.config.js";
import { allCommands } from "./modules/index.js";
import { Logger } from "@lib/utils/logger.util.js";

const body = allCommands.map((command) => command.data.toJSON());

const rest = new REST().setToken(env.DISCORD_TOKEN);

try {
  Logger.info(`Registering ${body.length} application (/) command(s)...`);

  // Global registration — can take up to 1 hour to propagate.
  // Swap to Routes.applicationGuildCommands(clientId, guildId) for instant updates during dev.
  await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), { body });

  Logger.info("Successfully registered application commands.");
} catch (err) {
  Logger.error(err, "failed to register application commands");
}
