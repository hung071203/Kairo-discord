import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { Command } from "@lib/interfaces/command.interface.js";
import { DateUtil } from "@lib/utils/date.util.js";
import { addWarn, getWarns } from "../services/moderation.service.js";

export const warnCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a member")
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Add a warning to a member")
        .addUserOption((opt) =>
          opt
            .setName("target")
            .setDescription("Member to warn")
            .setRequired(true),
        )
        .addStringOption((opt) =>
          opt
            .setName("reason")
            .setDescription("Reason for the warning")
            .setRequired(false),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("list")
        .setDescription("List warnings for a member")
        .addUserOption((opt) =>
          opt
            .setName("target")
            .setDescription("Member to check")
            .setRequired(true),
        ),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  permissions: [PermissionFlagsBits.ModerateMembers],

  async execute(interaction) {
    if (!interaction.inGuild()) return;

    const sub = interaction.options.getSubcommand();
    const target = interaction.options.getUser("target", true);

    if (sub === "add") {
      const reason =
        interaction.options.getString("reason") ?? "No reason provided";
      await addWarn(
        interaction.guildId!,
        target.id,
        interaction.user.id,
        reason,
      );
      await interaction.reply({
        content: `Warned **${target.tag}** — ${reason}`,
      });
      return;
    }

    if (sub === "list") {
      const warns = await getWarns(interaction.guildId!, target.id);
      if (warns.length === 0) {
        await interaction.reply({
          content: `${target.tag} has no warnings.`,
          ephemeral: true,
        });
        return;
      }

      const lines = warns.map(
        (w, i) =>
          `${i + 1}. ${w.reason ?? "No reason"} — ${DateUtil.toDiscordRelative(w.createdAt)}`,
      );
      await interaction.reply({
        content: `Warnings for **${target.tag}**:\n${lines.join("\n")}`,
        ephemeral: true,
      });
    }
  },
};
