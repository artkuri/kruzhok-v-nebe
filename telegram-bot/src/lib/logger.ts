type Meta = Record<string, unknown>;

function line(level: string, message: string, meta?: Meta): string {
  const extra = meta ? ` ${JSON.stringify(meta)}` : "";
  return `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}${extra}`;
}

export const logger = {
  info(message: string, meta?: Meta) {
    console.log(line("info", message, meta));
  },
  warn(message: string, meta?: Meta) {
    console.warn(line("warn", message, meta));
  },
  error(message: string, meta?: Meta) {
    console.error(line("error", message, meta));
  },
};
