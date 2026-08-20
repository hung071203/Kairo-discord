import { Injectable } from "@nestjs/common";
import { CurrentTranslate, localizationMapByKey, TranslationFn } from "@necord/localization";
import { GuildTextBasedChannel, MessageFlags, PermissionFlagsBits } from "discord.js";
import { Context, Options, SlashCommand, SlashCommandContext } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";
import { BanDto } from "../dto/ban.dto";
import { KickDto } from "../dto/kick.dto";
import { MuteDto } from "../dto/mute.dto";
import { PurgeDto } from "../dto/purge.dto";
import { SlowmodeDto } from "../dto/slowmode.dto";
import { UnbanDto } from "../dto/unban.dto";
import { ModerationService } from "../services/moderation.service";

@Injectable()
export class ModerationCommands {
  constructor(private readonly moderationService: ModerationService) {}

  @SlashCommand({
    name: "kick",
    description: "Kick a member from the server",
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.KickMembers,
    nameLocalizations: localizationMapByKey(TranslationKey.KickCommandName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.KickCommandDescription),
  })
  public async kick(
    @Context() [interaction]: SlashCommandContext,
    @Options() { member, reason }: KickDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    await this.moderationService.kickMember(member, reason);
    return interaction.reply(
      t(TranslationKey.KickReply, {
        target: member.toString(),
        reason: reason ?? t(TranslationKey.ModerationNoReasonProvided),
      }),
    );
  }

  @SlashCommand({
    name: "ban",
    description: "Ban a user from the server",
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.BanMembers,
    nameLocalizations: localizationMapByKey(TranslationKey.BanCommandName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.BanCommandDescription),
  })
  public async ban(
    @Context() [interaction]: SlashCommandContext,
    @Options() { user, reason, deleteMessageSeconds }: BanDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    await this.moderationService.banUser(interaction.guild!, user, reason, deleteMessageSeconds);
    return interaction.reply(
      t(TranslationKey.BanReply, {
        target: user.toString(),
        reason: reason ?? t(TranslationKey.ModerationNoReasonProvided),
      }),
    );
  }

  @SlashCommand({
    name: "unban",
    description: "Unban a user from the server",
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.BanMembers,
    nameLocalizations: localizationMapByKey(TranslationKey.UnbanCommandName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.UnbanCommandDescription),
  })
  public async unban(
    @Context() [interaction]: SlashCommandContext,
    @Options() { user, reason }: UnbanDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    await this.moderationService.unbanUser(interaction.guild!, user, reason);
    return interaction.reply(
      t(TranslationKey.UnbanReply, {
        target: user.toString(),
        reason: reason ?? t(TranslationKey.ModerationNoReasonProvided),
      }),
    );
  }

  @SlashCommand({
    name: "mute",
    description: "Temporarily mute a member",
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.ModerateMembers,
    nameLocalizations: localizationMapByKey(TranslationKey.MuteCommandName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.MuteCommandDescription),
  })
  public async mute(
    @Context() [interaction]: SlashCommandContext,
    @Options() { member, duration, reason }: MuteDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    await this.moderationService.muteMember(member, duration, reason);
    return interaction.reply(
      t(TranslationKey.MuteReply, {
        target: member.toString(),
        duration: String(duration),
        reason: reason ?? t(TranslationKey.ModerationNoReasonProvided),
      }),
    );
  }

  @SlashCommand({
    name: "purge",
    description: "Delete a number of recent messages in this channel",
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
    nameLocalizations: localizationMapByKey(TranslationKey.PurgeCommandName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.PurgeCommandDescription),
  })
  public async purge(
    @Context() [interaction]: SlashCommandContext,
    @Options() { amount }: PurgeDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const deletedCount = await this.moderationService.purgeMessages(
      interaction.channel as GuildTextBasedChannel,
      amount,
    );
    return interaction.reply({
      content: t(TranslationKey.PurgeReply, { amount: String(deletedCount) }),
      flags: MessageFlags.Ephemeral,
    });
  }

  @SlashCommand({
    name: "slowmode",
    description: "Set slowmode for this channel",
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.ManageChannels,
    nameLocalizations: localizationMapByKey(TranslationKey.SlowmodeCommandName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.SlowmodeCommandDescription),
  })
  public async slowmode(
    @Context() [interaction]: SlashCommandContext,
    @Options() { seconds }: SlowmodeDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    await this.moderationService.setSlowmode(interaction.channel as GuildTextBasedChannel, seconds);
    return interaction.reply(
      seconds > 0
        ? t(TranslationKey.SlowmodeReply, { seconds: String(seconds) })
        : t(TranslationKey.SlowmodeReplyDisabled),
    );
  }
}
