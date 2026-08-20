import { Injectable, Logger } from "@nestjs/common";
import { Guild, GuildMember, GuildTextBasedChannel, User } from "discord.js";

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);

  public async kickMember(member: GuildMember, reason?: string): Promise<void> {
    await member.kick(reason);
    this.logger.log(`Kicked ${member.user.tag} (${member.id}) from ${member.guild.name} — ${reason ?? "no reason"}`);
  }

  public async banUser(
    guild: Guild,
    user: User,
    reason?: string,
    deleteMessageSeconds?: number,
  ): Promise<void> {
    await guild.members.ban(user, { reason, deleteMessageSeconds });
    this.logger.log(`Banned ${user.tag} (${user.id}) from ${guild.name} — ${reason ?? "no reason"}`);
  }

  public async unbanUser(guild: Guild, user: User, reason?: string): Promise<void> {
    await guild.bans.remove(user, reason);
    this.logger.log(`Unbanned ${user.tag} (${user.id}) from ${guild.name} — ${reason ?? "no reason"}`);
  }

  public async muteMember(member: GuildMember, durationMinutes: number, reason?: string): Promise<void> {
    await member.timeout(durationMinutes * 60 * 1000, reason);
    this.logger.log(
      `Muted ${member.user.tag} (${member.id}) in ${member.guild.name} for ${durationMinutes}m — ${reason ?? "no reason"}`,
    );
  }

  public async purgeMessages(channel: GuildTextBasedChannel, amount: number): Promise<number> {
    const deleted = await channel.bulkDelete(amount, true);
    this.logger.log(`Purged ${deleted.size} message(s) in #${channel.name} (${channel.guild.name})`);
    return deleted.size;
  }

  public async setSlowmode(channel: GuildTextBasedChannel, seconds: number): Promise<void> {
    await channel.setRateLimitPerUser(seconds);
    this.logger.log(`Set slowmode to ${seconds}s in #${channel.name} (${channel.guild.name})`);
  }
}
