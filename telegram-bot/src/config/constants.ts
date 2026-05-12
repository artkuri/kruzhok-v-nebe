export const MENU_BUTTONS = {
  schedule: "📅 Расписание",
  children: "👶 Мои дети",
  book: "📝 Записаться",
  bookings: "📚 Мои записи",
  subscription: "💳 Абонемент",
  cancel: "❌ Отменить запись",
} as const;

export const BOOKING_STATUS_ACTIVE = ["PENDING", "CONFIRMED"] as const;
export const SUBSCRIPTION_LESSONS = 8;
export const CANCELLATION_DEADLINE_HOURS = 3;
