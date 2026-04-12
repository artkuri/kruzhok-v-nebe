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
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Heart,
    name: "Арт-терапия",
    desc: "Творческие занятия для эмоционального развития детей",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Scissors,
    name: "Рукоделие",
    desc: "Вышивка, вязание, декупаж, скрапбукинг",
    color: "bg-pink-50 text-pink-600",
  },
  {
    icon: Layers,
    name: "Керамика",
    desc: "Лепка из глины, гончарный круг, роспись",
    color: "bg-violet-50 text-violet-600",
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
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-violet-50 py-16 sm:py-24">
        <div className="page-container text-center">
          <div className="mx-auto max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700 mb-6">
              ✨ Студия творчества в вашем городе
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Откройте творчество <br />
              <span className="text-brand-600">вместе с детьми</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
              Рисование, арт-терапия, рукоделие и керамика для детей и взрослых. Малые группы,
              семейные абонементы, опытные педагоги.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild>
                <Link href="/register">Записаться на занятие</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/schedule">Смотреть расписание</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-brand-200/30 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl" />
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
      <section className="py-16">
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
                  className="group rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-md transition-shadow"
                >
                  <div className={`mb-4 h-12 w-12 rounded-2xl flex items-center justify-center ${d.color}`}>
                    <Icon className="h-6 w-6" />
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
      <section className="py-16 bg-gradient-to-br from-brand-600 to-violet-700 text-white">
        <div className="page-container text-center">
          <h2 className="text-3xl font-bold mb-4">Семейные абонементы</h2>
          <p className="text-brand-100 mb-8 max-w-lg mx-auto text-lg">
            Один абонемент на всю семью. Используйте для нескольких детей. Действует 1 год.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
            <div className="rounded-2xl bg-white/10 backdrop-blur p-6">
              <p className="text-brand-100 text-sm mb-1">Рисование / Арт-терапия</p>
              <p className="text-2xl font-bold">3 600 ₽</p>
              <p className="text-brand-200 text-xs mt-1">8 занятий, свои материалы</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur p-6">
              <p className="text-brand-100 text-sm mb-1">Рисование / Арт-терапия</p>
              <p className="text-2xl font-bold">4 800 ₽</p>
              <p className="text-brand-200 text-xs mt-1">8 занятий, материалы студии</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur p-6">
              <p className="text-brand-100 text-sm mb-1">Рукоделие / Керамика</p>
              <p className="text-2xl font-bold">4 800 ₽</p>
              <p className="text-brand-200 text-xs mt-1">8 занятий</p>
            </div>
          </div>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
            <Link href="/prices">Подробнее о ценах</Link>
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="page-container text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Готовы начать?</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Зарегистрируйтесь, добавьте детей и запишитесь на первое занятие прямо сейчас.
          </p>
          <Button size="lg" asChild>
            <Link href="/register">Создать аккаунт</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
