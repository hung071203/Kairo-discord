import { localizationMapByKey } from "@necord/localization";
import { StringOption } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

export class AutomodAddKeywordDto {
  @StringOption({
    name: "rule_name",
    description: "Name of the existing keyword rule to add to",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.AutomodAddKeywordRuleNameOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodAddKeywordRuleNameOptionDescription),
  })
  ruleName!: string;

  @StringOption({
    name: "keywords",
    description: "Comma-separated keywords to add to the rule",
    required: true,
    name_localizations: localizationMapByKey(TranslationKey.AutomodAddKeywordKeywordsOptionName),
    description_localizations: localizationMapByKey(TranslationKey.AutomodAddKeywordKeywordsOptionDescription),
  })
  keywords!: string;
}
