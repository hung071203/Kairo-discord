import { ChannelType, GuildBasedChannel, Role } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { ChannelOption, RoleOption, StringOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class AutomodExemptRemoveDto {
  @StringOption({
    name: "rule_name",
    description: "Name of the rule to remove an exemption from",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.AutomodExemptRemoveRuleNameOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodExemptRemoveRuleNameOptionDescription),
  })
  ruleName!: string;

  @RoleOption({
    name: "role",
    description: "Exempt role to remove from this rule (optional)",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.AutomodExemptRemoveRoleOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodExemptRemoveRoleOptionDescription),
  })
  role?: Role;

  @ChannelOption({
    name: "channel",
    description: "Exempt channel to remove from this rule (optional)",
    required: false,
    channel_types: [
      ChannelType.GuildText,
      ChannelType.GuildVoice,
      ChannelType.GuildAnnouncement,
      ChannelType.GuildForum,
      ChannelType.GuildStageVoice,
    ],
    name_localizations: localizationMapByKey(TranslationKey.AutomodExemptRemoveChannelOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodExemptRemoveChannelOptionDescription),
  })
  channel?: GuildBasedChannel;
}
