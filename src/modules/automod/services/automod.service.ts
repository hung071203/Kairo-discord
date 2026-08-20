import { Injectable, Logger } from "@nestjs/common";
import { TranslationFn } from "@necord/localization";
import {
  ActionRowBuilder,
  AutoModerationActionOptions,
  AutoModerationActionType,
  AutoModerationRule,
  AutoModerationRuleEventType,
  AutoModerationRuleKeywordPresetType,
  AutoModerationRuleTriggerType,
  EmbedBuilder,
  Guild,
  NewsChannel,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextChannel,
} from "discord.js";
import { TranslationKey } from "@lib/common/translationKey.common";

type AlertChannel = TextChannel | NewsChannel;

interface CommonRuleOptions {
  alertChannel?: AlertChannel;
  timeoutMinutes?: number;
}

@Injectable()
export class AutomodService {
  private readonly logger = new Logger(AutomodService.name);

  public async createKeywordRule(
    guild: Guild,
    params: CommonRuleOptions & { name: string; keywords: string[] },
  ): Promise<AutoModerationRule> {
    const rule = await guild.autoModerationRules.create({
      name: params.name,
      eventType: AutoModerationRuleEventType.MessageSend,
      triggerType: AutoModerationRuleTriggerType.Keyword,
      triggerMetadata: { keywordFilter: params.keywords },
      actions: this.buildMessageActions(params),
      enabled: true,
    });
    this.logCreated(guild, rule);
    return rule;
  }

  public async createPresetRule(
    guild: Guild,
    params: CommonRuleOptions & { name: string; profanity: boolean; sexualContent: boolean; slurs: boolean },
  ): Promise<AutoModerationRule> {
    const presets: AutoModerationRuleKeywordPresetType[] = [];
    if (params.profanity) presets.push(AutoModerationRuleKeywordPresetType.Profanity);
    if (params.sexualContent) presets.push(AutoModerationRuleKeywordPresetType.SexualContent);
    if (params.slurs) presets.push(AutoModerationRuleKeywordPresetType.Slurs);

    const rule = await guild.autoModerationRules.create({
      name: params.name,
      eventType: AutoModerationRuleEventType.MessageSend,
      triggerType: AutoModerationRuleTriggerType.KeywordPreset,
      triggerMetadata: { presets },
      actions: this.buildMessageActions(params),
      enabled: true,
    });
    this.logCreated(guild, rule);
    return rule;
  }

  public async createMentionSpamRule(
    guild: Guild,
    params: CommonRuleOptions & { name: string; mentionLimit: number; raidProtection: boolean },
  ): Promise<AutoModerationRule> {
    const rule = await guild.autoModerationRules.create({
      name: params.name,
      eventType: AutoModerationRuleEventType.MessageSend,
      triggerType: AutoModerationRuleTriggerType.MentionSpam,
      triggerMetadata: {
        mentionTotalLimit: params.mentionLimit,
        mentionRaidProtectionEnabled: params.raidProtection,
      },
      actions: this.buildMessageActions(params),
      enabled: true,
    });
    this.logCreated(guild, rule);
    return rule;
  }

  public async createSpamRule(
    guild: Guild,
    params: { name: string; alertChannel?: AlertChannel },
  ): Promise<AutoModerationRule> {
    const rule = await guild.autoModerationRules.create({
      name: params.name,
      eventType: AutoModerationRuleEventType.MessageSend,
      triggerType: AutoModerationRuleTriggerType.Spam,
      actions: this.buildMessageActions(params),
      enabled: true,
    });
    this.logCreated(guild, rule);
    return rule;
  }

  public async createMemberProfileRule(
    guild: Guild,
    params: { name: string; keywords: string[]; alertChannel?: AlertChannel },
  ): Promise<AutoModerationRule> {
    const rule = await guild.autoModerationRules.create({
      name: params.name,
      eventType: AutoModerationRuleEventType.MemberUpdate,
      triggerType: AutoModerationRuleTriggerType.MemberProfile,
      triggerMetadata: { keywordFilter: params.keywords },
      actions: this.buildProfileActions(params),
      enabled: true,
    });
    this.logCreated(guild, rule);
    return rule;
  }

  public async addKeywordsToRule(
    guild: Guild,
    ruleName: string,
    newKeywords: string[],
  ): Promise<{ rule: AutoModerationRule; addedCount: number } | null> {
    const rules = await this.listRules(guild);
    const rule = rules.find(
      (candidate) =>
        candidate.triggerType === AutoModerationRuleTriggerType.Keyword &&
        candidate.name.toLowerCase() === ruleName.toLowerCase(),
    );
    if (!rule) return null;

    const existingKeywords = rule.triggerMetadata.keywordFilter ?? [];
    const seen = new Set(existingKeywords.map((keyword) => keyword.toLowerCase()));
    const merged = [...existingKeywords];

    let addedCount = 0;
    for (const keyword of newKeywords) {
      if (seen.has(keyword.toLowerCase())) continue;
      seen.add(keyword.toLowerCase());
      merged.push(keyword);
      addedCount++;
    }

    const updatedRule = addedCount > 0 ? await rule.setKeywordFilter(merged) : rule;
    this.logger.log(`Added ${addedCount} keyword(s) to AutoMod rule "${rule.name}" (${rule.id}) in ${guild.name}`);
    return { rule: updatedRule, addedCount };
  }

  public async removeKeywordsFromRule(
    guild: Guild,
    ruleName: string,
    keywordsToRemove: string[],
  ): Promise<{ rule: AutoModerationRule; removedCount: number } | null> {
    const rules = await this.listRules(guild);
    const rule = rules.find(
      (candidate) =>
        candidate.triggerType === AutoModerationRuleTriggerType.Keyword &&
        candidate.name.toLowerCase() === ruleName.toLowerCase(),
    );
    if (!rule) return null;

    const toRemove = new Set(keywordsToRemove.map((keyword) => keyword.toLowerCase()));
    const existingKeywords = rule.triggerMetadata.keywordFilter ?? [];
    const remaining = existingKeywords.filter((keyword) => !toRemove.has(keyword.toLowerCase()));
    const removedCount = existingKeywords.length - remaining.length;

    const updatedRule = removedCount > 0 ? await rule.setKeywordFilter(remaining) : rule;
    this.logger.log(`Removed ${removedCount} keyword(s) from AutoMod rule "${rule.name}" (${rule.id}) in ${guild.name}`);
    return { rule: updatedRule, removedCount };
  }

  public async toggleRule(guild: Guild, ruleName: string): Promise<AutoModerationRule | null> {
    const rule = await this.findRuleByName(guild, ruleName);
    if (!rule) return null;

    const updatedRule = await rule.edit({ enabled: !rule.enabled });
    this.logger.log(
      `${updatedRule.enabled ? "Enabled" : "Disabled"} AutoMod rule "${rule.name}" (${rule.id}) in ${guild.name}`,
    );
    return updatedRule;
  }

  public async findRuleByName(guild: Guild, ruleName: string): Promise<AutoModerationRule | null> {
    const rules = await this.listRules(guild);
    return rules.find((candidate) => candidate.name.toLowerCase() === ruleName.toLowerCase()) ?? null;
  }

  public buildRuleDetailEmbed(rule: AutoModerationRule, t: TranslationFn): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor(null)
      .setTitle(rule.name)
      .addFields(
        { name: t(TranslationKey.AutomodViewTriggerField), value: this.getTriggerLabel(rule.triggerType, t), inline: true },
        {
          name: t(TranslationKey.AutomodViewStatusField),
          value: rule.enabled ? t(TranslationKey.AutomodStatusEnabled) : t(TranslationKey.AutomodStatusDisabled),
          inline: true,
        },
      );

    if (rule.triggerType === AutoModerationRuleTriggerType.Keyword) {
      const keywords = rule.triggerMetadata.keywordFilter ?? [];
      embed.addFields({
        name: t(TranslationKey.AutomodViewKeywordsField),
        value: keywords.length > 0 ? this.truncate(keywords.join(", "), 1024) : t(TranslationKey.AutomodViewNoneValue),
      });
    }

    if (rule.triggerType === AutoModerationRuleTriggerType.KeywordPreset) {
      const presets = rule.triggerMetadata.presets ?? [];
      embed.addFields({
        name: t(TranslationKey.AutomodViewPresetsField),
        value:
          presets.length > 0
            ? presets.map((preset) => t(this.getPresetLabelKey(preset))).join(", ")
            : t(TranslationKey.AutomodViewNoneValue),
      });
    }

    if (rule.triggerType === AutoModerationRuleTriggerType.MentionSpam) {
      embed.addFields(
        {
          name: t(TranslationKey.AutomodViewMentionLimitField),
          value: String(rule.triggerMetadata.mentionTotalLimit ?? t(TranslationKey.AutomodViewNoneValue)),
          inline: true,
        },
        {
          name: t(TranslationKey.AutomodViewRaidProtectionField),
          value: rule.triggerMetadata.mentionRaidProtectionEnabled
            ? t(TranslationKey.AutomodStatusEnabled)
            : t(TranslationKey.AutomodStatusDisabled),
          inline: true,
        },
      );
    }

    const alertChannelId = rule.actions.find((action) => action.type === AutoModerationActionType.SendAlertMessage)
      ?.metadata.channelId;
    const timeoutSeconds = rule.actions.find((action) => action.type === AutoModerationActionType.Timeout)?.metadata
      .durationSeconds;

    embed.addFields({
      name: t(TranslationKey.AutomodViewAlertChannelField),
      value: alertChannelId ? `<#${alertChannelId}>` : t(TranslationKey.AutomodViewNoneValue),
      inline: true,
    });

    if (timeoutSeconds) {
      embed.addFields({
        name: t(TranslationKey.AutomodViewTimeoutField),
        value: t(TranslationKey.AutomodTimeoutMinutesValue, { minutes: String(timeoutSeconds / 60) }),
        inline: true,
      });
    }

    return embed;
  }

  private truncate(text: string, maxLength: number): string {
    return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
  }

  private getPresetLabelKey(preset: AutoModerationRuleKeywordPresetType): TranslationKey {
    const labelKeyByPreset: Record<AutoModerationRuleKeywordPresetType, TranslationKey> = {
      [AutoModerationRuleKeywordPresetType.Profanity]: TranslationKey.AutomodPresetLabelProfanity,
      [AutoModerationRuleKeywordPresetType.SexualContent]: TranslationKey.AutomodPresetLabelSexualContent,
      [AutoModerationRuleKeywordPresetType.Slurs]: TranslationKey.AutomodPresetLabelSlurs,
    };

    return labelKeyByPreset[preset];
  }

  public async listRules(guild: Guild): Promise<AutoModerationRule[]> {
    const rules = await guild.autoModerationRules.fetch();
    return [...rules.values()];
  }

  public async deleteRules(guild: Guild, ruleIds: string[]): Promise<AutoModerationRule[]> {
    const rules = await this.listRules(guild);
    const rulesToDelete = rules.filter((rule) => ruleIds.includes(rule.id));

    const results = await Promise.allSettled(
      rulesToDelete.map((rule) => guild.autoModerationRules.delete(rule.id)),
    );
    const deletedRules = rulesToDelete.filter((_, i) => results[i].status === "fulfilled");

    this.logger.log(`Deleted ${deletedRules.length}/${ruleIds.length} AutoMod rule(s) in ${guild.name}`);
    return deletedRules;
  }

  private logCreated(guild: Guild, rule: AutoModerationRule): void {
    this.logger.log(
      `Created AutoMod rule "${rule.name}" (${rule.id}) in ${guild.name} — trigger: ${rule.triggerType}`,
    );
  }

  public buildRulesListEmbed(rules: AutoModerationRule[], t: TranslationFn): EmbedBuilder {
    const title = t(TranslationKey.AutomodRuleListTitle);

    if (rules.length === 0) {
      return new EmbedBuilder().setColor(null).setTitle(title).setDescription(t(TranslationKey.AutomodRuleListEmpty));
    }

    const lines = rules.map((rule, i) =>
      t(TranslationKey.AutomodRuleListEntry, {
        index: String(i + 1),
        name: rule.name,
        trigger: this.getTriggerLabel(rule.triggerType, t),
        status: rule.enabled ? t(TranslationKey.AutomodStatusEnabled) : t(TranslationKey.AutomodStatusDisabled),
      }),
    );

    return new EmbedBuilder().setColor(null).setTitle(title).setDescription(lines.join("\n"));
  }

  public buildRulesDeleteRow(rules: AutoModerationRule[], t: TranslationFn): ActionRowBuilder<StringSelectMenuBuilder> {
    const select = new StringSelectMenuBuilder()
      .setCustomId("automod-rule/delete-select")
      .setPlaceholder(t(TranslationKey.AutomodRuleDeleteSelectPlaceholder))
      .setMinValues(1)
      .setMaxValues(rules.length)
      .addOptions(
        rules.map((rule, i) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(`#${i + 1} · ${rule.name}`)
            .setDescription(this.getTriggerLabel(rule.triggerType, t))
            .setValue(rule.id),
        ),
      );

    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
  }

  private getTriggerLabel(triggerType: AutoModerationRuleTriggerType, t: TranslationFn): string {
    const labelKeyByType: Partial<Record<AutoModerationRuleTriggerType, TranslationKey>> = {
      [AutoModerationRuleTriggerType.Keyword]: TranslationKey.AutomodTriggerKeyword,
      [AutoModerationRuleTriggerType.KeywordPreset]: TranslationKey.AutomodTriggerPreset,
      [AutoModerationRuleTriggerType.MentionSpam]: TranslationKey.AutomodTriggerMentionSpam,
      [AutoModerationRuleTriggerType.Spam]: TranslationKey.AutomodTriggerSpam,
      [AutoModerationRuleTriggerType.MemberProfile]: TranslationKey.AutomodTriggerMemberProfile,
    };

    const labelKey = labelKeyByType[triggerType];
    return labelKey ? t(labelKey) : String(triggerType);
  }

  private buildMessageActions(params: CommonRuleOptions): AutoModerationActionOptions[] {
    const actions: AutoModerationActionOptions[] = [{ type: AutoModerationActionType.BlockMessage }];

    if (params.alertChannel) {
      actions.push({
        type: AutoModerationActionType.SendAlertMessage,
        metadata: { channel: params.alertChannel },
      });
    }

    if (params.timeoutMinutes) {
      actions.push({
        type: AutoModerationActionType.Timeout,
        metadata: { durationSeconds: params.timeoutMinutes * 60 },
      });
    }

    return actions;
  }

  private buildProfileActions(params: { alertChannel?: AlertChannel }): AutoModerationActionOptions[] {
    const actions: AutoModerationActionOptions[] = [{ type: AutoModerationActionType.BlockMemberInteraction }];

    if (params.alertChannel) {
      actions.push({
        type: AutoModerationActionType.SendAlertMessage,
        metadata: { channel: params.alertChannel },
      });
    }

    return actions;
  }
}
