import { GuildMember, Role } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { MemberOption, RoleOption, StringOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class RoleAddDto {
  @MemberOption({
    name: "member",
    description: "The member to give the role to",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.RoleAddMemberOptionName),
    description_localizations: localizationMapByKey(TranslationKey.RoleAddMemberOptionDescription),
  })
  member!: GuildMember;

  @RoleOption({
    name: "role",
    description: "The role to give",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.RoleAddRoleOptionName),
    description_localizations: localizationMapByKey(TranslationKey.RoleAddRoleOptionDescription),
  })
  role!: Role;

  @StringOption({
    name: "reason",
    description: "The reason for adding this role",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.RoleAddReasonOptionName),
    description_localizations: localizationMapByKey(TranslationKey.RoleAddReasonOptionDescription),
  })
  reason?: string;
}
