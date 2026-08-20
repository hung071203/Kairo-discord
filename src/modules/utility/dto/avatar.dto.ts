import { User } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { UserOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class AvatarDto {
  @UserOption({
    name: "user",
    description: "The user to look up",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.AvatarUserOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AvatarUserOptionDescription),
  })
  user?: User;
}
