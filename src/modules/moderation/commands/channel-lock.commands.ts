import { Injectable } from "@nestjs/common";
import {
  CurrentTranslate,
  localizationMapByKey,
  TranslationFn,
} from "@necord/localization";
import { ModActionType } from "@prisma/client";
import { NewsChannel, PermissionFlagsBits, TextChannel } from "discord.js";
import { Context, Options, SlashCommand, SlashCommandContext } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";
import { ModLogService } from "@lib/mod-log/mod-log.service";
import { LockDto } from "../dto/lock.dto";
import { UnlockDto } from "../dto/unlock.dto";

@Injectable()
export class ChannelLockCommands {
  constructor(private readonly modLogService: ModLogService) {}

  @SlashCommand({
    name: "lock",
    description: "Lock a channel, preventing @everyone from sending messages",
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.ManageChannels,
    nameLocalizations: localizationMapByKey(TranslationKey.LockCommandName),
    descriptionLocalizations: localizationMapByKey(
      TranslationKey.LockCommandDescription,
    ),
  })
  public async lock(
    @Context() [interaction]: SlashCommandContext,
    @Options() { channel, reason }: LockDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const targetChannel = (channel ?? interaction.channel) as
      | TextChannel
      | NewsChannel;
    await targetChannel.permissionOverwrites.edit(
      targetChannel.guild.roles.everyone,
      { SendMessages: false },
      { reason },
    );

    const action = await this.modLogService.record({
      guildId: interaction.guildId!,
      actionType: ModActionType.CHANNEL_LOCK,
      targetId: targetChannel.id,
      moderatorId: interaction.user.id,
      reason,
    });
    await this.modLogService.logToChannel(interaction.guild!, action, t);

    return interaction.reply(
      t(TranslationKey.LockReply, { channel: targetChannel.toString() }),
    );
  }

  @SlashCommand({
    name: "unlock",
    description:
      "Unlock a channel, restoring @everyone's ability to send messages",
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.ManageChannels,
    nameLocalizations: localizationMapByKey(TranslationKey.UnlockCommandName),
    descriptionLocalizations: localizationMapByKey(
      TranslationKey.UnlockCommandDescription,
    ),
  })
  public async unlock(
    @Context() [interaction]: SlashCommandContext,
    @Options() { channel, reason }: UnlockDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const targetChannel = (channel ?? interaction.channel) as
      | TextChannel
      | NewsChannel;
    await targetChannel.permissionOverwrites.edit(
      targetChannel.guild.roles.everyone,
      { SendMessages: null },
      { reason },
    );

    const action = await this.modLogService.record({
      guildId: interaction.guildId!,
      actionType: ModActionType.CHANNEL_UNLOCK,
      targetId: targetChannel.id,
      moderatorId: interaction.user.id,
      reason,
    });
    await this.modLogService.logToChannel(interaction.guild!, action, t);

    return interaction.reply(
      t(TranslationKey.UnlockReply, { channel: targetChannel.toString() }),
    );
  }
}
