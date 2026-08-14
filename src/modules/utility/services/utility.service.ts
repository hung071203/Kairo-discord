import { Injectable } from "@nestjs/common";
import { TranslationFn } from "@necord/localization";
import { EmbedBuilder, GuildMember } from "discord.js";
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
}
