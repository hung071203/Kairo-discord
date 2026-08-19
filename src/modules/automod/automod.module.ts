import { Module } from "@nestjs/common";
import { AutomodExecutionListener } from "./automod-execution.listener";
import { AutomodRuleCreateCommands } from "./automod-rule-create.commands";
import { AutomodRuleCommands } from "./automod-rule.commands";
import { AutomodService } from "./services/automod.service";

@Module({
  providers: [AutomodRuleCommands, AutomodRuleCreateCommands, AutomodExecutionListener, AutomodService],
})
export class AutomodModule {}
