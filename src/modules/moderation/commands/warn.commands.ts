import { Injectable } from "@nestjs/common";
import { CurrentTranslate, localizationMapByKey, TranslationFn } from "@necord/localization";
import { MessageFlags, PermissionFlagsBits } from "discord.js";
import {
  Context,
  createCommandGroupDecorator,
  Options,
  SelectedStrings,
  SlashCommandContext,
  Subcommand,
  StringSelect,
  StringSelectContext,
} from "necord";
import { fallbackLocale, localizationAdapter } from "@lib/i18n";
import { TranslationKey } from "@lib/common/translationKey.common";
import { PaginatorService } from "@lib/pagination/paginator.service";
import { WarnDto } from "../dto/warn.dto";
import { WarnRemoveDto } from "../dto/warn-remove.dto";
import { WarningsDto } from "../dto/warnings.dto";
import { WarnService } from "../services/warn.service";

export const WarnGroup = createCommandGroupDecorator({
  name: "warn",
  description: "Manage member warnings",
  dmPermission: false,
  defaultMemberPermissions: PermissionFlagsBits.ModerateMembers,
  nameLocalizations: localizationMapByKey(TranslationKey.WarnGroupName),
  descriptionLocalizations: localizationMapByKey(TranslationKey.WarnGroupDescription),
});

@Injectable()
@WarnGroup()
export class WarnCommands {
  constructor(
    private readonly warnService: WarnService,
    private readonly paginatorService: PaginatorService,
  ) {}

  @Subcommand({
    name: "add",
    description: "Warn a member",
    nameLocalizations: localizationMapByKey(TranslationKey.WarnAddSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.WarnAddSubDescription),
  })
  public async add(
    @Context() [interaction]: SlashCommandContext,
    @Options() { member, reason }: WarnDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    await this.warnService.createWarning(interaction.guildId!, member.id, interaction.user.id, reason);
    return interaction.reply(
      t(TranslationKey.WarnReply, { target: member.toString(), reason }),
    );
  }

  @Subcommand({
    name: "list",
    description: "Show a member's warning history",
    nameLocalizations: localizationMapByKey(TranslationKey.WarnListSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.WarnListSubDescription),
  })
  public async list(
    @Context() [interaction]: SlashCommandContext,
    @Options() { member }: WarningsDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const warnings = await this.warnService.listWarnings(interaction.guildId!, member.id);
    const pages = this.warnService.buildWarningsPages(member.user.username, warnings, t);
    const payload = this.paginatorService.createPaginator(interaction.user.id, pages);
    return interaction.reply(payload);
  }

  @Subcommand({
    name: "list-all",
    description: "Show the warning history of every member in this server",
    nameLocalizations: localizationMapByKey(TranslationKey.WarnListAllSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.WarnListAllSubDescription),
  })
  public async listAll(
    @Context() [interaction]: SlashCommandContext,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const summaries = await this.warnService.listGuildWarningSummaries(interaction.guildId!);
    const pages = await this.warnService.buildGuildWarningsPages(interaction.guild!, summaries, t);
    const payload = this.paginatorService.createPaginator(interaction.user.id, pages);
    return interaction.reply(payload);
  }

  @StringSelect("warnings-all/select")
  public async onSelectWarnedMember(
    @Context() [interaction]: StringSelectContext,
    @SelectedStrings() [userId]: string[],
  ) {
    const locale = interaction.locale ?? fallbackLocale;
    const t: TranslationFn = (key, ...args) => localizationAdapter.getTranslation(key, locale, ...args);

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({
        content: t(TranslationKey.ErrorMissingPermissions),
        flags: MessageFlags.Ephemeral,
      });
    }

    const warnings = await this.warnService.listWarnings(interaction.guildId!, userId);
    const user = await interaction.client.users.fetch(userId).catch(() => null);
    const pages = this.warnService.buildWarningsPages(user?.username ?? userId, warnings, t);
    const payload = this.paginatorService.createPaginator(interaction.user.id, pages);
    return interaction.reply({ ...payload, flags: MessageFlags.Ephemeral });
  }

  @Subcommand({
    name: "remove",
    description: "Remove one or more warnings from a member",
    nameLocalizations: localizationMapByKey(TranslationKey.WarnRemoveSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.WarnRemoveSubDescription),
  })
  public async remove(
    @Context() [interaction]: SlashCommandContext,
    @Options() { member }: WarnRemoveDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const warnings = await this.warnService.listWarnings(interaction.guildId!, member.id);
    const pages = this.warnService.buildWarningRemovalPages(member.user.username, warnings, t);
    const payload = this.paginatorService.createPaginator(interaction.user.id, pages);
    return interaction.reply({ ...payload, flags: MessageFlags.Ephemeral });
  }

  @StringSelect("warn-remove/select")
  public async onSelectWarningsToRemove(
    @Context() [interaction]: StringSelectContext,
    @SelectedStrings() warningIds: string[],
  ) {
    const locale = interaction.locale ?? fallbackLocale;
    const t: TranslationFn = (key, ...args) => localizationAdapter.getTranslation(key, locale, ...args);

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({
        content: t(TranslationKey.ErrorMissingPermissions),
        flags: MessageFlags.Ephemeral,
      });
    }

    const deletedCount = await this.warnService.deleteWarnings(interaction.guildId!, warningIds);
    return interaction.reply({
      content: t(TranslationKey.WarnRemoveReply, { count: String(deletedCount) }),
      flags: MessageFlags.Ephemeral,
    });
  }
}
