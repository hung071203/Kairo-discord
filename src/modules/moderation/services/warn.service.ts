import { Injectable } from "@nestjs/common";
import { TranslationFn } from "@necord/localization";
import { Warning } from "@prisma/client";
import {
  ActionRowBuilder,
  EmbedBuilder,
  Guild,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { PrismaService } from "@lib/database/prisma.service";
import { PaginatorPage } from "@lib/pagination/paginator.service";
import { TranslationKey } from "@lib/common/translationKey.common";
import { DateUtil } from "@lib/utils/date.util";

export interface WarningSummary {
  userId: string;
  count: number;
}

@Injectable()
export class WarnService {
  private static readonly WARNINGS_PER_PAGE = 5;
  private static readonly SUMMARIES_PER_PAGE = 10;

  constructor(private readonly prisma: PrismaService) {}

  public async createWarning(
    guildId: string,
    userId: string,
    moderatorId: string,
    reason: string,
  ): Promise<Warning> {
    return this.prisma.warning.create({
      data: { guildId, userId, moderatorId, reason },
    });
  }

  public async listWarnings(guildId: string, userId: string): Promise<Warning[]> {
    return this.prisma.warning.findMany({
      where: { guildId, userId },
      orderBy: { createdAt: "desc" },
    });
  }

  public async listGuildWarningSummaries(guildId: string): Promise<WarningSummary[]> {
    const grouped = await this.prisma.warning.groupBy({
      by: ["userId"],
      where: { guildId },
      _count: { userId: true },
      orderBy: { _count: { userId: "desc" } },
    });

    return grouped.map((group) => ({ userId: group.userId, count: group._count.userId }));
  }

  public buildWarningsPages(username: string, warnings: Warning[], t: TranslationFn): PaginatorPage[] {
    const title = t(TranslationKey.WarningsTitle, { username });

    if (warnings.length === 0) {
      return [
        {
          embed: new EmbedBuilder().setColor(null).setTitle(title).setDescription(t(TranslationKey.WarningsEmpty)),
        },
      ];
    }

    const chunks = this.chunk(warnings, WarnService.WARNINGS_PER_PAGE);

    return chunks.map((chunk, chunkIndex) => ({
      embed: new EmbedBuilder()
        .setColor(null)
        .setTitle(title)
        .addFields(
          chunk.map((warning, i) => {
            const index = chunkIndex * WarnService.WARNINGS_PER_PAGE + i;
            return {
              name: t(TranslationKey.WarningsEntryName, {
                index: String(index + 1),
                date: DateUtil.toDiscordTimestamp(warning.createdAt, "f"),
              }),
              value: t(TranslationKey.WarningsEntryValue, {
                moderator: `<@${warning.moderatorId}>`,
                reason: warning.reason,
              }),
            };
          }),
        ),
    }));
  }

  public async buildGuildWarningsPages(
    guild: Guild,
    summaries: WarningSummary[],
    t: TranslationFn,
  ): Promise<PaginatorPage[]> {
    const title = t(TranslationKey.WarningsAllTitle);

    if (summaries.length === 0) {
      return [{ embed: new EmbedBuilder().setColor(null).setTitle(title).setDescription(t(TranslationKey.WarningsAllEmpty)) }];
    }

    const chunks = this.chunk(summaries, WarnService.SUMMARIES_PER_PAGE);

    return Promise.all(
      chunks.map(async (chunk, chunkIndex) => {
        const users = await Promise.all(
          chunk.map((summary) => guild.client.users.fetch(summary.userId).catch(() => null)),
        );

        const lines = chunk.map((summary, i) =>
          t(TranslationKey.WarningsAllEntry, {
            index: String(chunkIndex * WarnService.SUMMARIES_PER_PAGE + i + 1),
            target: `<@${summary.userId}>`,
            count: String(summary.count),
          }),
        );

        const select = new StringSelectMenuBuilder()
          .setCustomId("warnings-all/select")
          .setPlaceholder(t(TranslationKey.WarningsAllSelectPlaceholder))
          .addOptions(
            chunk.map((summary, i) =>
              new StringSelectMenuOptionBuilder()
                .setLabel(
                  `#${chunkIndex * WarnService.SUMMARIES_PER_PAGE + i + 1} · ${users[i]?.username ?? summary.userId}`,
                )
                .setDescription(
                  t(TranslationKey.WarningsAllSelectOptionDescription, { count: String(summary.count) }),
                )
                .setValue(summary.userId),
            ),
          );

        return {
          embed: new EmbedBuilder().setColor(null).setTitle(title).setDescription(lines.join("\n")),
          components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select)],
        };
      }),
    );
  }

  private chunk<T>(items: T[], size: number): T[][] {
    const chunks: T[][] = [];

    for (let i = 0; i < items.length; i += size) {
      chunks.push(items.slice(i, i + size));
    }

    return chunks;
  }
}
