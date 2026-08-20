import { Module } from "@nestjs/common";
import { ChannelLockCommands } from "./commands/channel-lock.commands";
import { ModLogCommands } from "./commands/mod-log.commands";
import { ModerationCommands } from "./commands/moderation.commands";
import { RoleCommands } from "./commands/role.commands";
import { WarnCommands } from "./commands/warn.commands";
import { RoleConfigListener } from "./listeners/role-config.listener";
import { ModerationService } from "./services/moderation.service";
import { WarnService } from "./services/warn.service";

@Module({
  providers: [
    ModerationCommands,
    ModerationService,
    WarnCommands,
    WarnService,
    RoleCommands,
    RoleConfigListener,
    ChannelLockCommands,
    ModLogCommands,
  ],
})
export class ModerationModule {}
