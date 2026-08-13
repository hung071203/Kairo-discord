import { Injectable } from "@nestjs/common";
import {
  CurrentTranslate,
  localizationMapByKey,
  TranslationFn,
} from "@necord/localization";
import { Context, SlashCommand, SlashCommandContext } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";

@Injectable()
export class UtilityCommands {
  @SlashCommand({
    name: "ping",
    description: "Replies with Pong!",
    nameLocalizations: localizationMapByKey(TranslationKey.PingCommandName),
    descriptionLocalizations: localizationMapByKey(
      TranslationKey.PingCommandDescription,
    ),
  })
  public ping(
    @Context() [interaction]: SlashCommandContext,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const latency = Date.now() - interaction.createdTimestamp;
    return interaction.reply(
      t(TranslationKey.PingReply, { latency: String(latency) }),
    );
  }
}
