export interface UserDto {
  id: string;
  name: string;
  phone: string | null;
  familyId: string | null;
  telegramId: string | null;
}

export interface ChildDto {
  id: string;
  name: string;
  birthDate: Date | null;
}

export interface LessonDto {
  id: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  remainingSeats: number;
  maxStudents: number;
}

export interface BookingDto {
  id: string;
  childId: string;
  childName: string;
  lessonId: string;
  lessonTitle: string;
  startsAt: Date;
  status: "PENDING" | "CONFIRMED";
  hasSubscriptionUsage: boolean;
}

export interface SubscriptionDto {
  id: string;
  type: string;
  totalClasses: number;
  usedClasses: number;
  remainingClasses: number;
  validUntil: Date;
  isActive: boolean;
}
