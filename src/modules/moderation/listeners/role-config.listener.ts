import { Injectable, Logger } from "@nestjs/common";
import { TranslationFn } from "@necord/localization";
import { ModActionType } from "@prisma/client";
import { AuditLogEvent, Guild, Role } from "discord.js";
import { Context, ContextOf, On } from "necord";
import { AUDIT_LOG_WAIT_MS, UNKNOWN_ACTOR_ID } from "@lib/common/app.common";
import { fallbackLocale, localizationAdapter } from "@lib/i18n";
import { TranslationKey } from "@lib/common/translationKey.common";
import { ModLogService } from "@lib/mod-log/mod-log.service";
import { PendingModActionRegistry } from "@lib/mod-log/pending-mod-action.registry";

@Injectable()
export class RoleConfigListener {
  private readonly logger = new Logger(RoleConfigListener.name);

  constructor(
    private readonly modLogService: ModLogService,
    private readonly pendingModActionRegistry: PendingModActionRegistry,
  ) {}

  @On("roleCreate")
  public async onCreate(@Context() [role]: ContextOf<"roleCreate">) {
    const pending = this.pendingModActionRegistry.consume(role.id);
    const moderatorId = pending?.moderatorId ?? (await this.resolveExecutor(role.guild, AuditLogEvent.RoleCreate, role.id));

    const action = await this.modLogService.record({
      guildId: role.guild.id,
      actionType: ModActionType.ROLE_CREATE,
      targetId: role.id,
      moderatorId,
      reason: pending?.reason,
    });
    await this.modLogService.logToChannel(role.guild, action, this.translate(role.guild));
  }

  @On("roleDelete")
  public async onDelete(@Context() [role]: ContextOf<"roleDelete">) {
    const pending = this.pendingModActionRegistry.consume(role.id);
    const moderatorId = pending?.moderatorId ?? (await this.resolveExecutor(role.guild, AuditLogEvent.RoleDelete, role.id));

    const action = await this.modLogService.record({
      guildId: role.guild.id,
      actionType: ModActionType.ROLE_DELETE,
      targetId: role.id,
      moderatorId,
      reason: pending?.reason,
      detail: role.name,
    });
    await this.modLogService.logToChannel(role.guild, action, this.translate(role.guild));
  }

  @On("roleUpdate")
  public async onUpdate(@Context() [oldRole, newRole]: ContextOf<"roleUpdate">) {
    const t = this.translate(newRole.guild);
    const changes = this.diffRole(oldRole, newRole, t);
    if (changes.length === 0) return;

    const pending = this.pendingModActionRegistry.consume(newRole.id);
    const moderatorId =
      pending?.moderatorId ?? (await this.resolveExecutor(newRole.guild, AuditLogEvent.RoleUpdate, newRole.id));

    const action = await this.modLogService.record({
      guildId: newRole.guild.id,
      actionType: ModActionType.ROLE_UPDATE,
      targetId: newRole.id,
      moderatorId,
      reason: pending?.reason,
      detail: changes.join("\n"),
    });
    await this.modLogService.logToChannel(newRole.guild, action, t);
  }

  private translate(guild: Guild): TranslationFn {
    const locale = guild.preferredLocale ?? fallbackLocale;
    return (key, ...args) => localizationAdapter.getTranslation(key, locale, ...args);
  }

  private async resolveExecutor(guild: Guild, event: AuditLogEvent, roleId: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, AUDIT_LOG_WAIT_MS));

    try {
      const logs = await guild.fetchAuditLogs({ type: event, limit: 5 });
      const entry = logs.entries.find((candidate) => candidate.targetId === roleId);
      return entry?.executorId ?? UNKNOWN_ACTOR_ID;
    } catch (error) {
      this.logger.warn(`Failed to resolve audit log executor for role ${roleId}: ${error}`);
      return UNKNOWN_ACTOR_ID;
    }
  }

  private diffRole(oldRole: Role, newRole: Role, t: TranslationFn): string[] {
    const changes: string[] = [];

    if (oldRole.name !== newRole.name) {
      changes.push(t(TranslationKey.ModLogRoleUpdateNameChanged, { old: oldRole.name, new: newRole.name }));
    }

    if (oldRole.hexColor !== newRole.hexColor) {
      changes.push(t(TranslationKey.ModLogRoleUpdateColorChanged, { old: oldRole.hexColor, new: newRole.hexColor }));
    }

    if (oldRole.hoist !== newRole.hoist) {
      changes.push(
        t(TranslationKey.ModLogRoleUpdateHoistedChanged, {
          old: this.formatBoolean(oldRole.hoist, t),
          new: this.formatBoolean(newRole.hoist, t),
        }),
      );
    }

    if (oldRole.mentionable !== newRole.mentionable) {
      changes.push(
        t(TranslationKey.ModLogRoleUpdateMentionableChanged, {
          old: this.formatBoolean(oldRole.mentionable, t),
          new: this.formatBoolean(newRole.mentionable, t),
        }),
      );
    }

    if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
      changes.push(t(TranslationKey.ModLogRoleUpdatePermissionsChanged));
    }

    return changes;
  }

  private formatBoolean(value: boolean, t: TranslationFn): string {
    return value ? t(TranslationKey.CommonYes) : t(TranslationKey.CommonNo);
  }
}
