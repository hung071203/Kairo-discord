import { GuildMember } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { MemberOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class WarningsDto {
  @MemberOption({
    name: "member",
    description: "The member to look up",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.WarningsMemberOptionName),
    description_localizations: localizationMapByKey(TranslationKey.WarningsMemberOptionDescription),
  })
  member!: GuildMember;
}
