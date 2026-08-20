import { Injectable } from "@nestjs/common";
import {
  CurrentTranslate,
  localizationMapByKey,
  TranslationFn,
} from "@necord/localization";
import {
  ForumChannel,
  GuildBasedChannel,
  GuildMember,
  MediaChannel,
  NewsChannel,
  StageChannel,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import { Context, Options, SlashCommand, SlashCommandContext } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";
import { AvatarDto } from "../dto/avatar.dto";
import { ChannelInfoDto } from "../dto/channel-info.dto";
import { RoleInfoDto } from "../dto/role-info.dto";
import { UserInfoDto } from "../dto/user-info.dto";
import { UtilityService } from "../services/utility.service";

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

  @SlashCommand({
    name: "help",
    description: "List all available commands",
    nameLocalizations: localizationMapByKey(TranslationKey.HelpCommandName),
    descriptionLocalizations: localizationMapByKey(
      TranslationKey.HelpCommandDescription,
    ),
  })
  public help(
    @Context() [interaction]: SlashCommandContext,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const embed = this.utilityService.buildHelpEmbed(interaction.locale, t);
    return interaction.reply({ embeds: [embed] });
  }

  @SlashCommand({
    name: "uptime",
    description: "Show how long the bot has been online",
    nameLocalizations: localizationMapByKey(TranslationKey.UptimeCommandName),
    descriptionLocalizations: localizationMapByKey(
      TranslationKey.UptimeCommandDescription,
    ),
  })
  public uptime(
    @Context() [interaction]: SlashCommandContext,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const embed = this.utilityService.buildUptimeEmbed(interaction.client, t);
    return interaction.reply({ embeds: [embed] });
  }

  @SlashCommand({
    name: "roleinfo",
    description: "Show information about a role",
    dmPermission: false,
    nameLocalizations: localizationMapByKey(TranslationKey.RoleInfoCommandName),
    descriptionLocalizations: localizationMapByKey(
      TranslationKey.RoleInfoCommandDescription,
    ),
  })
  public roleinfo(
    @Context() [interaction]: SlashCommandContext,
    @Options() { role }: RoleInfoDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const embed = this.utilityService.buildRoleInfoEmbed(role, t);
    return interaction.reply({ embeds: [embed] });
  }

  @SlashCommand({
    name: "channelinfo",
    description: "Show information about a channel",
    dmPermission: false,
    nameLocalizations: localizationMapByKey(
      TranslationKey.ChannelInfoCommandName,
    ),
    descriptionLocalizations: localizationMapByKey(
      TranslationKey.ChannelInfoCommandDescription,
    ),
  })
  public channelinfo(
    @Context() [interaction]: SlashCommandContext,
    @Options() { channel }: ChannelInfoDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const target = (channel ?? interaction.channel) as GuildBasedChannel;
    const embed = this.utilityService.buildChannelInfoEmbed(target, t);
    return interaction.reply({ embeds: [embed] });
  }

  @SlashCommand({
    name: "invite",
    description: "Create an invite link for this channel",
    dmPermission: false,
    nameLocalizations: localizationMapByKey(TranslationKey.InviteCommandName),
    descriptionLocalizations: localizationMapByKey(
      TranslationKey.InviteCommandDescription,
    ),
  })
  public async invite(
    @Context() [interaction]: SlashCommandContext,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const channel = interaction.channel as
      | TextChannel
      | NewsChannel
      | VoiceChannel
      | StageChannel
      | ForumChannel
      | MediaChannel;
    const url = await this.utilityService.createChannelInvite(channel);
    return interaction.reply(t(TranslationKey.InviteReply, { url }));
  }
}
