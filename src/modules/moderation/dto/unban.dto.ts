import { User } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { StringOption, UserOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class UnbanDto {
  @UserOption({
    name: "user",
    description: "The user to unban",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.UnbanUserOptionName),
    description_localizations: localizationMapByKey(TranslationKey.UnbanUserOptionDescription),
  })
  user!: User;

  @StringOption({
    name: "reason",
    description: "The reason for the unban",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.UnbanReasonOptionName),
    description_localizations: localizationMapByKey(TranslationKey.UnbanReasonOptionDescription),
  })
  reason?: string;
}
