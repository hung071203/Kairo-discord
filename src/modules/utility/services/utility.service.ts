import { Injectable } from "@nestjs/common";
import { TranslationFn } from "@necord/localization";
import { EmbedBuilder, Guild, GuildMember, User } from "discord.js";
import { TranslationKey } from "@lib/common/translationKey.common";
import { DateUtil } from "@lib/utils/date.util";

@Injectable()
export class UtilityService {
  public getPingLatency(interaction: { createdTimestamp: number }): number {
    return Date.now() - interaction.createdTimestamp;
  }

  public buildUserInfoEmbed(target: GuildMember, t: TranslationFn): EmbedBuilder {
    const roles = target.roles.cache
      .filter((role) => role.id !== target.guild.id)
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString())
      .join(", ");

    const embed = new EmbedBuilder()
      .setColor(target.displayColor || null)
      .setAuthor({
        name: target.user.tag,
        iconURL: target.displayAvatarURL(),
      })
      .setThumbnail(target.displayAvatarURL())
      .addFields(
        {
          name: t(TranslationKey.UserInfoJoinedAt),
          value: DateUtil.toDiscordTimestamp(target.joinedTimestamp ?? Date.now(), "F"),
          inline: true,
        },
        {
          name: t(TranslationKey.UserInfoCreatedAt),
          value: DateUtil.toDiscordTimestamp(target.user.createdTimestamp, "F"),
          inline: true,
        },
        {
          name: t(TranslationKey.UserInfoRoles),
          value: roles || t(TranslationKey.UserInfoNoRoles),
        },
      )
      .setFooter({ text: target.id });

    if (target.nickname) {
      embed.spliceFields(0, 0, {
        name: t(TranslationKey.UserInfoNickname),
        value: target.nickname,
        inline: true,
      });
    }

    return embed;
  }

  public buildServerInfoEmbed(guild: Guild, t: TranslationFn): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(null)
      .setThumbnail(guild.iconURL({ size: 1024 }))
      .setImage(guild.bannerURL({ size: 1024 }))
      .addFields(
        { name: t(TranslationKey.ServerInfoName), value: guild.name, inline: true },
        { name: t(TranslationKey.ServerInfoId), value: guild.id, inline: true },
        { name: t(TranslationKey.ServerInfoOwner), value: `<@${guild.ownerId}>`, inline: true },
        {
          name: t(TranslationKey.ServerInfoCreatedAt),
          value: DateUtil.toDiscordTimestamp(guild.createdTimestamp, "F"),
          inline: true,
        },
        { name: t(TranslationKey.ServerInfoMembers), value: String(guild.memberCount), inline: true },
        { name: t(TranslationKey.ServerInfoRoles), value: String(guild.roles.cache.size), inline: true },
        { name: t(TranslationKey.ServerInfoChannels), value: String(guild.channels.cache.size), inline: true },
      );
  }

  public buildAvatarEmbed(user: User, member: GuildMember | null, t: TranslationFn): EmbedBuilder {
    const avatarUrl = (member ?? user).displayAvatarURL({ size: 1024 });

    return new EmbedBuilder()
      .setColor(member?.displayColor || null)
      .setTitle(t(TranslationKey.AvatarTitle, { username: user.username }))
      .setImage(avatarUrl);
  }
}
