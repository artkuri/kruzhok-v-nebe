"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const env_1 = require("../config/env");
function normalizePhone(phone) {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("8")) {
        return `7${digits.slice(1)}`;
    }
    return digits;
}
class AuthService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    sanitizePhone(rawPhone) {
        const phone = normalizePhone(rawPhone);
        if (phone.length < 11 || phone.length > 15) {
            throw new Error("Введите номер в формате +79991234567.");
        }
        return phone;
    }
    async requestCode(phone) {
        const normalizedPhone = this.sanitizePhone(phone);
        const user = await this.userRepository.findByPhone(normalizedPhone);
        if (!user) {
            throw new Error("Пользователь с таким номером не найден.");
        }
        return {
            phone: normalizedPhone,
            code: env_1.env.authMockCode,
        };
    }
    async verifyCode(input) {
        if (input.code.trim() !== env_1.env.authMockCode) {
            throw new Error("Неверный код подтверждения.");
        }
        const user = await this.userRepository.findByPhone(input.phone);
        if (!user) {
            throw new Error("Пользователь не найден.");
        }
        return this.userRepository.linkTelegram(user.id, input.telegramId);
    }
    async findByTelegramId(telegramId) {
        return this.userRepository.findByTelegramId(telegramId);
    }
}
exports.AuthService = AuthService;
