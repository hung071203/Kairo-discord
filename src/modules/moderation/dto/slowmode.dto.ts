import { localizationMapByKey } from "@necord/localization";
import { IntegerOption } from "necord";
import { DISCORD_LIMITS } from "@lib/common/discord-limits.common";
import { TranslationKey } from "@lib/common/translationKey.common";

export class SlowmodeDto {
  @IntegerOption({
    name: "seconds",
    description: "Slowmode duration in seconds (0 to disable, max 21600)",
    required: true,
    min_value: 0,
    max_value: DISCORD_LIMITS.MAX_SLOWMODE_SECONDS,
    name_localizations: localizationMapByKey(TranslationKey.SlowmodeSecondsOptionName),
    description_localizations: localizationMapByKey(TranslationKey.SlowmodeSecondsOptionDescription),
  })
  seconds!: number;
}
