import { localizationMapByKey } from "@necord/localization";
import { StringOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class AutomodToggleDto {
  @StringOption({
    name: "rule_name",
    description: "Name of the rule to enable/disable",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.AutomodToggleRuleNameOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodToggleRuleNameOptionDescription),
  })
  ruleName!: string;
}
