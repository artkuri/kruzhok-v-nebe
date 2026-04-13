"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import {
  Palette,
  LogOut,
  Menu,
  LayoutDashboard,
  Calendar,
  CalendarDays,
  ClipboardList,
  Users,
  Baby,
  CreditCard,
  Banknote,
  GraduationCap,
  Settings,
  CalendarCheck,
  History,
  User,
  BookOpen,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarNav } from "./sidebar-nav";

// Nav items defined here (Client Component) — icons never cross server/client boundary
const NAV_BY_ROLE = {
  ADMIN: [
    { href: "/admin/dashboard",     label: "Дашборд",       icon: LayoutDashboard },
    { href: "/admin/schedule",      label: "Расписание",    icon: Calendar },
    { href: "/admin/classes",       label: "Занятия",       icon: CalendarDays },
    { href: "/admin/bookings",      label: "Записи",        icon: ClipboardList },
    { href: "/admin/clients",       label: "Клиенты",       icon: Users },
    { href: "/admin/children",      label: "Дети",          icon: Baby },
    { href: "/admin/subscriptions", label: "Абонементы",    icon: CreditCard },
    { href: "/admin/payments",      label: "Оплаты",        icon: Banknote },
    { href: "/admin/teachers",      label: "Педагоги",      icon: GraduationCap },
    { href: "/admin/prices",        label: "Цены",          icon: Tag },
    { href: "/admin/settings",      label: "Настройки",     icon: Settings },
  ],
  CLIENT: [
    { href: "/cabinet/schedule",      label: "Расписание",         icon: Calendar },
    { href: "/cabinet/bookings",      label: "Мои записи",         icon: CalendarCheck },
    { href: "/cabinet/subscriptions", label: "Абонементы",         icon: CreditCard },
    { href: "/cabinet/children",      label: "Мои дети",           icon: Users },
    { href: "/cabinet/history",       label: "История посещений",  icon: History },
    { href: "/cabinet/profile",       label: "Профиль",            icon: User },
  ],
  TEACHER: [
    { href: "/teacher/schedule", label: "Моё расписание", icon: Calendar },
    { href: "/teacher/classes",  label: "Мои занятия",    icon: BookOpen },
  ],
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: "ADMIN" | "CLIENT" | "TEACHER";
  userName: string;
}

export function DashboardLayout({ children, userRole, userName }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navItems = NAV_BY_ROLE[userRole] ?? [];

  const roleLabel = {
    CLIENT:  "Личный кабинет",
    ADMIN:   "Администратор",
    TEACHER: "Педагог",
  }[userRole];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-gray-100 transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-4 border-b border-gray-100">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shrink-0">
            <Palette className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Кружок в небе</p>
            <p className="text-xs text-gray-500">{roleLabel}</p>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto p-3">
          <SidebarNav items={navItems} />
        </div>

        {/* User footer */}
        <div className="border-t border-gray-100 p-3">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-sm font-semibold text-brand-700 shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700 truncate flex-1">{userName}</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-white border-b border-gray-100 px-4 sm:px-6">
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
            aria-label="Открыть меню"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
