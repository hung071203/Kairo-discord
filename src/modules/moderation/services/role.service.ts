import { Injectable } from "@nestjs/common";
import { TranslationFn } from "@necord/localization";
import { EmbedBuilder, Guild, Role } from "discord.js";
import { PaginatorPage } from "@lib/pagination/paginator.service";
import { TranslationKey } from "@lib/common/translationKey.common";

@Injectable()
export class RoleService {
  private static readonly ROLES_PER_PAGE = 15;

  public buildRoleListPages(guild: Guild, t: TranslationFn): PaginatorPage[] {
    const title = t(TranslationKey.RoleListTitle);

    const roles = [...guild.roles.cache.values()]
      .filter((role) => role.id !== guild.id)
      .sort((a, b) => b.position - a.position);

    if (roles.length === 0) {
      return [{ embed: new EmbedBuilder().setColor(null).setTitle(title).setDescription(t(TranslationKey.RoleListEmpty)) }];
    }

    const chunks = this.chunk(roles, RoleService.ROLES_PER_PAGE);

    return chunks.map((chunk, chunkIndex) => {
      const lines = chunk.map((role, i) =>
        t(TranslationKey.RoleListEntry, {
          index: String(chunkIndex * RoleService.ROLES_PER_PAGE + i + 1),
          role: role.toString(),
          position: String(role.position),
          color: role.hexColor,
          count: String(role.members.size),
        }),
      );

      return { embed: new EmbedBuilder().setColor(null).setTitle(title).setDescription(lines.join("\n")) };
    });
  }

  private chunk(roles: Role[], size: number): Role[][] {
    const chunks: Role[][] = [];

    for (let i = 0; i < roles.length; i += size) {
      chunks.push(roles.slice(i, i + size));
    }

    return chunks;
  }
}
