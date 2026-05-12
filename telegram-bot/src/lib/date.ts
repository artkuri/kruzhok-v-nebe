export function addDays(base: Date, days: number): Date {
  const copy = new Date(base);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function subtractHours(base: Date, hours: number): Date {
  return new Date(base.getTime() - hours * 60 * 60 * 1000);
}

export function canCancelBooking(startsAt: Date): boolean {
  return new Date() < subtractHours(startsAt, 3);
}
