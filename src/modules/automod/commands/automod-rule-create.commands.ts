import { Injectable } from "@nestjs/common";
import { CurrentTranslate, localizationMapByKey, TranslationFn } from "@necord/localization";
import { ModActionType } from "@prisma/client";
import { Guild } from "discord.js";
import { Context, Options, SlashCommandContext, Subcommand } from "necord";
import { TranslationKey } from "@lib/common/translationKey.common";
import { ModLogService } from "@lib/mod-log/mod-log.service";
import { AutomodKeywordDto } from "../dto/automod-keyword.dto";
import { AutomodMemberProfileDto } from "../dto/automod-member-profile.dto";
import { AutomodMentionSpamDto } from "../dto/automod-mention-spam.dto";
import { AutomodPresetDto } from "../dto/automod-preset.dto";
import { AutomodSpamDto } from "../dto/automod-spam.dto";
import { AutomodRuleGroup } from "./automod-rule.commands";
import { AutomodService } from "../services/automod.service";

@Injectable()
@AutomodRuleGroup({
  name: "create",
  description: "Create a new AutoMod rule",
  nameLocalizations: localizationMapByKey(TranslationKey.AutomodRuleCreateGroupName),
  descriptionLocalizations: localizationMapByKey(TranslationKey.AutomodRuleCreateGroupDescription),
})
export class AutomodRuleCreateCommands {
  constructor(
    private readonly automodService: AutomodService,
    private readonly modLogService: ModLogService,
  ) {}

  @Subcommand({
    name: "keyword",
    description: "Block messages containing specific keywords",
    nameLocalizations: localizationMapByKey(TranslationKey.AutomodKeywordSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.AutomodKeywordSubDescription),
  })
  public async keyword(
    @Context() [interaction]: SlashCommandContext,
    @Options() { name, keywords, alertChannel, timeoutMinutes }: AutomodKeywordDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const rule = await this.automodService.createKeywordRule(interaction.guild!, {
      name,
      keywords: this.splitKeywords(keywords),
      alertChannel,
      timeoutMinutes,
    });
    await this.logCreated(interaction.guild!, rule.name, interaction.user.id, t);
    return interaction.reply(t(TranslationKey.AutomodRuleCreatedReply, { name: rule.name }));
  }

  @Subcommand({
    name: "preset",
    description: "Block messages using Discord's built-in word lists",
    nameLocalizations: localizationMapByKey(TranslationKey.AutomodPresetSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.AutomodPresetSubDescription),
  })
  public async preset(
    @Context() [interaction]: SlashCommandContext,
    @Options() { name, profanity, sexualContent, slurs, alertChannel, timeoutMinutes }: AutomodPresetDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const rule = await this.automodService.createPresetRule(interaction.guild!, {
      name,
      profanity: profanity ?? true,
      sexualContent: sexualContent ?? true,
      slurs: slurs ?? true,
      alertChannel,
      timeoutMinutes,
    });
    await this.logCreated(interaction.guild!, rule.name, interaction.user.id, t);
    return interaction.reply(t(TranslationKey.AutomodRuleCreatedReply, { name: rule.name }));
  }

  @Subcommand({
    name: "mention-spam",
    description: "Block messages that mention too many users/roles",
    nameLocalizations: localizationMapByKey(TranslationKey.AutomodMentionSpamSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.AutomodMentionSpamSubDescription),
  })
  public async mentionSpam(
    @Context() [interaction]: SlashCommandContext,
    @Options() { name, mentionLimit, raidProtection, alertChannel, timeoutMinutes }: AutomodMentionSpamDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const rule = await this.automodService.createMentionSpamRule(interaction.guild!, {
      name,
      mentionLimit,
      raidProtection: raidProtection ?? true,
      alertChannel,
      timeoutMinutes,
    });
    await this.logCreated(interaction.guild!, rule.name, interaction.user.id, t);
    return interaction.reply(t(TranslationKey.AutomodRuleCreatedReply, { name: rule.name }));
  }

  @Subcommand({
    name: "spam",
    description: "Block messages Discord's spam classifier detects as spam",
    nameLocalizations: localizationMapByKey(TranslationKey.AutomodSpamSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.AutomodSpamSubDescription),
  })
  public async spam(
    @Context() [interaction]: SlashCommandContext,
    @Options() { name, alertChannel }: AutomodSpamDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const rule = await this.automodService.createSpamRule(interaction.guild!, { name, alertChannel });
    await this.logCreated(interaction.guild!, rule.name, interaction.user.id, t);
    return interaction.reply(t(TranslationKey.AutomodRuleCreatedReply, { name: rule.name }));
  }

  @Subcommand({
    name: "member-profile",
    description: "Block members whose nickname/bio contains specific keywords",
    nameLocalizations: localizationMapByKey(TranslationKey.AutomodMemberProfileSubName),
    descriptionLocalizations: localizationMapByKey(TranslationKey.AutomodMemberProfileSubDescription),
  })
  public async memberProfile(
    @Context() [interaction]: SlashCommandContext,
    @Options() { name, keywords, alertChannel }: AutomodMemberProfileDto,
    @CurrentTranslate() t: TranslationFn,
  ) {
    const rule = await this.automodService.createMemberProfileRule(interaction.guild!, {
      name,
      keywords: this.splitKeywords(keywords),
      alertChannel,
    });
    await this.logCreated(interaction.guild!, rule.name, interaction.user.id, t);
    return interaction.reply(t(TranslationKey.AutomodRuleCreatedReply, { name: rule.name }));
  }

  private async logCreated(guild: Guild, ruleName: string, moderatorId: string, t: TranslationFn): Promise<void> {
    const action = await this.modLogService.record({
      guildId: guild.id,
      actionType: ModActionType.AUTOMOD_RULE_CREATE,
      targetId: ruleName,
      moderatorId,
    });
    await this.modLogService.logToChannel(guild, action, t);
  }

  private splitKeywords(keywords: string): string[] {
    return keywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);
  }
}
