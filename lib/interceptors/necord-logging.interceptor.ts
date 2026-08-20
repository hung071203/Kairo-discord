import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { NecordBaseDiscovery, NecordExecutionContext } from "necord";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

interface InteractionLike {
  user?: { tag?: string };
  guild?: { name?: string } | null;
  guildId?: string | null;
}

@Injectable()
export class NecordLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("Necord");

  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType<string>() !== "necord") {
      return next.handle();
    }

    const necordContext = NecordExecutionContext.create(context);
    const discovery = necordContext.getDiscovery();
    const [interaction] = necordContext.getContext<[InteractionLike]>();

    const label = this.describeDiscovery(discovery);
    const actor = interaction?.user?.tag ?? "unknown";
    const location = interaction?.guild?.name ?? interaction?.guildId ?? "DM";

    this.logger.log(`${label} — ${actor} @ ${location}`);

    const startedAt = Date.now();
    return next.handle().pipe(
      tap({
        next: () => this.logger.debug(`${label} completed in ${Date.now() - startedAt}ms`),
        error: (error) => this.logger.debug(`${label} failed after ${Date.now() - startedAt}ms: ${error}`),
      }),
    );
  }

  private describeDiscovery(discovery: NecordBaseDiscovery): string {
    if (discovery.isSlashCommand() || discovery.isContextMenu() || discovery.isTextCommand()) {
      return `Command:${discovery.getName()}`;
    }
    if (discovery.isMessageComponent()) {
      return `Component:${discovery.getCustomId()}`;
    }
    if (discovery.isModal()) {
      return `Modal:${discovery.getCustomId()}`;
    }
    return "Interaction";
  }
}
