import { Injectable } from "@nestjs/common";

interface PendingModAction {
  moderatorId: string;
  reason?: string;
}

/**
 * Bridges bot-triggered mutations (via slash commands) to their corresponding Discord
 * gateway events, so a single listener can be the source of truth for mod-log entries
 * regardless of whether a change came from a command or was made directly in Discord.
 */
@Injectable()
export class PendingModActionRegistry {
  private static readonly TTL_MS = 5000;

  private readonly pending = new Map<string, PendingModAction>();

  public mark(targetId: string, moderatorId: string, reason?: string): void {
    this.pending.set(targetId, { moderatorId, reason });
    setTimeout(() => this.pending.delete(targetId), PendingModActionRegistry.TTL_MS);
  }

  public consume(targetId: string): PendingModAction | null {
    const entry = this.pending.get(targetId);
    if (!entry) return null;

    this.pending.delete(targetId);
    return entry;
  }
}
