import { ChannelType, NewsChannel, TextChannel } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { ChannelOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class ModLogSetChannelDto {
  @ChannelOption({
    name: "channel",
    description: "Channel to send all moderation action logs to",
    required: true,
    channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
    name_localizations: localizationMapByKey(TranslationKey.ModLogSetChannelOptionName),
    description_localizations: localizationMapByKey(TranslationKey.ModLogSetChannelOptionDescription),
  })
  channel!: TextChannel | NewsChannel;
}
