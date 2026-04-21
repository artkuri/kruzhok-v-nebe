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
      <section className="relative overflow-hidden bg-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[55%] h-full bg-brand-50 rounded-bl-[80px] hidden sm:block" />

        {/* Decorative SVG elements */}
        <svg className="absolute top-6 left-[42%] w-10 h-10 text-sun-400 hidden sm:block" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="8" fill="currentColor"/>
          {[0,45,90,135,180,225,270,315].map((deg) => (
            <line key={deg}
              x1={20 + Math.cos(deg*Math.PI/180)*11}
              y1={20 + Math.sin(deg*Math.PI/180)*11}
              x2={20 + Math.cos(deg*Math.PI/180)*16}
              y2={20 + Math.sin(deg*Math.PI/180)*16}
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          ))}
        </svg>
        <svg className="absolute bottom-10 left-[38%] w-8 h-8 text-brand-300 hidden sm:block" viewBox="0 0 32 32" fill="currentColor">
          <polygon points="16,2 19,12 30,12 21,19 24,30 16,23 8,30 11,19 2,12 13,12"/>
        </svg>
        <svg className="absolute top-16 right-8 w-10 h-10 text-sun-400 opacity-60 hidden sm:block" viewBox="0 0 40 40" fill="none">
          <polygon points="20,3 23,14 34,14 25,21 28,32 20,25 12,32 15,21 6,14 17,14" fill="currentColor"/>
        </svg>

        <div className="page-container relative z-10 py-12 sm:py-16">
          <div className="grid sm:grid-cols-2 gap-8 items-center">
            {/* Left: text */}
            <div>
              <div className="mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Кружок в небе" className="h-20 w-auto" />
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Развитие<br />
                и творчество<br />
                <span className="text-brand-500">для вашего ребёнка</span>
              </h1>
              <p className="text-gray-500 text-lg mb-8 max-w-sm">
                Ребёнок раскрывается, учится новому и становится увереннее уже за 1 месяц
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="bg-sun-400 hover:bg-sun-500 text-gray-900 font-semibold shadow-md" asChild>
                  <Link href="/register">Записаться на занятие</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/schedule">Смотреть расписание</Link>
                </Button>
              </div>
            </div>

            {/* Right: photo */}
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero.png"
                alt="Девочка рисует акварелью"
                className="w-full h-auto rounded-3xl"
              />
            </div>
          </div>
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
