import { ChannelType, NewsChannel, TextChannel } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { ChannelOption, StringOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class LockDto {
  @ChannelOption({
    name: "channel",
    description: "The channel to lock (defaults to the current channel)",
    required: false,
    channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
    name_localizations: localizationMapByKey(TranslationKey.LockChannelOptionName),
    description_localizations: localizationMapByKey(TranslationKey.LockChannelOptionDescription),
  })
  channel?: TextChannel | NewsChannel;

  @StringOption({
    name: "reason",
    description: "The reason for locking this channel",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.LockReasonOptionName),
    description_localizations: localizationMapByKey(TranslationKey.LockReasonOptionDescription),
  })
  reason?: string;
}
