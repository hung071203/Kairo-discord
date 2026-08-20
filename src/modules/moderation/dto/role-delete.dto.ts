import { Role } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { RoleOption, StringOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class RoleDeleteDto {
  @RoleOption({
    name: "role",
    description: "The role to delete",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.RoleDeleteRoleOptionName),
    description_localizations: localizationMapByKey(TranslationKey.RoleDeleteRoleOptionDescription),
  })
  role!: Role;

  @StringOption({
    name: "reason",
    description: "The reason for deleting this role",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.RoleDeleteReasonOptionName),
    description_localizations: localizationMapByKey(TranslationKey.RoleDeleteReasonOptionDescription),
  })
  reason?: string;
}
