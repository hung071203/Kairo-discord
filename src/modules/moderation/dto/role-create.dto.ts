import { localizationMapByKey } from "@necord/localization";
import { BooleanOption, StringOption } from "necord";
import { DISCORD_LIMITS } from "@lib/common/discord-limits.common";
import { TranslationKey } from "@lib/common/translationKey.common";

export class RoleCreateDto {
  @StringOption({
    name: "name",
    description: "Name for the new role",
    required: true,
    max_length: DISCORD_LIMITS.MAX_ROLE_NAME_LENGTH,
    name_localizations: localizationMapByKey(TranslationKey.RoleCreateNameOptionName),
    description_localizations: localizationMapByKey(TranslationKey.RoleCreateNameOptionDescription),
  })
  name!: string;

  @StringOption({
    name: "color",
    description: "Hex color for the role, e.g. #ff0000 (optional)",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.RoleCreateColorOptionName),
    description_localizations: localizationMapByKey(TranslationKey.RoleCreateColorOptionDescription),
  })
  color?: string;

  @StringOption({
    name: "secondary_color",
    description: "Second hex color to make this a gradient role (requires server boost, optional)",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.RoleCreateSecondaryColorOptionName),
    description_localizations: localizationMapByKey(TranslationKey.RoleCreateSecondaryColorOptionDescription),
  })
  secondaryColor?: string;

  @BooleanOption({
    name: "holographic",
    description: "Use Discord's holographic (rainbow) role color (requires server boost, optional)",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.RoleCreateHolographicOptionName),
    description_localizations: localizationMapByKey(TranslationKey.RoleCreateHolographicOptionDescription),
  })
  holographic?: boolean;

  @BooleanOption({
    name: "hoisted",
    description: "Display members with this role separately in the member list (optional)",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.RoleCreateHoistedOptionName),
    description_localizations: localizationMapByKey(TranslationKey.RoleCreateHoistedOptionDescription),
  })
  hoisted?: boolean;

  @BooleanOption({
    name: "mentionable",
    description: "Allow anyone to mention this role (optional)",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.RoleCreateMentionableOptionName),
    description_localizations: localizationMapByKey(TranslationKey.RoleCreateMentionableOptionDescription),
  })
  mentionable?: boolean;

  @StringOption({
    name: "reason",
    description: "The reason for creating this role",
    required: false,
    name_localizations: localizationMapByKey(TranslationKey.RoleCreateReasonOptionName),
    description_localizations: localizationMapByKey(TranslationKey.RoleCreateReasonOptionDescription),
  })
  reason?: string;
}
