import pino from "pino";

const instance = pino({
  transport: {
    target: "pino-pretty",
    options: { colorize: true, translateTime: "SYS:HH:MM:ss" },
  },
});

export class Logger {
  static info = instance.info.bind(instance);
  static warn = instance.warn.bind(instance);
  static error = instance.error.bind(instance);
  static debug = instance.debug.bind(instance);
}
