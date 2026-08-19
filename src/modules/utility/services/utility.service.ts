import { Injectable } from "@nestjs/common";
import { TranslationFn } from "@necord/localization";
import {
  ChannelType,
  Client,
  EmbedBuilder,
  ForumChannel,
  Guild,
  GuildBasedChannel,
  GuildMember,
  MediaChannel,
  NewsChannel,
  Role,
  StageChannel,
  TextChannel,
  User,
  VoiceChannel,
} from "discord.js";
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

  public buildHelpEmbed(t: TranslationFn): EmbedBuilder {
    const commands: { nameKey: TranslationKey; descriptionKey: TranslationKey }[] = [
      { nameKey: TranslationKey.PingCommandName, descriptionKey: TranslationKey.PingCommandDescription },
      { nameKey: TranslationKey.UserInfoCommandName, descriptionKey: TranslationKey.UserInfoCommandDescription },
      { nameKey: TranslationKey.ServerInfoCommandName, descriptionKey: TranslationKey.ServerInfoCommandDescription },
      { nameKey: TranslationKey.AvatarCommandName, descriptionKey: TranslationKey.AvatarCommandDescription },
      { nameKey: TranslationKey.UptimeCommandName, descriptionKey: TranslationKey.UptimeCommandDescription },
      { nameKey: TranslationKey.RoleInfoCommandName, descriptionKey: TranslationKey.RoleInfoCommandDescription },
      { nameKey: TranslationKey.ChannelInfoCommandName, descriptionKey: TranslationKey.ChannelInfoCommandDescription },
      { nameKey: TranslationKey.InviteCommandName, descriptionKey: TranslationKey.InviteCommandDescription },
      { nameKey: TranslationKey.HelpCommandName, descriptionKey: TranslationKey.HelpCommandDescription },
    ];

    return new EmbedBuilder()
      .setColor(null)
      .setTitle(t(TranslationKey.HelpTitle))
      .addFields(
        commands.map(({ nameKey, descriptionKey }) => ({
          name: `/${t(nameKey)}`,
          value: t(descriptionKey),
        })),
      );
  }

  public buildUptimeEmbed(client: Client, t: TranslationFn): EmbedBuilder {
    const readyTimestamp = client.readyTimestamp ?? Date.now();

    return new EmbedBuilder()
      .setColor(null)
      .setDescription(
        t(TranslationKey.UptimeReply, {
          timestamp: DateUtil.toDiscordTimestamp(readyTimestamp, "R"),
        }),
      );
  }

  public buildRoleInfoEmbed(role: Role, t: TranslationFn): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(role.colors.primaryColor || null)
      .setTitle(role.name)
      .setFooter({ text: role.id })
      .addFields(
        { name: t(TranslationKey.RoleInfoId), value: role.id, inline: true },
        { name: t(TranslationKey.RoleInfoColor), value: role.hexColor, inline: true },
        { name: t(TranslationKey.RoleInfoPosition), value: String(role.position), inline: true },
        { name: t(TranslationKey.RoleInfoMembers), value: String(role.members.size), inline: true },
        {
          name: t(TranslationKey.RoleInfoMentionable),
          value: role.mentionable ? t(TranslationKey.CommonYes) : t(TranslationKey.CommonNo),
          inline: true,
        },
        {
          name: t(TranslationKey.RoleInfoHoisted),
          value: role.hoist ? t(TranslationKey.CommonYes) : t(TranslationKey.CommonNo),
          inline: true,
        },
        {
          name: t(TranslationKey.RoleInfoCreatedAt),
          value: DateUtil.toDiscordTimestamp(role.createdTimestamp, "F"),
          inline: true,
        },
      );
  }

  public buildChannelInfoEmbed(channel: GuildBasedChannel, t: TranslationFn): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor(null)
      .setTitle(channel.name)
      .setFooter({ text: channel.id })
      .addFields(
        { name: t(TranslationKey.ChannelInfoId), value: channel.id, inline: true },
        { name: t(TranslationKey.ChannelInfoType), value: this.getChannelTypeLabel(channel.type, t), inline: true },
        {
          name: t(TranslationKey.ChannelInfoCreatedAt),
          value: DateUtil.toDiscordTimestamp(channel.createdTimestamp ?? Date.now(), "F"),
          inline: true,
        },
      );

    if (channel.parent) {
      embed.addFields({ name: t(TranslationKey.ChannelInfoCategory), value: channel.parent.name, inline: true });
    }

    if ("topic" in channel && channel.topic) {
      embed.addFields({ name: t(TranslationKey.ChannelInfoTopic), value: channel.topic });
    }

    return embed;
  }

  public async createChannelInvite(
    channel: TextChannel | NewsChannel | VoiceChannel | StageChannel | ForumChannel | MediaChannel,
  ): Promise<string> {
    const invite = await channel.createInvite({
      maxAge: 7 * 24 * 60 * 60,
      maxUses: 0,
      unique: false,
    });

    return invite.url;
  }

  private getChannelTypeLabel(type: ChannelType, t: TranslationFn): string {
    const labelKeyByType: Partial<Record<ChannelType, TranslationKey>> = {
      [ChannelType.GuildText]: TranslationKey.ChannelInfoTypeText,
      [ChannelType.GuildVoice]: TranslationKey.ChannelInfoTypeVoice,
      [ChannelType.GuildCategory]: TranslationKey.ChannelInfoTypeCategory,
      [ChannelType.GuildAnnouncement]: TranslationKey.ChannelInfoTypeAnnouncement,
      [ChannelType.GuildForum]: TranslationKey.ChannelInfoTypeForum,
      [ChannelType.GuildStageVoice]: TranslationKey.ChannelInfoTypeStage,
    };

    const labelKey = labelKeyByType[type];
    return labelKey ? t(labelKey) : String(type);
  }
}
