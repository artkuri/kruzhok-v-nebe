"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
function line(level, message, meta) {
    const extra = meta ? ` ${JSON.stringify(meta)}` : "";
    return `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}${extra}`;
}
exports.logger = {
    info(message, meta) {
        console.log(line("info", message, meta));
    },
    warn(message, meta) {
        console.warn(line("warn", message, meta));
    },
    error(message, meta) {
        console.error(line("error", message, meta));
    },
};
