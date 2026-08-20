import { Injectable } from "@nestjs/common";
import { CurrentTranslate, localizationMapByKey, TranslationFn } from "@necord/localization";
import { EmbedBuilder, MessageFlags, PermissionFlagsBits } from "discord.js";
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
import { AutomodAddKeywordDto } from "../dto/automod-add-keyword.dto";
import { AutomodService } from "../services/automod.service";

export const AutomodRuleGroup = createCommandGroupDecorator({
  name: "automod-rule",
  description: "Manage AutoMod rules for this server",
  dmPermission: false,
  defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
  nameLocalizations: localizationMapByKey(TranslationKey.AutomodRuleGroupName),
  descriptionLocalizations: localizationMapByKey(TranslationKey.AutomodRuleGroupDescription),
});

@Injectable()
@AutomodRuleGroup()
export class AutomodRuleCommands {
  constructor(private readonly automodService: AutomodService) {}

  @Subcommand({
    name: "list",
    description: "List all AutoMod rules in this server",
    nameLocalizations: localizationMapByKey(TranslationKey.AutomodRuleListSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.AutomodRuleListSubDescription),
  })
  public async list(
    @Context() [interaction]: SlashCommandContext,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const rules = await this.automodService.listRules(interaction.guild!);
    const embed = this.automodService.buildRulesListEmbed(rules, t);
    return interaction.reply({ embeds: [embed] });
  }

  @Subcommand({
    name: "delete",
    description: "Delete one or more AutoMod rules",
    nameLocalizations: localizationMapByKey(TranslationKey.AutomodRuleDeleteSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.AutomodRuleDeleteSubDescription),
  })
  public async delete(
    @Context() [interaction]: SlashCommandContext,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const rules = await this.automodService.listRules(interaction.guild!);

    if (rules.length === 0) {
      const embed = this.automodService.buildRulesListEmbed(rules, t);
      return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }

    const embed = new EmbedBuilder().setColor(null).setTitle(t(TranslationKey.AutomodRuleDeleteTitle));
    const row = this.automodService.buildRulesDeleteRow(rules, t);

    return interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral });
  }

  @Subcommand({
    name: "add-keyword",
    description: "Add keywords to an existing keyword rule",
    nameLocalizations: localizationMapByKey(TranslationKey.AutomodAddKeywordSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.AutomodAddKeywordSubDescription),
  })
  public async addKeyword(
    @Context() [interaction]: SlashCommandContext,
    @Options() { ruleName, keywords }: AutomodAddKeywordDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const newKeywords = this.splitKeywords(keywords);
    const result = await this.automodService.addKeywordsToRule(interaction.guild!, ruleName, newKeywords);

    if (!result) {
      return interaction.reply({
        content: t(TranslationKey.AutomodRuleNotFoundReply, { name: ruleName }),
        flags: MessageFlags.Ephemeral,
      });
    }

    return interaction.reply(
      t(TranslationKey.AutomodAddKeywordReply, { count: String(result.addedCount), name: result.rule.name }),
    );
  }

  @StringSelect("automod-rule/delete-select")
  public async onSelectRulesToDelete(
    @Context() [interaction]: StringSelectContext,
    @SelectedStrings() ruleIds: string[],
  ) {
    const locale = interaction.locale ?? fallbackLocale;
    const t: TranslationFn = (key, ...args) => localizationAdapter.getTranslation(key, locale, ...args);

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
      return interaction.reply({
        content: t(TranslationKey.ErrorMissingPermissions),
        flags: MessageFlags.Ephemeral,
      });
    }

    const deletedCount = await this.automodService.deleteRules(interaction.guild!, ruleIds);
    return interaction.reply({
      content: t(TranslationKey.AutomodRuleDeleteReply, { count: String(deletedCount) }),
      flags: MessageFlags.Ephemeral,
    });
  }

  private splitKeywords(keywords: string): string[] {
    return keywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);
  }
}
