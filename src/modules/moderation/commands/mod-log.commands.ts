import { Injectable } from "@nestjs/common";
import { CurrentTranslate, localizationMapByKey, TranslationFn } from "@necord/localization";
import { PermissionFlagsBits } from "discord.js";
import { Context, createCommandGroupDecorator, Options, SlashCommandContext, Subcommand } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";
import { ModLogService } from "@lib/mod-log/mod-log.service";
import { PaginatorService } from "@lib/pagination/paginator.service";
import { ModLogListDto } from "../dto/mod-log-list.dto";
import { ModLogSetChannelDto } from "../dto/mod-log-set-channel.dto";

export const ModLogGroup = createCommandGroupDecorator({
  name: "modlog",
  description: "Configure and view the moderation action log",
  dmPermission: false,
  defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
  nameLocalizations: localizationMapByKey(TranslationKey.ModLogGroupName),
  descriptionLocalizations: localizationMapByKey(TranslationKey.ModLogGroupDescription),
});

@Injectable()
@ModLogGroup()
export class ModLogCommands {
  constructor(
    private readonly modLogService: ModLogService,
    private readonly paginatorService: PaginatorService,
  ) {}

  @Subcommand({
    name: "set-channel",
    description: "Set the channel where all moderation actions get logged",
    nameLocalizations: localizationMapByKey(TranslationKey.ModLogSetChannelSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.ModLogSetChannelSubDescription),
  })
  public async setChannel(
    @Context() [interaction]: SlashCommandContext,
    @Options() { channel }: ModLogSetChannelDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    await this.modLogService.setLogChannel(interaction.guildId!, channel.id);
    return interaction.reply(t(TranslationKey.ModLogSetChannelReply, { channel: channel.toString() }));
  }

  @Subcommand({
    name: "list",
    description: "Show the moderation action history for this server",
    nameLocalizations: localizationMapByKey(TranslationKey.ModLogListSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.ModLogListSubDescription),
  })
  public async list(
    @Context() [interaction]: SlashCommandContext,
    @Options() { member }: ModLogListDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const actions = await this.modLogService.listActions(interaction.guildId!, member?.id);
    const pages = this.modLogService.buildActionsPages(actions, t);
    const payload = this.paginatorService.createPaginator(interaction.user.id, pages);
    return interaction.reply(payload);
  }
}
