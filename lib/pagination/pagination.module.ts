import { Global, Module } from "@nestjs/common";
import { PaginatorComponents } from "./paginator.components";
import { PaginatorService } from "./paginator.service";

@Global()
@Module({
  providers: [PaginatorComponents, PaginatorService],
  exports: [PaginatorService],
})
export class PaginationModule {}
