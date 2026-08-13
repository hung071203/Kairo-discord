import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { DiscordAPIError, RESTJSONErrorCodes } from "discord.js";
import { NecordArgumentsHost } from "necord";
import { fallbackLocale, localizationAdapter } from "@lib/i18n";
import { TranslationKey } from "@lib/common/translationKey.common";

interface RepliableLike {
  locale?: string;
  isRepliable?: () => boolean;
  deferred?: boolean;
  replied?: boolean;
  reply: (options: { content: string; ephemeral: boolean }) => Promise<unknown>;
  editReply: (options: { content: string }) => Promise<unknown>;
}

@Catch()
export class DiscordExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DiscordExceptionFilter.name);

  public async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    if (host.getType<string>() !== "necord") {
      throw exception;
    }

    this.logger.error(exception instanceof Error ? exception.stack : exception);

    const [interaction] =
      NecordArgumentsHost.create(host).getContext<[RepliableLike]>();

    if (
      typeof interaction?.isRepliable !== "function" ||
      !interaction.isRepliable()
    ) {
      return;
    }

    const locale = interaction.locale ?? fallbackLocale;
    const message = localizationAdapter.getTranslation(
      this.resolveMessageKey(exception),
      locale,
    );

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content: message });
    } else {
      await interaction.reply({ content: message, ephemeral: true });
    }
  }

  private resolveMessageKey(exception: unknown): TranslationKey {
    if (exception instanceof DiscordAPIError) {
      if (exception.code === RESTJSONErrorCodes.MissingPermissions) {
        return TranslationKey.ErrorMissingPermissions;
      }
      if (exception.code === RESTJSONErrorCodes.MissingAccess) {
        return TranslationKey.ErrorMissingAccess;
      }
    }

    return TranslationKey.ErrorUnexpected;
  }
}
