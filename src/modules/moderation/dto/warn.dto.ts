import { GuildMember } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { MemberOption, StringOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class WarnDto {
  @MemberOption({
    name: "member",
    description: "The member to warn",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.WarnMemberOptionName),
    description_localizations: localizationMapByKey(TranslationKey.WarnMemberOptionDescription),
  })
  member!: GuildMember;

  @StringOption({
    name: "reason",
    description: "The reason for the warning",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.WarnReasonOptionName),
    description_localizations: localizationMapByKey(TranslationKey.WarnReasonOptionDescription),
  })
  reason!: string;
}
