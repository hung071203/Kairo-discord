import { Injectable, Logger } from "@nestjs/common";
import { Context, ContextOf, On } from "necord";

@Injectable()
export class AutomodExecutionListener {
  private readonly logger = new Logger("AutoMod");

  @On("autoModerationActionExecution")
  public onActionExecution(@Context() [execution]: ContextOf<"autoModerationActionExecution">) {
    const actor = execution.user?.tag ?? execution.userId;
    const channel = execution.channelId ? `#${execution.channelId}` : "unknown channel";

    this.logger.log(
      `Rule ${execution.ruleId} triggered by ${actor} in ${channel} (${execution.guild.name}) — action: ${execution.action.type}`,
    );

    if (execution.matchedKeyword) {
      this.logger.debug(`Matched keyword: "${execution.matchedKeyword}"`);
    }
  }
}
