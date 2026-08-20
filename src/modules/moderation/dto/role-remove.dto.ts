import { GuildMember, Role } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { MemberOption, RoleOption, StringOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class RoleRemoveDto {
  @MemberOption({
    name: "member",
    description: "The member to remove the role from",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.RoleRemoveMemberOptionName),
    description_localizations: localizationMapByKey(TranslationKey.RoleRemoveMemberOptionDescription),
  })
  member!: GuildMember;

  @RoleOption({
    name: "role",
    description: "The role to remove",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.RoleRemoveRoleOptionName),
    description_localizations: localizationMapByKey(TranslationKey.RoleRemoveRoleOptionDescription),
  })
  role!: Role;

  @StringOption({
    name: "reason",
    description: "The reason for removing this role",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.RoleRemoveReasonOptionName),
    description_localizations: localizationMapByKey(TranslationKey.RoleRemoveReasonOptionDescription),
  })
  reason?: string;
}
