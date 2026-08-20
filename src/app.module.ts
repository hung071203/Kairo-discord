import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { IntentsBitField } from "discord.js";
import { NecordModule } from "necord";
import { NecordLocalizationModule, UserResolver } from "@necord/localization";
import { env } from "@lib/configs/env.config";
import { localizationAdapter } from "@lib/i18n";
import { DiscordExceptionFilter } from "@lib/filters/discord-exception.filter";
import { NecordLoggingInterceptor } from "@lib/interceptors/necord-logging.interceptor";
import { DatabaseModule } from "@lib/database/database.module";
import { ModLogModule } from "@lib/mod-log/mod-log.module";
import { PaginationModule } from "@lib/pagination/pagination.module";
import { AutomodModule } from "./modules/automod/automod.module";
import { MediaModule } from "./modules/media/media.module";
import { ModerationModule } from "./modules/moderation/moderation.module";
import { UtilityModule } from "./modules/utility/utility.module";

@Module({
  imports: [
    NecordModule.forRoot({
      token: env.DISCORD_TOKEN,
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildModeration,
        IntentsBitField.Flags.GuildExpressions,
        IntentsBitField.Flags.GuildIntegrations,
        IntentsBitField.Flags.GuildWebhooks,
        IntentsBitField.Flags.GuildInvites,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildMessageTyping,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.DirectMessageReactions,
        IntentsBitField.Flags.DirectMessageTyping,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildScheduledEvents,
        IntentsBitField.Flags.AutoModerationConfiguration,
        IntentsBitField.Flags.AutoModerationExecution,
        IntentsBitField.Flags.GuildMessagePolls,
        IntentsBitField.Flags.DirectMessagePolls,
      ],
      development: env.DISCORD_DEV_GUILD_IDS ?? false,
    }),
    NecordLocalizationModule.forRoot({
      resolvers: UserResolver,
      adapter: localizationAdapter,
    }),
    DatabaseModule,
    ModLogModule,
    PaginationModule,
    UtilityModule,
    ModerationModule,
    MediaModule,
    AutomodModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: DiscordExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: NecordLoggingInterceptor },
  ],
})
export class AppModule {}
