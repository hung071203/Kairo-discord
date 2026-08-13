import { Module } from "@nestjs/common";
import { UtilityCommands } from "./utility.commands";

@Module({
  providers: [UtilityCommands],
})
export class UtilityModule {}
