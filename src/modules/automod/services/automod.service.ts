import { Injectable } from "@nestjs/common";
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
  public async createKeywordRule(
    guild: Guild,
    params: CommonRuleOptions & { name: string; keywords: string[] },
  ): Promise<AutoModerationRule> {
    return guild.autoModerationRules.create({
      name: params.name,
      eventType: AutoModerationRuleEventType.MessageSend,
      triggerType: AutoModerationRuleTriggerType.Keyword,
      triggerMetadata: { keywordFilter: params.keywords },
      actions: this.buildMessageActions(params),
      enabled: true,
    });
  }

  public async createPresetRule(
    guild: Guild,
    params: CommonRuleOptions & { name: string; profanity: boolean; sexualContent: boolean; slurs: boolean },
  ): Promise<AutoModerationRule> {
    const presets: AutoModerationRuleKeywordPresetType[] = [];
    if (params.profanity) presets.push(AutoModerationRuleKeywordPresetType.Profanity);
    if (params.sexualContent) presets.push(AutoModerationRuleKeywordPresetType.SexualContent);
    if (params.slurs) presets.push(AutoModerationRuleKeywordPresetType.Slurs);

    return guild.autoModerationRules.create({
      name: params.name,
      eventType: AutoModerationRuleEventType.MessageSend,
      triggerType: AutoModerationRuleTriggerType.KeywordPreset,
      triggerMetadata: { presets },
      actions: this.buildMessageActions(params),
      enabled: true,
    });
  }

  public async createMentionSpamRule(
    guild: Guild,
    params: CommonRuleOptions & { name: string; mentionLimit: number; raidProtection: boolean },
  ): Promise<AutoModerationRule> {
    return guild.autoModerationRules.create({
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
  }

  public async createSpamRule(
    guild: Guild,
    params: { name: string; alertChannel?: AlertChannel },
  ): Promise<AutoModerationRule> {
    return guild.autoModerationRules.create({
      name: params.name,
      eventType: AutoModerationRuleEventType.MessageSend,
      triggerType: AutoModerationRuleTriggerType.Spam,
      actions: this.buildMessageActions(params),
      enabled: true,
    });
  }

  public async createMemberProfileRule(
    guild: Guild,
    params: { name: string; keywords: string[]; alertChannel?: AlertChannel },
  ): Promise<AutoModerationRule> {
    return guild.autoModerationRules.create({
      name: params.name,
      eventType: AutoModerationRuleEventType.MemberUpdate,
      triggerType: AutoModerationRuleTriggerType.MemberProfile,
      triggerMetadata: { keywordFilter: params.keywords },
      actions: this.buildProfileActions(params),
      enabled: true,
    });
  }

  public async listRules(guild: Guild): Promise<AutoModerationRule[]> {
    const rules = await guild.autoModerationRules.fetch();
    return [...rules.values()];
  }

  public async deleteRules(guild: Guild, ruleIds: string[]): Promise<number> {
    const results = await Promise.allSettled(ruleIds.map((id) => guild.autoModerationRules.delete(id)));
    return results.filter((result) => result.status === "fulfilled").length;
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
