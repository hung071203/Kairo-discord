import { ChannelType, NewsChannel, TextChannel } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { ChannelOption, StringOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class UnlockDto {
  @ChannelOption({
    name: "channel",
    description: "The channel to unlock (defaults to the current channel)",
    required: false,
    channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
    name_localizations: localizationMapByKey(TranslationKey.UnlockChannelOptionName),
    description_localizations: localizationMapByKey(TranslationKey.UnlockChannelOptionDescription),
  })
  channel?: TextChannel | NewsChannel;

  @StringOption({
    name: "reason",
    description: "The reason for unlocking this channel",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.UnlockReasonOptionName),
    description_localizations: localizationMapByKey(TranslationKey.UnlockReasonOptionDescription),
  })
  reason?: string;
}
