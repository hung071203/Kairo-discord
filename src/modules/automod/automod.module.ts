import { Module } from "@nestjs/common";
import { AutomodRuleCreateCommands } from "./automod-rule-create.commands";
import { AutomodRuleCommands } from "./automod-rule.commands";
import { AutomodService } from "./services/automod.service";

@Module({
  providers: [AutomodRuleCommands, AutomodRuleCreateCommands, AutomodService],
})
export class AutomodModule {}
