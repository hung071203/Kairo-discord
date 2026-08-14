import { Injectable } from "@nestjs/common";
import {
  CurrentTranslate,
  localizationMapByKey,
  TranslationFn,
} from "@necord/localization";
import { GuildMember } from "discord.js";
import { Context, Options, SlashCommand, SlashCommandContext } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";
import { UserInfoDto } from "./dto/user-info.dto";
import { UtilityService } from "./services/utility.service";

@Injectable()
export class UtilityCommands {
  constructor(private readonly utilityService: UtilityService) {}

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
    const latency = this.utilityService.getPingLatency(interaction);
    return interaction.reply(
      t(TranslationKey.PingReply, { latency: String(latency) }),
    );
  }

  @SlashCommand({
    name: "userinfo",
    description: "Show information about a member",
    dmPermission: false,
    nameLocalizations: localizationMapByKey(TranslationKey.UserInfoCommandName),
    descriptionLocalizations: localizationMapByKey(
      TranslationKey.UserInfoCommandDescription,
    ),
  })
  public userinfo(
    @Context() [interaction]: SlashCommandContext,
    @Options() { member }: UserInfoDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const target = member ?? (interaction.member as GuildMember);
    const embed = this.utilityService.buildUserInfoEmbed(target, t);
    return interaction.reply({ embeds: [embed] });
  }
}
