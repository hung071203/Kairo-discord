import { Module } from "@nestjs/common";
import { ModerationCommands } from "./moderation.commands";
import { ModerationService } from "./services/moderation.service";
import { WarnCommands } from "./warn.commands";
import { WarnService } from "./services/warn.service";

@Module({
  providers: [ModerationCommands, ModerationService, WarnCommands, WarnService],
})
export class ModerationModule {}
