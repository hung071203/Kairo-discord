import { Injectable, Logger } from "@nestjs/common";
import { TranslationFn } from "@necord/localization";
import { ModActionType } from "@prisma/client";
import { AuditLogEvent, AutoModerationRule, Guild } from "discord.js";
import { Context, ContextOf, On } from "necord";
import { fallbackLocale, localizationAdapter } from "@lib/i18n";
import { TranslationKey } from "@lib/common/translationKey.common";
import { ModLogService } from "@lib/mod-log/mod-log.service";
import { AutomodService } from "../services/automod.service";

interface PendingChange {
  actionType: ModActionType;
  detail?: string;
}

const AUDIT_LOG_WAIT_MS = 1200;
const UNKNOWN_EXECUTOR_ID = "unknown";

@Injectable()
export class AutomodConfigListener {
  private readonly logger = new Logger(AutomodConfigListener.name);

  constructor(
    private readonly automodService: AutomodService,
    private readonly modLogService: ModLogService,
  ) {}

  @On("autoModerationRuleCreate")
  public async onCreate(@Context() [rule]: ContextOf<"autoModerationRuleCreate">) {
    if (this.automodService.wasRecentlyChangedBySelf(rule.id)) return;

    const action = await this.modLogService.record({
      guildId: rule.guild.id,
      actionType: ModActionType.AUTOMOD_RULE_CREATE,
      targetId: rule.name,
      moderatorId: rule.creatorId,
    });
    await this.modLogService.logToChannel(rule.guild, action, this.translate(rule.guild));
  }

  @On("autoModerationRuleDelete")
  public async onDelete(@Context() [rule]: ContextOf<"autoModerationRuleDelete">) {
    if (this.automodService.wasRecentlyChangedBySelf(rule.id)) return;

    const moderatorId = await this.resolveExecutor(rule.guild, AuditLogEvent.AutoModerationRuleDelete, rule.id);
    const action = await this.modLogService.record({
      guildId: rule.guild.id,
      actionType: ModActionType.AUTOMOD_RULE_DELETE,
      targetId: rule.name,
      moderatorId,
    });
    await this.modLogService.logToChannel(rule.guild, action, this.translate(rule.guild));
  }

  @On("autoModerationRuleUpdate")
  public async onUpdate(@Context() [oldRule, newRule]: ContextOf<"autoModerationRuleUpdate">) {
    if (!oldRule || this.automodService.wasRecentlyChangedBySelf(newRule.id)) return;

    const t = this.translate(newRule.guild);
    const changes = this.diffRule(oldRule, newRule, t);
    if (changes.length === 0) return;

    const moderatorId = await this.resolveExecutor(newRule.guild, AuditLogEvent.AutoModerationRuleUpdate, newRule.id);

    for (const change of changes) {
      const action = await this.modLogService.record({
        guildId: newRule.guild.id,
        actionType: change.actionType,
        targetId: newRule.name,
        moderatorId,
        detail: change.detail,
      });
      await this.modLogService.logToChannel(newRule.guild, action, t);
    }
  }

  private translate(guild: Guild): TranslationFn {
    const locale = guild.preferredLocale ?? fallbackLocale;
    return (key, ...args) => localizationAdapter.getTranslation(key, locale, ...args);
  }

  private async resolveExecutor(guild: Guild, event: AuditLogEvent, ruleId: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, AUDIT_LOG_WAIT_MS));

    try {
      const logs = await guild.fetchAuditLogs({ type: event, limit: 5 });
      const entry = logs.entries.find((candidate) => candidate.targetId === ruleId);
      return entry?.executorId ?? UNKNOWN_EXECUTOR_ID;
    } catch (error) {
      this.logger.warn(`Failed to resolve audit log executor for AutoMod rule ${ruleId}: ${error}`);
      return UNKNOWN_EXECUTOR_ID;
    }
  }

  private diffRule(oldRule: AutoModerationRule, newRule: AutoModerationRule, t: TranslationFn): PendingChange[] {
    const changes: PendingChange[] = [];

    if (oldRule.enabled !== newRule.enabled) {
      changes.push({
        actionType: ModActionType.AUTOMOD_RULE_TOGGLE,
        detail: newRule.enabled ? t(TranslationKey.AutomodStatusEnabled) : t(TranslationKey.AutomodStatusDisabled),
      });
    }

    const oldKeywords = new Set(oldRule.triggerMetadata.keywordFilter ?? []);
    const newKeywords = new Set(newRule.triggerMetadata.keywordFilter ?? []);
    const addedKeywords = [...newKeywords].filter((keyword) => !oldKeywords.has(keyword));
    const removedKeywords = [...oldKeywords].filter((keyword) => !newKeywords.has(keyword));

    if (addedKeywords.length > 0) {
      changes.push({ actionType: ModActionType.AUTOMOD_RULE_KEYWORD_ADD, detail: addedKeywords.join(", ") });
    }
    if (removedKeywords.length > 0) {
      changes.push({ actionType: ModActionType.AUTOMOD_RULE_KEYWORD_REMOVE, detail: removedKeywords.join(", ") });
    }

    const oldExemptRoleIds = new Set(oldRule.exemptRoles.keys());
    const newExemptRoleIds = new Set(newRule.exemptRoles.keys());
    const oldExemptChannelIds = new Set(oldRule.exemptChannels.keys());
    const newExemptChannelIds = new Set(newRule.exemptChannels.keys());

    const addedExempt = [
      ...[...newExemptRoleIds].filter((id) => !oldExemptRoleIds.has(id)).map((id) => `<@&${id}>`),
      ...[...newExemptChannelIds].filter((id) => !oldExemptChannelIds.has(id)).map((id) => `<#${id}>`),
    ];
    const removedExempt = [
      ...[...oldExemptRoleIds].filter((id) => !newExemptRoleIds.has(id)).map((id) => `<@&${id}>`),
      ...[...oldExemptChannelIds].filter((id) => !newExemptChannelIds.has(id)).map((id) => `<#${id}>`),
    ];

    if (addedExempt.length > 0) {
      changes.push({ actionType: ModActionType.AUTOMOD_RULE_EXEMPT_ADD, detail: addedExempt.join(", ") });
    }
    if (removedExempt.length > 0) {
      changes.push({ actionType: ModActionType.AUTOMOD_RULE_EXEMPT_REMOVE, detail: removedExempt.join(", ") });
    }

    const genericFieldsChanged =
      oldRule.name !== newRule.name ||
      oldRule.eventType !== newRule.eventType ||
      JSON.stringify(oldRule.actions) !== JSON.stringify(newRule.actions) ||
      JSON.stringify(oldRule.triggerMetadata.presets ?? []) !== JSON.stringify(newRule.triggerMetadata.presets ?? []) ||
      oldRule.triggerMetadata.mentionTotalLimit !== newRule.triggerMetadata.mentionTotalLimit ||
      oldRule.triggerMetadata.mentionRaidProtectionEnabled !== newRule.triggerMetadata.mentionRaidProtectionEnabled ||
      JSON.stringify(oldRule.triggerMetadata.allowList ?? []) !== JSON.stringify(newRule.triggerMetadata.allowList ?? []) ||
      JSON.stringify(oldRule.triggerMetadata.regexPatterns ?? []) !== JSON.stringify(newRule.triggerMetadata.regexPatterns ?? []);

    if (genericFieldsChanged) {
      changes.push({ actionType: ModActionType.AUTOMOD_RULE_UPDATE });
    }

    return changes;
  }
}
