import { Global, Module } from "@nestjs/common";
import { ModLogService } from "./mod-log.service";
import { PendingModActionRegistry } from "./pending-mod-action.registry";

@Global()
@Module({
  providers: [ModLogService, PendingModActionRegistry],
  exports: [ModLogService, PendingModActionRegistry],
})
export class ModLogModule {}
