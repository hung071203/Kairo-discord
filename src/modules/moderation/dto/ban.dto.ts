import { User } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { IntegerOption, StringOption, UserOption } from "necord";
import { DISCORD_LIMITS } from "@lib/common/discord-limits.common";
import { TranslationKey } from "@lib/common/translationKey.common";

export class BanDto {
  @UserOption({
    name: "user",
    description: "The user to ban",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.BanUserOptionName),
    description_localizations: localizationMapByKey(TranslationKey.BanUserOptionDescription),
  })
  user!: User;

  @StringOption({
    name: "reason",
    description: "The reason for the ban",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.BanReasonOptionName),
    description_localizations: localizationMapByKey(TranslationKey.BanReasonOptionDescription),
  })
  reason?: string;

  @IntegerOption({
    name: "delete_message_seconds",
    description: "Delete this user's messages sent in the last X seconds (max 7 days)",
    required: false,
    min_value: 0,
    max_value: DISCORD_LIMITS.MAX_BAN_DELETE_MESSAGE_SECONDS,
    name_localizations: localizationMapByKey(TranslationKey.BanDeleteMessageSecondsOptionName),
    description_localizations: localizationMapByKey(TranslationKey.BanDeleteMessageSecondsOptionDescription),
  })
  deleteMessageSeconds?: number;
}
