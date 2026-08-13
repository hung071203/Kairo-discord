import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { Command } from "@lib/interfaces/command.interface.js";
import { Logger } from "@lib/utils/logger.util.js";

const MAX_TIMEOUT_MINUTES = 40320; // Discord's cap: 28 days

export const timeoutCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout (mute) a member for a duration")
    .addUserOption((opt) =>
      opt
        .setName("target")
        .setDescription("Member to timeout")
        .setRequired(true),
    )
    .addIntegerOption((opt) =>
      opt
        .setName("minutes")
        .setDescription("Duration in minutes (max 40320 / 28 days)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(MAX_TIMEOUT_MINUTES),
    )
    .addStringOption((opt) =>
      opt
        .setName("reason")
        .setDescription("Reason for the timeout")
        .setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  permissions: [PermissionFlagsBits.ModerateMembers],

  async execute(interaction) {
    if (!interaction.inGuild()) return;

    const target = interaction.options.getUser("target", true);
    const minutes = interaction.options.getInteger("minutes", true);
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

    if (!member.moderatable) {
      await interaction.reply({
        content:
          "I cannot timeout this member (role hierarchy or missing permission).",
        ephemeral: true,
      });
      return;
    }

    await member.timeout(minutes * 60 * 1000, reason);
    Logger.info(
      {
        guildId: interaction.guildId,
        target: target.id,
        moderator: interaction.user.id,
        minutes,
      },
      "member timed out",
    );

    await interaction.reply({
      content: `Timed out **${target.tag}** for ${minutes} minute(s) — ${reason}`,
    });
  },
};
