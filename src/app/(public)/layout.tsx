import { PublicHeader } from "@/components/layouts/public-header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicHeader />
      <main>{children}</main>
      <footer className="border-t border-gray-100 bg-white mt-16">
        <div className="page-container py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Кружок в небе</h3>
              <p className="text-sm text-gray-500">
                Студия творчества для детей и взрослых. Рисование, арт-терапия, рукоделие, керамика.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Контакты</h3>
              <p className="text-sm text-gray-500">+7 963 900-09-90</p>
              <p className="text-sm text-gray-500">Telegram: @kruzhokvnebe</p>
              <p className="text-sm text-gray-500">ВК: vk.com/kruzhokvnebe02</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Режим работы</h3>
              <p className="text-sm text-gray-500">Пн, Ср: 18:30–20:00</p>
              <p className="text-sm text-gray-500">Вт, Чт: 17:30–20:30</p>
              <p className="text-sm text-gray-500">Пт: 18:30–20:00</p>
              <p className="text-sm text-gray-500">Сб, Вс: 12:00–16:00</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Студия творчества «Кружок в небе»
          </div>
        </div>
      </footer>
    </>
  );
}
