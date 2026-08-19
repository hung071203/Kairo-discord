import { ChannelType, NewsChannel, TextChannel } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { ChannelOption, StringOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class AutomodMemberProfileDto {
  @StringOption({
    name: "name",
    description: "A name for this rule",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.AutomodNameOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodNameOptionDescription),
  })
  name!: string;

  @StringOption({
    name: "keywords",
    description: "Comma-separated keywords to block",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.AutomodProfileKeywordsOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodProfileKeywordsOptionDescription),
  })
  keywords!: string;

  @ChannelOption({
    name: "alert_channel",
    description: "Channel to send alert logs to when this rule triggers (optional)",
    required: false,
    channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
    name_localizations: localizationMapByKey(TranslationKey.AutomodAlertChannelOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodAlertChannelOptionDescription),
  })
  alertChannel?: TextChannel | NewsChannel;
}
