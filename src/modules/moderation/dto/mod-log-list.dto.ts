import { GuildMember } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { MemberOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class ModLogListDto {
  @MemberOption({
    name: "member",
    description: "Only show actions taken against this member (optional)",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.ModLogListMemberOptionName),
    description_localizations: localizationMapByKey(TranslationKey.ModLogListMemberOptionDescription),
  })
  member?: GuildMember;
}
