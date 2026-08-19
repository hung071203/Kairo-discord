import { GuildMember } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { IntegerOption, MemberOption, StringOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class MuteDto {
  @MemberOption({
    name: "member",
    description: "The member to mute",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.MuteMemberOptionName),
    description_localizations: localizationMapByKey(TranslationKey.MuteMemberOptionDescription),
  })
  member!: GuildMember;

  @IntegerOption({
    name: "duration",
    description: "Mute duration in minutes (max 40320, 28 days)",
    required: true,
    min_value: 1,
    max_value: 40320,
    name_localizations: localizationMapByKey(TranslationKey.MuteDurationOptionName),
    description_localizations: localizationMapByKey(TranslationKey.MuteDurationOptionDescription),
  })
  duration!: number;

  @StringOption({
    name: "reason",
    description: "The reason for the mute",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.MuteReasonOptionName),
    description_localizations: localizationMapByKey(TranslationKey.MuteReasonOptionDescription),
  })
  reason?: string;
}
