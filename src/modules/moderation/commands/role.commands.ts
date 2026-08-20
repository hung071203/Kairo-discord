import { Injectable } from "@nestjs/common";
import { CurrentTranslate, localizationMapByKey, TranslationFn } from "@necord/localization";
import { ModActionType } from "@prisma/client";
import { PermissionFlagsBits } from "discord.js";
import { Context, createCommandGroupDecorator, Options, SlashCommandContext, Subcommand } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";
import { ModLogService } from "@lib/mod-log/mod-log.service";
import { RoleAddDto } from "../dto/role-add.dto";
import { RoleRemoveDto } from "../dto/role-remove.dto";

export const RoleGroup = createCommandGroupDecorator({
  name: "role",
  description: "Add or remove roles from a member",
  dmPermission: false,
  defaultMemberPermissions: PermissionFlagsBits.ManageRoles,
  nameLocalizations: localizationMapByKey(TranslationKey.RoleGroupName),
  descriptionLocalizations: localizationMapByKey(TranslationKey.RoleGroupDescription),
});

@Injectable()
@RoleGroup()
export class RoleCommands {
  constructor(private readonly modLogService: ModLogService) {}

  @Subcommand({
    name: "add",
    description: "Give a role to a member",
    nameLocalizations: localizationMapByKey(TranslationKey.RoleAddSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.RoleAddSubDescription),
  })
  public async add(
    @Context() [interaction]: SlashCommandContext,
    @Options() { member, role, reason }: RoleAddDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    await member.roles.add(role, reason);

    const action = await this.modLogService.record({
      guildId: interaction.guildId!,
      actionType: ModActionType.ROLE_ADD,
      targetId: member.id,
      moderatorId: interaction.user.id,
      reason,
      detail: role.toString(),
    });
    await this.modLogService.logToChannel(interaction.guild!, action, t);

    return interaction.reply(t(TranslationKey.RoleAddReply, { target: member.toString(), role: role.toString() }));
  }

  @Subcommand({
    name: "remove",
    description: "Remove a role from a member",
    nameLocalizations: localizationMapByKey(TranslationKey.RoleRemoveSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.RoleRemoveSubDescription),
  })
  public async remove(
    @Context() [interaction]: SlashCommandContext,
    @Options() { member, role, reason }: RoleRemoveDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    await member.roles.remove(role, reason);

    const action = await this.modLogService.record({
      guildId: interaction.guildId!,
      actionType: ModActionType.ROLE_REMOVE,
      targetId: member.id,
      moderatorId: interaction.user.id,
      reason,
      detail: role.toString(),
    });
    await this.modLogService.logToChannel(interaction.guild!, action, t);

    return interaction.reply(t(TranslationKey.RoleRemoveReply, { target: member.toString(), role: role.toString() }));
  }
}
