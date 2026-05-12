"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env.local" });
dotenv_1.default.config();
function required(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
}
exports.env = {
    botToken: required("BOT_TOKEN"),
    botName: process.env.BOT_NAME ?? "@kruzhok_v_nebe_bot",
    databaseUrl: required("DATABASE_URL"),
    authMockCode: process.env.BOT_AUTH_MOCK_CODE ?? "1234",
    timezone: process.env.BOT_TIMEZONE ?? "Asia/Yekaterinburg",
};
