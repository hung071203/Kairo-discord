import type { Command } from "@lib/interfaces/command.interface.js";
import type { BotEvent } from "@lib/interfaces/event.interface.js";
import { banCommand } from "./commands/ban.js";
import { kickCommand } from "./commands/kick.js";
import { warnCommand } from "./commands/warn.js";
import { timeoutCommand } from "./commands/timeout.js";
import { logDeletedMessageEvent } from "./events/logDeletedMessage.js";

export const moderationCommands: Command[] = [
  banCommand,
  kickCommand,
  warnCommand,
  timeoutCommand,
];
export const moderationEvents: BotEvent[] = [logDeletedMessageEvent];
