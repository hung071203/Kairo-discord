import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { fallbackLocale, localizationAdapter } from "@lib/i18n";
import { TranslationKey } from "@lib/common/translationKey.common";

export interface PaginatorPage {
  embed: EmbedBuilder;
  components?: ActionRowBuilder<MessageActionRowComponentBuilder>[];
}

interface PaginatorSession {
  authorId: string;
  pages: PaginatorPage[];
  index: number;
}

export interface PaginatorPayload {
  embeds: EmbedBuilder[];
  components: ActionRowBuilder<MessageActionRowComponentBuilder>[];
}

const SESSION_TTL_MS = 10 * 60 * 1000;
const ACTIONS = ["first", "prev", "next", "last"] as const;
type PaginatorAction = (typeof ACTIONS)[number];

@Injectable()
export class PaginatorService {
  private readonly sessions = new Map<string, PaginatorSession>();

  public createPaginator(authorId: string, pages: PaginatorPage[]): PaginatorPayload {
    if (pages.length <= 1) {
      return { embeds: [pages[0].embed], components: pages[0].components ?? [] };
    }

    const sessionId = randomUUID();
    this.sessions.set(sessionId, { authorId, pages, index: 0 });
    setTimeout(() => this.sessions.delete(sessionId), SESSION_TTL_MS);

    return this.renderPayload(sessionId, pages, 0);
  }

  public async handleAction(interaction: ButtonInteraction, action: string, sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    const locale = interaction.locale ?? fallbackLocale;

    if (!session) {
      await interaction.reply({
        content: localizationAdapter.getTranslation(TranslationKey.PaginatorExpired, locale),
        ephemeral: true,
      });
      return;
    }

    if (session.authorId !== interaction.user.id) {
      await interaction.reply({
        content: localizationAdapter.getTranslation(TranslationKey.PaginatorNotOwner, locale),
        ephemeral: true,
      });
      return;
    }

    session.index = this.resolveIndex(action as PaginatorAction, session.index, session.pages.length);

    const payload = this.renderPayload(sessionId, session.pages, session.index);
    await interaction.update(payload);
  }

  private renderPayload(sessionId: string, pages: PaginatorPage[], index: number): PaginatorPayload {
    const page = pages[index];

    return {
      embeds: [page.embed],
      components: [...(page.components ?? []), this.buildNavRow(sessionId, index, pages.length)],
    };
  }

  private resolveIndex(action: PaginatorAction, current: number, total: number): number {
    switch (action) {
      case "first":
        return 0;
      case "prev":
        return Math.max(0, current - 1);
      case "next":
        return Math.min(total - 1, current + 1);
      case "last":
        return total - 1;
    }
  }

  private buildNavRow(sessionId: string, index: number, total: number): ActionRowBuilder<ButtonBuilder> {
    const isFirst = index === 0;
    const isLast = index === total - 1;

    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`paginator/first/${sessionId}`)
        .setEmoji("⏮")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(isFirst),
      new ButtonBuilder()
        .setCustomId(`paginator/prev/${sessionId}`)
        .setEmoji("◀")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(isFirst),
      new ButtonBuilder()
        .setCustomId(`paginator/indicator/${sessionId}`)
        .setLabel(`${index + 1}/${total}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId(`paginator/next/${sessionId}`)
        .setEmoji("▶")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(isLast),
      new ButtonBuilder()
        .setCustomId(`paginator/last/${sessionId}`)
        .setEmoji("⏭")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(isLast),
    );
  }
}
