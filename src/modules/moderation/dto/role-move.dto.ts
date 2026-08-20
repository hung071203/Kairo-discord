import { Role } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { IntegerOption, RoleOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class RoleMoveDto {
  @RoleOption({
    name: "role",
    description: "The role to move",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.RoleMoveRoleOptionName),
    description_localizations: localizationMapByKey(TranslationKey.RoleMoveRoleOptionDescription),
  })
  role!: Role;

  @IntegerOption({
    name: "position",
    description: "New position for this role (see /role list for current positions)",
    required: true,
    min_value: 1,
    name_localizations: localizationMapByKey(TranslationKey.RoleMovePositionOptionName),
    description_localizations: localizationMapByKey(TranslationKey.RoleMovePositionOptionDescription),
  })
  position!: number;
}
