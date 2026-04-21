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
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-400 to-brand-600 py-20 sm:py-28">

        {/* === Illustrations === */}

        {/* Sun — top right */}
        <svg className="absolute -top-6 right-6 sm:right-16 w-36 sm:w-52 opacity-95" viewBox="0 0 120 120" fill="none">
          {[0,45,90,135,180,225,270,315].map((deg, i) => (
            <rect key={i} x="54" y="4" width="12" height="24" rx="6" fill="#FFD93D"
              transform={`rotate(${deg} 60 60)`} />
          ))}
          <circle cx="60" cy="60" r="32" fill="#FFD93D" />
          <circle cx="60" cy="60" r="25" fill="#FFE680" opacity="0.55" />
        </svg>

        {/* Cloud — top left */}
        <svg className="absolute -top-2 -left-8 w-52 sm:w-72 opacity-75" viewBox="0 0 200 90" fill="white">
          <circle cx="55"  cy="62" r="32" />
          <circle cx="95"  cy="50" r="42" />
          <circle cx="148" cy="60" r="30" />
          <rect   x="23"   y="60" width="155" height="30" rx="8" />
        </svg>

        {/* Cloud — bottom left */}
        <svg className="absolute -bottom-4 -left-4 w-64 sm:w-96 opacity-60" viewBox="0 0 260 100" fill="white">
          <circle cx="65"  cy="68" r="38" />
          <circle cx="115" cy="55" r="50" />
          <circle cx="178" cy="65" r="36" />
          <circle cx="230" cy="70" r="28" />
          <rect   x="27"   y="68" width="231" height="32" rx="8" />
        </svg>

        {/* Cloud — right mid */}
        <svg className="absolute top-1/2 -right-4 w-40 sm:w-56 opacity-50" viewBox="0 0 180 80" fill="white">
          <circle cx="45"  cy="52" r="28" />
          <circle cx="85"  cy="42" r="36" />
          <circle cx="136" cy="55" r="24" />
          <rect   x="17"   y="52" width="143" height="28" rx="8" />
        </svg>

        {/* Paper airplane */}
        <svg className="absolute top-1/4 left-[18%] sm:left-[28%] w-16 sm:w-24 opacity-90 drop-shadow-sm" viewBox="0 0 90 56" fill="none">
          {/* Body */}
          <polygon points="0,28 90,4 72,52" fill="white" />
          {/* Inner fold shadow */}
          <polygon points="0,28 72,52 36,34" fill="rgba(0,130,160,0.2)" />
          {/* Tail */}
          <polygon points="36,34 72,52 46,60" fill="white" opacity="0.7" />
          {/* Crease line */}
          <line x1="0" y1="28" x2="72" y2="52" stroke="rgba(0,130,160,0.3)" strokeWidth="1" />
        </svg>

        {/* Sparkle — top left */}
        <svg className="absolute top-10 left-10 w-7 opacity-80" viewBox="0 0 40 40">
          <polygon points="20,1 23,17 39,20 23,23 20,39 17,23 1,20 17,17" fill="#FFE680" />
        </svg>
        {/* Sparkle — bottom right */}
        <svg className="absolute bottom-16 right-16 sm:right-32 w-5 opacity-60" viewBox="0 0 40 40">
          <polygon points="20,1 23,17 39,20 23,23 20,39 17,23 1,20 17,17" fill="white" />
        </svg>
        {/* Sparkle — mid right */}
        <svg className="absolute top-1/3 right-28 sm:right-56 w-4 opacity-50" viewBox="0 0 40 40">
          <polygon points="20,1 23,17 39,20 23,23 20,39 17,23 1,20 17,17" fill="#FFE680" />
        </svg>

        {/* === Content === */}
        <div className="page-container relative z-10 text-center">
          <div className="inline-flex items-center gap-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2 mb-8">
            <svg viewBox="0 0 20 20" className="w-4 h-4 flex-shrink-0" fill="#FFD93D">
              <polygon points="10,1 12,8 19,8 13,12 15,19 10,15 5,19 7,12 1,8 8,8" />
            </svg>
            <span className="font-display text-white font-semibold text-sm tracking-wide">Студия творчества в Шмидтово</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-bold text-white leading-tight mb-5 drop-shadow-sm">
            Развитие<br />
            <span className="text-sun-300">и творчество</span><br />
            для вашего ребёнка
          </h1>
          <p className="text-white/80 text-lg sm:text-xl mb-10 max-w-lg mx-auto">
            Рисование, арт-терапия, рукоделие и керамика.<br />
            Малые группы и опытные педагоги.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-sun-400 hover:bg-sun-500 text-gray-900 font-semibold shadow-lg text-base" asChild>
              <Link href="/register">Записаться на занятие</Link>
            </Button>
            <Button size="lg" className="bg-white/15 border border-white/40 text-white hover:bg-white/25 backdrop-blur-sm text-base" asChild>
              <Link href="/schedule">Смотреть расписание</Link>
            </Button>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 64" className="w-full" preserveAspectRatio="none" fill="white">
            <path d="M0,32 C240,64 480,0 720,32 C960,64 1200,0 1440,32 L1440,64 L0,64 Z" />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="page-container">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="text-center">
                  <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-brand-50 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-brand-500" />
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
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-3">Наши направления</h2>
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
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-brand-500 transition-colors">
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
        <div className="absolute top-4 right-8 h-20 w-20 rounded-full bg-sun-400/30 blur-xl" />
        <div className="absolute bottom-4 left-8 h-16 w-16 rounded-full bg-white/10 blur-xl" />
        <div className="page-container text-center relative z-10">
          <h2 className="font-display text-3xl font-bold mb-4">Семейные абонементы</h2>
          <p className="text-brand-100 mb-8 max-w-lg mx-auto text-lg">
            Один абонемент на всю семью. Используйте для нескольких детей. Действует 1 год.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
            <div className="rounded-2xl bg-white/15 backdrop-blur border border-white/20 p-6">
              <p className="text-brand-100 text-sm mb-1">Рисование / Арт-терапия</p>
              <p className="text-2xl font-bold">3 600 ₽</p>
              <p className="text-brand-200 text-xs mt-1">8 занятий, свои материалы</p>
            </div>
            <div className="rounded-2xl bg-sun-400 border border-sun-300/30 p-6">
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
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Готовы начать?</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Зарегистрируйтесь, добавьте детей и запишитесь на первое занятие прямо сейчас.
          </p>
          <Button size="lg" className="bg-sun-400 hover:bg-sun-500 text-gray-900 font-semibold shadow-md" asChild>
            <Link href="/register">Создать аккаунт</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
