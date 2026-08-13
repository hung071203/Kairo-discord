export class DateUtil {
  static toUnixSeconds(date: Date): number {
    return Math.floor(date.getTime() / 1000);
  }

  static toDiscordRelative(date: Date): string {
    return `<t:${DateUtil.toUnixSeconds(date)}:R>`;
  }
}
