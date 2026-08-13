import { EmbedBuilder, Events, TextChannel } from "discord.js";
import { defineEvent } from "@lib/interfaces/event.interface.js";
import { EMBED_COLORS } from "@lib/common/constants.common.js";
import { prisma } from "@src/core/database/prisma.js";
import { Logger } from "@lib/utils/logger.util.js";

export const logDeletedMessageEvent = defineEvent({
  name: Events.MessageDelete,

  async execute(client, message) {
    if (!message.guildId || message.author?.bot) return;

    const config = await prisma.guildConfig.findUnique({
      where: { guildId: message.guildId },
    });
    if (!config?.modLogChannel) return;

    const channel = await client.channels
      .fetch(config.modLogChannel)
      .catch(() => null);
    if (!channel || !(channel instanceof TextChannel)) return;

    const embed = new EmbedBuilder()
      .setTitle("Message Deleted")
      .setColor(EMBED_COLORS.DANGER)
      .addFields(
        {
          name: "Author",
          value: message.author ? `<@${message.author.id}>` : "Unknown",
          inline: true,
        },
        { name: "Channel", value: `<#${message.channelId}>`, inline: true },
      )
      .setDescription(message.content?.slice(0, 1024) || "*No text content*")
      .setTimestamp();

    await channel
      .send({ embeds: [embed] })
      .catch((err) => Logger.error(err, "failed to send mod log"));
  },
});
