import { Module } from "@nestjs/common";
import { UtilityCommands } from "./commands/utility.commands";
import { UtilityService } from "./services/utility.service";

@Module({
  providers: [UtilityCommands, UtilityService],
})
export class UtilityModule {}
