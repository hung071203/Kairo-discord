export const APP_REGEX = {
  HEX_COLOR: /^#[0-9a-fA-F]{6}$/,
};

/** Sentinel moderator/actor id used when the real actor can't be determined (e.g. audit log lookup failed). */
export const UNKNOWN_ACTOR_ID = "unknown";

/** How long to wait before reading Discord's audit log, giving it time to populate after an action. */
export const AUDIT_LOG_WAIT_MS = 1200;
