import { GuildMember } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { MemberOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class WarnRemoveDto {
  @MemberOption({
    name: "member",
    description: "The member to remove warnings from",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.WarnRemoveMemberOptionName),
    description_localizations: localizationMapByKey(TranslationKey.WarnRemoveMemberOptionDescription),
  })
  member!: GuildMember;
}
