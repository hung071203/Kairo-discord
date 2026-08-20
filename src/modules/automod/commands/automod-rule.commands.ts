import { Injectable } from "@nestjs/common";
import { CurrentTranslate, localizationMapByKey, TranslationFn } from "@necord/localization";
import { ModActionType } from "@prisma/client";
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
import { ModLogService } from "@lib/mod-log/mod-log.service";
import { AutomodAddKeywordDto } from "../dto/automod-add-keyword.dto";
import { AutomodExemptAddDto } from "../dto/automod-exempt-add.dto";
import { AutomodExemptRemoveDto } from "../dto/automod-exempt-remove.dto";
import { AutomodRemoveKeywordDto } from "../dto/automod-remove-keyword.dto";
import { AutomodToggleDto } from "../dto/automod-toggle.dto";
import { AutomodViewDto } from "../dto/automod-view.dto";
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
  constructor(
    private readonly automodService: AutomodService,
    private readonly modLogService: ModLogService,
  ) {}

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

    const action = await this.modLogService.record({
      guildId: interaction.guildId!,
      actionType: ModActionType.AUTOMOD_RULE_KEYWORD_ADD,
      targetId: result.rule.name,
      moderatorId: interaction.user.id,
      detail: newKeywords.join(", "),
    });
    await this.modLogService.logToChannel(interaction.guild!, action, t);

    return interaction.reply(
      t(TranslationKey.AutomodAddKeywordReply, { count: String(result.addedCount), name: result.rule.name }),
    );
  }

  @Subcommand({
    name: "remove-keyword",
    description: "Remove keywords from an existing keyword rule",
    nameLocalizations: localizationMapByKey(TranslationKey.AutomodRemoveKeywordSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.AutomodRemoveKeywordSubDescription),
  })
  public async removeKeyword(
    @Context() [interaction]: SlashCommandContext,
    @Options() { ruleName, keywords }: AutomodRemoveKeywordDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const keywordsToRemove = this.splitKeywords(keywords);
    const result = await this.automodService.removeKeywordsFromRule(interaction.guild!, ruleName, keywordsToRemove);

    if (!result) {
      return interaction.reply({
        content: t(TranslationKey.AutomodRuleNotFoundReply, { name: ruleName }),
        flags: MessageFlags.Ephemeral,
      });
    }

    const action = await this.modLogService.record({
      guildId: interaction.guildId!,
      actionType: ModActionType.AUTOMOD_RULE_KEYWORD_REMOVE,
      targetId: result.rule.name,
      moderatorId: interaction.user.id,
      detail: keywordsToRemove.join(", "),
    });
    await this.modLogService.logToChannel(interaction.guild!, action, t);

    return interaction.reply(
      t(TranslationKey.AutomodRemoveKeywordReply, { count: String(result.removedCount), name: result.rule.name }),
    );
  }

  @Subcommand({
    name: "toggle",
    description: "Enable or disable a rule",
    nameLocalizations: localizationMapByKey(TranslationKey.AutomodToggleSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.AutomodToggleSubDescription),
  })
  public async toggle(
    @Context() [interaction]: SlashCommandContext,
    @Options() { ruleName }: AutomodToggleDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const rule = await this.automodService.toggleRule(interaction.guild!, ruleName);

    if (!rule) {
      return interaction.reply({
        content: t(TranslationKey.AutomodRuleNotFoundAnyReply, { name: ruleName }),
        flags: MessageFlags.Ephemeral,
      });
    }

    const action = await this.modLogService.record({
      guildId: interaction.guildId!,
      actionType: ModActionType.AUTOMOD_RULE_TOGGLE,
      targetId: rule.name,
      moderatorId: interaction.user.id,
      detail: rule.enabled ? t(TranslationKey.AutomodStatusEnabled) : t(TranslationKey.AutomodStatusDisabled),
    });
    await this.modLogService.logToChannel(interaction.guild!, action, t);

    return interaction.reply(
      t(rule.enabled ? TranslationKey.AutomodToggleEnabledReply : TranslationKey.AutomodToggleDisabledReply, {
        name: rule.name,
      }),
    );
  }

  @Subcommand({
    name: "exempt-add",
    description: "Exempt a role or channel from a rule",
    nameLocalizations: localizationMapByKey(TranslationKey.AutomodExemptAddSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.AutomodExemptAddSubDescription),
  })
  public async exemptAdd(
    @Context() [interaction]: SlashCommandContext,
    @Options() { ruleName, role, channel }: AutomodExemptAddDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    if (!role && !channel) {
      return interaction.reply({
        content: t(TranslationKey.AutomodExemptMissingTargetReply),
        flags: MessageFlags.Ephemeral,
      });
    }

    const rule = await this.automodService.addExemption(interaction.guild!, ruleName, { role, channel });

    if (!rule) {
      return interaction.reply({
        content: t(TranslationKey.AutomodRuleNotFoundAnyReply, { name: ruleName }),
        flags: MessageFlags.Ephemeral,
      });
    }

    const target = [role?.toString(), channel?.toString()].filter(Boolean).join(", ");

    const action = await this.modLogService.record({
      guildId: interaction.guildId!,
      actionType: ModActionType.AUTOMOD_RULE_EXEMPT_ADD,
      targetId: rule.name,
      moderatorId: interaction.user.id,
      detail: target,
    });
    await this.modLogService.logToChannel(interaction.guild!, action, t);

    return interaction.reply(t(TranslationKey.AutomodExemptAddReply, { target, name: rule.name }));
  }

  @Subcommand({
    name: "exempt-remove",
    description: "Remove an exemption from a rule",
    nameLocalizations: localizationMapByKey(TranslationKey.AutomodExemptRemoveSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.AutomodExemptRemoveSubDescription),
  })
  public async exemptRemove(
    @Context() [interaction]: SlashCommandContext,
    @Options() { ruleName, role, channel }: AutomodExemptRemoveDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    if (!role && !channel) {
      return interaction.reply({
        content: t(TranslationKey.AutomodExemptMissingTargetReply),
        flags: MessageFlags.Ephemeral,
      });
    }

    const rule = await this.automodService.removeExemption(interaction.guild!, ruleName, { role, channel });

    if (!rule) {
      return interaction.reply({
        content: t(TranslationKey.AutomodRuleNotFoundAnyReply, { name: ruleName }),
        flags: MessageFlags.Ephemeral,
      });
    }

    const target = [role?.toString(), channel?.toString()].filter(Boolean).join(", ");

    const action = await this.modLogService.record({
      guildId: interaction.guildId!,
      actionType: ModActionType.AUTOMOD_RULE_EXEMPT_REMOVE,
      targetId: rule.name,
      moderatorId: interaction.user.id,
      detail: target,
    });
    await this.modLogService.logToChannel(interaction.guild!, action, t);

    return interaction.reply(t(TranslationKey.AutomodExemptRemoveReply, { target, name: rule.name }));
  }

  @Subcommand({
    name: "view",
    description: "View the full details of a rule",
    nameLocalizations: localizationMapByKey(TranslationKey.AutomodViewSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.AutomodViewSubDescription),
  })
  public async view(
    @Context() [interaction]: SlashCommandContext,
    @Options() { ruleName }: AutomodViewDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const rule = await this.automodService.findRuleByName(interaction.guild!, ruleName);

    if (!rule) {
      return interaction.reply({
        content: t(TranslationKey.AutomodRuleNotFoundAnyReply, { name: ruleName }),
        flags: MessageFlags.Ephemeral,
      });
    }

    const embed = this.automodService.buildRuleDetailEmbed(rule, t);
    return interaction.reply({ embeds: [embed] });
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

    const deletedRules = await this.automodService.deleteRules(interaction.guild!, ruleIds);

    for (const rule of deletedRules) {
      const action = await this.modLogService.record({
        guildId: interaction.guildId!,
        actionType: ModActionType.AUTOMOD_RULE_DELETE,
        targetId: rule.name,
        moderatorId: interaction.user.id,
      });
      await this.modLogService.logToChannel(interaction.guild!, action, t);
    }

    return interaction.reply({
      content: t(TranslationKey.AutomodRuleDeleteReply, { count: String(deletedRules.length) }),
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
