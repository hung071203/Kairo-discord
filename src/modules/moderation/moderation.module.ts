import { Module } from "@nestjs/common";
import { ModerationCommands } from "./commands/moderation.commands";
import { ModerationService } from "./services/moderation.service";
import { WarnCommands } from "./commands/warn.commands";
import { WarnService } from "./services/warn.service";

@Module({
  providers: [ModerationCommands, ModerationService, WarnCommands, WarnService],
})
export class ModerationModule {}
