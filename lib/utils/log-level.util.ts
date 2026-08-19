import { LogLevel } from "@nestjs/common";

const LOG_LEVELS_BY_VERBOSITY: LogLevel[] = ["error", "warn", "log", "debug", "verbose"];

export function resolveLogLevels(minLevel: LogLevel): LogLevel[] {
  const cutoff = LOG_LEVELS_BY_VERBOSITY.indexOf(minLevel);
  return LOG_LEVELS_BY_VERBOSITY.slice(0, cutoff + 1);
}
