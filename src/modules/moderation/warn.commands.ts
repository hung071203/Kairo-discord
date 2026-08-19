import { Injectable } from "@nestjs/common";
import { CurrentTranslate, localizationMapByKey, TranslationFn } from "@necord/localization";
import { PermissionFlagsBits } from "discord.js";
import {
  Context,
  Options,
  SelectedStrings,
  SlashCommand,
  SlashCommandContext,
  StringSelect,
  StringSelectContext,
} from "necord";
import { fallbackLocale, localizationAdapter } from "@lib/i18n";
import { TranslationKey } from "@lib/common/translationKey.common";
import { PaginatorService } from "@lib/pagination/paginator.service";
import { WarnDto } from "./dto/warn.dto";
import { WarningsDto } from "./dto/warnings.dto";
import { WarnService } from "./services/warn.service";

@Injectable()
export class WarnCommands {
  constructor(
    private readonly warnService: WarnService,
    private readonly paginatorService: PaginatorService,
  ) {}

  @SlashCommand({
    name: "warn",
    description: "Warn a member",
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.ModerateMembers,
    nameLocalizations: localizationMapByKey(TranslationKey.WarnCommandName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.WarnCommandDescription),
  })
  public async warn(
    @Context() [interaction]: SlashCommandContext,
    @Options() { member, reason }: WarnDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    await this.warnService.createWarning(interaction.guildId!, member.id, interaction.user.id, reason);
    return interaction.reply(
      t(TranslationKey.WarnReply, { target: member.toString(), reason }),
    );
  }

  @SlashCommand({
    name: "warnings",
    description: "Show a member's warning history",
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.ModerateMembers,
    nameLocalizations: localizationMapByKey(TranslationKey.WarningsCommandName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.WarningsCommandDescription),
  })
  public async warnings(
    @Context() [interaction]: SlashCommandContext,
    @Options() { member }: WarningsDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const warnings = await this.warnService.listWarnings(interaction.guildId!, member.id);
    const pages = this.warnService.buildWarningsPages(member.user.username, warnings, t);
    const payload = this.paginatorService.createPaginator(interaction.user.id, pages);
    return interaction.reply(payload);
  }

  @SlashCommand({
    name: "warnings-all",
    description: "Show the warning history of every member in this server",
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.ModerateMembers,
    nameLocalizations: localizationMapByKey(TranslationKey.WarningsAllCommandName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.WarningsAllCommandDescription),
  })
  public async warningsAll(
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
        ephemeral: true,
      });
    }

    const warnings = await this.warnService.listWarnings(interaction.guildId!, userId);
    const user = await interaction.client.users.fetch(userId).catch(() => null);
    const pages = this.warnService.buildWarningsPages(user?.username ?? userId, warnings, t);
    const payload = this.paginatorService.createPaginator(interaction.user.id, pages);
    return interaction.reply({ ...payload, ephemeral: true });
  }
}
