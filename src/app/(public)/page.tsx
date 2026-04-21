import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Clock, MapPin } from "lucide-react";
import {
  IconPalette, IconHeart, IconPeople, IconTrophy, IconBrain, IconAirplane,
  StarFilled, StarOutline, Cloud, Sun, PaperPlane, DotTrail, BrandPattern,
} from "@/components/ui/brand-icons";

export const metadata = {
  title: "Студия творчества для детей и взрослых",
};

const DIRECTIONS = [
  {
    Icon: IconPalette,
    name: "Рисование",
    desc: "Живопись, акварель, графика — от азов до своего стиля",
    bg: "bg-amber-50",
  },
  {
    Icon: IconBrain,
    name: "Арт-терапия",
    desc: "Творческие занятия для эмоционального развития детей",
    bg: "bg-[#EDE9FE]",
  },
  {
    Icon: IconHeart,
    name: "Рукоделие",
    desc: "Вышивка, вязание, декупаж, скрапбукинг",
    bg: "bg-rose-50",
  },
  {
    Icon: IconTrophy,
    name: "Керамика",
    desc: "Лепка из глины, гончарный круг, роспись",
    bg: "bg-brand-50",
  },
];

const FEATURES = [
  { Icon: IconPeople,   label: "Малые группы",     desc: "До 10 человек" },
  { Icon: IconAirplane, label: "Опытные педагоги",  desc: "Профессионалы своего дела" },
  { Icon: IconBrain,    label: "Удобное время",    desc: "Вечера и выходные" },
  { Icon: IconTrophy,   label: "Шмидтово",         desc: "Удобная локация" },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-brand-50 py-14 sm:py-20 overflow-hidden relative">
        {/* Background pattern */}
        <BrandPattern className="absolute inset-0 w-full h-full pointer-events-none" />

        <div className="page-container relative z-10">
          <div className="grid sm:grid-cols-2 gap-10 items-center">

            {/* Left — text */}
            <div className="relative z-10">
              {/* Badge */}
              <span className="inline-flex items-center gap-2 bg-white border border-brand-200 text-brand-500 rounded-full px-4 py-1.5 text-sm font-medium mb-6 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-brand-400 inline-block" />
                Студия творчества в Шмидтово
              </span>

              <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#1F2937] leading-tight mb-5">
                Развитие<br />
                и <span className="text-brand-400">творчество</span><br />
                для вашего ребёнка
              </h1>

              <p className="text-gray-500 text-lg mb-8 max-w-sm leading-relaxed">
                Ребёнок раскрывается, учится новому и становится увереннее уже за 1 месяц
              </p>

              <div className="flex flex-wrap gap-3">
                <Button size="lg"
                  className="bg-sun-400 hover:bg-sun-500 text-[#1F2937] font-semibold rounded-2xl shadow-md px-8"
                  asChild>
                  <Link href="/register">Записаться на занятие</Link>
                </Button>
                <Button size="lg" variant="outline"
                  className="border-brand-300 text-brand-500 hover:bg-brand-50 rounded-2xl"
                  asChild>
                  <Link href="/schedule">Расписание</Link>
                </Button>
              </div>
            </div>

            {/* Right — illustration */}
            <div className="relative">
              <div className="relative rounded-[28px] overflow-hidden shadow-xl bg-gradient-to-br from-brand-300 to-brand-500 h-72 sm:h-[380px]">
                <svg viewBox="0 0 420 340" className="w-full h-full" fill="none">

                  {/* Sun */}
                  {[0,40,80,120,160,200,240,280,320].map((deg) => (
                    <rect key={deg} x="372" y="10" width="10" height="22" rx="5"
                      fill="#FFD93D" transform={`rotate(${deg} 388 55)`} />
                  ))}
                  <circle cx="388" cy="55" r="36" fill="#FFD93D" />
                  <circle cx="388" cy="55" r="28" fill="#FFE680" opacity="0.5" />

                  {/* Cloud 1 — top left */}
                  <g fill="white" opacity="0.92">
                    <circle cx="55"  cy="72" r="30" />
                    <circle cx="92"  cy="58" r="40" />
                    <circle cx="140" cy="70" r="28" />
                    <rect   x="25"   y="72" width="143" height="30" rx="8" />
                  </g>

                  {/* Cloud 2 — mid right */}
                  <g fill="white" opacity="0.70">
                    <circle cx="295" cy="155" r="22" />
                    <circle cx="328" cy="145" r="30" />
                    <circle cx="364" cy="158" r="20" />
                    <rect   x="273" y="155" width="111" height="23" rx="7" />
                  </g>

                  {/* Cloud 3 — bottom */}
                  <g fill="white" opacity="0.55">
                    <circle cx="80"  cy="285" r="35" />
                    <circle cx="130" cy="272" r="46" />
                    <circle cx="195" cy="284" r="32" />
                    <circle cx="250" cy="288" r="26" />
                    <rect   x="45"   y="285" width="231" height="55" rx="10" />
                  </g>

                  {/* Paper airplane */}
                  <g>
                    <polygon points="55,190 205,148 182,212" fill="white" opacity="0.95" />
                    <polygon points="55,190 182,212 115,196" fill="rgba(10,100,140,0.2)" />
                    <polygon points="115,196 182,212 148,228" fill="white" opacity="0.75" />
                  </g>
                  {/* Dotted trail */}
                  <path d="M44,195 Q110,168 198,152"
                    stroke="white" strokeWidth="2.5" strokeDasharray="7,6" opacity="0.55" />

                  {/* Stars */}
                  <polygon points="260,90 262,98 270,98 264,103 266,111 260,106 254,111 256,103 250,98 258,98"
                    fill="#FFE680" opacity="0.9" />
                  <polygon points="165,210 167,216 173,216 168,220 170,226 165,222 160,226 162,220 157,216 163,216"
                    fill="white" opacity="0.6" />
                  <polygon points="310,225 311,229 315,229 312,232 313,236 310,233 307,236 308,232 305,229 309,229"
                    fill="#FFE680" opacity="0.7" />

                  {/* Art dots (palette hint) */}
                  <circle cx="230" cy="200" r="7" fill="#A78BFA" opacity="0.75" />
                  <circle cx="248" cy="212" r="5" fill="#FFD93D" opacity="0.8" />
                  <circle cx="216" cy="215" r="6" fill="white"   opacity="0.6" />
                </svg>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-sun-400 flex items-center justify-center text-lg">🎨</div>
                <div>
                  <p className="text-xs text-gray-400">Занятий проведено</p>
                  <p className="font-display font-bold text-[#1F2937]">500+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="page-container">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.Icon;
              return (
                <div key={f.label} className="text-center">
                  <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-brand-50 flex items-center justify-center">
                    <Icon className="h-7 w-7" />
                  </div>
                  <p className="text-sm font-semibold text-[#1F2937]">{f.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Directions ── */}
      <section className="py-16 bg-brand-50">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-[#1F2937] mb-3">Наши направления</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Выбирайте по интересам и возрасту. Все направления подходят для начинающих.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DIRECTIONS.map((d) => {
              const Icon = d.Icon;
              return (
                <Link key={d.name} href="/directions"
                  className="group rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className={`mb-4 h-12 w-12 rounded-xl flex items-center justify-center ${d.bg}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-[#1F2937] mb-2 group-hover:text-brand-400 transition-colors">
                    {d.name}
                  </h3>
                  <p className="text-sm text-gray-500">{d.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Prices teaser ── */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-[#1F2937] mb-3">Семейные абонементы</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Один абонемент на всю семью. Используйте для нескольких детей. Действует 1 год.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto mb-8">
            <div className="rounded-2xl border border-gray-100 bg-brand-50 p-6 text-center">
              <p className="text-gray-500 text-sm mb-2">Рисование / Арт-терапия</p>
              <p className="font-display text-3xl font-bold text-[#1F2937]">3 600 ₽</p>
              <p className="text-gray-400 text-xs mt-1">8 занятий, свои материалы</p>
            </div>
            <div className="rounded-2xl border-2 border-sun-400 bg-sun-400 p-6 text-center shadow-md">
              <p className="text-amber-900 text-sm font-medium mb-2">Рисование / Арт-терапия</p>
              <p className="font-display text-3xl font-bold text-amber-900">4 800 ₽</p>
              <p className="text-amber-700 text-xs mt-1">8 занятий + материалы студии</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-brand-50 p-6 text-center">
              <p className="text-gray-500 text-sm mb-2">Рукоделие / Керамика</p>
              <p className="font-display text-3xl font-bold text-[#1F2937]">4 800 ₽</p>
              <p className="text-gray-400 text-xs mt-1">8 занятий</p>
            </div>
          </div>
          <div className="text-center">
            <Button size="lg" variant="outline"
              className="border-brand-300 text-brand-500 hover:bg-brand-50 rounded-2xl"
              asChild>
              <Link href="/prices">Подробнее о ценах</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-brand-50">
        <div className="page-container">
          <div className="rounded-3xl bg-gradient-to-br from-brand-400 to-brand-500 p-10 sm:p-14 text-center relative overflow-hidden">
            {/* Decorative */}
            <svg className="absolute right-8 top-4 w-20 opacity-30" viewBox="0 0 120 120" fill="none">
              {[0,45,90,135,180,225,270,315].map((deg) => (
                <rect key={deg} x="54" y="4" width="12" height="24" rx="6" fill="#FFD93D"
                  transform={`rotate(${deg} 60 60)`} />
              ))}
              <circle cx="60" cy="60" r="32" fill="#FFD93D" />
            </svg>
            <svg className="absolute -left-6 -bottom-6 w-32 opacity-20" viewBox="0 0 200 90" fill="white">
              <circle cx="55"  cy="62" r="32" />
              <circle cx="95"  cy="50" r="42" />
              <circle cx="148" cy="60" r="30" />
              <rect   x="23"   y="62" width="155" height="28" rx="8" />
            </svg>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 relative z-10">
              Готовы начать?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-md mx-auto relative z-10">
              Зарегистрируйтесь и запишитесь на первое занятие прямо сейчас.
            </p>
            <Button size="lg"
              className="bg-sun-400 hover:bg-sun-500 text-[#1F2937] font-semibold rounded-2xl shadow-lg px-10 relative z-10"
              asChild>
              <Link href="/register">Создать аккаунт</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
