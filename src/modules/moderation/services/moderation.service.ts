import { Injectable } from "@nestjs/common";
import { Guild, GuildMember, GuildTextBasedChannel, User } from "discord.js";

@Injectable()
export class ModerationService {
  public async kickMember(member: GuildMember, reason?: string): Promise<void> {
    await member.kick(reason);
  }

  public async banUser(
    guild: Guild,
    user: User,
    reason?: string,
    deleteMessageSeconds?: number,
  ): Promise<void> {
    await guild.members.ban(user, { reason, deleteMessageSeconds });
  }

  public async unbanUser(guild: Guild, user: User, reason?: string): Promise<void> {
    await guild.bans.remove(user, reason);
  }

  public async muteMember(member: GuildMember, durationMinutes: number, reason?: string): Promise<void> {
    await member.timeout(durationMinutes * 60 * 1000, reason);
  }

  public async purgeMessages(channel: GuildTextBasedChannel, amount: number): Promise<number> {
    const deleted = await channel.bulkDelete(amount, true);
    return deleted.size;
  }

  public async setSlowmode(channel: GuildTextBasedChannel, seconds: number): Promise<void> {
    await channel.setRateLimitPerUser(seconds);
  }
}
