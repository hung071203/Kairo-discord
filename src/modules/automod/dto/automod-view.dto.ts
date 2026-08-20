import { localizationMapByKey } from "@necord/localization";
import { StringOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class AutomodViewDto {
  @StringOption({
    name: "rule_name",
    description: "Name of the rule to view",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.AutomodViewRuleNameOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodViewRuleNameOptionDescription),
  })
  ruleName!: string;
}
