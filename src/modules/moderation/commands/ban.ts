import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { Command } from "@lib/interfaces/command.interface.js";
import { Logger } from "@lib/utils/logger.util.js";

export const banCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member from the server")
    .addUserOption((opt) =>
      opt.setName("target").setDescription("Member to ban").setRequired(true),
    )
    .addStringOption((opt) =>
      opt
        .setName("reason")
        .setDescription("Reason for the ban")
        .setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  permissions: [PermissionFlagsBits.BanMembers],

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

    if (!member.bannable) {
      await interaction.reply({
        content:
          "I cannot ban this member (role hierarchy or missing permission).",
        ephemeral: true,
      });
      return;
    }

    await member.ban({ reason });
    Logger.info(
      {
        guildId: interaction.guildId,
        target: target.id,
        moderator: interaction.user.id,
      },
      "member banned",
    );

    await interaction.reply({
      content: `Banned **${target.tag}** — ${reason}`,
    });
  },
};
