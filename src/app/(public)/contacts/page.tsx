import { MapPin, Phone, MessageCircle, Clock, Send } from "lucide-react";

export const metadata = { title: "Контакты" };

export default function ContactsPage() {
  return (
    <div className="page-container py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Контакты</h1>
        <div className="grid gap-4">
          <div className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-white">
            <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5 text-brand-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Адрес</p>
              <p className="font-medium text-gray-900">ул. Генерала Шаймуратова, 14/4, 2 этаж</p>
              <p className="text-sm text-gray-500 mt-0.5">Уфа, Миллениум парк, д. Шмидтово</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-white">
            <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
              <Phone className="h-5 w-5 text-brand-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Телефон / WhatsApp</p>
              <a href="tel:+79639000990" className="font-medium text-gray-900 hover:text-brand-600">
                +7 963 900-09-90
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-white">
            <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
              <Send className="h-5 w-5 text-brand-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Telegram</p>
              <a href="https://t.me/kruzhokvnebe" target="_blank" rel="noopener noreferrer"
                className="font-medium text-gray-900 hover:text-brand-600">
                @kruzhokvnebe
              </a>
              <span className="text-gray-400 mx-2">·</span>
              <a href="https://t.me/shmidtovoart" target="_blank" rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-brand-600">
                канал @shmidtovoart
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-white">
            <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
              <MessageCircle className="h-5 w-5 text-brand-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">ВКонтакте</p>
              <a href="https://vk.com/kruzhokvnebe02" target="_blank" rel="noopener noreferrer"
                className="font-medium text-gray-900 hover:text-brand-600">
                vk.com/kruzhokvnebe02
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-white">
            <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-brand-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Режим работы (по предварительной записи)</p>
              <div className="space-y-1 text-sm">
                <div className="flex gap-3">
                  <span className="text-gray-500 w-24">Пн, Ср</span>
                  <span className="font-medium text-gray-900">18:30 – 20:00</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-gray-500 w-24">Вт, Чт</span>
                  <span className="font-medium text-gray-900">17:30 – 20:30</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-gray-500 w-24">Пт</span>
                  <span className="font-medium text-gray-900">18:30 – 20:00</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-gray-500 w-24">Сб, Вс</span>
                  <span className="font-medium text-gray-900">12:00 – 16:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2GIS map embed */}
        <div className="mt-8 rounded-2xl overflow-hidden border border-gray-100">
          <iframe
            src="https://widgets.2gis.com/widget?type=firmsonmap&options=%7B%22pos%22%3A%7B%22lat%22%3A54.6872%2C%22lon%22%3A55.9939%2C%22zoom%22%3A15%7D%2C%22opt%22%3A%7B%22city%22%3A%22ufa%22%7D%2C%22org%22%3A%2270000001095191995%22%7D"
            width="100%"
            height="300"
            allowFullScreen
            title="Кружок в небе на карте"
            className="block"
          />
        </div>
      </div>
    </div>
  );
}
