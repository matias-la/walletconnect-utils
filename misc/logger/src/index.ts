/* eslint-disable-next-line import/no-named-default */
import { Logger, LoggerOptions } from "./utils";
export * from "./constants";
export * from "./utils";
export type { Logger } from "./utils";

export function pino(LoggerOptions): Logger {
  return console;
}
