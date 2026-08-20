import { Injectable, Logger } from "@nestjs/common";
import { TranslationFn } from "@necord/localization";
import { ModAction, ModActionType } from "@prisma/client";
import { EmbedBuilder, Guild } from "discord.js";
import { PrismaService } from "@lib/database/prisma.service";
import { PaginatorPage } from "@lib/pagination/paginator.service";
import { TranslationKey } from "@lib/common/translationKey.common";
import { DateUtil } from "@lib/utils/date.util";

const UNKNOWN_MODERATOR_ID = "unknown";

interface RecordModActionParams {
  guildId: string;
  actionType: ModActionType;
  targetId: string;
  moderatorId: string;
  reason?: string;
  detail?: string;
}

enum TargetFormat {
  User,
  Channel,
  Text,
}

const TARGET_FORMAT_BY_ACTION: Record<ModActionType, TargetFormat> = {
  [ModActionType.KICK]: TargetFormat.User,
  [ModActionType.BAN]: TargetFormat.User,
  [ModActionType.UNBAN]: TargetFormat.User,
  [ModActionType.MUTE]: TargetFormat.User,
  [ModActionType.ROLE_ADD]: TargetFormat.User,
  [ModActionType.ROLE_REMOVE]: TargetFormat.User,
  [ModActionType.CHANNEL_LOCK]: TargetFormat.Channel,
  [ModActionType.CHANNEL_UNLOCK]: TargetFormat.Channel,
  [ModActionType.AUTOMOD_RULE_CREATE]: TargetFormat.Text,
  [ModActionType.AUTOMOD_RULE_DELETE]: TargetFormat.Text,
  [ModActionType.AUTOMOD_RULE_TOGGLE]: TargetFormat.Text,
  [ModActionType.AUTOMOD_RULE_KEYWORD_ADD]: TargetFormat.Text,
  [ModActionType.AUTOMOD_RULE_KEYWORD_REMOVE]: TargetFormat.Text,
  [ModActionType.AUTOMOD_RULE_EXEMPT_ADD]: TargetFormat.Text,
  [ModActionType.AUTOMOD_RULE_EXEMPT_REMOVE]: TargetFormat.Text,
  [ModActionType.AUTOMOD_RULE_UPDATE]: TargetFormat.Text,
};

const ACTION_LABEL_KEYS: Record<ModActionType, TranslationKey> = {
  [ModActionType.KICK]: TranslationKey.ModLogActionKick,
  [ModActionType.BAN]: TranslationKey.ModLogActionBan,
  [ModActionType.UNBAN]: TranslationKey.ModLogActionUnban,
  [ModActionType.MUTE]: TranslationKey.ModLogActionMute,
  [ModActionType.ROLE_ADD]: TranslationKey.ModLogActionRoleAdd,
  [ModActionType.ROLE_REMOVE]: TranslationKey.ModLogActionRoleRemove,
  [ModActionType.CHANNEL_LOCK]: TranslationKey.ModLogActionChannelLock,
  [ModActionType.CHANNEL_UNLOCK]: TranslationKey.ModLogActionChannelUnlock,
  [ModActionType.AUTOMOD_RULE_CREATE]: TranslationKey.ModLogActionAutomodRuleCreate,
  [ModActionType.AUTOMOD_RULE_DELETE]: TranslationKey.ModLogActionAutomodRuleDelete,
  [ModActionType.AUTOMOD_RULE_TOGGLE]: TranslationKey.ModLogActionAutomodRuleToggle,
  [ModActionType.AUTOMOD_RULE_KEYWORD_ADD]: TranslationKey.ModLogActionAutomodRuleKeywordAdd,
  [ModActionType.AUTOMOD_RULE_KEYWORD_REMOVE]: TranslationKey.ModLogActionAutomodRuleKeywordRemove,
  [ModActionType.AUTOMOD_RULE_EXEMPT_ADD]: TranslationKey.ModLogActionAutomodRuleExemptAdd,
  [ModActionType.AUTOMOD_RULE_EXEMPT_REMOVE]: TranslationKey.ModLogActionAutomodRuleExemptRemove,
  [ModActionType.AUTOMOD_RULE_UPDATE]: TranslationKey.ModLogActionAutomodRuleUpdate,
};

@Injectable()
export class ModLogService {
  private static readonly ACTIONS_PER_PAGE = 5;

  private readonly logger = new Logger(ModLogService.name);

  constructor(private readonly prisma: PrismaService) {}

  public async setLogChannel(guildId: string, channelId: string): Promise<void> {
    await this.prisma.guildConfig.upsert({
      where: { guildId },
      create: { guildId, modLogChannelId: channelId },
      update: { modLogChannelId: channelId },
    });
  }

  public async getLogChannelId(guildId: string): Promise<string | null> {
    const config = await this.prisma.guildConfig.findUnique({ where: { guildId } });
    return config?.modLogChannelId ?? null;
  }

  public async record(params: RecordModActionParams): Promise<ModAction> {
    const action = await this.prisma.modAction.create({ data: params });
    this.logger.log(
      `[${params.actionType}] target=${params.targetId} moderator=${params.moderatorId} guild=${params.guildId}`,
    );
    return action;
  }

  public async logToChannel(guild: Guild, action: ModAction, t: TranslationFn): Promise<void> {
    const channelId = await this.getLogChannelId(guild.id);
    if (!channelId) return;

    const channel = await guild.channels.fetch(channelId).catch(() => null);
    if (!channel?.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setColor(null)
      .setTitle(t(this.getActionLabelKey(action.actionType)))
      .addFields(
        { name: t(TranslationKey.ModLogFieldTarget), value: this.formatTarget(action), inline: true },
        {
          name: t(TranslationKey.ModLogFieldModerator),
          value: this.formatModerator(action.moderatorId, t),
          inline: true,
        },
        {
          name: t(TranslationKey.ModLogFieldReason),
          value: action.reason ?? t(TranslationKey.ModerationNoReasonProvided),
        },
      )
      .setTimestamp(action.createdAt);

    if (action.detail) {
      embed.addFields({ name: t(TranslationKey.ModLogFieldDetail), value: action.detail });
    }

    await channel.send({ embeds: [embed] }).catch(() => null);
  }

  public async listActions(guildId: string, targetId?: string): Promise<ModAction[]> {
    return this.prisma.modAction.findMany({
      where: { guildId, ...(targetId ? { targetId } : {}) },
      orderBy: { createdAt: "desc" },
    });
  }

  public buildActionsPages(actions: ModAction[], t: TranslationFn): PaginatorPage[] {
    const title = t(TranslationKey.ModLogListTitle);

    if (actions.length === 0) {
      return [
        { embed: new EmbedBuilder().setColor(null).setTitle(title).setDescription(t(TranslationKey.ModLogListEmpty)) },
      ];
    }

    const chunks = this.chunk(actions, ModLogService.ACTIONS_PER_PAGE);

    return chunks.map((chunk, chunkIndex) => ({
      embed: new EmbedBuilder()
        .setColor(null)
        .setTitle(title)
        .addFields(
          chunk.map((action, i) => ({
            name: t(TranslationKey.ModLogEntryName, {
              index: String(chunkIndex * ModLogService.ACTIONS_PER_PAGE + i + 1),
              action: t(this.getActionLabelKey(action.actionType)),
              date: DateUtil.toDiscordTimestamp(action.createdAt, "f"),
            }),
            value: t(TranslationKey.ModLogEntryValue, {
              target: this.formatTarget(action),
              moderator: this.formatModerator(action.moderatorId, t),
              reason: action.reason ?? t(TranslationKey.ModerationNoReasonProvided),
            }),
          })),
        ),
    }));
  }

  private formatModerator(moderatorId: string, t: TranslationFn): string {
    return moderatorId === UNKNOWN_MODERATOR_ID ? t(TranslationKey.ModLogUnknownModerator) : `<@${moderatorId}>`;
  }

  private formatTarget(action: ModAction): string {
    switch (TARGET_FORMAT_BY_ACTION[action.actionType]) {
      case TargetFormat.Channel:
        return `<#${action.targetId}>`;
      case TargetFormat.Text:
        return `\`${action.targetId}\``;
      default:
        return `<@${action.targetId}>`;
    }
  }

  private getActionLabelKey(actionType: ModActionType): TranslationKey {
    return ACTION_LABEL_KEYS[actionType];
  }

  private chunk<T>(items: T[], size: number): T[][] {
    const chunks: T[][] = [];

    for (let i = 0; i < items.length; i += size) {
      chunks.push(items.slice(i, i + size));
    }

    return chunks;
  }
}
