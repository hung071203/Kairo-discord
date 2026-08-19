import { ChannelType, NewsChannel, TextChannel } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { ChannelOption, IntegerOption, StringOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class AutomodKeywordDto {
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
    name_localizations: localizationMapByKey(TranslationKey.AutomodKeywordsOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodKeywordsOptionDescription),
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

  @IntegerOption({
    name: "timeout_minutes",
    description: "Timeout the member for this many minutes when triggered (optional)",
    required: false,
    min_value: 1,
    max_value: 40320,
    name_localizations: localizationMapByKey(TranslationKey.AutomodTimeoutMinutesOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodTimeoutMinutesOptionDescription),
  })
  timeoutMinutes?: number;
}
