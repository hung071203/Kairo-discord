import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { Command } from "@lib/interfaces/command.interface.js";
import { Logger } from "@lib/utils/logger.util.js";

export const kickCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from the server")
    .addUserOption((opt) =>
      opt.setName("target").setDescription("Member to kick").setRequired(true),
    )
    .addStringOption((opt) =>
      opt
        .setName("reason")
        .setDescription("Reason for the kick")
        .setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  permissions: [PermissionFlagsBits.KickMembers],

  async execute(interaction) {
    if (!interaction.inGuild()) return;

    const target = interaction.options.getUser("target", true);
    const reason =
      interaction.options.getString("reason") ?? "No reason provided";

    const member = await interaction
      .guild!.members.fetch(target.id)
      .catch(() => null);
    if (!member) {
      await interaction.reply({
        content: "Could not find that member in this server.",
        ephemeral: true,
      });
      return;
    }

    if (!member.kickable) {
      await interaction.reply({
        content:
          "I cannot kick this member (role hierarchy or missing permission).",
        ephemeral: true,
      });
      return;
    }

    await member.kick(reason);
    Logger.info(
      {
        guildId: interaction.guildId,
        target: target.id,
        moderator: interaction.user.id,
      },
      "member kicked",
    );

    await interaction.reply({
      content: `Kicked **${target.tag}** — ${reason}`,
    });
  },
};
