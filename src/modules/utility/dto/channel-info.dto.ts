import { Channel, ChannelType } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { ChannelOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class ChannelInfoDto {
  @ChannelOption({
    name: "channel",
    description: "The channel to look up",
    required: false,
    channel_types: [
      ChannelType.GuildText,
      ChannelType.GuildVoice,
      ChannelType.GuildCategory,
      ChannelType.GuildAnnouncement,
      ChannelType.GuildForum,
      ChannelType.GuildStageVoice,
    ],
    name_localizations: localizationMapByKey(TranslationKey.ChannelInfoChannelOptionName),
    description_localizations: localizationMapByKey(TranslationKey.ChannelInfoChannelOptionDescription),
  })
  channel?: Channel;
}
