import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, subHours } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { ru } from "date-fns/locale";

/** Единая временная зона студии — всё время отображается и вычисляется в UTC+5 */
export const STUDIO_TZ = "Asia/Yekaterinburg";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return formatInTimeZone(new Date(date), STUDIO_TZ, "d MMMM yyyy", { locale: ru });
}

export function formatDateTime(date: Date | string): string {
  return formatInTimeZone(new Date(date), STUDIO_TZ, "d MMMM yyyy, HH:mm", { locale: ru });
}

export function formatTime(date: Date | string): string {
  return formatInTimeZone(new Date(date), STUDIO_TZ, "HH:mm");
}

export function formatDateShort(date: Date | string): string {
  return formatInTimeZone(new Date(date), STUDIO_TZ, "d MMM", { locale: ru });
}

export function formatRelative(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { locale: ru, addSuffix: true });
}

export const DAY_NAMES = ["", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
export const DAY_NAMES_FULL = [
  "",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

export function canCancelBooking(sessionStartTime: Date): boolean {
  const cutoff = subHours(sessionStartTime, 3);
  return new Date() < cutoff;
}

export function getSubscriptionPrice(type: string, includesMaterials: boolean): number {
  if (type === "DRAWING_ART_OWN" || type === "CRAFT_CERAMIC") {
    return includesMaterials ? 4800 : 3600;
  }
  return 4800;
}

export function getSingleClassPrice(directionType: string, includesMaterials: boolean): number {
  if (directionType === "DRAWING" || directionType === "ART_THERAPY") {
    return includesMaterials ? 650 : 500;
  }
  return 650; // CRAFT, CERAMICS
}

export function formatRub(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(amount);
}
