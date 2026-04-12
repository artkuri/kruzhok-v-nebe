import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = { title: "Цены" };

const PRICE_GROUPS = [
  {
    title: "Рисование и Арт-терапия",
    color: "brand",
    options: [
      {
        name: "Разовое занятие",
        subtitle: "Со своими материалами",
        price: "500 ₽",
        features: ["Одно занятие", "Свои материалы", "Без записи на месяц"],
      },
      {
        name: "Разовое занятие",
        subtitle: "Материалы студии",
        price: "650 ₽",
        features: ["Одно занятие", "Все материалы включены", "Без записи на месяц"],
      },
      {
        name: "Абонемент 8 занятий",
        subtitle: "Со своими материалами",
        price: "3 600 ₽",
        priceNote: "450 ₽/занятие",
        featured: true,
        features: [
          "8 занятий",
          "Свои материалы",
          "Семейный — для нескольких детей",
          "Действует 1 год",
          "Гибкое расписание",
        ],
      },
      {
        name: "Абонемент 8 занятий",
        subtitle: "Материалы студии",
        price: "4 800 ₽",
        priceNote: "600 ₽/занятие",
        features: [
          "8 занятий",
          "Все материалы включены",
          "Семейный — для нескольких детей",
          "Действует 1 год",
          "Гибкое расписание",
        ],
      },
    ],
  },
  {
    title: "Рукоделие и Керамика",
    color: "violet",
    options: [
      {
        name: "Разовое занятие",
        subtitle: "",
        price: "650 ₽",
        features: ["Одно занятие", "Материалы студии", "Без записи на месяц"],
      },
      {
        name: "Абонемент 8 занятий",
        subtitle: "",
        price: "4 800 ₽",
        priceNote: "600 ₽/занятие",
        featured: true,
        features: [
          "8 занятий",
          "Материалы студии",
          "Семейный — для нескольких детей",
          "Действует 1 год",
          "Гибкое расписание",
        ],
      },
    ],
  },
];

export default function PricesPage() {
  return (
    <div className="page-container py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Цены</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Семейные абонементы — один абонемент для всех детей семьи.
          Запись без предоплаты, оплата на месте или переводом.
        </p>
      </div>

      {PRICE_GROUPS.map((group) => (
        <div key={group.title} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{group.title}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {group.options.map((opt, i) => (
              <div
                key={i}
                className={`relative rounded-2xl border p-6 flex flex-col ${
                  opt.featured
                    ? "border-brand-300 bg-brand-50 shadow-md"
                    : "border-gray-100 bg-white"
                }`}
              >
                {opt.featured && (
                  <div className="absolute -top-3 left-4 rounded-full bg-brand-600 px-3 py-0.5 text-xs font-medium text-white">
                    Выгодно
                  </div>
                )}
                <div className="mb-4">
                  <p className="font-semibold text-gray-900">{opt.name}</p>
                  {opt.subtitle && <p className="text-sm text-gray-500 mt-0.5">{opt.subtitle}</p>}
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{opt.price}</span>
                  {opt.priceNote && (
                    <span className="text-sm text-gray-400 ml-2">({opt.priceNote})</span>
                  )}
                </div>
                <ul className="space-y-2 flex-1">
                  {opt.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-6 w-full"
                  variant={opt.featured ? "default" : "outline"}
                  asChild
                >
                  <Link href="/register">Записаться</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Individual lesson */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Индивидуальные занятия</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 flex flex-col">
            <div className="mb-4">
              <p className="font-semibold text-gray-900">Индивидуальное занятие</p>
              <p className="text-sm text-gray-500 mt-0.5">Один ученик + педагог</p>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">1 000 ₽</span>
              <span className="text-sm text-gray-400 ml-2">(60 мин)</span>
            </div>
            <ul className="space-y-2 flex-1">
              {[
                "Персональный подход",
                "Любое направление студии",
                "Подходит для всех возрастов",
                "Удобное время — по договорённости",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Button className="mt-6 w-full" variant="outline" asChild>
              <Link href="/contacts">Записаться через контакты</Link>
            </Button>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 flex flex-col justify-center">
            <p className="text-sm text-gray-500 mb-3">Индивидуальные занятия назначаются администратором по договорённости с педагогом. Свяжитесь с нами через:</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="tel:+79639000990" className="hover:text-brand-600">+7 963 900-09-90</a></li>
              <li><a href="https://t.me/kruzhokvnebe" target="_blank" rel="noopener noreferrer" className="hover:text-brand-600">Telegram @kruzhokvnebe</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="rounded-2xl bg-amber-50 border border-amber-100 p-6">
        <h3 className="font-semibold text-amber-900 mb-3">Условия посещения</h3>
        <ul className="space-y-2 text-sm text-amber-800">
          <li>• Отмена записи не менее чем за 3 часа до занятия — занятие не сгорает</li>
          <li>• При отмене менее чем за 3 часа или неявке — занятие списывается с абонемента</li>
          <li>• Абонемент действует 1 год с момента покупки</li>
          <li>• Абонемент семейный: один абонемент для всех детей одной семьи</li>
        </ul>
      </div>
    </div>
  );
}
