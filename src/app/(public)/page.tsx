import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Palette, Heart, Scissors, Layers, Star, Users, Clock, MapPin } from "lucide-react";

export const metadata = {
  title: "Студия творчества для детей и взрослых",
};

const DIRECTIONS = [
  {
    icon: Palette,
    name: "Рисование",
    desc: "Живопись, акварель, графика — от азов до своего стиля",
    bg: "bg-amber-50",
    icon_color: "text-amber-500",
    border: "border-amber-100",
  },
  {
    icon: Heart,
    name: "Арт-терапия",
    desc: "Творческие занятия для эмоционального развития детей",
    bg: "bg-rose-50",
    icon_color: "text-rose-500",
    border: "border-rose-100",
  },
  {
    icon: Scissors,
    name: "Рукоделие",
    desc: "Вышивка, вязание, декупаж, скрапбукинг",
    bg: "bg-violet-50",
    icon_color: "text-violet-500",
    border: "border-violet-100",
  },
  {
    icon: Layers,
    name: "Керамика",
    desc: "Лепка из глины, гончарный круг, роспись",
    bg: "bg-emerald-50",
    icon_color: "text-emerald-500",
    border: "border-emerald-100",
  },
];

const FEATURES = [
  { icon: Users, label: "Малые группы", desc: "До 10 человек" },
  { icon: Star, label: "Опытные педагоги", desc: "Профессионалы своего дела" },
  { icon: Clock, label: "Удобное время", desc: "Вечера и выходные" },
  { icon: MapPin, label: "Центр города", desc: "Удобная локация" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-500 to-brand-600 py-16 sm:py-24">
        {/* Sun decoration */}
        <div className="absolute right-8 top-6 sm:right-16 sm:top-8 h-24 w-24 sm:h-36 sm:w-36 rounded-full bg-sun-400 shadow-lg shadow-sun-500/40 flex items-center justify-center">
          <div className="h-16 w-16 sm:h-24 sm:w-24 rounded-full bg-sun-300 opacity-60" />
        </div>
        {/* Cloud blobs */}
        <div className="absolute -bottom-8 left-1/4 h-32 w-48 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -bottom-4 left-[10%] h-20 w-32 rounded-full bg-white/10 blur-xl" />

        <div className="page-container text-center relative z-10">
          <div className="mx-auto max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white mb-6 border border-white/30">
              ✨ Студия творчества в Шмидтово
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight drop-shadow-sm">
              Кружок в небе —<br />
              <span className="text-sun-300">творчество без границ</span>
            </h1>
            <p className="text-lg text-brand-100 mb-8 max-w-xl mx-auto">
              Рисование, арт-терапия, рукоделие и керамика для детей и взрослых. Малые группы,
              семейные абонементы, опытные педагоги.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="bg-white text-brand-700 hover:bg-brand-50 shadow-md" asChild>
                <Link href="/register">Записаться на занятие</Link>
              </Button>
              <Button size="lg" className="bg-white/15 border border-white/50 text-white hover:bg-white/25 backdrop-blur-sm" asChild>
                <Link href="/schedule">Смотреть расписание</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Wave divider */}
      <div className="bg-brand-600 h-8 relative overflow-hidden">
        <svg viewBox="0 0 1200 50" className="absolute bottom-0 w-full" preserveAspectRatio="none">
          <path d="M0,0 C300,50 900,50 1200,0 L1200,50 L0,50 Z" fill="white" />
        </svg>
      </div>

      {/* Features */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="page-container">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="text-center">
                  <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-brand-50 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-brand-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{f.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Directions */}
      <section className="py-16 bg-gray-50">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Наши направления</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Выбирайте занятия по интересам и возрасту. Все направления подходят для начинающих.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DIRECTIONS.map((d) => {
              const Icon = d.icon;
              return (
                <Link
                  key={d.name}
                  href="/directions"
                  className={`group rounded-2xl border bg-white p-6 hover:shadow-md transition-all hover:-translate-y-0.5 ${d.border}`}
                >
                  <div className={`mb-4 h-12 w-12 rounded-2xl flex items-center justify-center ${d.bg}`}>
                    <Icon className={`h-6 w-6 ${d.icon_color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
                    {d.name}
                  </h3>
                  <p className="text-sm text-gray-500">{d.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Prices teaser */}
      <section className="py-16 bg-gradient-to-br from-brand-500 to-brand-700 text-white relative overflow-hidden">
        <div className="absolute top-4 right-8 h-20 w-20 rounded-full bg-sun-400/40 blur-xl" />
        <div className="absolute bottom-4 left-8 h-16 w-16 rounded-full bg-white/10 blur-xl" />
        <div className="page-container text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">Семейные абонементы</h2>
          <p className="text-brand-100 mb-8 max-w-lg mx-auto text-lg">
            Один абонемент на всю семью. Используйте для нескольких детей. Действует 1 год.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
            <div className="rounded-2xl bg-white/15 backdrop-blur border border-white/20 p-6">
              <p className="text-brand-100 text-sm mb-1">Рисование / Арт-терапия</p>
              <p className="text-2xl font-bold">3 600 ₽</p>
              <p className="text-brand-200 text-xs mt-1">8 занятий, свои материалы</p>
            </div>
            <div className="rounded-2xl bg-sun-400/90 border border-sun-300/30 p-6">
              <p className="text-amber-900 text-sm mb-1 font-medium">Рисование / Арт-терапия</p>
              <p className="text-2xl font-bold text-amber-900">4 800 ₽</p>
              <p className="text-amber-800 text-xs mt-1">8 занятий, материалы студии</p>
            </div>
            <div className="rounded-2xl bg-white/15 backdrop-blur border border-white/20 p-6">
              <p className="text-brand-100 text-sm mb-1">Рукоделие / Керамика</p>
              <p className="text-2xl font-bold">4 800 ₽</p>
              <p className="text-brand-200 text-xs mt-1">8 занятий</p>
            </div>
          </div>
          <Button size="lg" className="bg-white text-brand-700 hover:bg-brand-50 shadow-md" asChild>
            <Link href="/prices">Подробнее о ценах</Link>
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="page-container text-center">
          <div className="mx-auto max-w-sm mb-6 h-16 w-16 rounded-full bg-sun-400 flex items-center justify-center shadow-lg shadow-sun-400/30">
            <Star className="h-8 w-8 text-amber-900" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Готовы начать?</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Зарегистрируйтесь, добавьте детей и запишитесь на первое занятие прямо сейчас.
          </p>
          <Button size="lg" className="bg-brand-500 hover:bg-brand-600 text-white shadow-md" asChild>
            <Link href="/register">Создать аккаунт</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
