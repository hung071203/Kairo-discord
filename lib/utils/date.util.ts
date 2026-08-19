import dayjs from "dayjs";
import { DiscordTimestampStyle } from "@lib/interfaces/discord-timestamp-style.interface";

export class DateUtil {
  public static toDiscordTimestamp(date: Date | number, style: DiscordTimestampStyle = "f"): string {
    return `<t:${dayjs(date).unix()}:${style}>`;
  }

  public static toPlainDateTime(date: Date | number): string {
    return dayjs(date).format("DD/MM/YYYY HH:mm");
  }
}
