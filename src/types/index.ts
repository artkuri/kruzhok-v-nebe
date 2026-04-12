import type {
  User,
  Family,
  Child,
  Teacher,
  Direction,
  ScheduleSlot,
  ClassSession,
  Booking,
  Attendance,
  Subscription,
  SubscriptionUsage,
  Payment,
  Role,
  BookingStatus,
  SessionStatus,
  SubscriptionType,
  PaymentMethod,
  DirectionType,
} from "@prisma/client";

export type {
  User,
  Family,
  Child,
  Teacher,
  Direction,
  ScheduleSlot,
  ClassSession,
  Booking,
  Attendance,
  Subscription,
  SubscriptionUsage,
  Payment,
  Role,
  BookingStatus,
  SessionStatus,
  SubscriptionType,
  PaymentMethod,
  DirectionType,
};

// Extended types with relations
export type ClassSessionWithRelations = ClassSession & {
  direction: Direction;
  teacher: (Teacher & { user: User }) | null;
  bookings: (Booking & {
    child: Child;
    attendance: Attendance | null;
    payment: Payment | null;
    subscriptionUsage: (SubscriptionUsage & { subscription: Subscription }) | null;
  })[];
  _count?: { bookings: number };
};

export type BookingWithRelations = Booking & {
  classSession: ClassSessionWithRelations;
  child: Child;
  attendance: Attendance | null;
  payment: Payment | null;
  subscriptionUsage: (SubscriptionUsage & { subscription: Subscription }) | null;
};

export type FamilyWithRelations = Family & {
  members: User[];
  children: Child[];
  subscriptions: (Subscription & {
    usages: SubscriptionUsage[];
    payments: Payment[];
  })[];
};

export type SubscriptionWithRelations = Subscription & {
  family: Family;
  usages: (SubscriptionUsage & {
    booking: Booking & {
      classSession: ClassSession & { direction: Direction };
      child: Child;
    };
  })[];
  payments: Payment[];
};

// Auth session user
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  familyId: string | null;
}

// API response types
export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
