/** Numeric limits imposed by the Discord API, reused across slash command option constraints. */
export const DISCORD_LIMITS = {
  MAX_ROLE_NAME_LENGTH: 100,
  MAX_TIMEOUT_MINUTES: 40320, // 28 days
  MAX_BAN_DELETE_MESSAGE_SECONDS: 604800, // 7 days
  MAX_PURGE_AMOUNT: 100,
  MAX_SLOWMODE_SECONDS: 21600, // 6 hours
  MAX_MENTION_LIMIT: 50,
};
