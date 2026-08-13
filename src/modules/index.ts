import type { Command } from "@lib/interfaces/command.interface.js";
import type { BotEvent } from "@lib/interfaces/event.interface.js";
import { moderationCommands, moderationEvents } from "./moderation/index.js";

// Add new modules here as they're built: music, utility, game, ai...
export const allCommands: Command[] = [...moderationCommands];
export const allEvents: BotEvent[] = [...moderationEvents];
