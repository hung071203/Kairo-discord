import { ChannelType, GuildBasedChannel, Role } from "discord.js";
import { localizationMapByKey } from "@necord/localization";
import { ChannelOption, RoleOption, StringOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class AutomodExemptAddDto {
  @StringOption({
    name: "rule_name",
    description: "Name of the rule to add an exemption to",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.AutomodExemptAddRuleNameOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodExemptAddRuleNameOptionDescription),
  })
  ruleName!: string;

  @RoleOption({
    name: "role",
    description: "Role to exempt from this rule (optional)",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.AutomodExemptAddRoleOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodExemptAddRoleOptionDescription),
  })
  role?: Role;

  @ChannelOption({
    name: "channel",
    description: "Channel to exempt from this rule (optional)",
    required: false,
    channel_types: [
      ChannelType.GuildText,
      ChannelType.GuildVoice,
      ChannelType.GuildAnnouncement,
      ChannelType.GuildForum,
      ChannelType.GuildStageVoice,
    ],
    name_localizations: localizationMapByKey(TranslationKey.AutomodExemptAddChannelOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodExemptAddChannelOptionDescription),
  })
  channel?: GuildBasedChannel;
}
