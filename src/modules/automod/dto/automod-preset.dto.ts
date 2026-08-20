import { ChannelType, NewsChannel, TextChannel } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { BooleanOption, ChannelOption, IntegerOption, StringOption } from "necord";
import { DISCORD_LIMITS } from "@lib/common/discord-limits.common";
import { TranslationKey } from "@lib/common/translationKey.common";

export class AutomodPresetDto {
  @StringOption({
    name: "name",
    description: "A name for this rule",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.AutomodNameOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodNameOptionDescription),
  })
  name!: string;

  @BooleanOption({
    name: "profanity",
    description: "Block profanity/cursing (default: on)",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.AutomodPresetProfanityOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodPresetProfanityOptionDescription),
  })
  profanity?: boolean;

  @BooleanOption({
    name: "sexual_content",
    description: "Block sexually explicit content (default: on)",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.AutomodPresetSexualContentOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodPresetSexualContentOptionDescription),
  })
  sexualContent?: boolean;

  @BooleanOption({
    name: "slurs",
    description: "Block slurs/hate speech (default: on)",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.AutomodPresetSlursOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodPresetSlursOptionDescription),
  })
  slurs?: boolean;

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
