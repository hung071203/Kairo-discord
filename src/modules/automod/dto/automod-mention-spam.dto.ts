import { ChannelType, NewsChannel, TextChannel } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { BooleanOption, ChannelOption, IntegerOption, StringOption } from "necord";
import { DISCORD_LIMITS } from "@lib/common/discord-limits.common";
import { TranslationKey } from "@lib/common/translationKey.common";

export class AutomodMentionSpamDto {
  @StringOption({
    name: "name",
    description: "A name for this rule",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.AutomodNameOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodNameOptionDescription),
  })
  name!: string;

  @IntegerOption({
    name: "mention_limit",
    description: "Max mentions allowed per message (1-50)",
    required: true,
    min_value: 1,
    max_value: DISCORD_LIMITS.MAX_MENTION_LIMIT,
    name_localizations: localizationMapByKey(TranslationKey.AutomodMentionLimitOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodMentionLimitOptionDescription),
  })
  mentionLimit!: number;

  @BooleanOption({
    name: "raid_protection",
    description: "Automatically detect mention raids (default: on)",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.AutomodRaidProtectionOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodRaidProtectionOptionDescription),
  })
  raidProtection?: boolean;

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
    max_value: DISCORD_LIMITS.MAX_TIMEOUT_MINUTES,
    name_localizations: localizationMapByKey(TranslationKey.AutomodTimeoutMinutesOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodTimeoutMinutesOptionDescription),
  })
  timeoutMinutes?: number;
}
