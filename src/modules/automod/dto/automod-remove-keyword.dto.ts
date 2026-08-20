import { localizationMapByKey } from "@necord/localization";
import { StringOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class AutomodRemoveKeywordDto {
  @StringOption({
    name: "rule_name",
    description: "Name of the existing keyword rule to remove from",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.AutomodRemoveKeywordRuleNameOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodRemoveKeywordRuleNameOptionDescription),
  })
  ruleName!: string;

  @StringOption({
    name: "keywords",
    description: "Comma-separated keywords to remove from the rule",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.AutomodRemoveKeywordKeywordsOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodRemoveKeywordKeywordsOptionDescription),
  })
  keywords!: string;
}
