import { Module } from "@nestjs/common";
import { AutomodConfigListener } from "./listeners/automod-config.listener";
import { AutomodExecutionListener } from "./listeners/automod-execution.listener";
import { AutomodRuleCreateCommands } from "./commands/automod-rule-create.commands";
import { AutomodRuleCommands } from "./commands/automod-rule.commands";
import { AutomodService } from "./services/automod.service";

@Module({
  providers: [
    AutomodRuleCommands,
    AutomodRuleCreateCommands,
    AutomodExecutionListener,
    AutomodConfigListener,
    AutomodService,
  ],
})
export class AutomodModule {}
