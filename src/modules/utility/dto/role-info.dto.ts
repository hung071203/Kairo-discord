import { Role } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { RoleOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class RoleInfoDto {
  @RoleOption({
    name: "role",
    description: "The role to look up",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.RoleInfoRoleOptionName),
    description_localizations: localizationMapByKey(TranslationKey.RoleInfoRoleOptionDescription),
  })
  role!: Role;
}
