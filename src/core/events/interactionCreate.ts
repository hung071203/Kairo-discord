import { Events, PermissionsBitField } from "discord.js";
import { defineEvent } from "@lib/interfaces/event.interface.js";
import { Logger } from "@lib/utils/logger.util.js";

export const interactionCreateEvent = defineEvent({
  name: Events.InteractionCreate,

  async execute(client, interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    if (command.permissions && interaction.inGuild()) {
      const memberPermissions = interaction.memberPermissions;
      const missing = command.permissions.filter(
        (perm) => !memberPermissions?.has(perm),
      );
      if (missing.length > 0) {
        await interaction.reply({
          content: `You're missing permission(s): ${new PermissionsBitField(missing).toArray().join(", ")}`,
          ephemeral: true,
        });
        return;
      }
    }

    try {
      await command.execute(interaction);
    } catch (err) {
      Logger.error(err, `error executing command "${interaction.commandName}"`);
      const payload = {
        content: "Something went wrong while running this command.",
        ephemeral: true,
      };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(payload);
      } else {
        await interaction.reply(payload);
      }
    }
  },
});
