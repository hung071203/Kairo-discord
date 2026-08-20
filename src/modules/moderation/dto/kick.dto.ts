import { GuildMember } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { MemberOption, StringOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class KickDto {
  @MemberOption({
    name: "member",
    description: "The member to kick",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.KickMemberOptionName),
    description_localizations: localizationMapByKey(TranslationKey.KickMemberOptionDescription),
  })
  member!: GuildMember;

  @StringOption({
    name: "reason",
    description: "The reason for the kick",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.KickReasonOptionName),
    description_localizations: localizationMapByKey(TranslationKey.KickReasonOptionDescription),
  })
  reason?: string;
}
