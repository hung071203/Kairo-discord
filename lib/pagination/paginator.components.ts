import { Injectable } from "@nestjs/common";
import { Button, ButtonContext, ComponentParam, Context } from "necord";
import { PaginatorService } from "./paginator.service";

@Injectable()
export class PaginatorComponents {
  constructor(private readonly paginatorService: PaginatorService) {}

  @Button("paginator/:action/:sessionId")
  public async onPaginate(
    @Context() [interaction]: ButtonContext,
    @ComponentParam("action") action: string,
    @ComponentParam("sessionId") sessionId: string,
  ) {
    await this.paginatorService.handleAction(interaction, action, sessionId);
  }
}
