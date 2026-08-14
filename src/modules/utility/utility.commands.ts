import { Injectable } from "@nestjs/common";
import {
  CurrentTranslate,
  localizationMapByKey,
  TranslationFn,
} from "@necord/localization";
import { GuildMember } from "discord.js";
import { Context, Options, SlashCommand, SlashCommandContext } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";
import { AvatarDto } from "./dto/avatar.dto";
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

  @SlashCommand({
    name: "serverinfo",
    description: "Show information about the server",
    dmPermission: false,
    nameLocalizations: localizationMapByKey(
      TranslationKey.ServerInfoCommandName,
    ),
    descriptionLocalizations: localizationMapByKey(
      TranslationKey.ServerInfoCommandDescription,
    ),
  })
  public serverinfo(
    @Context() [interaction]: SlashCommandContext,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const embed = this.utilityService.buildServerInfoEmbed(interaction.guild!, t);
    return interaction.reply({ embeds: [embed] });
  }

  @SlashCommand({
    name: "avatar",
    description: "Show a user's avatar",
    nameLocalizations: localizationMapByKey(TranslationKey.AvatarCommandName),
    descriptionLocalizations: localizationMapByKey(
      TranslationKey.AvatarCommandDescription,
    ),
  })
  public avatar(
    @Context() [interaction]: SlashCommandContext,
    @Options() { user }: AvatarDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const targetUser = user ?? interaction.user;
    const member = user
      ? (interaction.guild?.members.cache.get(user.id) ?? null)
      : (interaction.member as GuildMember | null);
    const embed = this.utilityService.buildAvatarEmbed(targetUser, member, t);
    return interaction.reply({ embeds: [embed] });
  }
}
