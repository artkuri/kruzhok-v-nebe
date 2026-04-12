import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata = { title: "Контакты" };

export default function ContactsPage() {
  return (
    <div className="page-container py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Контакты</h1>
        <div className="grid gap-4">
          {[
            { icon: MapPin, label: "Адрес", value: "г. Москва, ул. Творческая, д. 1" },
            { icon: Phone, label: "Телефон", value: "+7 (XXX) XXX-XX-XX" },
            { icon: Mail, label: "Email", value: "info@kruzhok.ru" },
            { icon: Clock, label: "Режим работы", value: "Вт–Пт 17:00–21:00, Сб 11:00–15:00" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-white">
                <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="font-medium text-gray-900">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
