import { localizationMapByKey } from "@necord/localization";
import { IntegerOption } from "necord";
import { DISCORD_LIMITS } from "@lib/common/discord-limits.common";
import { TranslationKey } from "@lib/common/translationKey.common";

export class PurgeDto {
  @IntegerOption({
    name: "amount",
    description: "Number of messages to delete (1-100)",
    required: true,
    min_value: 1,
    max_value: DISCORD_LIMITS.MAX_PURGE_AMOUNT,
    name_localizations: localizationMapByKey(TranslationKey.PurgeAmountOptionName),
    description_localizations: localizationMapByKey(TranslationKey.PurgeAmountOptionDescription),
  })
  amount!: number;
}
