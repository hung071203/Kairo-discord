import { GuildMember } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { MemberOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class UserInfoDto {
  @MemberOption({
    name: "member",
    description: "The member to look up",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.UserInfoMemberOptionName),
    description_localizations: localizationMapByKey(TranslationKey.UserInfoMemberOptionDescription),
  })
  member?: GuildMember;
}
