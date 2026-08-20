import { Injectable } from "@nestjs/common";
import { CurrentTranslate, localizationMapByKey, TranslationFn } from "@necord/localization";
import { ModActionType } from "@prisma/client";
import { Constants, GuildFeature, HexColorString, MessageFlags, PermissionFlagsBits } from "discord.js";
import { Context, createCommandGroupDecorator, Options, SlashCommandContext, Subcommand } from "necord";
import { APP_REGEX } from "@lib/common/app.common";
import { TranslationKey } from "@lib/common/translationKey.common";
import { ModLogService } from "@lib/mod-log/mod-log.service";
import { PendingModActionRegistry } from "@lib/mod-log/pending-mod-action.registry";
import { RoleAddDto } from "../dto/role-add.dto";
import { RoleCreateDto } from "../dto/role-create.dto";
import { RoleDeleteDto } from "../dto/role-delete.dto";
import { RoleRemoveDto } from "../dto/role-remove.dto";

export const RoleGroup = createCommandGroupDecorator({
  name: "role",
  description: "Manage server roles",
  dmPermission: false,
  defaultMemberPermissions: PermissionFlagsBits.ManageRoles,
  nameLocalizations: localizationMapByKey(TranslationKey.RoleGroupName),
  descriptionLocalizations: localizationMapByKey(TranslationKey.RoleGroupDescription),
});

@Injectable()
@RoleGroup()
export class RoleCommands {
  constructor(
    private readonly modLogService: ModLogService,
    private readonly pendingModActionRegistry: PendingModActionRegistry,
  ) {}

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

  @Subcommand({
    name: "create",
    description: "Create a new role",
    nameLocalizations: localizationMapByKey(TranslationKey.RoleCreateSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.RoleCreateSubDescription),
  })
  public async create(
    @Context() [interaction]: SlashCommandContext,
    @Options() { name, color, secondaryColor, holographic, hoisted, mentionable, reason }: RoleCreateDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const hasInvalidColor =
      (color && !APP_REGEX.HEX_COLOR.test(color)) || (secondaryColor && !APP_REGEX.HEX_COLOR.test(secondaryColor));
    if (hasInvalidColor) {
      return interaction.reply({
        content: t(TranslationKey.RoleCreateInvalidColorReply),
        flags: MessageFlags.Ephemeral,
      });
    }

    if (secondaryColor && !color) {
      return interaction.reply({
        content: t(TranslationKey.RoleCreateGradientRequiresColorReply),
        flags: MessageFlags.Ephemeral,
      });
    }

    const usesEnhancedColors = holographic || Boolean(secondaryColor);
    if (usesEnhancedColors && !interaction.guild!.features.includes(GuildFeature.EnhancedRoleColors)) {
      return interaction.reply({
        content: t(TranslationKey.RoleCreateEnhancedColorsUnavailableReply),
        flags: MessageFlags.Ephemeral,
      });
    }

    const role = await interaction.guild!.roles.create({
      name,
      hoist: hoisted,
      mentionable,
      reason,
      ...(holographic
        ? {
            colors: {
              primaryColor: Constants.HolographicStyle.Primary,
              secondaryColor: Constants.HolographicStyle.Secondary,
              tertiaryColor: Constants.HolographicStyle.Tertiary,
            },
          }
        : secondaryColor
          ? { colors: { primaryColor: color as HexColorString, secondaryColor: secondaryColor as HexColorString } }
          : { color: color as HexColorString | undefined }),
    });

    this.pendingModActionRegistry.mark(role.id, interaction.user.id, reason);

    return interaction.reply(t(TranslationKey.RoleCreateReply, { role: role.toString() }));
  }

  @Subcommand({
    name: "delete",
    description: "Delete a role",
    nameLocalizations: localizationMapByKey(TranslationKey.RoleDeleteSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.RoleDeleteSubDescription),
  })
  public async delete(
    @Context() [interaction]: SlashCommandContext,
    @Options() { role, reason }: RoleDeleteDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const { id: roleId, name: roleName } = role;
    this.pendingModActionRegistry.mark(roleId, interaction.user.id, reason);
    await role.delete(reason);

    return interaction.reply(t(TranslationKey.RoleDeleteReply, { role: roleName }));
  }
}
