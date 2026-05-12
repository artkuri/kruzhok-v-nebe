import { UserDto } from "../dto";
import { env } from "../config/env";
import { UserRepository } from "../repositories/user.repository";

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) {
    return `7${digits.slice(1)}`;
  }
  return digits;
}

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  sanitizePhone(rawPhone: string): string {
    const phone = normalizePhone(rawPhone);
    if (phone.length < 11 || phone.length > 15) {
      throw new Error("Введите номер в формате +79991234567.");
    }
    return phone;
  }

  async requestCode(phone: string) {
    const normalizedPhone = this.sanitizePhone(phone);
    const user = await this.userRepository.findByPhone(normalizedPhone);

    if (!user) {
      throw new Error("Пользователь с таким номером не найден.");
    }

    return {
      phone: normalizedPhone,
      code: env.authMockCode,
    };
  }

  async verifyCode(input: { phone: string; code: string; telegramId: string }): Promise<UserDto> {
    if (input.code.trim() !== env.authMockCode) {
      throw new Error("Неверный код подтверждения.");
    }

    const user = await this.userRepository.findByPhone(input.phone);
    if (!user) {
      throw new Error("Пользователь не найден.");
    }

    return this.userRepository.linkTelegram(user.id, input.telegramId);
  }

  async findByTelegramId(telegramId: string): Promise<UserDto | null> {
    return this.userRepository.findByTelegramId(telegramId);
  }
}
