import { Global, Module } from "@nestjs/common";
import { ModLogService } from "./mod-log.service";

@Global()
@Module({
  providers: [ModLogService],
  exports: [ModLogService],
})
export class ModLogModule {}
